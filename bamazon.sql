create database bamazon;
use bamazon;

create table products(
item_id int auto_increment not null,
product_name varchar(100) not null,
department_name varchar(100) not null,
price decimal(4,2) not null,
stock_quantity integer(4) not null,
primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity) values
('Ear plugs', 'Sleeping', 2.50, 100),
('Face mask', 'Beauty', 5, 50),
('Silk robe','Clothing', 45, 40),
('Wine', 'Food', 15, 36),
('Popcorn', 'Food', 5, 70),
('Pizza', 'Food', 20, 50),
('Snuggie', 'Bedding', 20, 60),
('Nail polish', 'Beauty', 5, 75),
('Slippers', 'Shoes', 15, 60),
('Lipstick', 'Beauty', 5, 50);

create table departments(
department_id int auto_increment not null,
department_name varchar(100) not null,
over_head_costs int(4) not null,
primary key (department_id)
);

alter table products
add column product_sales int(4) not null;

insert into departments (department_name, over_head_costs) 
values ('Beauty', 500),
	('Bedding', 750),
    ('Clothing', 1000),
    ('Food', 240),
    ('Home', 1000),
    ('Shoes', 850),
    ('Sleeping', 1100);

-- select d.department_id, d.department_name, d.over_head_costs, p.product_sales, (p.product_sales - d.over_head_costs) as total_profit
-- from departments d join products p
-- group by d.department_name;