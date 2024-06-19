CREATE DATABASE MilkShop
USE MilkShop
DROP DATABASE MilkShop

CREATE TABLE Roles (
    role_id VARCHAR(20) PRIMARY KEY,
    role_name NVARCHAR(50) NOT NULL
);

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL,
    password NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    role_id VARCHAR(20) NOT NULL REFERENCES Roles(role_id),
    status BIT DEFAULT 1
);

CREATE TABLE Customer (
    customer_id INT PRIMARY KEY REFERENCES Users(user_id),
    loyalty_points INT DEFAULT 0
);

CREATE TABLE Product_Categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL
);

CREATE TABLE Brands (
    brand_id INT IDENTITY(1,1) PRIMARY KEY,
    brand_name NVARCHAR(255) NOT NULL,
	category_id INT REFERENCES Product_Categories(category_id) 
);

CREATE TABLE Originated_Country (
    country_id CHAR(3) PRIMARY KEY,
    country_name NVARCHAR(100) NOT NULL,
	category_id INT REFERENCES Product_Categories(category_id) 
);

CREATE TABLE Age_Range (
    age_range NVARCHAR(255) PRIMARY KEY,
	category_id INT REFERENCES Product_Categories(category_id) 
);

CREATE TABLE Products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    product_name NVARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    brand_id INT REFERENCES Brands(brand_id),
    country_id CHAR(3) REFERENCES Originated_Country(country_id),
    age_range NVARCHAR(255) REFERENCES Age_Range(age_range),
);

