const express = require('express');
const router = express.Router();
const HttpError = require('../../utils/HttpError');
const { tablesSchemas, tablesNames } = require('../../initialLoad');
const { toItem, searchQuery } = require('../../dataNormalization/Items');
const { adminRole, userRole } = require('../middlewares/roles');
const { queries } = require('@testing-library/react');
var actions;

const getItems = async (query) => {
    try {
        const conditions = searchQuery(query)

        const items = await actions.selectFromTable(tablesNames.items, ['*'], conditions);
        const brands = await actions.selectFromTable(tablesNames.items, ['brand'], [], true);
        const maxPrice = await actions.selectFromTable(tablesNames.items, ['MAX(price)']);

        return { data: items, brands: brands.map(obj => obj.brand), maxPrice: maxPrice[0].max, options: query };
    } catch (e) {
        console.log(e)
    }
}

router.use((req, res, next) => {
    actions = req.app.locals.dbActions;

    next();
});

router.post('/', adminRole, async (req, res) => {
    try {
        console.log(req.body);

        await actions.insertInTable(
            tablesNames.items,
            tablesSchemas.items,
            [toItem(req.body)]);

        const result = await getItems();

        req.app.locals.io.emit('floors:add', result);
        res.send(result);
    } catch (e) {
        console.log(e.stack);
        return HttpError(e, res);
    }
});

router.get('/', async (req, res) => {
    try {
        res.send(await getItems(req.query))
    } catch (e) {
        console.log(e.stack);
        return HttpError(e, res);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await actions.selectFromTable(tablesNames.items, ['*'], [`WHERE id = ${req.params.id}`])
        res.send({ item: result[0] || {} })
    } catch (e) {
        console.log(e.stack);
        return HttpError(e, res);
    }
});

router.put('/', async (req, res) => {
    try {
        const result = await actions.selectFromTable(tablesNames.orders_details, ['*'], [`INNER JOIN ${tablesNames.orders} USING(order_id) `,
        ` WHERE item_id = ${req.query.item_id} AND`,
        ` order_modified >= '${req.query.dateFrom}' AND`,
        ` order_modified <= '${req.query.dateTo}' AND order_status = 'finished'`,]);

        res.send({ data: result });
    } catch (e) {
        console.log(e.stack);
        return HttpError(e, res);
    }
});

module.exports = router;