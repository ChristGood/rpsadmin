// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.html
// Allowing console calls below since this is a build file.
import webpack from 'webpack';
import webpackConfig from '../webpack.config.prod';
const logger = require('tracer').colorConsole();


process.env.NODE_ENV = 'production'; // this assures the Babel dev config (for hot reloading) doesn't apply.

logger.debug('Generating minified bundle for production via Webpack. This will take a moment...');

webpack(webpackConfig).run((err, stats) => {
  if (err) { // so a fatal error occurred. Stop here.
    logger.error(err);
    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(error => logger.error(error));
  }

  if (jsonStats.hasWarnings) {
    logger.warn('Webpack generated the following warnings: ');
    jsonStats.warnings.map(warning => logger.warn(warning));
  }

  logger.log(`Webpack stats: ${stats}`);

  // if we got this far, the build succeeded.
  logger.info('Your app has been compiled in production mode and written to /dist. It\'s ready to roll!');

  return 0;
});
