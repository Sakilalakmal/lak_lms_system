import "server-only";

import Stripe from "stripe";
import { env } from "./env";

// Lazy-loaded Stripe client to avoid initialization during build
let stripeInstance: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!stripeInstance) {
      stripeInstance = new Stripe(env.STRIPE_API_KEY, {
        apiVersion: "2025-10-29.clover",
        typescript: true,
      });
    }
    return stripeInstance[prop as keyof Stripe];
  },
});
