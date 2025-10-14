"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingAppointment = exports.cancelAppointment = exports.confirmAppointment = exports.createPendingAppointment = exports.getAppointmentsBySpecialist = void 0;
const supabaseClient_1 = require("../database/supabaseClient");
const getAppointmentsBySpecialist = async (req, res) => {
    const { specialistId } = req.params;
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('appointments')
            .select('*')
            .eq('specialist_id', specialistId)
            .order('start_time', { ascending: true });
        if (error)
            throw error;
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore caricamento appuntamenti' });
    }
};
exports.getAppointmentsBySpecialist = getAppointmentsBySpecialist;
const createPendingAppointment = async (req, res) => {
    const { userId, specialistId, startTime, endTime } = req.body;
    try {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        const { data: conflicts, error: conflictError } = await supabaseClient_1.supabase
            .from('appointments')
            .select('*')
            .eq('specialist_id', specialistId)
            .gte('start_time', startTime)
            .lt('end_time', endTime);
        if (conflictError)
            throw conflictError;
        if (conflicts && conflicts.length > 0) {
            return res.status(400).json({ message: 'Slot già prenotato' });
        }
        const { data, error } = await supabaseClient_1.supabase
            .from('appointments')
            .insert([
            {
                user_id: userId,
                specialist_id: specialistId,
                start_time: startTime,
                end_time: endTime,
                status: 'blocked',
                expires_at: expiresAt
            }
        ])
            .select();
        if (error)
            throw error;
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore durante la prenotazione' });
    }
};
exports.createPendingAppointment = createPendingAppointment;
const confirmAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    if (!appointmentId) {
        return res.status(400).json({ message: 'appointmentId mancante' });
    }
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('appointments')
            .update({
            status: 'booked',
            expires_at: null
        })
            .eq('id', appointmentId)
            .select();
        if (error)
            throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Appuntamento non trovato' });
        }
        res.json({ message: 'Appuntamento confermato', appointment: data[0] });
    }
    catch (err) {
        console.error('Errore conferma appuntamento:', err);
        res.status(500).json({ message: 'Errore durante la conferma', error: err.message });
    }
};
exports.confirmAppointment = confirmAppointment;
const cancelAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('appointments')
            .update({ status: 'canceled', expires_at: null })
            .eq('id', appointmentId)
            .select();
        if (error)
            throw error;
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore cancellazione appuntamento' });
    }
};
exports.cancelAppointment = cancelAppointment;
const getPendingAppointment = async (req, res) => {
    const { userId } = req.params;
    try {
        const now = new Date().toISOString();
        const { data, error } = await supabaseClient_1.supabase
            .from('appointments')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'blocked')
            .gt('expires_at', now)
            .limit(1);
        if (error)
            throw error;
        res.json(data?.[0] || null);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore recupero appuntamento pendente' });
    }
};
exports.getPendingAppointment = getPendingAppointment;
//# sourceMappingURL=appointment.controller.js.map