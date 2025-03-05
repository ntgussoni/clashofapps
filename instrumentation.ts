import { registerOTel } from "@vercel/otel";
import { LangfuseExporter } from "langfuse-vercel";

export function register() {
  registerOTel({
    serviceName: "clash-of-apps",
    traceExporter: new LangfuseExporter(),
  });
}
