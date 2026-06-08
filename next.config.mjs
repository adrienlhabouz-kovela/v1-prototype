/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // SHA du commit déployé — Vercel l'injecte automatiquement au build.
    // Fallback « local » pour les builds locaux.
    BUILD_SHA: (process.env.VERCEL_GIT_COMMIT_SHA || "local").slice(0, 7),
  },
};

export default nextConfig;
