var express = require("express");
var app = express();
var routes = require("./routes");
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var logger = require("morgan")

app.use(logger("dev"));
app.use(express.static(__dirname + '/public')); //Keep before other use statements
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.set("view engine", "ejs");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/gKeepClone")
var db = mongoose.connection
db.on("error", function(err){
  console.log("Error connecting to the gKeepClone Database", err)
})
db.once("open", function(){
  console.log("Successfully connected to the gKeepClone Database")
})

app.use("/", routes)
app.use("/new", routes)
app.use("/put", routes)
app.use("/#:id", routes)

// catch 404 and forward to error handler
app.use(function(req, res, next){
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error Handler
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server is listening on port", port);
});
