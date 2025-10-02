"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const router = (0, express_1.Router)();
router.get('/:userId/cart', cart_controller_1.getCart);
router.post('/:userId/cart/add', cart_controller_1.addItem);
router.delete('/:userId/cart/remove/:itemId', cart_controller_1.removeItem);
router.patch('/:userId/cart/item/:itemId/specialist', cart_controller_1.updateSpecialist);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map