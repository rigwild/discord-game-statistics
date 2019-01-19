"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bot_1 = __importStar(require("./bot"));
const config_1 = require("./config");
// Start the bot
let botInstance;
(async () => (botInstance = await bot_1.default()))().catch(err => console.error('Bot crashed.', err));
const app = express_1.default();
app.use('/', express_1.default.static(__dirname + '/../public'));
app.get('/api', async (req, res) => {
    const data = await bot_1.load();
    res.json(data);
});
app.listen(config_1.serverPort, () => console.log(`Server is listening on port ${config_1.serverPort}. http://localhost:${config_1.serverPort}/`));
