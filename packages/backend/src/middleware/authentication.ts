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
    if (securityName === "bearerAuth") {

        //Note we are purposefully not verifying the token at this time.
        const authHeader = request.header('authorization');


        if (!authHeader) {
            return Promise.reject(new AuthError("Unauthorized"));
        }
        const token = authHeader.split(' ')[1];
        const jwtPayload = token.split('.')[1];
        const payload = Buffer.from(jwtPayload, 'base64').toString('utf-8');
        const identity: Identity = JSON.parse(payload).session.identity;

        //We will inject a jwks verification at a later point 

        return Promise.resolve(identity);
    }
    return Promise.reject({});
}