'use strict';

const ghpages = require('gh-pages');
const config = require('../webpack.config');

ghpages.publish(config.output.path, console.error.bind(console));
