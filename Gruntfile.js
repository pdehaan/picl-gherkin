var fs = require('fs');
var path = require('path');
var vars = require('insert-module-globals').vars;

function mergeVars (opts, defaults) {
  if (!opts) return defaults;
  Object.keys(defaults).map(function (key) {
    if (!opts[key]) opts[key] = defaults[key];
  });
  return opts;
}

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-browserify');

  grunt.initConfig({
    browserify: {
      basic: {
        src: ['entry.js'],
        dest: 'web/bundle.js',
        options: {
          alias: [
            'browser-request:request',
            'crypto-browserify:crypto',
            'bigint-browserify:bignum',
            'buffer-browserify:buffer',
          ],
          ignore: [
            'dns',
            'hapi',
            '../error',
          ],
          insertGlobalVars: mergeVars({
            Buffer: function() {
              return {
                id: path.join(__dirname, 'lib', 'buffer_shim.js'),
                source: fs.readFileSync('lib/buffer_shim.js', 'utf8'),
                suffix: '.Buffer'
              };
            }
          }, vars),
          standalone: 'gherkin'
        }
      }
    }
  });

  //grunt.loadTasks('../../tasks');

  grunt.registerTask('default', ['browserify']);
};

