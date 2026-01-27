"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const app_module_1 = require("../src/app.module");
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
const createNestServer = async (expressInstance) => {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressInstance));
        app.setGlobalPrefix('api/v1');
        app.enableCors();
        await app.init();
        return app;
    }
    catch (err) {
        console.error('NestJS Init Error:', err);
        throw err;
    }
};
let appPromise;
async function handler(req, res) {
    try {
        if (!appPromise) {
            appPromise = createNestServer(server);
        }
        await appPromise;
        server(req, res);
    }
    catch (err) {
        console.error('Handler Error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}
//# sourceMappingURL=index.js.map