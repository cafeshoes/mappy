var mongoose = require("mongoose");

var customerSchema = new mongoose.Schema({
	customername: String,
	customeraddress: String,
	latitude: String,
	longitude: String,
	deliveryStatus: {
		type: String,
		default: "Pending"
	},
	deliverydate: Date
});

module.exports = mongoose.model("Customer", customerSchema);