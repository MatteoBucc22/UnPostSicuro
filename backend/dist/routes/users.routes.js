"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const router = (0, express_1.Router)();
router.get('/exists/:id', users_controller_1.userExists);
router.post('/complete-registration', users_controller_1.completeRegistration);
exports.default = router;
//# sourceMappingURL=users.routes.js.map