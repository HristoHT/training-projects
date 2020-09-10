const productObject = require('./productObject');
const { tablesNames, tablesSchemas } = require('../../initialLoad');
const CustomError = require('../../utils/CustomError');
const { format } = require('../../utils/formatValue');

/**
 * Products controller
 * 
 * @param {postgres actions} actions 
 */
const controller = (actions) => {

    /**
     * Add new product to the postgress table
     * 
     * @param {product object} obj
     */
    const add = async (obj) => {
        try {
            const { product, measures } = productObject(obj);

            try {
                const add = await actions.insertInTable(tablesNames.products, tablesSchemas.products, [product], true)

                const result = await getAdmin({ name: product.name });
                const product_id = result[0].id;

                await actions.insertInTable(
                    tablesNames.products_measures,
                    tablesSchemas.products_measures,
                    // measures.map(measure_id => ({ measure_id, product_id }))
                    measures.map(measure => ({ measure_id: measure.id, product_id }))
                );

            } catch (e) {
                console.log(e);
                throw new CustomError(409, 'Продукт с това име вече съществува');
            }


            return await getAdmin();
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    const get = async ({ id = false, name = false, visable = false, measuresList = false, search = false, priceFrom = false, priceTo = false } = {}) => {
        try {
            let conditions = [], preds = [];

            conditions.push(`INNER JOIN ${tablesNames.products_measures} ON product_id = ${tablesNames.products}.id`);
            conditions.push(`INNER JOIN ${tablesNames.measures} ON measure_id = ${tablesNames.measures}.id`);

            if (id || name || visable || measuresList || search || priceFrom || priceTo) {
                conditions.push('WHERE');
            }

            if (visable) {
                preds.push(`visable = ${visable}`);
            }

            if (id) {
                preds.push(`id = ${id}`);
            }

            if (search) {
                preds.push(`( ${tablesNames.products}.name ~* ${format(search, { type: 'string' })} OR description ~* ${format(search, { type: 'string' })})`)
            }

            if (priceTo) {
                preds.push(`price <= ${format(priceTo, { type: 'number' })}`);
            }

            if (priceFrom) {
                preds.push(`price >= ${format(priceFrom, { type: 'number' })}`);
            }

            if (name) {
                preds.push(`name = '${name}'`);
            }

            if (measuresList) {
                preds.push('('
                    + measuresList.split(',').map(measure_id => `measure_id = ${measure_id}`).join(' OR ') +
                    ')');
            }

            conditions.push(preds.join(' AND '));
            // conditions.push('ORDER BY name');
            const result = await actions.selectFromTable(tablesNames.products, ['*',
                `${tablesNames.products}.name AS name`,
                `${tablesNames.measures}.name AS measure_name`], conditions);
            // console.log(result)
            return result;
        } catch (e) {
            console.log(e)
            throw e;
        }
    }

    const getMaxPrice = async () => {
        try {
            let conditions = [];

            conditions.push(`INNER JOIN ${tablesNames.products_measures} ON product_id = ${tablesNames.products}.id`);
            conditions.push(`INNER JOIN ${tablesNames.measures} ON measure_id = ${tablesNames.measures}.id`);

            const maxPrice = await actions.selectFromTable(tablesNames.products, ['MAX(price)'], conditions);

            return { maxPrice: maxPrice[0].max };
        } catch (e) {
            console.log(e)
            throw e;
        }
    }


    const getAdmin = async ({ id = false, name = false } = {}) => {
        try {
            let conditions = [], preds = [];

            if (id || name) {
                conditions.push('WHERE');
            }

            if (id) {
                preds.push(`id = ${id}`);
            }

            if (name) {
                preds.push(`name = '${name}'`);
            }

            conditions.push(preds.join(' AND '));
            const result = await actions.selectFromTable(tablesNames.products, ['*'], conditions);
            // console.log(result)
            return result;
        } catch (e) {
            console.log(e)
            throw e;
        }
    }

    const getProductById = async (id) => {
        try {
            const product = await actions.selectFromTable(tablesNames.products, ['*'], [`WHERE id = ${id}`]);
            const measures = await actions.selectFromTable(tablesNames.products_measures, ['*'], [`INNER JOIN ${tablesNames.measures} ON ${tablesNames.products_measures}.measure_id = ${tablesNames.measures}.id`, `WHERE product_id = ${id}`]);

            const result = { ...product[0], measures };
            return result;
        } catch (e) {
            console.log(e.stack)
            throw e;
        }
    }

    const update = async (id, obj) => {
        try {
            const { product, measures } = productObject(obj);
            try {
                const result = await actions.updateTable(tablesNames.products, tablesSchemas.products, product, [`WHERE id = ${id}`]);
                await actions.deleteFromTable(tablesNames.products_measures, [`WHERE product_id=${id}`]);
                // console.log(JSON.stringify(measures.map(measure_id => ({ measure_id, product_id: id }))));
                await actions.insertInTable(
                    tablesNames.products_measures,
                    tablesSchemas.products_measures,
                    measures.map(measure => ({ measure_id: measure.id, product_id: id }))
                );
            } catch (e) {
                console.log(e);
                throw new CustomError(409, 'Продукт с това име вече съществува');
            }

            return await getAdmin();
        } catch (e) {
            throw e;
        }
    }

    const updateOne = async (id, obj) => {
        try {
            try {
                let newChema = {}, values = {};
                for (let column in obj) {
                    if (tablesSchemas.products[column]) {
                        newChema[column] = tablesSchemas.products[column];
                        values[column] = obj[column];
                    }
                }

                await actions.updateTable(tablesNames.products, newChema, values, [`WHERE id = ${id}`]);

            } catch (e) {
                console.log(e);
                throw new CustomError(409, 'Продукт с това име вече съществува');
            }

            const result = await getAdmin({ id });
            // console.log(result);
            return await result[0];
        } catch (e) {
            throw e;
        }
    }

    const remove = async (id) => {
        try {
            await actions.deleteFromTable(tablesNames.products_measures, [`WHERE product_id=${id}`]);
            const result = await actions.deleteFromTable(tablesNames.products, [`WHERE id = ${id}`]);

            return await getAdmin();
        } catch (e) {
            throw e;
        }
    }

    return Object.freeze({
        add,
        get,
        remove,
        getProductById,
        update,
        updateOne,
        getAdmin,
        getMaxPrice
    });
}

module.exports = controller;