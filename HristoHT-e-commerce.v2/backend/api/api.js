const express = require('express');
const router = express.Router();

router.use('/admin/auth', require('./routes/admin/auth'));
router.use('/admin/products', require('./routes/admin/products'));
router.use('/admin/measures', require('./routes/admin/measures'));

router.use('/user/auth', require('./routes/user/auth'));
router.use('/user/products', require('./routes/user/products'));
router.use('/user/carts', require('./routes/user/carts'));
router.use('/user/measures', require('./routes/user/measures'));

module.exports = router;