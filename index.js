var express 				= require("express"),
	mongoose 				= require("mongoose"),
	flash					= require("connect-flash"),
	passport 				= require("passport"),
	bodyParser 				= require("body-parser"),
	User					= require("./models/user"),
	Customer                = require("./models/customer"),
	Route 					= require("./models/route"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose   = require("passport-local-mongoose"),
	seeder					= require("./seed.js");

seeder();
mongoose.connect("mongodb+srv://frostcover:Fz7vsxHlcuQY6ezj@cluster0-nlz9b.mongodb.net/test?retryWrites=true");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.set("view engine","ejs");
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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
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
	console.log(d_date);
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
app.get("/customerShow", (req, res) => {
    Customer.find({}, (err, data) => {
        res.render("delivery", {
            data: data
        })
    })
});
app.post("/updateStatus", (req, res) => {

    Customer.find({latitude: req.body.latitude}, (err, data) => {
        if(err)
            console.log(err);
        else {
                if(data[0].deliveryStatus == "Pending") {
                    Customer.findOneAndUpdate({latitude: req.body.latitude},{ deliveryStatus: "Delivered" }, (err, retData) => {
                        if(err)
                            console.log(err);
                        else {
                        res.send("Delivered");
                    }
                })
            } else {
                res.send("Already delivered!");
            }

        }
    })
})
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
app.post("/register", function(req,res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, ans) {
        if(err) {
            console.log(err);
            res.send('Error');
        }
        else {
            // Authentication via passport
            passport.authenticate('User')(req, res, function(){
                res.send("Registered!");
            });
        }
    });
});
app.get("/logout", function(req, res){
	req.logout();
	//req.flash("success", "Logged you out")
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	//req.flash("error", "You need to be logged in!");
	res.redirect("/login");
}

app.listen(process.env.PORT || 5000, function(){
	console.log("Server started..!!!")
});
