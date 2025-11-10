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

export default arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],

  //define base rules here
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});
