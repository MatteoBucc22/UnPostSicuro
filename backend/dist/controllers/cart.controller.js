"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpecialist = exports.removeItem = exports.addItem = exports.getCart = void 0;
const supabaseClient_1 = require("../database/supabaseClient");
const getCart = async (req, res) => {
    const { userId } = req.params;
    const { data, error } = await supabaseClient_1.supabase
        .from('cart_item')
        .select('id, ebook_id, specialist_id, ebooks(*), specialists(*)')
        .eq('user_id', userId);
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data || []);
};
exports.getCart = getCart;
const addItem = async (req, res) => {
    const { userId } = req.params;
    const { ebookId } = req.body;
    const { data: existing, error: fetchError } = await supabaseClient_1.supabase
        .from('cart_item')
        .select('*')
        .eq('user_id', userId)
        .eq('ebook_id', ebookId)
        .single();
    if (fetchError && fetchError.code !== 'PGRST116') {
        return res.status(500).json({ error: fetchError.message });
    }
    if (existing) {
        return res.json(existing);
    }
    else {
        const { v4: uuidv4 } = await import('uuid');
        const { data, error } = await supabaseClient_1.supabase
            .from('cart_item')
            .insert({ id: uuidv4(), user_id: userId, ebook_id: ebookId })
            .select();
        if (error)
            return res.status(500).json({ error: error.message });
        return res.json(data);
    }
};
exports.addItem = addItem;
const removeItem = async (req, res) => {
    const { userId, itemId } = req.params;
    const { data, error } = await supabaseClient_1.supabase
        .from('cart_item')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId)
        .select();
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.removeItem = removeItem;
const updateSpecialist = async (req, res) => {
    const { userId, itemId } = req.params;
    const { specialistId } = req.body;
    const { data, error } = await supabaseClient_1.supabase
        .from('cart_item')
        .update({ specialist_id: specialistId })
        .eq('id', itemId)
        .eq('user_id', userId)
        .select();
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.updateSpecialist = updateSpecialist;
//# sourceMappingURL=cart.controller.js.map