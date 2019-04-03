var mongoose = require("mongoose");

var customerSchema = new mongoose.Schema({
	customername: String,
	customeraddress: String,
	latitude: String,
	longitude: String,
	deliverydate: Date
});

module.exports = mongoose.model("Customer", customerSchema);