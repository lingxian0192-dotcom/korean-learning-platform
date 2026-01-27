"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const app_module_1 = require("./app.module");
const express_1 = require("express");
const server = (0, express_1.default)();
const createNestServer = async (expressInstance) => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressInstance));
    app.setGlobalPrefix('api/v1');
    app.enableCors();
    await app.init();
    return app;
};
let appPromise;
async function handler(req, res) {
    if (!appPromise) {
        appPromise = createNestServer(server);
    }
    await appPromise;
    server(req, res);
}
//# sourceMappingURL=vercel.js.map