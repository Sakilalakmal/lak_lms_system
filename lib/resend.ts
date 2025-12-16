import "server-only";

import { Resend } from "resend";
import { env } from "./env";

// Lazy-loaded Resend client to avoid initialization during build
let resendInstance: Resend | null = null;

function getResendInstance() {
  if (!resendInstance) {
    resendInstance = new Resend(env.RESEND_API_KEY);
  }
  return resendInstance;
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const instance = getResendInstance();
    const value = instance[prop as keyof Resend];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
