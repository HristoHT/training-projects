CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    description TEXT,
    image TEXT,
    visable BOOLEAN
);
CREATE TABLE measures (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    price FLOAT(2),
    quantity FLOAT(3)
);
CREATE TABLE products_measures (
    id BIGSERIAL PRIMARY KEY,
    measure_id BIGSERIAL REFERENCES measures(measure_id),
    product_id BIGSERIAL REFERENCES products(product_id)
);
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE
);
CREATE TABLE products_tags (
    id BIGSERIAL PRIMARY KEY,
    tag_id BIGSERIAL REFERENCES tags(tag_id),
    product_id BIGSERIAL REFERENCES products(product_id)
);
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    method TEXT UNIQUE NOT NULL
);
CREATE TABLE currencies (
    id BIGSERIAL PRIMARY KEY,
    symbol TEXT UNIQUE NOT NULL,
    course FLOAT(5),
    name TEXT UNIQUE NOT NULL
);
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL, 
    addres TEXT,
    payment BIGSERIAL REFERENCES payments(payment_id)
);
CREATE TABLE cart (
    id BIGSERIAL PRIMARY KEY,
    price FLOAT(2),
    user BIGSERIAL REFERENCES users(user_id),
    modified TEXT NOT NULL
);
CREATE TABLE cart_details (
    id BIGSERIAL PRIMARY KEY,
    modified TEXT NOT NULL,
    cart_id BIGSERIAL REFERENCES cart(cart_id),
    product_id BIGSERIAL REFERENCES products(product_id),
    measure_id BIGSERIAL REFERENCES measures(measure_id),
    quantity FLOAT(3),
    price FLOAT(3)
);
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    price FLOAT(2),
    user BIGSERIAL REFERENCES users(user_id),
    payment BIGSERIAL REFERENCES payments(payment_id),
    currency BIGSERIAL REFERENCES currencies(currency_id),
    status TEXT NOT NULL,
    created TEXT NOT NULL,
    address TEXT NOT NULL
);
CREATE TABLE order_details (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGSERIAL REFERENCES orders(order_id),
    product_id BIGSERIAL REFERENCES products(product_id),
    measure_id BIGSERIAL REFERENCES measures(measure_id),
    quantity FLOAT(3),
    price FLOAT(2)
);
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL, 
    email TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL
);
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);
CREATE TABLE admins_permissions (
    id BIGSERIAL PRIMARY KEY,
    permission_id BIGSERIAL REFERENCES permissions(permission_id),
    admin_id BIGSERIAL REFERENCES admins(admin_id)
);