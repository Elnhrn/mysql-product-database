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

// Quit message. If user chooses "n", it will end the SQL connection and exit the code.
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

// Menu of options for user.
function userPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "choices",
            message: "Hello Mrs. Supervisor. What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function (arg) {
        if (arg.choices === "View Product Sales by Department") {
            viewSales();
        } else if (arg.choices === "Create New Department") {
            newDept();
        }
    });
}

// View Product Sales by Department
function viewSales() {
    var query = "select d.department_id, d.department_name, d.over_head_costs, p.product_sales, (p.product_sales - d.over_head_costs) as total_profit from departments d join products p group by d.department_name;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        quit();
    });
}

// Create New Department
function newDept() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department you would like to add?"
        },
        {
            type: "input",
            name: "overhead",
            message: "What is the overhead cost?"
        },
    ]).then(function (arg) {

        // SET not VALUES
        var sql = "insert into departments set ?";
        var values = {
            department_name: arg.name,
            over_head_costs: arg.overhead,
        };
        connection.query(sql, values, function (err) {
            if (err) throw err;
            console.log("Your new department has been successfully added.");
            quit();
        });
    });
}