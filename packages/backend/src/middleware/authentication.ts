import { Request } from 'express';
import { Configuration, FrontendApi, Identity } from '@ory/kratos-client';
import { AuthError } from "@/errors/auth";

const ORY_KRATOS_PUBLIC_URL = process.env.ORY_KRATOS_PUBLIC_URL

const frontend = new FrontendApi(
    new Configuration({
        basePath: ORY_KRATOS_PUBLIC_URL, // Use your local Ory Tunnel URL
        baseOptions: {
            withCredentials: true,
        },
    }),
)

export async function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === "cookieAuth") {

        try {
            const cookie = request.header('cookie');
            const session = await frontend.toSession(undefined, {
                headers: {
                    cookie,
                },
            });

            // Session has expired
            if (session.data.active === false) {
                return Promise.reject(new AuthError("Unauthorized"));
            }

            const identity: Identity = session.data.identity;
            return Promise.resolve(identity);
        }
        catch (err) {

            if (err.response?.status === 401) {
                return Promise.reject(new AuthError("Unauthorized"));
            }
            //Otherwise an unknown error has occurred. Treat as a 500
            return Promise.reject(err);
        }

    }

    return Promise.reject({});
}