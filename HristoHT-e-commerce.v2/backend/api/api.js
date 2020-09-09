const express = require('express');
const router = express.Router();

router.use('/measures', require('./routes/measures'));
router.use('/products', require('./routes/products'));
router.use('/auth', require('./routes/auth'));

module.exports = router;