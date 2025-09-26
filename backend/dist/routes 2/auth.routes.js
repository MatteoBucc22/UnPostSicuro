"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabaseClient_1 = require("../database/supabaseClient");
const router = (0, express_1.Router)();
router.get('/auth/google', async (req, res) => {
    try {
        const { data, error } = await supabaseClient_1.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'http://localhost:4200/auth/callback' }
        });
        if (error)
            return res.status(400).json({ error: error.message });
        res.json({ url: data.url });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore server OAuth' });
    }
});
router.post('/auth/callback', async (req, res) => {
    const { code } = req.body;
    if (!code)
        return res.status(400).json({ error: 'Code mancante' });
    try {
        const { data, error } = await supabaseClient_1.supabase.auth.exchangeCodeForSession(code);
        if (error)
            return res.status(500).json({ error: error.message });
        const user = data.user;
        if (!user)
            return res.status(404).json({ error: 'Nessun utente trovato' });
        const { data: existingUser } = await supabaseClient_1.supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
        if (!existingUser) {
            await supabaseClient_1.supabase.from('users').insert([{
                    id: user.id,
                    email: user.email,
                    name: '',
                    surname: '',
                    dob: null,
                    gender: null,
                    phone: '',
                    city: ''
                }]);
        }
        res.json({ user: { id: user.id, email: user.email } });
    }
    catch (err) {
        console.error('Errore callback Google:', err);
        res.status(500).json({ error: 'Errore server durante callback' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map