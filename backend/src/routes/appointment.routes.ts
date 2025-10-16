import { Router } from 'express';
import {
  getAppointmentsBySpecialist,
  createPendingAppointment,
  confirmAppointment,
  cancelAppointment, 
  getPendingAppointment,
  getAppointmentsByUser, 
  updateAppointment
} from '../controllers/appointment.controller';

const router = Router();

// GET /appointments/:specialistId → lista slot
router.get('/:specialistId', getAppointmentsBySpecialist);

// POST /appointments → blocca prenotazione
router.post('/', createPendingAppointment);

// PATCH /appointments/:appointmentId/confirm → conferma prenotazione
router.patch('/:appointmentId/confirm', confirmAppointment);

// PATCH /appointments/:appointmentId/cancel → annulla prenotazione
router.patch('/:appointmentId/cancel', cancelAppointment);

router.get('/pending/:userId', getPendingAppointment);

router.get('/user/:userId', getAppointmentsByUser)

router.put('/:appointmentId/update', updateAppointment);
export default router;
