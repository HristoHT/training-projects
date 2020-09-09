const { tablesNames, tablesSchemas } = require('../../initialLoad');
const { toUser, toUserLogin } = require('./userObject');
const CustomError = require('../../utils/CustomError');
const bcrypt = require('bcrypt');
const config = require('../../config');
const jwt = require('jsonwebtoken');
/**
 * Measures controller
 * 
 * @param {postgres actions} actions 
 */
const controller = (actions) => {


    const accessTokenFunct = user => {
        if (user.iat) delete user.iat;//Оказа се, че ако обектът има property iat генерира същич токен

        return jwt.sign(user, config.ACCESS_TOKEN, { expiresIn: '60s' });
    }


    const refreshTokenFunct = async user => {
        try {
            if (user.iat) delete user.iat;//Оказа се, че ако обектът има property iat генерира същич токен

            const token = jwt.sign(user, config.REFRESH_TOKEN);

            await actions.insertInTable(tablesNames.tokens, tablesSchemas.tokens, [{ token }]);

            return token;
        } catch (e) {
            throw e;
        }
    }

    const registerUser = async (obj) => {
        try {
            let { name, email, password } = toUser(obj);
            let user = await actions.selectFromTable(tablesNames.users, ['name'], [`WHERE name = '${name}' OR email='${email}'`]);

            if (user.length) {
                throw new CustomError(409, 'Потребител с това потребителско име или е-маеил съществува');
            }

            password = await bcrypt.hash(password, 10);

            await actions.insertInTable(tablesNames.users, tablesSchemas.users, [
                { name, email, password }
            ])

            return true;

        } catch (e) {
            throw e;
        }
    }

    const registerAdmin = async (obj) => {
        try {
            let { name, email, password } = toUser(obj);
            let user = await actions.selectFromTable(tablesNames.admins, ['name'], [`WHERE name = '${name}' OR email='${email}'`]);

            if (user.length) {
                throw new CustomError(409, 'Потребител с това потребителско име или е-маеил съществува');
            }

            password = await bcrypt.hash(password, 10);

            await actions.insertInTable(tablesNames.admins, tablesSchemas.admins, [
                { name, email, password }
            ])

            return true;

        } catch (e) {
            throw e;
        }
    }

    const loginAdmin = async (obj) => {
        let { name, password } = toUserLogin(obj);
        let admin = await actions.selectFromTable(tablesNames.admins, ['*'], [`WHERE name = '${name}'`]);

        if (!admin.length) {
            throw new CustomError(404, 'Непаравилно име или парола');
        } else {
            admin = admin[0];
            const isPasswordCorrect = await bcrypt.compare(password, admin.password);

            if (isPasswordCorrect) {
                delete admin.password;
                console.log('------------');
                console.log(admin);
                const accessToken = await accessTokenFunct(admin);
                const refreshToken = await refreshTokenFunct(admin);

                return ({ accessToken, refreshToken, user: {...admin, admin:true}, admin: true });
            } else {
                throw new CustomError(404, 'Непаравилно име или парола')
            }
        }
    }

    const loginUser = async (obj) => {
        let { name, password } = toUserLogin(obj);
        let user = await actions.selectFromTable(tablesNames.users, ['*'], [`WHERE name = '${name}'`]);

        if (!user.length) {
            throw new CustomError(404, 'Непаравилно име или парола');
        } else {
            user = user[0];
            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (isPasswordCorrect) {
                delete user.password;
                console.log('------------');
                console.log(user);
                const accessToken = await accessTokenFunct(user);
                const refreshToken = await refreshTokenFunct(user);

                return ({ accessToken, refreshToken, user });
            } else {
                throw new CustomError(404, 'Непаравилно име или парола')
            }
        }
    }

    const regenerateToken = async ({ token = null }) => {
        try {
            const refreshToken = token;
            console.log(token)
            if (refreshToken === null) {
                console.log(1);
                throw new CustomError(401, 'Влезте в профила си');
            }

            //Проверява дали refreshToken-a съществува в базата с refreshToken-и,
            //ако не съществува => или клиентът се e logout-нал или е неправилен токен
            const isExistingToken = await getToken(refreshToken);
            if (isExistingToken === null) {
                console.log(2);
                throw new CustomError(401, 'Влезте в профила си');
            }

            try {
                //Връща нов accessToken ако refreshToken-a е валиден, а ако не хвърля грешка и попада в catch-a
                const accessToken = await verifyRefreshToken(refreshToken);

                return { accessToken };
            } catch (e) {
                console.log(e);
                throw new CustomError(401, 'Влезте в профила си');
            }

        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    const logoutUser = async ({ token = null }) => {
        try {
            const refreshToken = token;
            if (token === null) {
                throw new CustomError(401, 'Влезте в профила си');
            }

            await deleteToken(refreshToken);

            return true;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }


    const deleteToken = async token => {
        try {
            return await actions.deleteFromTable(tablesNames.tokens, [`WHERE token ='${token}'`]);
        } catch (e) {
            throw e;
        }
    }

    const getToken = async token => {
        try {
            const result = await actions.selectFromTable(tablesNames.tokens, ['token'], [`WHERE token = '${token}'`]);

            if (result.length) {
                return result[0];
            } else {
                return null;
            }
        } catch (e) {
            throw e;
        }
    }

    const verifyRefreshToken = async refreshToken => {
        try {
            const user = await jwt.verify(refreshToken, config.REFRESH_TOKEN);

            return accessTokenFunct(user);

        } catch (e) {
            throw e;
        }
    }

    const verifyAccessToken = async accessToken => {
        try {
            const user = await jwt.verify(accessToken, config.ACCESS_TOKEN);

            return user;

        } catch (e) {
            throw e;
        }
    }


    return Object.freeze({
        loginUser,
        logoutUser,
        regenerateToken,
        registerUser,
        loginAdmin,
        registerAdmin
    });
}

module.exports = controller;