const { customActions } = require('../../dataNormalization/Auth');
const CustomError = require('../../utils/CustomError');
const HttpError = require('../../utils/HttpError');

const validateToken = async (req, res, next) => {
    try {
        let actions = req.app.locals.dbActions,
            authActions = customActions(actions);

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            throw new CustomError(401, 'Влезте в профила си');
        }

        try {
            const user = await authActions.verifyAccessToken(token);
            console.log(user);
            req.user = user;
            next();
        } catch (e) {
            console.log(e)
            throw new CustomError(401, 'Влезте в профила си');
        }
    } catch (e) {
        console.log(e);
        return HttpError(e, res);
    }
}

module.exports = validateToken;