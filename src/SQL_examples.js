    // 'ALTER TABLE your_table MODIFY id INT AUTO_INCREMENT PRIMARY KEY'
    // const sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
    //              ALTER TABLE users ADD COLUMN rank VARCHAR(20) NOT NULL
    // const sql = "ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";
    // const sql = "INSERT INTO customers (name, address) VALUES ('koko', 'lala')";
    // con.query(sql, function (err, result) {
    //     if (err) throw err;
    //     //console.log("Done");
    //     console.log(result);
    // });

    // var sql = "INSERT INTO customers (name, address) VALUES ?";
    // var values = [
    //     ['John', 'Highway 71'],
    //     ['Peter', 'Lowstreet 4'],
    //     ['Viola', 'Sideway 1633']
    //   ];
    //   con.query(sql, [values], function (err, result) {
    //     if (err) throw err;
    //     console.log("Number of records inserted: " + result.affectedRows);
    //   });

    // con.query("SELECT * FROM users", function (err, result, fields) {
    //     if (err) throw err;
    //     console.log(result);
    //  });

    // var name = 'Amy';
    // var adr = 'Mountain 21';
    // var sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
    // con.query(sql, [name, adr], function (err, result) {
    //     if (err) throw err;
    //     console.log(result);
    // });

    // var sql = "DROP TABLE IF EXISTS passwords";
    // con.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Table deleted");
    // });

    // var sql = "UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";
    // con.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log(result.affectedRows + " record(s) updated");
    // });

    //var sql = "SELECT * FROM customers LIMIT 5";
    // var sql = "SELECT * FROM customers LIMIT 5 OFFSET 2";
    // var sql = "SELECT * FROM customers LIMIT 2, 5"; // shortet varsion that do the same
    // con.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log(result);
    // });