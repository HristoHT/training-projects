const requiredParam = require('../utils/requiredParam');
const ValidationError = require('../utils/ValidationError');
const { tablesSchemas, tablesNames } = require('../initialLoad');
const CustomError = require('../utils/CustomError');
const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');

const toUser = ({
    username = requiredParam('потребителско име'),
    password = requiredParam('парола'),
    email = requiredParam('е-маил адрес'),
    confirmPassword = requiredParam('потвърди парола'),
    role = requiredParam('роля')
}) => {
    try {
        if (username.length < 3) {
            ValidationError('Потребителското име трябва да е с дължина по-голяма от 2 символа');
        }

        if (email < 6) {
            ValidationError('Въведете валид е-маил адрес');
        }

        if (password !== confirmPassword) {
            ValidationError('Паролите не съвпадат');
        }

        return {
            username,
            password,
            email,
            role
        }
    } catch (e) {
        throw e;
    }
};

const toUserLogin = ({
    username = requiredParam('потребителско име'),
    password = requiredParam('парола'),
}) => {
    return {
        username,
        password,
    }
};

const accessTokenFunct = user => {
    if (user.iat) delete user.iat;//Оказа се, че ако обектът има property iat генерира същич токен

    return jwt.sign(user, config.ACCESS_TOKEN, { expiresIn: '60s' });
}


const refreshTokenFunct = (actions) => async user => {
    try {
        if (user.iat) delete user.iat;//Оказа се, че ако обектът има property iat генерира същич токен

        const token = jwt.sign(user, config.REFRESH_TOKEN);

        await actions.insertInTable(tablesNames.tokens, tablesSchemas.tokens, [{ token }]);

        return token;
    } catch (e) {
        throw e;
    }
}

const registerUser = (actions) => async ({ username, email, password, role }) => {
    try {
        let user = await actions.selectFromTable(tablesNames.users, ['username'], [`WHERE username = '${username}' OR email='${email}'`]);

        if (user.length) {
            throw new CustomError(409, 'Потребител с това потребителско име или е-маеил съществува');
        }

        password = await bcrypt.hash(password, 10);

        await actions.insertInTable(tablesNames.users, tablesSchemas.users, [
            { username, email, password, role }
        ])

        return true;

    } catch (e) {
        throw e;
    }
}

const loginUser = (actions) => async ({ username, password }) => {
    let user = await actions.selectFromTable(tablesNames.users, ['*'], [`WHERE username = '${username}'`]);

    if (!user.length) {
        throw new CustomError(404, 'Не паравилно име или парола');
    } else {
        user = user[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            delete user.password;
            console.log('------------');
            console.log(user);
            const accessToken = accessTokenFunct(user);
            const refreshToken = await refreshTokenFunct(actions)(user);

            return ({ accessToken, refreshToken, user });
        } else {
            throw new CustomError(404, 'Непаравилно име или парола')
        }
    }
}

const regenerateToken = (actions) => async ({ token = null }) => {
    try {
        const refreshToken = token;
        console.log(token)
        if (refreshToken === null) {
            console.log(1);
            throw new CustomError(401, 'Влезте в профила си');
        }

        //Проверява дали refreshToken-a съществува в базата с refreshToken-и,
        //ако не съществува => или клиентът се e logout-нал или е неправилен токен
        const isExistingToken = await getToken(actions)(refreshToken);
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

const logoutUser = (actions) => async ({ token = null }) => {
    try {
        const refreshToken = token;
        if (token === null) {
            throw new CustomError(401, 'Влезте в профила си');
        }

        await deleteToken(actions)(refreshToken);

        return true;
    } catch (e) {
        console.log(e);
        throw e;
    }
}


const deleteToken = (actions) => async token => {
    try {
        return await actions.deleteFromTable(tablesNames.tokens, [`WHERE token ='${token}'`]);
    } catch (e) {
        throw e;
    }
}

const getToken = actions => async token => {
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

const customActions = (actions) => {
    return {
        registerUser: registerUser(actions),
        loginUser: loginUser(actions),
        regenerateToken: regenerateToken(actions),
        logoutUser: logoutUser(actions),
        verifyAccessToken: verifyAccessToken
    }
}

module.exports = { toUser, toUserLogin, customActions };