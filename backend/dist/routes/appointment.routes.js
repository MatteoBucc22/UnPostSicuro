"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../controllers/appointment.controller");
const router = (0, express_1.Router)();
router.get('/:specialistId', appointment_controller_1.getAppointmentsBySpecialist);
router.post('/', appointment_controller_1.createPendingAppointment);
router.patch('/:appointmentId/confirm', appointment_controller_1.confirmAppointment);
router.patch('/:appointmentId/cancel', appointment_controller_1.cancelAppointment);
router.get('/pending/:userId', appointment_controller_1.getPendingAppointment);
router.get('/user/:userId', appointment_controller_1.getAppointmentsByUser);
router.put('/:appointmentId/update', appointment_controller_1.updateAppointment);
exports.default = router;
//# sourceMappingURL=appointment.routes.js.map