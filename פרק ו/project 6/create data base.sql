-- create the data base named jsonplaceholder_clone
CREATE DATABASE IF NOT EXISTS jsonplaceholder_clone;
USE jsonplaceholder_clone;

-- crreate table
-- users (id(key), name, username, email)

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- passwords(user_is(foreign key), password)

CREATE TABLE passwords (
    user_id INT PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- posts(id(key), user_is(foreign key), title, bady)

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- comments(id(key), post_id(foreign key), name, email, bady)

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    body TEXT,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- todos(id(key), user_id(foreign key), title, completed)

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- albums(id, user_id(foreign key), title)
CREATE TABLE albums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- photos(id, album_id(foreign key), title, url, thumbnailUrl)
CREATE TABLE photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  album_id INT,
  title VARCHAR(255),
  url TEXT,
  thumbnailUrl TEXT,
  FOREIGN KEY (album_id) REFERENCES albums(id)
);


-- add demy data
INSERT INTO users (name, username, email) VALUES
('Alice Smith', 'alice', 'alice@example.com'),
('Bob Johnson', 'bobby', 'bob@example.com'),
('Carol White', 'carolw', 'carol@example.com'),
('David Brown', 'davidb', 'david@example.com'),
('Eve Davis', 'eved', 'eve@example.com');

INSERT INTO passwords (user_id, password) VALUES
(1, '123456'),
(2, 'password1'),
(3, 'letmein'),
(4, 'admin123'),
(5, 'testtest');

INSERT INTO todos (user_id, title, completed) VALUES
(1, 'Buy groceries', TRUE),
(1, 'Finish project', FALSE),
(2, 'Walk the dog', TRUE),
(2, 'Read a book', FALSE),
(3, 'Workout', TRUE),
(4, 'Call mom', TRUE),
(5, 'Write blog post', FALSE);

INSERT INTO posts (user_id, title, body) VALUES
(1, 'My first post', 'This is Alices first post.'),
(2, 'A day in the life', 'Bob writes about his day.'),
(3, 'Tech trends', 'Carol discusses tech.'),
(4, 'Travel tips', 'David shares travel advice.'),
(5, 'Book review', 'Eve reviews a novel.');

INSERT INTO comments (post_id, name, email, body) VALUES
(1, 'Tom', 'tom@example.com', 'Great post!'),
(1, 'Jerry', 'jerry@example.com', 'Thanks for sharing.'),
(2, 'Alice', 'alice@example.com', 'Nice writing.'),
(3, 'Carol', 'carol@example.com', 'Interesting points.'),
(4, 'David', 'david@example.com', 'Loved it!'),
(5, 'Eve', 'eve@example.com', 'Very useful.');

INSERT INTO albums (user_id, title) VALUES
(1, 'Animal Album'),
(1, 'vןiew album'),
(2,'vןiew album');

INSERT INTO photos (album_id, title, url, thumbnailUrl) VALUES
(1, 'dog', 'https://picsum.photos/id/237/400/600','https://picsum.photos/id/237/400/600'),
(1, 'lion','https://media.istockphoto.com/id/1796374503/photo/the-lion-king.webp?a=1&b=1&s=612x612&w=0&k=20&c=WHVZW8kYz5I-hfkES58duFi2VrXI_Z0hXNweq3MUSwE=','https://media.istockphoto.com/id/1796374503/photo/the-lion-king.webp?a=1&b=1&s=612x612&w=0&k=20&c=WHVZW8kYz5I-hfkES58duFi2VrXI_Z0hXNweq3MUSwE='),
(2, 'photo2','https://fastly.picsum.photos/id/724/300/200.jpg?hmac=noXikCG-jTwpsWI_sfPENFpGvq1UtFKfiy4ARKbcdN0','https://fastly.picsum.photos/id/724/300/200.jpg?hmac=noXikCG-jTwpsWI_sfPENFpGvq1UtFKfiy4ARKbcdN0'),
(2, 'photo1','https://fastly.picsum.photos/id/559/600/400.jpg?hmac=sRJHfq808moVesuKlfinoDI8WW6bDAUb-6MEFtm0tUk','https://fastly.picsum.photos/id/559/600/400.jpg?hmac=sRJHfq808moVesuKlfinoDI8WW6bDAUb-6MEFtm0tUk'),
(2,'sea','https://fastly.picsum.photos/id/559/600/400.jpg?hmac=sRJHfq808moVesuKlfinoDI8WW6bDAUb-6MEFtm0tU','https://fastly.picsum.photos/id/559/600/400.jpg?hmac=sRJHfq808moVesuKlfinoDI8WW6bDAUb-6MEFtm0tU');
