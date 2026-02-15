import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverless from 'serverless-http';
import { Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return serverless(expressApp);
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: any,
) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
