import "server-only";

import Stripe from "stripe";
import { env } from "./env";

// Lazy-loaded Stripe client to avoid initialization during build
let stripeInstance: Stripe | null = null;

function getStripeInstance() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(env.STRIPE_API_KEY, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripeInstance();
    const value = instance[prop as keyof Stripe];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
