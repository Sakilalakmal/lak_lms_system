import "server-only";

import arcjetLib, {
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
let arcjetInstance: ReturnType<typeof arcjetLib> | null = null;

function getArcjetInstance() {
  if (!arcjetInstance) {
    arcjetInstance = arcjetLib({
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

// Create a proxy that lazily initializes and properly binds methods
const arcjetProxy = new Proxy({} as ReturnType<typeof arcjetLib>, {
  get(_target, prop) {
    const instance = getArcjetInstance();
    const value = instance[prop as keyof typeof instance];
    // Bind functions to the instance so method chaining works
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

export default arcjetProxy;
