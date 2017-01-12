/**
 * Created by Shariar Shaikot on 1/9/16.
 */

const taskLoader = require('load-grunt-tasks');

module.exports = grunt => {
  taskLoader(grunt);
  grunt.initConfig({
    watch: {
      options: {
        livereload: true,
      },
      less: {
        files: ['src/css/*.less'],
        tasks: ['less'],
      },
      scripts: {
        files: ['src/js/*.js'],
        tasks: ['browserify'],
      },
    },
    less: {
      all: {
        files: {
          '.tmp/mr-slider.css': 'src/css/main.less',
        },
      },
    },
    browserify: {
      dist: {
        options: {
          transform: [
            ['babelify', {
              //loose: 'all',
            }],
          ],
        },
        files: {
          '.tmp/mr-slider.js': ['src/js/*.js'],
        },
      },
    },
    connect: {
      server: {
        options: {
          livereload: true,
          open: true,
          base: './',
          port: 8080,
        },
      },
    },
    uglify: {
      dist: {
        files: {
          './mr.slider.min.js': ['./.tmp/mr-slider.js']
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          './mr.slider.min.css': ['./.tmp/mr-slider.css']
        }
      }
    }
  });
  grunt.registerTask('serve', [
    'connect',
    'watch',
  ]);
  grunt.registerTask('build', [
    'browserify',
    'less',
    'uglify',
    'cssmin'
  ]);
};