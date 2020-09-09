const measureObject = require('./measureObject');
const { tablesNames, tablesSchemas } = require('../../initialLoad');
const CustomError = require('../../utils/CustomError');

/**
 * Measures controller
 * 
 * @param {postgres actions} actions 
 */
const controller = (actions) => {

    /**
     * Add new measure to the postgress table
     * 
     * @param {measure object} obj
     */
    const add = async (obj) => {
        try {
            obj = measureObject(obj);
            try {
                const result = await actions.insertInTable(tablesNames.measures, tablesSchemas.measures, [obj], true);
            } catch (e) {
                console.log(e);
                throw new CustomError(409, 'Разфасовка с това име вече съществува');
            }

            return await get();
        } catch (e) {
            throw e;
        }
    }

    const get = async ({ measure_id = false } = {}) => {
        try {
            let conditions = [];

            if (measure_id) {
                conditions.push('WHERE');
            }

            if (measure_id) {
                conditions.push(`id = ${measure_id}`);
            }

            const result = await actions.selectFromTable(tablesNames.measures, ['*'], conditions);
            return result;
        } catch (e) {
            throw e;
        }
    }

    const update = async (id, obj) => {
        try {
            obj = measureObject(obj);
            try {
                const result = await actions.updateTable(tablesNames.measures, tablesSchemas.measures, obj, [`WHERE id = ${id}`]);
            } catch (e) {
                throw new CustomError(409, 'Разфасовка с това име вече съществува');
            }

            return await get();
        } catch (e) {
            throw e;
        }
    }

    const remove = async (id) => {
        try {
            const result = await actions.deleteFromTable(tablesNames.measures, [`WHERE id = ${id}`]);

            return await get();
        } catch (e) {
            throw e;
        }
    }

    return Object.freeze({
        add,
        get,
        update,
        remove
    });
}

module.exports = controller;