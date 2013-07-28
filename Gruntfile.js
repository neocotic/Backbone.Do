module.exports = function(grunt) {

  'use strict';

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
        src: [ 'backbone.do.js' ]
      }
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'backbone.do.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    nodeunit: {
      all: [ 'test/*_test.js' ]
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
          'backbone.do.min.js': 'backbone.do.js'
        }
      },
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | (c) ' +
          '<%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | ' +
          '<%= pkg.licenses[0].type %> License */\n'
      }
    },

    watch: {
      files: [ '<%= jshint.all %>' ],
      tasks: [ 'default' ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco');

  grunt.registerTask('build',   [ 'docco', 'uglify' ]);
  grunt.registerTask('default', [ 'test', 'build' ]);
  grunt.registerTask('test',    [ 'jshint', 'nodeunit', 'connect', 'qunit' ]);

};
