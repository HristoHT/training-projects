const requiredParam = require('../utils/requiredParam');
const ValidationError = require('../utils/ValidationError');
const stringNormalization = require('../utils/StringNormalization');
const format = require('../utils/formatValue');
const { tablesSchemas, tablesNames } = require('../initialLoad');
const CustomError = require('../utils/CustomError');
const actions = require('../actions');

const toOrder = ({
    user_id = requiredParam('user_id'),
    item_id = requiredParam('product_id'),
    item_quantity = requiredParam('item_quantity')
}) => {
    if (format(user_id, { type: 'number-0' }) === 0) {
        ValidationError('Неправилен потребител');
    }

    if (format(item_id, { type: 'number-0' }) === 0) {
        ValidationError('Неправилен продукт');
    }

    if (Number(format(item_quantity, { type: 'number-0' })) < 0) {
        ValidationError('Количеството трябва да е по-големо от 0');
    }

    return {
        user_id,
        item_id,
        item_quantity
    }
}

const startNewOrder = (actions) => async ({ user_id }) => {
    await actions.insertInTable(tablesNames.orders, tablesSchemas.orders, [{
        user_id: Number(user_id),
        order_price: '0',
        order_created: (new Date()).getTime(),
        order_modified: (new Date()).getTime(),
        order_status: 'not finished',
    }])

    return await getOrder(actions)({ user_id });
}

const getOrder = (actions) => async ({ user_id }) => {
    let result = await actions.selectFromTable(tablesNames.orders, ['*'],
        [`WHERE user_id = ${Number(user_id)}`,
            `AND order_status = 'not finished'`]);

    if (result.length === 0) {
        result = await startNewOrder(actions)({ user_id });
        return result;
    } else {
        return result[0];
    }
}

const addToOrder = (actions) => async ({ user_id, item_id, item_quantity = 1 }) => {
    try {
        let order = await getOrder(actions)({ user_id });

        let item = await actions.selectFromTable(tablesNames.items, ['name', 'price', 'id'], [`WHERE id = ${item_id}`]);

        if (item.length === 0) {
            throw new CustomError(404, 'Не съществува продукт с това id');
        } else {
            item = item[0];
        }
        console.log(item);
        const toNumber = (val) => (Number(val) || 0);

        let newOrderPrice = toNumber(order.order_price) + toNumber(item.price) * toNumber(item_quantity);


        await actions.updateTable(tablesNames.orders, tablesSchemas.orders, { order_price: newOrderPrice, order_modified: (new Date()).getTime() }, [`WHERE order_id = '${order.order_id}'`]);
        await actions.insertInTable(tablesNames.orders_details, tablesSchemas.orders_details, [{
            order_id: order.order_id,
            item_id: item.id,
            item_name: item.name,
            item_price: item.price,
            item_quantity
        }]);

        let result = await actions.selectFromTable(tablesNames.orders, ['*'], [`WHERE order_id = ${order.order_id}`]);

        return result[0];
    } catch (e) {
        throw e;
    }
}

const getOrders = (actions) => async ({
    user_id = false,
    order_id = false,
    type = false,
    detailed = true,
    dateFrom = false,
    dateTo = false,
    priceFrom = null,
    priceTo = null,
    search = null }) => {
    try {
        let conditions = [], flag = false;

        console.log(Boolean(detailed), detailed);

        if (detailed !== 'false') {
            conditions.push(`INNER JOIN ${tablesNames.orders_details} USING(order_id)`);
        }
        conditions.push(`INNER JOIN ${tablesNames.users} ON username = ${tablesNames.users}.username`);
        conditions.push(`AND user_id = ${tablesNames.users}.id`);

        if(user_id || type || detailed || dateFrom || dateTo || priceFrom || priceTo || search){
            conditions.push('WHERE');
        }

        if (user_id) {
            conditions.push(`user_id = ${user_id} `);
            flag = true;
        }

        if (order_id) {
            if (flag)
                conditions.push('AND');
            conditions.push(`order_id = '${order_id}' `);
            flag = true;
        }

        if (dateFrom) {
            if (flag)
                conditions.push('AND');
            conditions.push(`order_modified >= '${dateFrom}' `);
            flag = true;
        }

        if (dateTo) {
            if (flag)
                conditions.push('AND');
            conditions.push(`order_modified <= '${dateTo}' `);
            flag = true;

        }

        if (priceFrom) {
            if (flag)
                conditions.push('AND');
            conditions.push(`order_price >= ${priceFrom} `);
            flag = true;
        }

        if (priceTo) {
            if (flag)
                conditions.push('AND');
            conditions.push(`order_price <= ${priceTo} `);
            flag = true;
        }

        if (search) {
            if (flag)
                conditions.push('AND');
            search = search.trim();
            conditions.push(`( username ~* '${search}')`);
            flag = true;
        }

        if (type) {
            if (flag)
                conditions.push('AND');
            conditions.push(`order_status = '${type}'`);
            flag = true;
        }
        conditions.push(`ORDER BY order_modified`);

        return await actions.selectFromTable(tablesNames.orders,
            ['*'],
            conditions);
    } catch (e) {
        throw e;
    }
}

const finishOrder = (actions) => async ({ user_id = requiredParam('user_id') }) => {
    return await actions.updateTable(tablesNames.orders, tablesSchemas, { order_status: 'finished' }, [`WHERE user_id = ${Number(user_id)} AND order_status='not finished'`])
}

const deleteOrder = (actions) => async ({ user_id = requiredParam('user_id') }) => {
    const order = await getOrder(actions)({ user_id });

    await actions.deleteFromTable(tablesNames.orders_details, [`WHERE order_id = ${order.order_id}`]);
    await actions.updateTable(tablesNames.orders, tablesSchemas.orders, { order_price: 0, order_modified: (new Date()).getTime() }, [`WHERE order_id = '${order.order_id}'`]);

    return await getOrder(actions)({ user_id });
}

const customActions = (actions) => {
    return {
        getOrder: getOrder(actions),
        startNewOrder: startNewOrder(actions),
        addToOrder: addToOrder(actions),
        getOrders: getOrders(actions),
        finishOrder: finishOrder(actions),
        deleteOrder: deleteOrder(actions)
    }
}

module.exports = { toOrder, customActions };