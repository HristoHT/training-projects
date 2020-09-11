const express = require('express');
const router = express.Router();
const HttpError = require('../../../utils/HttpError');
var auth;

router.use((req, res, next) => {
    auth = req.app.locals.controllers.auth;

    next();
});

router.post('/register', async (req, res) => {
    try {
        res.send({ data: await auth.registerUser(req.body) })
    } catch (e) {
        console.log(e);
        return HttpError(e, res);
    }
});

/**
 * При правилно влизане в системата потребителят получава чифт ключове refreshToken & accessToken
 * AccessToken-a изтича на 10мин
 * RefreshToken-a се използва за възобновяване на AccessToken, пернаментен е или до изпълнение на DELETE request-a
 */
router.post('/login', async (req, res) => {
    try {
        res.send(await auth.loginUser(req.body));
    } catch (e) {
        console.log(e.stack);
        return HttpError(e, res);
    }
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


module.exports = router;