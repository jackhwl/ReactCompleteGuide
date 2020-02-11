angular.module('app')
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$rootScopeProvider', '__env', function ($stateProvider, $locationProvider, $urlRouterProvider, $rootScopeProvider, __env) {
	    $stateProvider
	    
	        // route for the home page
	        .state('app', {
	            url:'/',
	            views: {
	                'header': {
	                    templateUrl : 'app/views/header.html',
	                },
	                'content': {
	                    templateUrl : 'app/views/home.html',
	                    //controller  : 'IndexController'
	                },
	                'footer': {
	                    templateUrl : 'app/views/footer.html',
	                }
	            },
	            data: {
	                requireLogin: false
	            }

	        })
	    
	        // route for the dashboard page
	        .state('app.dashboard', {
	            url:'dashboard',
	            views: {
	                'header@': {
	                  template : '<ov-header-wrap page="Dashboard" icon="dashboard32W.png" user="$resolve.user" top-menu="$resolve.topMenu" global-selections="$resolve.globalSelections"></ov-header-wrap>',
	                  resolve: app.resolveHeader  /*global app: true*/
	                },
	                'content@': {
	                    template : '<ov-dashboard widget-name-list="$resolve.widgetNameList"></ov-dashboard>',
	        						resolve: app.resolveDashboard 
	                }
	            },
	            data: {
	                requireLogin: true
	            }
	        })

	        // route for widget
	        .state('app.widget', {
	            url: 'widget',
	            views: {
	                'header@': {
	                    template: '<ov-header-wrap page="My Widgets" icon="dashboard32W.png" user="$resolve.user" top-menu="$resolve.topMenu"></ov-header-wrap>',
	                    resolve: app.resolveHeader
	                },
	                'content@': {
	                    template: '<ov-widget user="$resolve.user"></ov-widget>',
	                    resolve: app.resolveWidget
	                }
	            },
	            data: {
	                requireLogin: true
	            }
	        })
	    
	        // route for widget admin
	        .state('app.widgetAdmin', {
	            url:'widgetAdmin',
	            views: {
	                'header@': {
	                  template : '<ov-header-wrap page="Widget Administration" icon="dashboard32W.png" user="$resolve.user" top-menu="$resolve.topMenu"></ov-header-wrap>',
	                  resolve: app.resolveHeader  
	                },
	                'content@': {
	                    template: '<ov-widget-admin user="$resolve.user"></ov-widget-admin>',
	                    resolve: app.resolveWidgetAdmin 
	                }
	            },
	            data: {
	                requireLogin: true
	            }
	        })

	        // routes for binder

	        .state('app.bindercreate', {
	            url: 'binders/setup',
	            views: {
	                'header@': {
	                  template : '<ov-header-wrap page="Create" icon="binders32W.png" user="$resolve.user" top-menu="$resolve.topMenu" hide-header="true"></ov-header-wrap>',
	                  resolve: app.resolveHeader
	                },
	                'content@': {
                        template: '<ov-binder user="$resolve.user" available-reports="$resolve.availableReports" binder="$resolve.binder"></ov-binder>',
	                    resolve: app.resolveBinder 
	                }
	            },
	            data: {
	                requireLogin: true
	            }
            })

	        // route for Custom-Drivers
	        .state('app.customDrivers', {
	            url: 'customDrivers',
	            views: {
	                'header@': {
	                    template: '<ov-header-wrap page="Custom Drivers" icon="global32W.png" user="$resolve.user" top-menu="$resolve.topMenu"></ov-header-wrap>',
	                    resolve: app.resolveHeader
	                },
	                'content@': {
	                    template: '<ov-custom-drivers user="$resolve.user"></ov-custom-drivers>',
	                    resolve: app.resolveCustomDriver
	                }
	            },
	            data: {
	                requireLogin: true
	            }
	        })

	        // route for Custom-Drivers
            .state('app.administration', {
                url: 'administration',
	            views: {
	                'header@': {
	                    template: '<ov-header-wrap page="Administration" icon="global32W.png" user="$resolve.user" top-menu="$resolve.topMenu"></ov-header-wrap>',
	                    resolve: app.resolveHeader
	                },
	                'content@': {
                        template: '<ov-administration user="$resolve.user"></ov-administration>',
                        resolve: app.resolveAdministration
	                }
	            },
	            data: {
	                requireLogin: true
	            }
	        })

			.state('app.binderedit', {
	            url: 'binders/setup/:id',
	            views: {
	                'header@': {
	                    template: '<ov-header-wrap page="Edit" icon="binders32W.png" user="$resolve.user" top-menu="$resolve.topMenu" hide-header="true" ></ov-header-wrap>',
						resolve: app.resolveHeader
	                },
	                'content@': {
	                    template: '<ov-binder user="$resolve.user" available-reports="$resolve.availableReports" binder="$resolve.binder"></ov-binder>',
	                    resolve: app.resolveBinder
	                }
	            },
	            data: {
	                requireLogin: true
	            }
	        })

            // route for adminServices
            .state('app.system/serviceAccountConfig', {
                url: 'system/serviceAccountConfig',
                views: {
                    'header@': {
                        template: '<ov-header-wrap page="Service Account" icon="system32W.png" user="$resolve.user" top-menu="$resolve.topMenu"></ov-header-wrap>',
                        resolve: app.resolveHeader
                    },
                    'content@': {
                        template: '<ov-service-account-config user="$resolve.user"></ov-service-account-config>',
                        resolve: app.resolveServiceAccountConfig
                    }
                },
                data: {
                    requireLogin: true
                }
            })

            // route for adminDirectory
            .state('app.system/emailConfig', {
                url: 'system/emailConfig',
                views: {
                    'header@': {
                        template: '<ov-header-wrap page="Email Settings" icon="system32W.png" user="$resolve.user" top-menu="$resolve.topMenu"></ov-header-wrap>',
                        resolve: app.resolveHeader
                    },
                    'content@': {
                        template: '<ov-email-config user="$resolve.user"></ov-email-config>',
                        resolve: app.resolveEmailConfig
                    }
                },
                data: {
                    requireLogin: true
                }
            })

	        // route for error
			.state('app.error', {
				url:'error',
				/*resolve: {
				errorObj: [function () {
						return this.self.error;
					}]
				},*/
				views: {
	          'content@': {
	              controller: 'ErrorController',
	  						controllerAs: 'err',
	  						//templateUrl: 'app/views/error.html',
	  						resolve: {
	  							errorObj: [function () {
	  									return this.self.error;
	  								}]
	  						}
	          		}
	      		},
	          data: {
	              requireLogin: false
	          }			
			});

        $rootScopeProvider.digestTtl(1000); 

        $locationProvider
            .html5Mode(__env.html5Mode); // enable html5Mode for pushstate ('#'-less URLs DOESN'T WORK)

        $urlRouterProvider
            .when('/Spa/administration', '/administration')
            .when('/Administration', '/administration')
            .otherwise(!__env.html5Mode ? '/' : '/dashboard');
	}])
