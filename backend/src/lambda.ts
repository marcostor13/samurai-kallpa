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

// Normalizes Netlify/Lambda events to ensure they match AWS API Gateway v1 expected structure
function normalizeEvent(event: any) {
    if (!event.httpMethod) {
        event.httpMethod = event.requestContext?.http?.method || 'GET';
    }
    if (!event.path) {
        event.path = event.rawPath || event.requestContext?.http?.path || '/';
    }
    if (!event.headers) {
        event.headers = {};
    }
    if (!event.multiValueHeaders) {
        event.multiValueHeaders = {};
    }
    if (!event.body) {
        event.body = '';
    }
    if (typeof event.isBase64Encoded === 'undefined') {
        event.isBase64Encoded = false;
    }
    return event;
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    // Debug log to capture the raw event from Netlify
    console.log('Incoming Raw Event:', JSON.stringify(event, null, 2));

    const normalizedEvent = normalizeEvent({ ...event });
    console.log('Normalized Event:', JSON.stringify(normalizedEvent, null, 2));

    server = server ?? (await bootstrap());
    return server(normalizedEvent, context, callback);
};
