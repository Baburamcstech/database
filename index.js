var mysql = require("mysql");
const express = require("express");
const ejs = require("ejs");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
let bcrypt = require("bcrypt");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loginpage",
});

app.get("/home", (req, res) => {
  con.query("SELECT * from login", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.render("home", { result: result });
  });
});
app.get("/add", (req, res) => {
  // res.redirect('/add');
  res.render("add");
});

app.post("/add", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let contact = req.body.contact;
  let pass = req.body.pass;
  pass = await bcrypt.hash(pass, 10);
  let sqlQuery =
    "INSERT INTO register (username,email,contact,pass) VALUES ('" +
    name +
    "','" +
    email +
    "','" +
    contact +
    "','" +
    pass +
    "')";
  con.query(sqlQuery, function (err) {
    if (err) throw err;
    console.log("yeah ! inserted");
  });
  res.redirect("/registerStudent");
});

app.get("/update", (req, res) => {
  con.query("SELECT * from register", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.render("update", { result: result });
  });
});
app.post("/update", (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let sql = `UPDATE register SET username=? WHERE id=?`;
  con.query(sql, [name, id], function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/update");
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});
// app.post('/login',(req,res)=>{
//   let email=req.body.email;
//   let pass=req.body.pass;
//   con.query('SELECT *FROM login',function(err,result){
//     result.forEach(ele=>{
//       if(email==`ele.email` && pass='ele.pass'){
//   res.redirect('/registerStudent');
//       }
//       else{
//         if(email!==email){
//           res.send("Wrong email!");
//         }
//         if(pass!==pass){
//           res.send("Wrong password!");
//         }
//       }
//     })

//   })
// });
app.post("/login", async (req, res) => {
  let email = req.body.email;
  let pass = req.body.pass;
  pass = await bcrypt.hash(pass, 10);
  let sql =
    "INSERT INTO login (email,password) VALUES ('" +
    email +
    "','" +
    pass +
    "')";
  con.query(sql, function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let contact = req.body.contact;
  let pass = req.body.pass;
  //let sql="INSERT INTO register (username,email,contact,pass) VALUES ('"+name+"','"+email+"','"+contact+"','"+pass+"')";
  //con.query(sql,function(err,result){
  // if(err) throw err;

  res.redirect("/home");
});
app.get("/registerStudent", (req, res) => {
  con.query("SELECT * from register", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.render("registerStudent", { result: result });
  });
});
// app.post('/registerStudent',(req,res)=>{
//   con.query('SELECT * from register', (err, result) => {
//     if (err) {
//     console.log(err);}
//     res.render("registerStudent",{result:result});
//   })
//   // console.log(".");
// })

app.post("/delete", (req, res) => {
  let id = req.body.id;
  let sql = `DELETE FROM login WHERE id=?`;
  con.query(sql, [id], function (err, result) {
    if (err) throw err;
    else {
      console.log(result);
      res.redirect("/home");
    }
  });
});

app.listen(port, () => {
  console.log(`I am active on ${port}`);
});
