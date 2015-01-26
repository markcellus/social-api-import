module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: ['dist'],
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        dest: 'dist',
                        src: [
                            'social-api.js'
                        ]
                    }
                ]
            },
            'libs': {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/requirejs',
                        dest: 'external/requirejs',
                        src: ['require.js']
                    }
                ]
            },
            'test-libs': {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/qunit/qunit',
                        dest: 'tests/libs/qunit',
                        src: ['**/*']
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/sinonjs',
                        dest: 'tests/libs/sinon',
                        src: ['sinon.js']
                    }
                ]
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dist/social-api.min.js': ['src/social-api.js']
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    dir: "dist",
                    removeCombined: true,
                    optimize: 'uglify',
                    uglify: {
                        preserveComments: true,
                        ASCIIOnly: true,
                        output: 'social-api.min.js'
                    }
                }
            }
        },
        connect: {
            test: {
                options: {
                    hostname: 'localhost',
                    port: 7000
                }
            },
            local: {
                options: {
                    keepalive: true
                }
            }
        },
        qunit: {
            local: {
                options: {
                    urls: [
                        'http://localhost:7000/tests/index.html'
                    ]
                }
            }
        },
        usebanner: {
            all: {
                options: {
                    banner: '/** \n' +
                    '* Social API - v<%= pkg.version %>.\n' +
                    '* <%= pkg.repository.url %>\n' +
                    '* Copyright <%= grunt.template.today("yyyy") %> Mark Kennedy. Licensed MIT.\n' +
                    '*/\n',
                    linebreak: false
                },
                files: {
                    src: ['dist/social-api.js', 'dist/social-api.min.js']
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commit: false,
                createTag: false,
                tagName: 'v%VERSION%',
                tagMessage: 'v%VERSION%',
                push: false,
                pushTo: 'origin',
                updateConfigs: ['pkg'],
                commitFiles: [
                    'dist/social-api.js',
                    'dist/social-api.min.js',
                    'package.json',
                    'bower.json'
                ],
                commitMessage: 'release %VERSION%'
            }
        }
    });

    // Load grunt tasks from node modules
    require( "load-grunt-tasks" )( grunt, {
        loadGruntTasks: {
            pattern: 'grunt-*'
        }
    } );

    // Default grunt

    grunt.registerTask( "build-files", [
        "clean",
        "copy",
        "uglify",
        "usebanner:all"
    ]);

    grunt.registerTask( "build", [
        "build-files",
        "connect:test",
        "qunit:local"
    ]);

    grunt.task.registerTask('release', 'A custom release.', function(type) {
        type = type || 'patch';
        grunt.task.run([
            'bump:' + type,
            'build'
        ]);
    });

    grunt.registerTask( "server", [
        "connect:local"
    ]);

    grunt.registerTask( "test", [
        "connect:test",
        "qunit:local"
    ]);
};