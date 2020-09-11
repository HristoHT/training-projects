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

module.exports = router;