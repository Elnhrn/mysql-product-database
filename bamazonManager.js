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
    userPrompt();
});

// menu of choices for user
function userPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "choices",
            message: "Hello Mrs. Manager. What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (arg) {
        if (arg.choices === "View Products for Sale") {
            viewProducts();
        } else if (arg.choices === "View Low Inventory") {
            lowInventory();
        } else if (arg.choices === "Add to Inventory") {
            addInventory();
        } else if (arg.choices === "Add New Product") {
            addProduct();
        }
    });
}

// quit message. if user chooses "n", it will end the sql connection and exit the code.
function quit() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "goback",
            message: "Would you like to go back to the main menu?"
        }
    ]).then(function (arg) {
        if (arg.choice === "n") {
            connection.end();
            process.exit();
        } else {
            userPrompt();
        }
    });
}

// list every available item: the item IDs, names, prices, and quantities
function viewProducts() {
    connection.query("select * from products", function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        quit();
    });
}

// list all items with an inventory count lower than five
function lowInventory() {
    connection.query("select * from products where stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);
        quit();
    });
}

// let the manager "add more" of any item currently in the store
function addInventory() {
    connection.query("select * from products", function (err, res) {
        if (err) throw err;
        console.log("\n");
        console.table(res);

        // empty array to push all products available in the database to display as "1: PRODUCT NAME" in the terminal
        var productArr = [];

        for (var i = 0; i < res.length; i++) {
            productArr.push(res[i].item_id + ": " + res[i].product_name);
        }

        inquirer.prompt([
            {
                type: "list",
                name: "product",
                message: "Which product would you like to add to?",
                choices: productArr
            },
            {
                type: "input",
                name: "units",
                message: "How many units of the product would you like to add?"
            }
        ]).then(function (arg) {
            var add;
            var arr = arg.product.split(":");

            // for loop to match the selected item id to the item id in the database table
            for (var i = 0; i < res.length; i++) {

                if (parseInt(arr[0]) == parseInt(res[i].item_id)) {
                    // adding the user input units and current stock quantity
                    add = parseInt(res[i].stock_quantity) + parseInt(arg.units);

                    var sql = "UPDATE products SET ? WHERE ?";
                    var values = [
                        { stock_quantity: add },
                        { item_id: res[i].item_id }
                    ];
                    connection.query(sql, values, function (err) {
                        if (err) throw err;
                    });

                    console.log("Additional inventory has been added successfully.");
                    quit();
                }
            }
        });
    });
}

// allow the manager to add a completely new product to the store
function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the product you would like to add?"
        },
        {
            type: "input",
            name: "dept",
            message: "What department is it in?"
        },
        {
            type: "input",
            name: "price",
            message: "What is the price?"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to stock?"
        },
    ]).then(function (arg) {

        // SET not VALUES
        var sql = "insert into products set ?";
        var values = {
            product_name: arg.name,
            department_name: arg.dept,
            price: arg.price,
            stock_quantity: arg.quantity
        };
        connection.query(sql, values, function (err) {
            if (err) throw err;
            console.log("Your new product has been successfully added.");
            quit();
        });
    });
}