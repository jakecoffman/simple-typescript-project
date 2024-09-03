import { Toucan } from 'toucan-js';

export type Env = {
    APP_VERSION: string;
    ENVIRONMENT_NAME: string;
    SENTRY_DSN: string;
    UNSPLASH_ACCESS_KEY: string;
};

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const sentry = new Toucan({
            dsn: env.SENTRY_DSN,
            environment: env.ENVIRONMENT_NAME,
            release: env.APP_VERSION,
            request,
            requestDataOptions: {
                allowedCookies: true,
                allowedHeaders: true,
                allowedIps: true,
                allowedSearchParams: true,
            },
        });

        sentry.startSession();

        const requestUrl = new URL(request.url);

        try {
            switch (requestUrl.pathname) {
                case '/':
                    return healthAction(env.APP_VERSION);

                default:
                    return endpointNotFoundResponse();
            }
        } catch (error: unknown) {
            sentry.captureException(error);

            return internalServerErrorResponse();
        } finally {
            sentry.captureSession(true);
        }
    },
};

const apiProblemResponse = (
    status: number,
    description: string,
    type: string,
    additionalProperties?: { [key: string]: unknown },
): Response => {
    return new Response(
        JSON.stringify({
            detail: description,
            status: status,
            type: type,
            ...additionalProperties,
        }),
        {
            headers: {
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/problem+json; charset=UTF-8',
            },
            status: status,
        },
    );
};

const healthAction = (appVersion: string): Response => {
    return new Response(
        JSON.stringify({
            releaseId: appVersion,
            status: 'pass',
        }),
        {
            headers: {
                'Content-Type': 'application/health+json; charset=UTF-8',
            },
        },
    );
};


const endpointNotFoundResponse = (): Response => {
    return apiProblemResponse(404, `The requested URL does not exist.`, 'endpoint_not_found');
};

const internalServerErrorResponse = (): Response => {
    return apiProblemResponse(500, `Something went wrong.`, 'internal_server_error');
};
