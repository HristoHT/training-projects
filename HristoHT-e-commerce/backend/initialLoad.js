const initialLoad = async actions => {
    const usersFlag = await actions.checkIfTableExist(tablesNames.users);
    const itemsFlag = await actions.checkIfTableExist(tablesNames.items);
    const ordersFlag = await actions.checkIfTableExist(tablesNames.orders);
    const ordersDetailsFlag = await actions.checkIfTableExist(tablesNames.orders_details);
    const tokensFlag = await actions.checkIfTableExist(tablesNames.tokens);


    if (!usersFlag) {
        await actions.createTable(tablesNames.users, {
            username: 'TEXT NOT NULL UNIQUE',
            password: 'TEXT NOT NULL',
            role: 'TEXT NOT NULL',
            email: 'TEXT NOT NULL UNIQUE',
            id: 'SERIAL PRIMARY KEY'
        });
    }

    if (!itemsFlag) {
        await actions.createTable(tablesNames.items, {
            name: 'TEXT NOT NULL',
            description: 'TEXT NOT NULL',
            brand: 'TEXT NOT NULL',
            price: 'NUMERIC(5,2)',
            img: 'TEXT',
            id: 'SERIAL PRIMARY KEY'
        });
    }

    if (!ordersFlag) {
        await actions.createTable(tablesNames.orders, {
            order_id: 'SERIAL PRIMARY KEY',
            user_id: `SERIAL REFERENCES ${tablesNames.users}(id)`,
            order_price: 'NUMERIC(5,2)',
            order_status: 'TEXT',
            order_created: 'TEXT',
            order_modified: 'TEXT'
        });
    }

    if (!ordersDetailsFlag) {
        await actions.createTable(tablesNames.orders_details, {
            order_detail_id: 'SERIAL PRIMARY KEY',
            order_id: `SERIAL REFERENCES ${tablesNames.orders}(order_id)`,
            item_id: `SERIAL REFERENCES ${tablesNames.items}(id)`,
            item_name: 'TEXT',
            item_price: 'NUMERIC(5,2)',
            item_quantity: 'NUMERIC(5,2)'
        });
    }

    if (!tokensFlag) {
        await actions.createTable(tablesNames.tokens, {
            token_id: 'SERIAL PRIMARY KEY',
            token: 'TEXT'
        });
    }

    // await actions.deleteTable(tablesNames.users);
    // await actions.deleteTable(tablesNames.orders);
    // await actions.deleteTable(tablesNames.orders_details);
    console.log('Tables are waiting data...');
}

const tablesNames = {
    items: 'items',
    users: 'users',
    orders: 'orders',
    orders_details: 'order_details',
    tokens: 'tokens'
}

const tablesSchemas = {
    users: {
        username: { type: 'string' },
        password: { type: 'string' },
        role: { type: 'string' },
        email: { type: 'string' },
    }, items: {
        name: { type: 'string' },
        description: { type: 'string' },
        brand: { type: 'string' },
        price: { type: 'number-2' },
        img: { type: 'string' }
    }, orders: {
        user_id: { type: 'string' },
        order_price: { type: 'number-2' },
        order_created: { type: 'string' },
        order_modified: { type: 'string' },
        order_status: { type: 'string' },
    }, orders_details: {
        order_id: { type: 'string' },
        item_id: { type: 'string' },
        item_name: { type: 'string' },
        item_price: { type: 'number-2' },
        item_quantity: { type: 'number-0' }
    }, tokens: {
        token: { type: 'string' }
    }
}

module.exports = { initialLoad, tablesSchemas, tablesNames };