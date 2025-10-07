"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paypal_1 = require("../payments/paypal");
const router = (0, express_1.Router)();
router.post('/create-order', paypal_1.createOrder);
router.post('/capture-order', paypal_1.captureOrder);
router.get('/config', (req, res) => {
    res.json({ clientId: process.env.PAYPAL_CLIENT });
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map