import "server-only";

import { Resend } from "resend";
import { env } from "./env";

// Lazy-loaded Resend client to avoid initialization during build
let resendInstance: Resend | null = null;

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    if (!resendInstance) {
      resendInstance = new Resend(env.RESEND_API_KEY);
    }
    return resendInstance[prop as keyof Resend];
  },
});
