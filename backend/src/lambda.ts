import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({
        app: expressApp,
        // Netlify events are very similar to AWS API Gateway proxy events
        eventSource: {
            getRequest: (event: any) => {
                return {
                    method: event.httpMethod,
                    path: event.path,
                    headers: event.headers,
                    body: event.body,
                    remoteAddress: event.requestContext?.identity?.sourceIp
                };
            },
            getResponse: ({ statusCode, body, headers, isBase64Encoded }: any) => {
                return {
                    statusCode,
                    body,
                    headers,
                    isBase64Encoded
                };
            }
        }
    });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    // Debug log to see the event structure in Netlify logs
    console.log('Incoming event:', JSON.stringify(event, null, 2));
    server = server ?? (await bootstrap());
    return server(event, context, callback);
};
