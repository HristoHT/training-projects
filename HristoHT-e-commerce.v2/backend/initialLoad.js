const initialLoad = async actions => {
    try {
        const measuresFlag = await actions.checkIfTableExist(tablesNames.measures);
        const productsFlag = await actions.checkIfTableExist(tablesNames.products);
        const productsMeasuresFlag = await actions.checkIfTableExist(tablesNames.products_measures);
        const usersFlag = await actions.checkIfTableExist(tablesNames.users);
        const tokensFlag = await actions.checkIfTableExist(tablesNames.tokens);
        const adminFlag = await actions.checkIfTableExist(tablesNames.admins);
        const cartsFlag = await actions.checkIfTableExist(tablesNames.carts);
        const cart_detailsFlag = await actions.checkIfTableExist(tablesNames.cart_details);
        const ordersFlag = await actions.checkIfTableExist(tablesNames.orders);
        const order_detailsFlag = await actions.checkIfTableExist(tablesNames.order_details);

        if (!usersFlag) {
            await actions.createTable(tablesNames.users, {
                id: ' BIGSERIAL PRIMARY KEY',
                name: ' TEXT UNIQUE NOT NULL',
                password: ' TEXT NOT NULL',
                email: ' TEXT UNIQUE NOT NULL',
                address: ' TEXT',
                // payment: 'BIGSERIAL REFERENCES payments(payment_id)'
            });
        }

        if (!adminFlag) {
            await actions.createTable(tablesNames.admins, {
                id: ' BIGSERIAL PRIMARY KEY',
                name: ' TEXT UNIQUE NOT NULL',
                password: ' TEXT NOT NULL',
                email: ' TEXT UNIQUE NOT NULL',
            });
        }

        if (!measuresFlag) {
            await actions.createTable(tablesNames.measures, {
                id: 'BIGSERIAL PRIMARY KEY',
                name: 'TEXT UNIQUE',
                price: 'NUMERIC(2)',
                quantity: 'NUMERIC(3)'
            });
        }

        if (!productsFlag) {
            await actions.createTable(tablesNames.products, {
                id: 'BIGSERIAL PRIMARY KEY',
                name: 'TEXT UNIQUE',
                description: 'TEXT',
                image: 'TEXT'
            });
        }

        if (!productsMeasuresFlag) {
            await actions.createTable(tablesNames.products_measures, {
                id: 'BIGSERIAL PRIMARY KEY',
                product_id: `BIGSERIAL REFERENCES ${tablesNames.products}(id)`,
                measure_id: `BIGSERIAL REFERENCES ${tablesNames.measures}(id)`,
            });
        }

        if (!tokensFlag) {
            await actions.createTable(tablesNames.tokens, {
                id: 'BIGSERIAL PRIMARY KEY',
                token: `TEXT NOT NULL`,
            });
        }

        if (!cartsFlag) {
            await actions.createTable(tablesNames.carts, {
                id: 'BIGSERIAL PRIMARY KEY',
                price: 'FLOAT(2)',
                user_id: `BIGSERIAL REFERENCES ${tablesNames.users}(id)`,
                modified: 'TEXT NOT NULL',
            });
        }

        if (!cart_detailsFlag) {
            await actions.createTable(tablesNames.cart_details, {
                id: 'BIGSERIAL PRIMARY KEY',
                modified: 'TEXT NOT NULL',
                cart_id: `BIGSERIAL REFERENCES ${tablesNames.carts}(id)`,
                product_id: `BIGSERIAL REFERENCES ${tablesNames.products}(id)`,
                measure_id: `BIGSERIAL REFERENCES ${tablesNames.measures}(id)`,
                quantity: 'FLOAT(3)',
                price: 'FLOAT(2)'
            });
        }

        if (!ordersFlag) {
            await actions.createTable(tablesNames.orders, {
                id: ` BIGSERIAL PRIMARY KEY`,
                price: ` FLOAT(2)`,
                user_id: ` BIGSERIAL REFERENCES ${tablesNames.users}(id)`,
                // payment: ` BIGSERIAL REFERENCES payments(payment_id)`,
                // currency: ` BIGSERIAL REFERENCES currencies(currency_id)`,
                status: ` TEXT NOT NULL`,
                created: ` TEXT NOT NULL`,
                address: `TEXT NOT NULL`
            });
        }

        if(!order_detailsFlag){
            await actions.createTable(tablesNames.order_details, {
                id: `BIGSERIAL PRIMARY KEY`,
                order_id: `BIGSERIAL REFERENCES ${tablesNames.orders}(id)`,
                product_id: `BIGSERIAL REFERENCES ${tablesNames.products}(id)`,
                measure_id: `BIGSERIAL REFERENCES ${tablesNames.measures}(id)`,
                quantity: `FLOAT(3)`,
                price: `FLOAT(2)`
            });
        }

        // await actions.deleteTable(tablesNames.products_measures);
        // await actions.deleteTable(tablesNames.measures);
        // await actions.deleteTable(tablesNames.order_details);
        console.log('Tables are waiting data...');
    } catch (e) {
        console.log(e)
    }
}

const tablesNames = {
    measures: 'measures',
    products: 'products',
    products_measures: 'products_measures',
    users: 'users',
    tokens: 'tokens',
    admins: 'admins',
    carts: 'carts',
    cart_details: 'cart_details',
    orders: 'orders',
    order_details: 'order_details'
}

const tablesSchemas = {
    tokens: {
        token: { type: 'string' }
    },
    users: {
        name: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        address: { type: 'string' },
    },
    admins: {
        name: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
    },
    measures: {
        name: { type: 'string' },
        price: { type: 'number-2' },
        quantity: { type: 'number-3' },
    },
    products: {
        name: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string' },
        visable: { type: 'bolean' }
    },
    products_measures: {
        product_id: { type: 'id' },
        measure_id: { type: 'id' },
    },
    carts: {
        price: { type: 'number-2' },
        user_id: { type: 'id' },
        modified: { type: 'string' },
    },
    cart_details: {
        modified: { type: 'string' },
        cart_id: { type: 'id' },
        product_id: { type: 'id' },
        measure_id: { type: 'id' },
        quantity: { type: 'number-3' },
        price: { type: 'number-2' }
    },
    orders: {
        price: { type: 'number-2' },
        user_id: { type: 'id' },
        created: { type: 'string' },
        status: { type: 'string' },
        address: { type: 'string' },
    },
    order_details: {
        order_id: { type: 'id' },
        product_id: { type: 'id' },
        measure_id: { type: 'id' },
        quantity: { type: 'number-3' },
        price: { type: 'number-2' }
    },
}

module.exports = { initialLoad, tablesSchemas, tablesNames };