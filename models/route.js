var mongoose = require("mongoose");

var routeSchema = new mongoose.Schema({
	date: Date
});

module.exports = mongoose.model("Route", routeSchema);