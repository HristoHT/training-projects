const actions = {
    CHANGE_USER: 'CHANGE_USER',
}

export default actions;

export const changeUserAction = user => ({
    type: actions.CHANGE_USER,
    payload: user
});