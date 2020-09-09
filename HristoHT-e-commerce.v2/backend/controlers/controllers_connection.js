const products_controller = require('./products_controller');
const measures_controller = require('./measures_controller');
const auth_controller = require('./auth_controller');

const controllers = ( actions ) => {
    console.log('controllers generated...');

    return Object.freeze({
        products:products_controller(actions),
        measures:measures_controller(actions),
        auth:auth_controller(actions)
    })
}

module.exports = controllers;