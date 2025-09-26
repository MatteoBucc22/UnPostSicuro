"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ebooks_controller_1 = require("../controllers/ebooks.controller");
const router = (0, express_1.Router)();
router.get('/', ebooks_controller_1.getEbooks);
router.post('/', ebooks_controller_1.addEbook);
router.get('/:id', ebooks_controller_1.getEbookById);
exports.default = router;
//# sourceMappingURL=ebooks.routes.js.map