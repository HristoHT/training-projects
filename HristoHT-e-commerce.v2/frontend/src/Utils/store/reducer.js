import actions from './actions';

const initialState = {
    user: {},
    measures: [],
    products:[],
    product: {
        name: '',
        image: '',
        measures: [],
        description: '',
        tags: [1]
    }
};


const reducer = (state = initialState, { type, payload }) => {
    const newState = { ...state };

    switch (type) {
        case actions.CHANGE_USER:
            newState.user = { ...payload };
            break;

        case actions.SET_MEASURES:
            newState.measures = [...payload];
            break;

        case actions.SET_PRODUCT_FIELD:
            newState.product = { ...newState.product, [payload.field]: payload.value };
            break;

        case actions.SET_PRODUCT:
            newState.product = { ...payload };
            break;

        case actions.UPDATE_PRODUCT:
            newState.products = [...newState.products].map(product => {
                if(payload.id === product.id){
                    return payload;
                } else {
                    return product;
                }
            });
            break;

        case actions.SET_PRODUCTS:
            newState.products = [...payload];
            break;

        default:
    }

    return newState;
}

export default reducer;