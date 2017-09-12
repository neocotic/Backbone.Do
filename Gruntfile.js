module.exports = function(grunt) {

  'use strict';

  // Configuration
  // -------------

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: [ 'dist/**' ]
    },

    connect: {
      server: {
        options: {
          base: '.',
          port: 3000
        }
      }
    },

    jshint: {
      all: [
        'lib/*.js',
        'test/*.js',
        'Gruntfile.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    qunit: {
      all: {
        options: {
          urls: [ 'http://localhost:3000/test/index.html' ]
        }
      }
    },

    uglify: {
      all: {
        files: {
          'dist/backbone.do.min.js': 'lib/backbone.do.js'
        }
      },
      options: {
        banner: (
          '/*! Backbone.Do v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %>' +
          ' <%= pkg.author.name %> | <%= pkg.license %> License */'
        ),
        report: 'min',
        sourceMap: true,
        sourceMapName: 'dist/backbone.do.min.map'
      }
    }
  });

  // Tasks
  // -----

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [ 'ci' ]);
  grunt.registerTask('build', [ 'jshint', 'clean:build', 'uglify' ]);
  grunt.registerTask('ci', [ 'jshint', 'clean', 'uglify', 'connect', 'qunit' ]);
  grunt.registerTask('test', [ 'jshint', 'connect', 'qunit' ]);

};
