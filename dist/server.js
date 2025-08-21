"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const passwordRoutes_1 = __importDefault(require("./routes/passwordRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use(express_1.default.json());
// MongoDB connection
mongoose_1.default.connect('mongodb://localhost:27017/passblockdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
app.use('/api/user', userRoutes_1.default);
app.use('/api/passwords', passwordRoutes_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
