BackEnd:
Các package cần cài đặt:
npm install nodemon express sequelize mysql2 dotenv bcrypt jsonwebtoken rand-token

chạy server:
npm run dev

sql: cài đặt tài khoản, mật khẩu trong file .env

MySQL:
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('customer', 'admin') NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    bio TEXT,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255) NOT NULL,
    access_token VARCHAR(255)
);
