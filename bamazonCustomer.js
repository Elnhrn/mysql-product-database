var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon",
});

connection.connect(function (err) {
    if (err) throw err;
    afterConnection();
});

//Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
function afterConnection() {
    connection.query("select * from products", function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        userPrompt();
    });
}

function quit() {
    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "Press Q to quit."
        }
    ]).then(function (arg) {
        if(arg.choice === "q" || arg.choice === "Q") {
            connection.end();
            process.exit();
        }
    });
}

//The app should then prompt users with two messages.
function userPrompt() {
    inquirer.prompt([
        //The first should ask them the ID of the product they would like to buy.
        {
            type: "input",
            name: "productId",
            message: "What is the ID of the product you would like to buy?"
        },
        //The second message should ask how many units of the product they would like to buy.
        {
            type: "input",
            name: "units",
            message: "How many units of the product would you like to buy?"
        }

    ]).then(function (arg) {

        //Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
        connection.query("select * from products where item_id = ?", arg.productId, function (err, res) {
            if (err) throw err;

            //Fulfill the customer's order by updating the SQL database to reflect the remaining quantity.
            if (arg.units <= res[0].stock_quantity) {
                var newQuantity = res[0].stock_quantity - arg.units;

                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        { stock_quantity: newQuantity },
                        { item_id: arg.productId }
                    ], function (err) {
                        if (err) throw err;
                    }
                );

                //Once the update goes through, show the customer the total cost of their purchase.
                var total = arg.units * res[0].price;
                console.log("Your order has been placed successfully. Your total cost is $" + total.toFixed(2));
                quit();
            } else {
                //If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
                console.log("Insufficient quantity! Please try placing your order again.");
                afterConnection();
            }
        });
    });
}