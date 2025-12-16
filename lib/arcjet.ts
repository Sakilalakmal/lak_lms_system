import "server-only";

import arcjet, {
  detectBot,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
  fixedWindow,
} from "@arcjet/next";
import { env } from "./env";

export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  shield,
  slidingWindow,
};

// Lazy-loaded Arcjet client to avoid initialization during build
let arcjetInstance: ReturnType<typeof arcjet> | null = null;

function getArcjetInstance() {
  if (!arcjetInstance) {
    arcjetInstance = arcjet({
      key: env.ARCJET_KEY,
      characteristics: ["fingerprint"],
      rules: [
        shield({
          mode: "LIVE",
        }),
      ],
    });
  }
  return arcjetInstance;
}

const arcjetProxy = new Proxy({} as ReturnType<typeof arcjet>, {
  get(_target, prop) {
    return getArcjetInstance()[prop as keyof ReturnType<typeof arcjet>];
  },
});

export default arcjetProxy;
