module.exports = function(grunt) {

  'use strict';

  // Configuration
  // -------------

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

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
        'Gruntfile.js',
        '<%= pkg.name %>.js',
        'test/*.js'
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
          '<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
        }
      },
      options: {
        banner: (
          '/*! Backbone.Do v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %>' +
          ' <%= pkg.author.name %> | <%= pkg.license %> License */'
        ),
        report: 'min',
        sourceMap: true,
        sourceMapName: '<%= pkg.name %>.min.map'
      }
    }

  });

  // Tasks
  // -----

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [ 'ci' ]);
  grunt.registerTask('build', [ 'jshint', 'uglify' ]);
  grunt.registerTask('ci', [ 'jshint', 'uglify', 'connect', 'qunit' ]);
  grunt.registerTask('test', [ 'jshint', 'connect', 'qunit' ]);

};
