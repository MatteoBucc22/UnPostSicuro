"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
const supabaseClient_1 = require("./database/supabaseClient");
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const ebooks_routes_1 = __importDefault(require("./routes/ebooks.routes"));
const specialists_routes_1 = __importDefault(require("./routes/specialists.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/users', users_routes_1.default);
app.use('/ebooks', ebooks_routes_1.default);
app.use('/specialists', specialists_routes_1.default);
app.use('/users', cart_routes_1.default);
app.use('/auth', auth_routes_1.default);
app.use('/payments', payment_routes_1.default);
app.use('/appointments', appointment_routes_1.default);
node_cron_1.default.schedule('* * * * *', async () => {
    console.log('⏱️ Controllo appuntamenti scaduti...');
    try {
        const now = new Date().toISOString();
        const { data, error } = await supabaseClient_1.supabase
            .from('appointments')
            .update({ status: 'canceled', expires_at: null })
            .lt('expires_at', now)
            .eq('status', 'blocked')
            .select();
        if (error)
            throw error;
        if (data && data.length > 0) {
            console.log(`❌ Cancellati ${data.length} appuntamenti scaduti.`);
        }
    }
    catch (err) {
        console.error('Errore nel cron job:', err);
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//# sourceMappingURL=main.js.map