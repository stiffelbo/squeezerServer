const express = require('express');
const router = express.Router();

const controller = require('../controllers/binance.controller');

router.get('/binance/', controller.getTickers);
router.get('/binance/usdt', controller.getUsdtTickers);
router.get('/binance/klines', controller.getKlines);

module.exports = router;