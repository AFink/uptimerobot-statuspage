const { i18n } = require("./next-i18next.config");

const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  i18n,
  future: {
    webpack5: true,
  },
};

const SentryWebpackPluginOptions = {};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
