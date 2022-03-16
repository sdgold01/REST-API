'use strict';

var express = require("express");
var app = express();
var routes = require("./routes");

var jsonParser = require("body-parser").json;
var logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/qa")

var db = mongoose.connection;

db.on("error", function(err) {
    console.error("connection error:", err)
});

db.once("open", function(){
    console.log("db connection successful!");
})

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
});

app.use("/questions", routes);

app.use(function(req, res, next){
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

var port = process.env.PORT || 3005;

app.listen(port, function() {
    console.log('The server is running at port', port);
});