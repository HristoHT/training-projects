const { customActions } = require('../../dataNormalization/Auth');
const CustomError = require('../../utils/CustomError');
const HttpError = require('../../utils/HttpError');

const userRole = async (req, res, next) => {
    try {
        const user = req.user;
        console.log(user.role, typeof(user.role));
        if (user.role !== 'user') {
            throw new CustomError(403, 'Вие не сте оторизиран да извършите това действие');
        }

        next();
    } catch (e) {
        console.log(e);
        return HttpError(e, res);
    }
}

const adminRole = async (req, res, next) => {
    try {
        const user = req.user;
        console.log(user.role, typeof(user.role));

        if (user.role !== 'admin') {
            throw new CustomError(403, 'Вие не сте оторизиран да извършите това действие');
        }

        next();
    } catch (e) {
        console.log(e);
        return HttpError(e, res);
    }
}
module.exports = { adminRole, userRole };