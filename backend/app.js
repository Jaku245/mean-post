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
app.use("/images",express.static(path.join("backend/images")));

app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With , Content-Type , Accept, Authorization ");
  res.setHeader(
    "Access-Control-Allow-Methods",
    " GET , POST , PUT , PATCH , DELETE , OPTIONS ");
  next();
})

app.use("/api/posts", PostRoutes);
app.use("/api/user", UserRoutes);

module.exports = app;
