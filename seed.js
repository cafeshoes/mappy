var Customer = require("./models/customer.js");

function seeder() {
    var Data = [
        {
            customername: "John Doe",
            customeraddress: "Park Street 101",
            latitude:"28.4595",
            longitude:"77.0266",
            deliverydate: new Date("2019-01-01")
        },
        {
            customername: "Mary Poppins",
            customeraddress: "Park Street 102",
            latitude:"28.5355",
            longitude:"77.3910",
            deliverydate: new Date("2019-01-01")
        },
        {
            customername: "Stephanie Johnson",
            customeraddress: "Park Street 103",
            latitude:"26.9124",
            longitude:"75.7873",
            deliverydate: new Date("2019-01-01")
        },
        {
            customername: "Lucy Myres",
            customeraddress: "Park Street 105s",
            latitude:"26.8467",
            longitude:"80.9462",
            deliverydate: new Date("2019-01-01")
        },
        {
            customername: "Sheila Bhattcharya",
            customeraddress: "Park Street 104",
            latitude:"28.7041",
            longitude:"77.1025",
            deliverydate: new Date("2019-01-01")
        }
    ];
    Customer.find({}, function(err, returnData) {
        if(err) {
            console.log("Err occured!");
        } else {
            if(returnData.length===0) {
                Data.forEach(function(entry) {
                    console.log(entry.deliverydate)
                    Customer.create(entry, function(error, success) {
                        if(err)
                            console.log("Error encountered!");
                        else
                            console.log("Database populated!")
                    });
                });
            }
        }
    });
}

module.exports = seeder;
