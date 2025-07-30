-- יצירת בסיס הנתונים
DROP DATABASE IF EXISTS online_store;
CREATE DATABASE online_store;
USE online_store;

-- יצירת טבלאות
-- מחלקות v
CREATE TABLE Departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- משתמשים v
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'worker', 'storekeeper', 'admin') DEFAULT 'customer',
    department_id INT DEFAULT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Departments(id) ON DELETE SET NULL
);

-- מוצרים v
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    min_quantity INT NOT NULL,
    department_id INT NOT NULL,
    image LONGTEXT,
    FOREIGN KEY (department_id) REFERENCES Departments(id) ON DELETE CASCADE
);

-- סל מוצרים v
CREATE TABLE CartItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

-- הזמנות v
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('shipped', 'arrived') DEFAULT 'shipped',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    address TEXT, -- ברירת מחדל הכתובת של המשתמש
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- פירטי הזמנות v
CREATE TABLE OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

-- הזמנת מלאי v
CREATE TABLE RestockRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    requested_by INT NOT NULL,
    status ENUM('arrived', 'ordered', 'rejected', 'pending') DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES Users(id) ON DELETE CASCADE
);

-- דירוג ותגובות v
CREATE TABLE Ranking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    UNIQUE (product_id, user_id)  -- דירוג אחד לכל מוצר
);

-- תשלום v
CREATE TABLE Payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    card_last4 CHAR(4),
    card_expiry DATE,
    balance DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- תיעוד פעולות v
CREATE TABLE UserLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    activity VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
