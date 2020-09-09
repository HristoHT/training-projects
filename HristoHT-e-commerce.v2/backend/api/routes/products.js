const express = require('express');
const router = express.Router();
const HttpError = require('../../utils/HttpError');
var products;

router.use((req, res, next) => {
    products = req.app.locals.controllers.products;

    next();
});

router.get('/', async (req, res) => {
    try {
        console.log(req.query);
        const result = await products.get(req.query);
        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.get('/:product_id', async (req, res) => {
    try {
        console.log(1);
        const result = await products.getProductById(req.params.product_id);
        console.log(2);
        res.send(result);
    } catch (e) {
        console.log(e)
        HttpError(e, res);
    }
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const result = await products.add(req.body);

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.put('/:product_id', async (req, res) => {
    try {
        const result = await products.update(req.params.product_id, req.body);

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.patch('/:product_id', async (req, res) => {
    try {
        const result = await products.updateOne(req.params.product_id, req.body);

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.delete('/:product_id', async (req, res) => {
    try {
        const result = await products.remove(req.params.product_id);

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

module.exports = router;