import { withSentryConfig } from '@sentry/nextjs';
import nextTranslate from 'next-translate-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = nextTranslate({
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },

  rewrites() {
    return [
      {
        source: '/settings',
        destination: '/settings/account',
      },
    ];
  },

  redirects() {
    return [
      {
        source: '/rewise',
        destination: 'https://rewise.tuturuuu.com',
        permanent: false,
      },
    ];
  },
});

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: 'tuturuuu',
    project: 'web-app',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
