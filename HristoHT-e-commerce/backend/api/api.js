const express = require('express');
const router = express.Router();
const validateToken = require('./middlewares/validateToken');

router.use('/items', validateToken, require('./routes/items'));
router.use('/orders', validateToken, require('./routes/orders'));
router.use('/auth', require('./routes/auth'));

module.exports = router;