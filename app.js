const express = require("express");
const bodyParser = require("body-parser");
const app = express()

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var today = new Date();
var date = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var nameTyped="";
var mobileTyped="";



app.get("/", function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
   
    
    if(req.body.buttonId == "1"){
        return res.redirect("/application");
    }
    else if(req.body.buttonId == "2"){
        return res.redirect("/login");
    }
});

app.get("/application",function(req,res){
    res.sendFile(__dirname + "/application.html")
});

app.post("/application",function(req,res){
    var dateTyped = req.body.date;
    nameTyped = req.body.firstName +" "+ req.body.lastName;
    mobileTyped = req.body.phNumber;
    res.render("applicationSuccess",{datePrint:dateTyped});
});

app.get("/login",function(req,res){
    res.sendFile(__dirname + "/login.html")
});

app.post("/login",function(req,res){
    res.render("viewAppointments",{nameprint:nameTyped,phprint:mobileTyped});
    
});

app.listen(3000, function() {
  console.log("server started at port 3000")
});