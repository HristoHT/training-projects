const express = require('express');
const router = express.Router();
const HttpError = require('../../../utils/HttpError');
var auth;

router.use((req, res, next) => {
    auth = req.app.locals.controllers.auth;

    next();
});

/**
 * По RefreshToken генерира нов AccessToken
 */
router.post('/token', async (req, res) => {
    try {
        res.send(await auth.regenerateToken(req.body));
    } catch (e) {
        console.log(e)
        return HttpError(e, res);
    }
});

/**
 * Деактивира refreshToken като го изтрива от базата
 */
router.delete('/logout', async (req, res) => {
    try {
        res.send({ data: await auth.logoutUser(req.body) });
    } catch (e) {
        console.log(e)
        return HttpError(e, res);
    }
});

router.post('/login', async (req, res) => {
    try {
        res.send(await auth.loginAdmin(req.body));
    } catch (e) {
        console.log(e.stack);
        return HttpError(e, res);
    }
});

router.post('/register', async (req, res) => {
    try {
        res.send({ data: await auth.registerAdmin(req.body) })
    } catch (e) {
        console.log(e);
        return HttpError(e, res);
    }
});

module.exports = router;