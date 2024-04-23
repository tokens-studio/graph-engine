import { registerOTel } from '@vercel/otel'

const OTEL_SERVICE_NAME = process.env.OTEL_SERVICE_NAME;

export function register() {
    registerOTel({ serviceName: OTEL_SERVICE_NAME })
}