CREATE TABLE Reviews (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(user_id),
    product_id INT NOT NULL REFERENCES Products(product_id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date DATETIME DEFAULT GETDATE()
);

CREATE TABLE Orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(user_id),
    order_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(10) CHECK (status IN ('pending', 'paid', 'confirmed', 'completed', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0)
);

CREATE TABLE Order_Items (
    order_item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL REFERENCES Orders(order_id),
    product_id INT NOT NULL REFERENCES Products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE Vouchers (
    voucher_id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(50) UNIQUE NOT NULL,
    discount DECIMAL(5, 2) NOT NULL CHECK (discount >= 0),
    expiration_date DATE NOT NULL
);

CREATE TABLE User_Vouchers (
    user_id INT NOT NULL REFERENCES Users(user_id),
    voucher_id INT NOT NULL REFERENCES Vouchers(voucher_id),
    used BIT DEFAULT 0,
    PRIMARY KEY (user_id, voucher_id)
);

CREATE TABLE Payment_Methods (
    payment_method_id INT IDENTITY(1,1) PRIMARY KEY,
    method_name NVARCHAR(50) NOT NULL,
    details TEXT
);

CREATE TABLE Payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL REFERENCES Orders(order_id),
    payment_method_id INT NOT NULL REFERENCES Payment_Methods(payment_method_id),
    transaction_date DATETIME NOT NULL DEFAULT GETDATE(),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    transaction_status NVARCHAR(20) NOT NULL,
    payment_details TEXT
);

CREATE TABLE Posts (
    post_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(user_id),
    content TEXT,
    post_date DATETIME DEFAULT GETDATE(),
    product_id INT REFERENCES Products(product_id)
);

CREATE TABLE RefreshTokens (
  token VARCHAR(255) PRIMARY KEY,
  user_id INT,
  expiryDate DATETIME,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Insert into Roles
INSERT INTO Roles (role_id, role_name) VALUES
('admin', 'Admin'),
('customer', 'Customer'),
('staff', 'Staff');

-- Insert into Users
INSERT INTO Users (username, password, email, role_id) VALUES
('admin_user', 'password123', 'admin@example.com', 'admin'),
('customer1', 'password123', 'customer1@example.com', 'customer'),
('customer2', 'password123', 'customer2@example.com', 'customer'),
('staff1', '123456789', 'staff1@example.com', 'staff');

-- Insert into Customer
INSERT INTO Customer (customer_id, loyalty_points) VALUES
(2, 100),
(3, 150);

-- Insert into Product_Categories
INSERT INTO Product_Categories (category_name) VALUES
('Brands'),
('Originated countries'),
('Age ranges');

-- Insert into Brands
INSERT INTO Brands (brand_name, category_id) VALUES
('BabyMilk Co.',1),
('Maternal Care Inc.',1);

-- Insert into Originated_Country
INSERT INTO Originated_Country (country_id, country_name, category_id) VALUES
('USA', 'United States', 2),
('CAN', 'Canada', 2),
('JPN', 'Japan', 2),
('GER', 'Germany', 2);

-- Insert into Age_Range
INSERT INTO Age_Range (age_range, category_id) VALUES
('0-6 months', 3),
('6-12 months', 3),
('1-2 years', 3),
('More than 2 years old', 3),
('Maternal', 3),
('Adult', 3);

-- Insert into Products
INSERT INTO Products (product_name, description, price, stock, brand_id, country_id, age_range) VALUES
('Infant Milk Powder', 'High-quality milk powder for infants 0-6 months.', 25.99, 100, 1, 'USA', '0-6 months'),
('Maternal Milk Supplement', 'Nutritional supplement for mothers.', 19.99, 50, 2, 'CAN', '1-2 years'),
('Baby Formula', 'Baby formula for infants 6-12 months.', 29.99, 75, 1, 'USA', '6-12 months'),
('Toddler Milk Drink', 'Nutritious milk drink for toddlers.', 22.99, 60, 1, 'GER', '1-2 years'),
('Organic Baby Formula', 'Organic formula for infants 0-6 months.', 35.99, 40, 2, 'CAN', '0-6 months'),
('Maternal Health Drink', 'Healthy drink for pregnant women.', 27.99, 30, 2, 'JPN', 'Maternal'),
('Junior Growth Milk', 'Growth milk for kids over 2 years.', 32.99, 80, 1, 'USA', 'More than 2 years old'),
('Adult Milk Powder', 'Milk powder for adults.', 20.99, 45, 1, 'USA', 'Adult'),
('Soy-Based Infant Formula', 'Soy-based formula for infants 0-6 months.', 29.99, 50, 2, 'GER', '0-6 months'),
('Lactose-Free Baby Formula', 'Lactose-free formula for infants.', 33.99, 70, 1, 'USA', '0-6 months');

-- Insert into Orders
INSERT INTO Orders (user_id, order_date, status, total_amount) VALUES
(2, '2024-06-01', 'Completed', 55.98),
(3, '2024-06-05', 'Pending', 29.99);

-- Insert into Order_Items
INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 25.99),
(1, 2, 1, 19.99),
(2, 3, 1, 29.99);

-- Insert into Vouchers
INSERT INTO Vouchers (code, discount, expiration_date) VALUES
('DISCOUNT10', 10.00, '2024-12-31'),
('WELCOME5', 5.00, '2024-06-30'),
('SPRING20', 20.00, '2024-07-31'),
('SUMMER15', 15.00, '2024-08-31'),
('FALL10', 10.00, '2024-09-30'),
('WINTER5', 5.00, '2024-10-31'),
('NEWYEAR25', 25.00, '2025-01-01');

-- Insert into Payment_Methods
INSERT INTO Payment_Methods (method_name, details) VALUES
('Momo', 'Mobile Money'),
('Zalopay', 'Online payment by Zalo'),
('Credit Card', 'Visa, MasterCard, Amex'),
('PayPal', 'paypal@example.com'),
('Bank Transfer', 'Account Number: 123456789, Bank: ABC Bank'),
('Cash on Delivery', 'Payment upon delivery'),
('Gift Card', 'Gift card code can be applied at checkout');

-- Insert into Payments
INSERT INTO Payments (order_id, payment_method_id, transaction_date, amount, transaction_status, payment_details) VALUES
(1, 1, '2024-06-01', 55.98, 'Completed', 'Visa ending in 1234'),
(2, 2, '2024-06-05', 29.99, 'Pending', 'PayPal transaction ID: abc123'),
(1, 3, '2024-06-01', 55.98, 'Completed', 'Bank transfer reference number: 987654321'),
(2, 4, '2024-06-05', 29.99, 'Pending', 'Payment will be collected upon delivery'),
(1, 5, '2024-06-01', 55.98, 'Completed', 'Gift card code: GIFT2024');

-- Additional Payments for variety
INSERT INTO Payments (order_id, payment_method_id, transaction_date, amount, transaction_status, payment_details) VALUES
(2, 1, '2024-06-07', 29.99, 'Completed', 'MasterCard ending in 5678'),
(1, 2, '2024-06-01', 55.98, 'Completed', 'PayPal transaction ID: def456'),
(2, 3, '2024-06-05', 29.99, 'Failed', 'Bank transfer failed, insufficient funds'),
(1, 4, '2024-06-01', 55.98, 'Completed', 'Payment will be collected upon delivery'),
(2, 5, '2024-06-05', 29.99, 'Pending', 'Gift card code: SUMMERGIFT');
