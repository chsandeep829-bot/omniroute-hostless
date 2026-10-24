import { Container } from "@cloudflare/containers";

interface Env {
  OMNIROUTE: DurableObjectNamespace;
}

export class OmniRouteContainer extends Container<Env> {
  defaultPort = 20128;
  sleepAfter = "10m";
  envVars = {
    PORT: "20128",
    HOSTNAME: "0.0.0.0"
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const container = env.OMNIROUTE.getByName("omniroute-singleton");
    return container.fetch(request);
  }
};
