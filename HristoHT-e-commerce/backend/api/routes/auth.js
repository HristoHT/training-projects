const express = require('express');
const router = express.Router();
const HttpError = require('../../utils/HttpError');
const { tablesSchemas, tablesNames } = require('../../initialLoad');
const requiredParam = require('../../utils/requiredParam');
const { toUser, customActions, toUserLogin } = require('../../dataNormalization/Auth');
var actions, authActions;

router.use((req, res, next) => {
    actions = req.app.locals.dbActions;
    authActions = customActions(actions);

    next();
});

router.post('/register', async (req, res) => {
    try {
        res.send({ data: await authActions.registerUser(toUser(req.body)) })
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
        let user = toUserLogin(req.body);

        res.send(await authActions.loginUser(user));
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
        res.send(await authActions.regenerateToken(req.body));
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
        res.send({data: await authActions.logoutUser(req.body)});
    } catch (e) {
        console.log(e)
        return HttpError(e, res);
    }
});

module.exports = router;