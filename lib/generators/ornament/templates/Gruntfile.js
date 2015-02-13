// generate icons in terminal with: grunt icons
// place SVGs to use in app/assets/images/svg

module.exports = function(grunt) {
  grunt.initConfig({
    grunticon: {
      myIcons: {
        files: [{

          expand: true,

          // source folder
          cwd: 'app/assets/icons',

          // all svgs
          // src: ['*.svg', '*.png'],
          src: ['*.svg'],

          // base desination folder (everything is over-ridden below anyway)
          dest: "app"

        }],
        options: {

          // SVGO compression
          svgo:           true,

          // PNG compression
          pngcrush:       true,

          // Custom CSS template
          // relative to Gruntfile
          // template:       "app/assets/stylesheets/grunticon/grunticon-template.hbs",

          // CSS Files
          // relative to destination folder
          datasvgcss:     "assets/stylesheets/grunticon/_icon-svg.scss",
          datapngcss:     "assets/stylesheets/grunticon/_icon-png.scss",
          urlpngcss:      "assets/stylesheets/grunticon/_icon-png-images.scss",

          // Folder path for PNG files
          // relative to destination folder
          pngfolder:      "assets/images/png-icons",

          // CSS path for PNG files
          // relative to css file
          pngpath:        "/assets/png-icons",

          // CSS prefixes
          cssprefix:      ".grunticon-",

          // Loader snippet (not used, but put in a nice place, rather than the default)
          loadersnippet:  "../grunt/_grunticon.loader.js",

          // Preview HTML file
          // relative to destination folder
          previewhtml:    "../grunt/_grunticons-preview.html",

          // Custom colours
          // usage: "sidebar: #bada55"
          // name SVG file: my-icon.colors-sidebar.svg
          colors: {
            white: "#fff"
          }

        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-grunticon');
  grunt.registerTask('icons', ['grunticon:myIcons']);
};