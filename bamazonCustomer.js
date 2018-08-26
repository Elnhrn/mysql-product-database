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

// Displays all of the items available for sale, including ids, names, and prices of products for sale.
function afterConnection() {
    connection.query("select item_id, product_name, department_name, price from products", function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        userPrompt();
    });
}

// Quit message: if user chooses "n", it will end the sql connection and exit the code.
function quit() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "menu",
            message: "Would you like to go back to the main menu?"
        }
    ]).then(function (arg) {
        if (arg.menu === false) {
            connection.end();
            process.exit();
        } else {
            userPrompt();
        }
    });
}

// Prompts users with two messages.
function userPrompt() {
    inquirer.prompt([
        // Asks them the ID of the product they would like to buy.
        {
            type: "input",
            name: "productId",
            message: "What is the ID of the product you would like to buy?"
        },
        // Asks how many units of the product they would like to buy
        {
            type: "input",
            name: "units",
            message: "How many units of the product would you like to buy?"
        }

    ]).then(function (arg) {

        // Once the customer has placed the order, it checks if your store has enough of the product to meet the customer's request.
        connection.query("select * from products where item_id = ?", arg.productId, function (err, res) {
            if (err) throw err;

            // Fulfill the customer's order by updating the SQL database to reflect the remaining quantity.
            if (arg.units <= res[0].stock_quantity) {
                var newQuantity = res[0].stock_quantity - arg.units;

                // The price of the product multiplied by the quantity purchased is added to the product's product_sales column.
                var sales = res[0].price * arg.units;

                var query = "UPDATE products SET ? , ? WHERE ?";
                var values = [
                    {stock_quantity: newQuantity},
                    {product_sales: sales},
                    {item_id: arg.productId}
                ];
                connection.query(query, values, function (err) {
                    if (err) throw err;
                });

                // Once the update goes through, shows the customer the total cost of their purchase.
                var total = arg.units * res[0].price;
                console.log("Your order has been placed successfully. Your total cost is $" + total.toFixed(2));
                quit();
            } else {
                // If not, the app logs a phrase like Insufficient quantity!, and then prevent the order from going through.
                console.log("Insufficient quantity! Please try placing your order again.");
                afterConnection();
            }
        });
    });
}