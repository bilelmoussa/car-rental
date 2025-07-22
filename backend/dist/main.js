"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("api");
    const options = new swagger_1.DocumentBuilder()
        .setTitle("APIs for car rental app")
        .setDescription("APIs for car rental app, add cars, user auth, online reservation")
        .setVersion("1.0")
        .addServer("http://localhost:3000/", "Local environment")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options, {
        include: [],
        deepScanRoutes: true,
    });
    swagger_1.SwaggerModule.setup("api-docs", app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map