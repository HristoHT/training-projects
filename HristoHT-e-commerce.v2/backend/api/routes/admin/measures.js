const express = require('express');
const router = express.Router();
const HttpError = require('../../../utils/HttpError');
var measures;

router.use((req, res, next) => {
    measures = req.app.locals.controllers.measures;

    next();
});

router.get('/', async (req, res) => {
    try {
        const result = await measures.get();

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.get('/:measure_id', async (req, res) => {
    try {
        const result = await measures.get({ measure_id: req.params.measure_id });

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await measures.add(req.body);

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.put('/:measure_id', async (req, res) => {
    try {
        const result = await measures.update(req.params.measure_id, req.body);

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

router.delete('/:measure_id', async (req, res) => {
    try {
        const result = await measures.remove(req.params.measure_id);

        res.send(result);
    } catch (e) {
        HttpError(e, res);
    }
});

module.exports = router;