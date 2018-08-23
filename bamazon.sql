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