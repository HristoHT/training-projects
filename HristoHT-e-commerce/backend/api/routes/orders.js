const express = require('express');
const router = express.Router();
const HttpError = require('../../utils/HttpError');
const { tablesSchemas, tablesNames } = require('../../initialLoad');
const requiredParam = require('../../utils/requiredParam');
const { toOrder, customActions } = require('../../dataNormalization/Orders');
const { adminRole, userRole } = require('../middlewares/roles')

var actions, orderActions;

router.use((req, res, next) => {
    actions = req.app.locals.dbActions;
    orderActions = customActions(actions);

    next();
});

router.put('/', userRole, async (req, res) => {
    try {
        const orderInfo = toOrder(req.body);
        res.send({ data: await orderActions.addToOrder(orderInfo) })
    } catch (e) {
        console.log(e.stack);
        return HttpError(e, res);
    }
});

router.put('/:user_id', userRole, async (req, res) => {
    try {
        await orderActions.finishOrder(req.params);
        res.send({ data: await orderActions.getOrders({ user_id: req.params.user_id, type: 'not finished' }) })
    } catch (e) {
        console.log(e.stack);
        return HttpError(e, res);
    }
});

router.delete('/:user_id', userRole, async (req, res) => {
    try {
        await orderActions.deleteOrder(req.params);
        res.send({ data: await orderActions.getOrders({ user_id: req.params.user_id, type: 'not finished' }) })
    } catch (e) {
        console.log(e.stack);
        return HttpError(e, res);
    }
});

router.get('/', async (req, res) => {
    try {
        const maxPrice = await actions.selectFromTable(tablesNames.orders, ['MAX(order_price)']);

        res.send({
            rows: await orderActions.getOrders(req.query),
            options: req.query,
            maxPrice: maxPrice[0].max
        })
    } catch (e) {
        console.log(e.stack);
        return HttpError(e, res);
    }
});

module.exports = router;