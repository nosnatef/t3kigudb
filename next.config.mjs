/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import config from "./next-i18next.config.mjs";

/**
 * @param {{ reactStrictMode: boolean; swcMinify: boolean; images: { domains: string[]; unoptimized: boolean; }; 
// Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
i18n: { defaultLocale: string; domains?: { defaultLocale: string; domain: string; http?: true; locales?: string[]; }[]; localeDetection?: false; locales: string[]; }; }} config
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["d1kkex4vltbo88.cloudfront.net", "fakeimg.pl"],
    unoptimized: true,
  },
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: config.i18n,
});
