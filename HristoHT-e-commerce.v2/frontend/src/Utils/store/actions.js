const actions = {
    CHANGE_USER: 'CHANGE_USER',

    SET_PRODUCTS: 'SET_PRODUCTS',

    SET_MEASURES: 'SET_MEASURES',

    SET_PRODUCT: 'SET_PRODUCT',
    SET_PRODUCT_FIELD: 'SET_PRODUCT_FIELD',
    UPDATE_PRODUCT: 'UPDATE_PRODUCT'
}

export default actions;

export const changeUserAction = user => ({
    type: actions.CHANGE_USER,
    payload: user
});

export const setMeasuresActions = measures => ({
    type: actions.SET_MEASURES,
    payload: measures
});

export const setProductFieldAction = ({field, value}) => ({
    type: actions.SET_PRODUCT_FIELD,
    payload: { value, field }
});

/**
 * Избира продукта, който да се ъпдейтва
 * 
 * @param {*} product 
 */
export const setProductAction = (product) => ({
    type: actions.SET_PRODUCT,
    payload: product
});

/**
 * Променя всички визуализирани продукти
 * 
 * @param {*} products 
 */
export const setProductsAction = (products) => ({
    type: actions.SET_PRODUCTS,
    payload: products
});

/**
 * Променя един продукт от всичките визуализирани
 * 
 * @param {*} product 
 */
export const updateProductAction = (product) => ({
    type: actions.UPDATE_PRODUCT,
    payload: product
})