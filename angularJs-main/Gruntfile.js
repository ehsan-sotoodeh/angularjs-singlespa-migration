module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({

    //Read the package.json (optional)
    pkg: grunt.file.readJSON('package.json'),

    // Metadata.
    meta: {
        basePath: './',
        deployPath: './public/assets/css/',
        bowerPath: './public/assets/bower_components/'
    },

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

    // Task configuration.
    connect: {
      server: {
        options: {
          port: 8002,
          base: './public',
          hostname: 'localhost',
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                next();
            });
  
            return middlewares;
          }
        }
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        autoWatch: false,
        background: true
      }
    },



    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'public/assets/js/angular_src.min.js': ['public/assets/bower_components/angular-route/angular-route.min.js', 'public/assets/bower_components/howler/howler.min.js', 'public/app/**/*.js']
        }
      }
    },

    watch: {


      /* watch and see if our javascript files change, or new packages are installed */
      js: {
        files: ['public/app/**/*.js'],
        tasks: ['uglify']
      },

      karma: {
        files: ['public/app/**/*.js', 'test/**/*.js'],
        tasks: ['karma:unit:run']
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-connect');
  // grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  // Default task.
  grunt.registerTask('default', [ 'uglify', 'connect', 'watch']);
  grunt.registerTask('test', [ 'uglify', 'karma:unit:start', 'connect', 'watch']);
};
