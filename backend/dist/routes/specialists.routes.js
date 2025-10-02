"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const specialists_controller_1 = require("../controllers/specialists.controller");
const router = (0, express_1.Router)();
router.get('/', specialists_controller_1.getSpecialists);
router.post('/', specialists_controller_1.addSpecialist);
router.get('/:id', specialists_controller_1.getSpecialistsbyId);
exports.default = router;
//# sourceMappingURL=specialists.routes.js.map