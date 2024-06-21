// tracing.js
"use strict";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { trace } from "@opentelemetry/api";
import opentelemetry from "@opentelemetry/sdk-node";
import process from "process";

const OTEL_URL = process.env.OTEL_URL;
const OTEL_SERVICE_NAME = process.env.OTEL_SERVICE_NAME;

const exporterOptions = {
  url: OTEL_URL,
};

const traceExporter = new OTLPTraceExporter(exporterOptions);
const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: OTEL_SERVICE_NAME,
  }),
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry

sdk.start();

// gracefully shut down the SDK on process exit
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});

export const createTracer = (name: string) => trace.getTracer(name);
