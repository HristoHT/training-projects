const express = require('express');
const router = express.Router();
const HttpError = require('../../utils/HttpError');
var carts;

router.use((req, res, next) => {
    carts = req.app.locals.controllers.carts;

    next();
});

router.get('/:user_id', async (req, res) => {
    try {
        const result = await carts.getCartDetails(req.params.user_id);

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.put('/', async (req, res) => {
    try {
        const result = await carts.addToCart(req.body);
        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.patch('/', async (req, res) => {
    try {
        const result = await carts.removeFromCart(req.body);
        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.delete('/:user_id', async (req, res) => {
    try {
        const result = await carts.clearCart(req.params.user_id);

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

module.exports = router;