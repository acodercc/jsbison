module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        nodeunit: {
            all: ['test/*_test.js'],
            options: {
              reporter: 'tap'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('default', ['nodeunit']);
};
