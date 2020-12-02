const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const popups = require("popups");
const alert = require('alert'); 
const app = express()
var n=["Rahul","Prasana","Teju"];

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/hospitalDB",{useNewUrlParser: true,useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    userName: {
        type:String,
        required: true
    },
    email:  {
        type:String,
        required: true,
        unique:true
    },
    address: {
        type:String,
        required: true
    },
    city: {
        type:String,
        required: false
    },
    state: {
        type:String,
        required: false
    },
    zip: {
        type:String,
        required: true
    },
    mobileNumber: {
        type:String,
        required: true,
        unique: true
    },
    reason: {
        type:String,
        required: true
    },
    date: {
        type:String,
        required: true
    },
    doctorName: {
        type: String,
        required: false
    }
});
const doctorSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true,
        unique: true
    },
    doctorName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type :Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
        min:22,
    },
    qualification: {
        type: String,
        required:true,
        enum: ["MBBS","mbbs","MD MBBS","md mbbs","general","nursing"]
    },
    address: {
        type: String,
        required: true
    },
    maxAppointment: {
        type: Number,
        required: false,
        min:0,
        max:5
    }
});
const User = mongoose.model("User",userSchema);
const Doctor = mongoose.model("Doctor",doctorSchema);
const doctor1 = new Doctor({
    id:1,doctorName:"Rahul",phoneNumber:6361842031,age:26,qualification:"mbbs",address:"xyz",maxAppointment:4
});
const doctor2 = new Doctor({
    id:2,doctorName:"Prasana",phoneNumber:6361842032,age:30,qualification:"md mbbs",address:"abc",maxAppointment:3
});
const doctor3 = new Doctor({
    id:3,doctorName:"Teju",phoneNumber:6361842033,age:28,qualification:"general",address:"pqr",maxAppointment:5
});

Doctor.find({},function(err,foundItems){
    if(foundItems.length === 0){
        Doctor.insertMany([doctor1,doctor2,doctor3],function(error){
            if(error){
                console.log(error);
             }
        });
    }
});

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
    // var docNameList=[];
    // Doctor.find(function(err,doctorList){
    //     var num = Math.floor((Math.random() * doctorList.length));
    //     // console.log(num);
    //     // console.log(doctorList);
    //      console.log(doctorlist[num]);
          
    // });
    // console.log(docNameList);
    var num = Math.floor((Math.random() * n.length));
    var dateTyped = req.body.date;
    const user = new User({
        userName: req.body.firstName +" "+ req.body.lastName,
        email: req.body.userEmail,
        address: req.body.userAddress,
        city: req.body.userCity,
        state: req.body.userState,
        zip: req.body.userZip,
        mobileNumber: req.body.phNumber,
        reason:req.body.reason ,
        date: req.body.date,
        doctorName: n[num]
    });
    user.save();
    res.render("applicationSuccess",{datePrint:dateTyped});
});

app.get("/login",function(req,res){
    res.sendFile(__dirname + "/login.html")
});

app.post("/login",function(req,res){
    emailTyped = req.body.inputEmail;
    passwordTyped = req.body.inputPassword;
    if( emailTyped == "venkatsatish@gmail.com" && passwordTyped == "1234"){
       return res.redirect("/appointments");
    }
    else{
       alert("Invalid email or password! Please try again.")
    }
});

app.get("/appointments",function(req,res){
    User.find(function(err,users){
        if(err){
            console.log(err);
            }
        else{
             res.render("viewAppointments",{userList:users});
            }
    });
});

app.post("/delete",function(req,res){
    const clickedId = req.body.changeButton;
    User.findByIdAndRemove(clickedId,function(err){
        if(err){
            console.log(err);
        }
    });
    res.redirect("/appointments");
});

app.listen(3000, function() {
  console.log("server started at port 3000")
});