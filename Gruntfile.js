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

    docco: {
      all: {
        options: {
          output: 'docs'
        },
        src: [ '<%= pkg.name %>.js' ]
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
          ' <%= pkg.author.name %> | <%= pkg.licenses[0].type %> License\n' +
          '*/'
        ),
        report: 'min',
        sourceMap: true,
        sourceMapName: '<%= pkg.name %>.min.map'
      }
    },

    watch: {
      files: [ '<%= jshint.all %>' ],
      tasks: [ 'default' ]
    }

  });

  // Tasks
  // -----

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco');

  grunt.registerTask('default', [ 'test' ]);
  grunt.registerTask('dist', [ 'test', 'uglify', 'docco' ]);
  grunt.registerTask('test', [ 'jshint', 'connect', 'qunit' ]);

};