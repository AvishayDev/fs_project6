const Joi = require('joi')
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

// Validation Schema
const postSchema = Joi.object({
    userId: Joi.string().required(),
    title: Joi.string().min(3).max(512).required(),
    body: Joi.string().min(3).max(512).required()
});

const Validate = (testObject,validateType) => {
    //const {error} = 
}

pathTableNames = ['posts','users','comments','todos']

const getTable = (tableName) => {
    return new Promise((resolve) => {
        databaseConnection.query(`SELECT * FROM ${tableName}`, 
        (err, result) => {
            if (err) return resolve({error: err.message});
            resolve(result);
        });
    });
}

const getItems = (tableName, param, value) => {
    return new Promise((resolve) => {
        databaseConnection.query(`SELECT * FROM ${tableName} WHERE ${param} = ${value}`,
        (err, result) => {
            if (err) return resolve({error: err.message});

            resolve(result.length === 1 ? result[0] : result);

        });
    });
}

const getAuthorization = (api_key, id, authorizationType) => {
    return new Promise((resolve,reject) =>{
        databaseConnection.query('SELECT id AS userId,`rank` FROM users WHERE api_key = ?',
        [api_key],
        (err, user) => {
            if (err) return resolve({error: err.message});
            if(user.length === 0) return resolve({error: "API Dosen't Exists."});
            
            user = user[0]

            // check for administration
            if (user.rank === 'admin') return resolve(user)
            
            // choose authorization Types
            if (authorizationType === 'users') return resolve(id === user.userId ? user : {error: "You Desn't Have Prommision To Access This Data!"})
            
            var sql;
            if (authorizationType === 'posts' || authorizationType === 'todos')
                sql = `SELECT userId FROM ${authorizationType} WHERE id = ?`;
            else if (authorizationType === 'comments')
                sql = 'WITH post AS (SELECT postId FROM comments WHERE id = ?) SELECT userId FROM posts WHERE id = post.postId'
            else
                return resolve({error: "You Desn't Have Prommision To Access This Data!"})
            
            databaseConnection.query(sql,[id], 
                (err,result) => {
                    if (err) return resolve({error: err.message})
                    if (result.length === 0) return resolve({error: `There Is No ${authorizationType} with Id ${id}`})

                    if (user.userId !== result[0].userId) return resolve({error: "You Desn't Have Prommision To Access This Data!"})

                    return resolve(user);
                });

        });
    })
}

const insertToTable = (tableName, instance) => {
    
    return new Promise((resolve,reject) => {
        databaseConnection.query(`INSERT INTO ${tableName} SET ?`,
        instance,
        (err, result) => {
            if (err) return resolve({error: err.message});
                
            databaseConnection.query(`SELECT count(*) AS len FROM ${tableName}`,
            (err2,result2) => {
                if (err) return resolve({error: err2.message});

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
                if (err) return resolve({error: err.message});
                resolve(instance);
            });
    });
}

const deleteToTable = (tableName, id) => {
    
    return new Promise((resolve) => {
        databaseConnection.query(`DELETE FROM ${tableName} WHERE id = ?`,
                [id],
                (err, result) => {
                    if (err) return resolve({error: err.message});
                    resolve({error: null})
        });

        
    })
}

const checkForExistence = async (tableName, columnName, columnValue) =>{

    const instances = await getItems(tableName, columnName, columnValue)
    if (instances.error) return instances
    if (instances.length === 0) return {error: `Resource ${columnName}=${columnValue} Dosen't Found!`}
    
    return instances.length === 1 ? instances[0] : instances
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
        // Authoretion
        const authorization = await getAuthorization(req.query.api_key)
        if (authorization.error) return res.status(404).send(authorization.error)

        const table = await getTable(ptName);
        if (table.error) return res.status(404).send(table.error)
        
        res.send(table);
    });

    app.get(`/${ptName}/:id`, async (req,res) =>{

        const authorization = await getAuthorization(req.query.api_key, req.params.id, ptName)
        if (authorization.error) return res.status(404).send(authorization.error)

        const data = await checkForExistence(ptName,'id',req.params.id)
        if (data.error) return res.status(404).send(data.error)
        res.send(data);

    });
}


// ------------ posts ------------
// paths: (posts, postId, postId/comments)
app.get('/posts/:id/comments', async (req,res) =>{
    const authorization = await getAuthorization(req.query.api_key, req.params.id, 'posts')
    if (authorization.error) return res.status(404).send(authorization.error)

    const data = await checkForExistence('comments','postId' ,req.params.id)
    if (data.error) return res.status(404).send(data.error)
    res.send(data);
});


