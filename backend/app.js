const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const PostRoutes = require("./Routes/posts");
const UserRoutes = require("./Routes/users");

const app = express();

mongoose.connect("mongodb+srv://Jaimin:"+ process.env.MONGO_ATLAS_PWD +"@cluster0-n9nc6.mongodb.net/Node-Angular?retryWrites=true&w=majority")
.then(()=>{
  console.log("Connection Successfull!!");
})
.catch(()=>{
  console.log("Connection Failed!!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images",express.static(path.join(__dirname ,"images")));
app.use("/",express.static(path.join(__dirname ,"angular")));

app.use("/api/posts", PostRoutes);
app.use("/api/user", UserRoutes);
app.use((req, res, next) =>{
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});


module.exports = app;
