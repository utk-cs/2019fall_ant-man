var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "yourusername",
  password: "yourpassword"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE mydb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

/*
var sql2 = "CREATE TABLE cookies (name VARCHAR(255))";
  con.query(sql2, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
*/
