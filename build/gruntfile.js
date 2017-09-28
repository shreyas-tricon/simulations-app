module.exports = function(grunt){
	'use strict'
	//Read the version information from version.js
    function readVersionInfo(versionFile){
        var versionFileContent = grunt.file.read(versionFile);
        var versionRegex = /var MAJOR = '(.*?)';/;
        var match = versionRegex.exec(versionFileContent);
        var major = match[1];
        
        versionRegex = /var MINOR = '(.*?)';/;
        match = versionRegex.exec(versionFileContent);
        var minor = match[1];
        
        versionRegex = /var PATCH = '(.*?)';/;
        match = versionRegex.exec(versionFileContent);
        var patch = match[1];
        
        return ([major,minor,patch].join('.'))
    }
	var versionInfo = readVersionInfo('../sim-app-android/www/auth/js/version.js') || readVersionInfo('../sim-app-ios/www/auth/js/version.js');
//	var versionInfo = readVersionInfo('sim-app-ios/www/auth/js/version.js');
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		versionInfo : versionInfo,
		svninfo:{
			options:{
				cwd: '../<%= pkg.name%>'
			}
		},
		'string-replace': {
			'version-js': {
                files: {
                	'../<%= pkg.name%>/www/auth/js/version.js' : '../<%= pkg.name%>/www/auth/js/version.js'
                },
                options: {
                    replacements: [
                        {
                            pattern: /var BUILD = '(.*?)';/,
                            replacement: 'var BUILD = \'<%= svninfo.rev %>\';'
                        }
                    ]
                }
            },
            'version-xml': {
            	files : {
					'../<%= pkg.name%>/config.xml' : '../<%= pkg.name%>/config.xml'
				},
                options: {
                    replacements: [
                        {
                            pattern: /version="(.*?)"/,
                            replacement: 'version="<%= versionInfo %>.<%= svninfo.rev %>"'
                        }
                    ]
                }
            },
            'remove-console': {
            	files: [{
							cwd:'<%=pkg.buildTarget%>/<%= pkg.name%>/www/auth/js',
							expand:true,
							src: ['**/*.js'],
							dest: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/auth/js'
						},
						{
							cwd:'<%=pkg.buildTarget%>/<%= pkg.name%>/www/www/js',
							expand:true,
							src: ['**/*.js'],
							dest: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/www/js'
						}
//            	        {
//            	        	'../<%= pkg.name%>/www/www/js/launcher.js' : '../<%= pkg.name%>/www/www/js/launcher.js'
//            	        }
    	        ],
                options : {
                	replacements : [
                	                {
                	                	pattern:/console.log/g,
                	                	replacement:'//console commented '
                	                }
	                ]
                }
            }
		},
		clean:{
			options:{
				force:true
			},
			dist:['<%=pkg.buildTarget%>'],
			www:['<%=pkg.buildTarget%>/<%=pkg.name%>/www']
		},
		copy:{
			dist: {
				files:[{
					cwd: '../<%= pkg.name%>',
					expand: true,
					src :['**/*'],
					dest:'<%=pkg.buildTarget%>/<%= pkg.name%>'
				}]
			},
			www: {
				files:[{
					cwd: '../<%= pkg.name%>/www',
					expand: true,
					src :['**/*'],
					dest:'<%=pkg.buildTarget%>/<%= pkg.name%>/www'
				}]
			}
		},
		uglify: {
			js:{
				files:[{
					cwd:'../<%= pkg.name%>/www/auth/js',
					expand:true,
					src: ['**/*.js'],
					dest: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/auth/js'
				},
				{
					cwd:'../<%= pkg.name%>/www/auth/utils',
					expand:true,
					src: ['**/*.js'],
					dest: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/auth/utils'
				},
				{
					cwd:'../<%= pkg.name%>/www/www/js',
					expand:true,
					src: ['**/*.js'],
					dest: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/www/js'
				}]
			}
		},
		cssmin: {
			css: {
				files: [{
					cwd: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/auth/css',
					expand: true,
					src: ['**/*.css'],
					dest: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/auth/css'
				},
				{
					cwd: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/www/css',
					expand: true,
					src: ['**/*.css'],
					dest: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/www/css'
				}]
			}
		},
		htmlmin: {
			html: {
				files: [{
					cwd:'<%=pkg.buildTarget%>/<%= pkg.name%>/www/www',
					expand: true,
					src: ['**/*.html'],
					dest: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/www'
				}]
			}
		},
		jsonmin: {
			json: {
				files: [{
					cwd:'<%=pkg.buildTarget%>/<%= pkg.name%>/www/www',
					expand: true,
					src: ['**/*.json'],
					dest: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/www'
				}]
			}
		},
		imagemin: {
			dist: {
				files: [{
					cwd: '../<%= pkg.name%>/www/www/assets/images',
					expand: true,
					src: ['**/*.{gif,GIF,jpg,JPG,png,PNG}'],
					dest: '<%=pkg.buildTarget%>/<%= pkg.name%>/www/www/assets/images'
				}]
			}
		}
	});
	grunt.loadNpmTasks('grunt-svn');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-jsonmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
    
	grunt.registerTask('version', [										//Update version information
	                       'svninfo',
	                       'string-replace:version-js',
	                       'string-replace:version-xml'
                       	]);
	
	grunt.registerTask('dist',[
	                           'clean:dist',
	                           'copy:dist'
//	                           'string-replace:remove-console',
//	                           'uglify',
//	                           'cssmin',
//	                           'jsonmin',
//	                           'htmlmin'
	                           ]);
	
	grunt.registerTask('www',[
	                           'clean:www',
	                           'copy:www',
	                           'version',
	                           'uglify',
	                           'cssmin',
	                           'jsonmin',
	                           'htmlmin',
	                           'imagemin'
	                           ])
	
	
}