"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpecialistsbyId = exports.deleteSpecialist = exports.addSpecialist = exports.getSpecialists = void 0;
const supabaseClient_1 = require("../database/supabaseClient");
const getSpecialists = async (req, res) => {
    const { data, error } = await supabaseClient_1.supabase.from('specialists').select('*');
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.getSpecialists = getSpecialists;
const addSpecialist = async (req, res) => {
    const { name, surname, bio, expertise } = req.body;
    const { data, error } = await supabaseClient_1.supabase
        .from('specialists')
        .insert([{ name, surname, bio, expertise }]);
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.addSpecialist = addSpecialist;
const deleteSpecialist = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabaseClient_1.supabase
        .from('specialists')
        .delete()
        .eq('id', id)
        .select();
    if (error)
        return res.status(400).json({ error });
    res.json(data);
};
exports.deleteSpecialist = deleteSpecialist;
const getSpecialistsbyId = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabaseClient_1.supabase
        .from('specialists')
        .select('*')
        .eq('id', id)
        .single();
    if (error)
        return res.status(404).json({ error: error.message });
    res.json(data);
};
exports.getSpecialistsbyId = getSpecialistsbyId;
//# sourceMappingURL=specialists.controller.js.map