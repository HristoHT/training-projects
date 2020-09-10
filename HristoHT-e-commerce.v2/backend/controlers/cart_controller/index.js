const { tablesNames, tablesSchemas } = require('../../initialLoad');
const CustomError = require('../../utils/CustomError');
const { format, getNumber, toNumber } = require('../../utils/formatValue');
const toCart = require('./toCart');

/**
 * Products controller
 * 
 * @param {postgres actions} actions 
 */
const controller = (actions) => {
    const startNewCart = async (user_id) => {
        try {
            await actions.insertInTable(tablesNames.carts, tablesSchemas.carts, [{
                user_id: Number(user_id),
                price: 0,
                modified: (new Date()).getTime(),
            }])

            return await getCart(user_id);
        } catch (e) {
            console.log(e);
        }
    }

    const getCart = async (user_id) => {
        try {
            let result = await actions.selectFromTable(tablesNames.carts, ['*'],
                [`WHERE user_id = ${Number(user_id)}`]);

            if (result.length === 0) {
                result = await startNewCart(user_id);
                return result;
            } else {
                return result[0];
            }
        } catch (e) {
            console.log(e)
        }
    }

    const addToCart = async (obj) => {
        try {
            let { user_id, product_id, measure_id, quantity } = toCart(obj);
            let cart = await getCart(user_id);
            let measure = await actions.selectFromTable(
                tablesNames.measures,
                ['*'],
                [`WHERE id = ${measure_id}`]);

            if (cart && measure.length) {
                measure = measure[0];

                const price = getNumber(toNumber(measure.price) * toNumber(quantity) + toNumber(cart.price));
                console.log(toNumber(measure.price), '*', toNumber(quantity), '+', toNumber(cart.price));
                const modified = (new Date()).getTime()
                await actions.updateTable(
                    tablesNames.carts,
                    tablesSchemas.carts,
                    {
                        price,
                        modified
                    },
                    [`WHERE user_id = ${user_id}`]
                );

                const products = await actions.selectFromTable(
                    tablesNames.cart_details,
                    ['*'],
                    [`WHERE product_id = ${toNumber(product_id)} AND measure_id = ${toNumber(measure_id)}`]);

                if (products.length) {
                    const newQuantity = getNumber(toNumber(products[0].quantity) + toNumber(quantity));
                    await actions.updateTable(
                        tablesNames.cart_details,
                        tablesSchemas.cart_details,
                        {
                            modified,
                            quantity: newQuantity,
                            price: getNumber(newQuantity * toNumber(measure.price))
                        },
                        [`WHERE cart_id = ${cart.id}`]);
                } else {
                    await actions.insertInTable(
                        tablesNames.cart_details,
                        tablesSchemas.cart_details,
                        [{
                            modified,
                            cart_id: cart.id,
                            product_id: product_id,
                            measure_id: measure_id,
                            quantity: toNumber(quantity),
                            price: getNumber(toNumber(measure.price) * toNumber(quantity))
                        }]);
                }


            } else {
                throw new Error('Неуспешно добавяне на продукта');
            }

            return await getCart(user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    const removeFromCart = async (obj) => {
        try {
            let { user_id, product_id, measure_id, quantity } = toCart(obj);
            let cart = await getCart(user_id);
            let measure = await actions.selectFromTable(
                tablesNames.measures,
                ['*'],
                [`WHERE id = ${measure_id}`]);
            let product_details = await actions.selectFromTable(
                tablesNames.cart_details,
                ['*'],
                [`WHERE product_id = ${product_id} AND measure_id = ${measure_id}`]
            );

            if (cart && measure.length && product_details.length) {
                measure = measure[0];
                product_details = product_details[0];

                if (product_details.quantity < quantity) {
                    throw new Error('Въведете валидно количество');
                }

                const price = getNumber(toNumber(cart.price) - toNumber(measure.price) * toNumber(quantity), 2);
                const modified = (new Date()).getTime()
                await actions.updateTable(
                    tablesNames.carts,
                    tablesSchemas.carts,
                    {
                        price,
                        modified
                    }
                );

                const newQuantity = getNumber(toNumber(product_details.quantity) - toNumber(quantity));
                await actions.updateTable(
                    tablesNames.cart_details,
                    tablesSchemas.cart_details,
                    {
                        modified,
                        quantity: newQuantity,
                        price: getNumber(newQuantity * toNumber(measure.price))
                    });

            } else {
                throw new Error('Неуспешно премахване на продукта');
            }

            return await getCart(user_id);
        } catch (e) {
            throw e;
        }
    }

    const getCartDetails = async (user_id) => {
        try {
            let result = await actions.selectFromTable(
                tablesNames.carts,
                ['*',
                    `${tablesNames.products}.name AS product_name`,
                    `${tablesNames.measures}.name AS measure_name`,
                    `${tablesNames.carts}.price AS cart_price`,
                    `${tablesNames.measures}.quantity AS measure_qantity`,
                    `${tablesNames.cart_details}.quantity AS quantity`],
                [
                    `INNER JOIN ${tablesNames.cart_details} ON ${tablesNames.cart_details}.id = ${tablesNames.cart_details}.id`,
                    `INNER JOIN ${tablesNames.measures} ON measure_id = ${tablesNames.measures}.id`,
                    `INNER JOIN ${tablesNames.products} ON product_id = ${tablesNames.products}.id`,
                    `WHERE user_id = ${Number(user_id)}`]);

            if (result.length === 0) {
                return [];
            } else {
                return result;
            }
        } catch (e) {
            console.log(e)
        }
    }

    const clearCart = async (user_id) => {
        try {
            const cart = await getCart(user_id);
            const cart_id = cart.id;

            await actions.deleteFromTable(
                tablesNames.cart_details,
                [`WHERE cart_id = ${Number(cart_id)}`]
            );

            await actions.deleteFromTable(
                tablesNames.carts,
                [`WHERE id = ${Number(cart_id)}`]
            );

            return getCartDetails(user_id);
        } catch (e) {
            console.log(e)
        }
    }

    return Object.freeze({
        getCart,
        addToCart,
        removeFromCart,
        getCartDetails,
        clearCart
    });
}

module.exports = controller;