// ------------ users ------------
// paths: (users, userId, userId/todos, userId/posts)
app.get('/users/:id/todos', async (req,res) =>{
    const authorization = await getAuthorization(req.query.api_key, req.params.id, 'users')
    if (authorization.error) return res.status(404).send(authorization.error)

    const data = await checkForExistence('todos','userId' ,req.params.id)
    if (data.error) return res.status(404).send(data.error)
    res.send(data);

});
app.get('/users/:id/posts', async (req,res) =>{
    const authorization = await getAuthorization(req.query.api_key, req.params.id, 'users')
    if (authorization.error) return res.status(404).send(authorization.error)

    const data = await checkForExistence('posts','userId' ,req.params.id)
    if (data.error) return res.status(404).send(data.error)
    res.send(data);
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
    // we need to get: userId, api_key, title, body
    // this would be sent in the body.
    const authorization = await getAuthorization(req.query.api_key, req.body.userId, 'users')
    if (authorization.error) return res.status(404).send(authorization.error)

    let post = {
        userId: authorization.userId,
        title : req.body.title,
        body: req.body.body
    }

    post = await insertToTable('posts',post)
    if (post.error) return res.status(404).send(post.error)
    res.send(post)
});

// ------------ users ------------
// its the sign-up!
app.post('/signup', async (req,res) => {
    // Authoretion
    // Don't Need Authoretion, Because everybody can signup..
    
    let user = {
        username: req.body.username,
        api_key:  generateRandomString(20),
        rank:     req.body.rank,
        name:     req.body.name,
        email:    req.body.email,
        phone:    req.body.phone,
        website:  req.body.website,
    }
    let userpass ={
        username: req.body.username,
        password: req.body.password
    }

    user = await insertToTable('users',user)
    if (user.error) return res.status(404).send(user.error)

    userpass = await insertToTable('passwords',userpass)
    if (userpass.error) return res.status(404).send(userpass.error)

    res.send(user)
});
// ------------ comments ------------
app.post('/comments', async (req,res) => {
    // Authoretion
    const authorization = await getAuthorization(req.query.api_key, req.body.postId, 'posts')
    if (authorization.error) return res.status(404).send(authorization.error)

    // we need to get: api_key, title, body
    // this would be sent in the body.
    let comment = {
        postId: req.body.postId,
        name : req.body.name,
        email: req.body.email,
        body: req.body.body
    }

    comment = await insertToTable('comments',comment)
    if (comment.error) res.status(404).send(comment.error)
    res.send(comment)
});
// ------------ todos ------------
app.post('/todos', async (req,res) => {
    // Authoretion
    const authorization = await getAuthorization(req.query.api_key, req.body.userId, 'users')
    if (authorization.error) return res.status(404).send(authorization.error)

    // we need to get: api_key, userId, title, compleated
    // this would be sent in the body.
    let todo = {
        userId: authorization.userId,
        title : req.body.title,
        completed: req.body.completed
    }

    todo = await insertToTable('todos',todo)
    if (todo.error) return res.status(404).send(todo.error)

    res.send(todo)
});


// ************ PUT DELETE ************

// ------------ posts users comments todos ------------
for (const ptName of pathTableNames){
    app.put(`/${ptName}/:id`, async (req,res) => {
        // Authoretion
        const authorization = await getAuthorization(req.query.api_key, req.params.id, ptName)
        if (authorization.error) return res.status(404).send(authorization.error)
    
        // Validate
    
    
        // Check For Existence
        let data = await checkForExistence(ptName,'id' ,req.params.id)
        if (data.error) return res.status(404).send(data.error)

        // Update the Resource
        Object.keys(data).forEach( key => { 
            if (key in req.body)
                data[key] = req.body[key]
        });

        // Return the Updated Resource
        data = await updateToTable(ptName, data)
        if (data.error) return res.status(404).send(data.error)

        res.send(data)
    
    });

    app.delete(`/${ptName}/:id`, async (req,res) => {
        // Authoretion
        const authorization = await getAuthorization(req.query.api_key, req.params.id, ptName)
        if (authorization.error) return res.status(404).send(authorization.error)
    
        // Validate
    
    
        // Check For Existence
        let data = await checkForExistence(ptName,'id' ,req.params.id)
        if (data.error) return res.status(404).send(data.error)

        // Delete the Course
        const { error } = await deleteToTable(ptName, data.id)
        if (error) return res.status(404).send('Something Went Wrong.. Please Try Again')
        
        res.send(data)
    });
}



//The 404 Route
app.get('/test', async (req,res) => {
    // Authoretion
    res.send('Koko Lala!')
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