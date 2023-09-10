import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
const port=3000;
const app=express();
mongoose.connect('mongodb://127.0.0.1/User').then(()=>
        {console.log("Success")});
        const value=new mongoose.Schema({
            email:String,
            password:String,
        });
        app.use(bodyParser.urlencoded({extended:true}));
        const set="tr";
        value.plugin(encrypt,{secret:set,encryptedFields:["password"]});
        const data=new mongoose.model("data",value);
app.use(express.static("public"));
app.listen(port,function(){
    console.log("Connected to server");
});
app.get("/",function(req ,res){
    res.render("home.ejs");
});
app.get("/login",function(req,res){
     res.render("login.ejs");
});
app.get("/register",function(req,res){
     res.render("register.ejs");
});
app.post("/register",function(req,res){
       async function add(){
        const t=await new data({
            email:req.body.username,
            password:req.body.password,
        });
        t.save();
       }
      add().then(()=>{
          res.render("secrets.ejs");
      })
      .catch(error=>{
          res.send(error);
      })
    //    add();
    //    res.render("secrets.ejs");
});
app.post("/login",function(req,res){
     let value;
    async function find(val){
        let user=await data.findOne({email:val});
        value=user.password;
        console.log(user);
        console.log(value);
        if(req.body.password===value)
        {
             res.render("secrets.ejs");    
        }
        else{
           res.redirect("/");
        }
      }
       find(req.body.username);
      
     
});