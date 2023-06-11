const mysql = require('mysql2');
const express = require('express')

// Initial Variables
const app = express()
app.use(express.json())

const databaseConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "AvishayDEV19",
    port: 3306,
    database: 'FullStackProject6'
});

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
pathTableNames = ['posts','users','comments','todos']

const getTable = (tableName) => {
    return new Promise((resolve, reject) => {
        databaseConnection.query(`SELECT * FROM ${tableName}`, 
        (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

const getItems = (tableName, param, value) => {
    return new Promise((resolve, reject) => {
        databaseConnection.query(`SELECT * FROM ${tableName} WHERE ${param} = ${value}`,
        (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

const getUserAuthorization = (api_key) => {
    return new Promise((resolve,reject) =>{
        databaseConnection.query('SELECT id AS userId,`rank` FROM users WHERE api_key = ?',
        [api_key],
        (err, result) => {
            if (err) reject({userId:0,rank:unrank});
            resolve(result[0]);
        });
    })
}

const insertToTable = (tableName, instance) => {
    
    return new Promise((resolve,reject) => {
        databaseConnection.query(`INSERT INTO ${tableName} SET ?`,
        instance,
        (err, result) => {
            if (err) reject(err)
                
            databaseConnection.query(`SELECT count(*) AS len FROM ${tableName}`,
            (err2,result2) => {
                if (err) reject(err2)

                instance.id = result2[0].len
                resolve(instance)
            })
        });
    })
}

function updateToTable(tableName, instance) {

    return new Promise((resolve, reject) => {
        databaseConnection.query(`UPDATE ${tableName} SET ? WHERE id = ?`,
            [instance, instance.id],
            (err, result) => {
                if (err) reject(err);
                resolve(instance);
            });
    });
}

const deleteToTable = (tableName, id) => {
    
    return new Promise((resolve,reject) => {
        databaseConnection.query(`DELETE FROM ${tableName} WHERE id = ?`,
                [id],
                (err, result) => {
                    if (err) reject(false)
                    resolve(true)
        });

        
    })
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    
    return randomString;
}

// ************ GET ************

// GET Structure:
// /path => return all
// /path/id => return specific resource by the id
// /path/id/path2 => return all the path2 resources that have id of path
//                   if the resource will not have id of path, all the path2 elements returned
// path-not-exists => empty object

// Start Path
app.get('/', (req,res) => {
    res.send('Hi There! Lets Load Some Data!')
});

// set base paths
for (const ptName of pathTableNames){
    app.get(`/${ptName}`, async (req,res) =>{
        const table = await getTable(ptName);
        res.send(table);
    });

    app.get(`/${ptName}/:id`, async (req,res) =>{
        const instance = await getItems(ptName,'id' ,req.params.id)
        if (instance.length === 0) return res.status(404).send(`Resource Id ${req.params.id} Not Found`)
        res.send(instance[0]);
    });
}


// ------------ posts ------------
// paths: (posts, postId, postId/comments)
app.get('/posts/:id/comments', async (req,res) =>{
    const instances = await getItems('comments','postId' ,req.params.id)
    if (instances.length === 0) return res.status(404).send(`Post Id ${req.params.id} Dont have Any Comments`)
    res.send(instances);
});


// ------------ users ------------
// paths: (users, userId, userId/todos, userId/posts)
app.get('/users/:id/todos', async (req,res) =>{
    const instances = await getItems('todos','userId' ,req.params.id)
    if (instances.length === 0) return res.status(404).send(`User Id ${req.params.id} Dont have Any Todos`)
    res.send(instances);
});
app.get('/users/:id/posts', async (req,res) =>{
    const instances = await getItems('posts','userId' ,req.params.id)
    if (instances.length === 0) return res.status(404).send(`User Id ${req.params.id} Dont have Any Posts`)
    res.send(instances);
});

// ------------ comments ------------
// paths: (comments, commentId)
// ------------ todos ------------
// paths: (todos, todoId)


// ------------ passwords ------------
// for login user, dont forget to send username and password in the query.
app.get('/login', (req,res) =>{
    databaseConnection.query('WITH user AS (SELECT * FROM passwords WHERE username = ? AND password = ? ) SELECT users.* FROM users JOIN user ON users.username = user.username',
    [req.query.username,req.query.password],
        (err, result) => {
            if (err) return res.status(404).send('Something Went Wrong.. Please Try Again');
            if (result.length === 0) return res.status(404).send('Usename or Password is Not Currect')
            res.send(result);
                
    });
});


// ************ POST ************
// No need to send id. its auto_increment.

// ------------ posts ------------
app.post('/posts', async (req,res) => {
    // Authoretion
    const {userId, rank} = await getUserAuthorization(req.body.api_key)


    // we need to get: api_key, title, body
    // this would be sent in the body.
    const post = {
        userId: userId,
        title : req.body.title,
        body: req.body.body
    }
    res.send(await insertToTable('posts',post))
});

// ------------ users ------------
// its the sign-up!
app.post('/users', async (req,res) => {
    // Authoretion
    const {userId, rank} = await getUserAuthorization(req.body.api_key)
    

    // we need to get: api_key, title, body
    // this would be sent in the body.
    let user = {
        username: req.body.username,
        api_key:  generateRandomString(20),
        rank:     req.body.rank,
        name:     req.body.name,
        email:    req.body.email,
        phone:    req.body.phone,
        website:  req.body.website,
    }
    const userpass ={
        username: req.body.username,
        password: req.body.password
    }

    user = await insertToTable('users',user)
    await insertToTable('passwords',userpass)
    res.send(user)
});
// ------------ comments ------------
app.post('/comments', async (req,res) => {
    // Authoretion
    const {userId, rank} = await getUserAuthorization(req.body.api_key)

    // we need to get: api_key, title, body
    // this would be sent in the body.
    const comment = {
        postId: req.body.postId,
        name : req.body.name,
        email: req.aborted.name,
        body: req.body.body
    }
    res.send(await insertToTable('comments',comment))
});
// ------------ todos ------------
app.post('/todos', async (req,res) => {
    // Authoretion
    const {userId, rank} = await getUserAuthorization(req.body.api_key)

    // we need to get: api_key, title, body
    // this would be sent in the body.
    const todo = {
        userId: userId,
        title : req.body.title,
        completed: req.body.completed
    }
    res.send(await insertToTable('todos',todo))
});


// ************ PUT DELETE ************

// ------------ posts users comments todos ------------
for (const ptName of pathTableNames){
    app.put(`/${ptName}/:id`, async (req,res) => {
        // Authoretion
        const {userId, rank} = await getUserAuthorization(req.body.api_key)
    
        // Validate
    
    
        // Check For Existence
        let instance = await getItems(ptName,'id' ,req.params.id)
        if (instance.length === 0) return res.status(404).send(`Resource Id ${req.params.id} Not Found`)
        instance = instance[0]

        // Update the Course
        Object.keys(instance).forEach( key => { 
            if (key in req.body)
                instance[key] = req.body[key]
        });

        res.send(await updateToTable(ptName, instance))
    
    });

    app.delete(`/${ptName}/:id`, async (req,res) => {
        // Authoretion
        const {userId, rank} = await getUserAuthorization(req.body.api_key)
    
        // Validate
    
    
        // Check For Existence
        let instance = await getItems(ptName,'id' ,req.params.id)
        if (instance.length === 0) return res.status(404).send(`Resource Id ${req.params.id} Not Found`)
        instance = instance[0]

        // Delete the Course
        if (await deleteToTable(ptName, instance.id))
            return res.send(instance)
        res.status(404).send('Something Went Wrong.. Please Try Again')
    });
}



//The 404 Route
app.get('/test', async (req,res) => {
    const test_api_key = '123'
    const {userId, rank} = await getUserAuthorization(test_api_key)
    // Authoretion
    res.send(`${userId} ${rank}`)
    // we need to get: api_key, title, body
});

app.get('*', (req, res) => {
    //return res.status(404).send('what??? How Did You get Here?'/{});
});

// Connect to the Database and running up the server
databaseConnection.connect((err)=> {
    if (err) throw err;
    console.log("Connected To The Database.");

    app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
});