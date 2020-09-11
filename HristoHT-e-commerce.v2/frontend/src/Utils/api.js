export const API_BASE = "http://localhost:8080/api";

/**
 * !АПИ функциите, на които им се подават парамертри трябва да изфлеждат по следния начин 
 * !const APIMethod = ( data ) => async (checkAccessToken = true) => {}
 * !1. те са ламда функции, за да се запази this-a
 * !2. те са функции, които връщат функции, заради async revalidateAccessToken(callback)
 */


class CustomError extends Error {
    constructor(status, ...params) {
        super(...params)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError)
        }

        this.name = 'CustomError'
        // Custom debugging information
        this.status = status;
        this.date = new Date();
    }
}

class API {
    accessToken = '';
    refreshToken = '';
    user = '';

    endPoints = {
        measures: '/measures',
        products: '/products',
        auth: '/auth',
        carts: '/carts'
    }
    //Ако е запазен accessToken-а в локалната памет го взема
    constructor() {
        this.getUser();
    }

    setUser(user = {}) {
        const [,endpoint] = window.location.pathname.split('/');
        console.log('endpoint', endpoint);
        console.log(user);
        window.localStorage.setItem(endpoint, JSON.stringify(user));
    }

    getUser() {
        const [,endpoint] = window.location.pathname.split('/');
        return JSON.parse(window.localStorage.getItem(endpoint) || '{}')
    }

    getAccessToken() {
        const { accessToken } = this.getUser();
        return accessToken;
    }

    /**
     * @param callback - функция, която изпълнява http заявка към апито
     * !callback-ът задължително трябва да е ламда функция!
     * !Ако на callback-а трябва да се подадът някакви параметри той трябва да е функция, изглеждаща по следния начин
     * ! const = ( data ) => async () => {}
     * *Функцията връща или грешка или отговорът на callback-а
     */
    async revalidateAccessToken(callback) {
        try {
            const [,endpoint] = window.location.pathname.split('/');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: this.refreshToken })
            };
            console.log('revalidation start');
            const response = await fetch(`${API_BASE}/${endpoint}${this.endPoints.auth}/token`, requestOptions);
            console.log(response);
            const result = await response.json();
            console.log('revalidate', result);
            if (response.status < 300) {
                this.setUser({ ...this.getUser(), accessToken: result.accessToken })
                return await callback(false);
            } else {
                return result;
            }

        } catch (e) {
            console.log(e.stack)
            throw e;
        }
    }

    /**
     * Метод за влизане в акаунт
     * @param body {username, password}
     */
    async login(body, admin = false) {
        try {
            const [,endpoint] = window.location.pathname.split('/');

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            };

            const response = await fetch(`${API_BASE}/${endpoint}${this.endPoints.auth}/login`, requestOptions);
            console.log(response);
            const result = await response.json();
            console.log(result);
            console.log(response)
            if (response.status >= 200 && response.status < 300) {
                this.setUser(result);
            } else {
                throw new CustomError(response.status, result.message);
            }

            return result;
        } catch (e) {
            console.log('Should throw an error')
            console.log(e.stack)
            throw e;
        }
    }

    /**
    * Метод за влизане в акаунт
    * @param body {username, password}
    */
    async register(body) {
        try {
            const [,endpoint] = window.location.pathname.split('/');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            };

            const response = await fetch(`${API_BASE}/${endpoint}${this.endPoints.auth}/register`, requestOptions);
            // console.log(response);
            const result = await response.json();
            console.log(result);
            if (response.status >= 400) {
                throw new CustomError(response.status, result.message)
            }

            return result;
        } catch (e) {
            console.log(e.stack)
            throw e;
        }
    }

    async logout() {
        try {
            const [,endpoint] = window.location.pathname.split('/');
            const { accessToken } = this.getUser();
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: accessToken })
            };

            const response = await fetch(`${API_BASE}/${endpoint}${this.endPoints.auth}/logout`, requestOptions);
            const result = await response.json();

            if (response.status >= 200 && response.status < 300) {
                console.log('Log out')
                this.setUser();
            }

            return result;
        } catch (e) {
            console.log(e.stack)
            throw e;
        }
    }

    /**
     * 
     * @param {String} method 
     * @param {String} endPoint 
     * @param {Object} body 
     * @param {Array of Strings} queries queries[i] = 'value=key'
     * @param {String} param трябва да включва '/' 
     * Универсален метод за правене на заявки към апито
     */
    request =
        (method, endPoint, { body = {}, queries = {}, param = '' } = { body: {}, queries: {}, param: '' }) =>
            async (checkAccessToken = true) => {
                try {
                    const { accessToken } = this.getUser();
                    const [,endpoint] = window.location.pathname.split('/');
                    //Тялото на заявката
                    let requestOptions = {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        }
                    };

                    // Атрибут body имат само следните методи
                    if (['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
                        requestOptions.body = JSON.stringify(body);
                    }

                    const query = '?' + Object.keys(queries)
                        .filter(key => {
                            if (typeof queries[key] === 'string' && !queries[key]) {
                                return false;
                            } else if (typeof queries[key] === 'object' && !queries[key].length) {
                                return false;
                            }

                            return true;
                        })
                        .map(key => {
                            let string = queries[key];

                            // if (typeof string === 'object') string = string.join(',');

                            return `${key}=${string}`;
                        }).join('&');
                    console.log('fetch sended', `${API_BASE}/${endpoint}${this.endPoints[endPoint]}${param}${query}`)
                    const response = await fetch(`${API_BASE}/${endpoint}${this.endPoints[endPoint]}${param}${query}`, requestOptions);
                    console.log('response recieved')
                    const result = await response.json();
                    /**
                    * Ако статуса на отговорът е [400, 499] има вероятност да е изтекъл accessToken-а
                    * затова извикваме функцията revalidateAccessToken
                    */
                    if (response.status >= 400 && response.status < 500 && checkAccessToken) {
                        console.log('Login error')
                        return await this.revalidateAccessToken(this.request(method, endPoint, { body, queries, param }));
                    } else if (response.status >= 400) {
                        console.log(result);
                        throw new CustomError(response.status, result.message);
                    } else {
                        return result;
                    }

                } catch (e) {
                    console.log(e.stack);
                    throw e;
                }
            }
}

const api = new API();
export default api;