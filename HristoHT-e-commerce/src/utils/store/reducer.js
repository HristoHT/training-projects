import actions, { setMessageAction } from './actions';

const initialState = {
    user: {}
};


const reducer = (state = initialState, { type, payload }) => {
    const newState = { ...state };

    switch (type) {
        case actions.CHANGE_USER:
            newState.user = { ...payload };
            break;

        default:
    }

    return newState;
}

export default reducer;