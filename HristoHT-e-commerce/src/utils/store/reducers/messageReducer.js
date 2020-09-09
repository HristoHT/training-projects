const setMessage = ({ message, messageType, show }) => ({ message, messageType, show });

export default setMessage;

/*
const message = useSelector(state => state.message);
const dispatch = useDispatch();
const setMessage = (message, messageType = 'error', show = true) => dispatch(setMessageAction({ message, messageType, show: true }));
*/