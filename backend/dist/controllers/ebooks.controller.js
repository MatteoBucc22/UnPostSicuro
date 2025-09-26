"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEbookById = exports.addEbook = exports.getEbooks = void 0;
const supabaseClient_1 = require("../database/supabaseClient");
const getEbooks = async (req, res) => {
    const { data, error } = await supabaseClient_1.supabase.from('ebooks').select('*');
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.getEbooks = getEbooks;
const addEbook = async (req, res) => {
    const { title, description } = req.body;
    const { data, error } = await supabaseClient_1.supabase.from('ebooks').insert([{ title, description }]);
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.addEbook = addEbook;
const getEbookById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabaseClient_1.supabase
        .from('ebooks')
        .select('*')
        .eq('id', id)
        .single();
    if (error)
        return res.status(404).json({ error: error.message });
    res.json(data);
};
exports.getEbookById = getEbookById;
//# sourceMappingURL=ebooks.controller.js.map