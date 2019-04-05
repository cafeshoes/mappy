var express 				= require("express"),
	mongoose 				= require("mongoose"),
	passport 				= require("passport"),
	bodyParser 				= require("body-parser"),
	User					= require("./models/user"),
	Customer                = require("./models/customer"),
	Route 					= require("./models/route"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose   = require("passport-local-mongoose");
	// shortestDistance		= require("./public/shortestroute");
mongoose.connect("mongodb://localhost/optimal_route_api");

var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
	secret: "Doggos are the best",
	resave: false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//add new customer
app.get("/customer", isLoggedIn, function(req, res){
	Customer.find({}, function(err, allCustomers){
		if(err){
			console.log(err);
		} else {
			res.render("customer",{customers: allCustomers});
		}
	})
});

app.post("/customer", function(req, res){
	var name = req.body.customername;
	var address = req.body.customeraddress;
	var lat = req.body.latitude;
	var lng = req.body.longitude;
	var d_date = req.body.deliverydate;
	//console.log(date);
	var newCustomer = {customername: name, customeraddress: address, latitude: lat, longitude: lng, deliverydate: d_date};
	//create a new customer and save it to db
	Customer.create(newCustomer, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/");

		}
	});
});

app.get("/route", isLoggedIn, function(req, res){
	Route.find({}, function(err, newRoutes){
		if(err){
			console.log(err);
		} else{
			res.render("route",{routes: newRoutes});
		}
	})
});

app.post("/route", function(req, res){
	var date = new Date(req.body.date);
	Customer.find({deliverydate: new Date(date)}, function(err, data){
		if(err){
			console.log(err);
		} else{
			//console.log(data);
			res.render("map", {data: data});
		}
	})
});

// ==============
// AUTH ROUTES
// ==============

app.get("/", function(req, res){
	res.render("home");
});

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/",
		failureRedirect: "/login"
	}), function(req, res){

});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function(){
	console.log("Server started..!!!")
});
