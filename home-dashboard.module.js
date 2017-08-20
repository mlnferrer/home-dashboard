(function() {
    'use strict';

    angular
        .module('app.homedashboard', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, msNavigationServiceProvider, cpNavigationServiceProvider) {
        // State
        var date = new Date();
        $stateProvider.state('app.homedashboard', {
            url: '/home',
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/home-dashboard/home-dashboard.html',
                    controller: 'HomeDashboardController as vm'
                }
            },
            resolve: {
                SFApps: function(msApi, $q, localStorageService) {
                    var deferred = $q.defer();
                    var my = localStorageService.get('my');
                    if($.isEmptyObject(my)){
                        return msApi.resolve('sfapps@get').then(function(response){
                            localStorageService.set('my', response);
                        });
                    } else {
                        deferred.resolve();
                        return deferred.promise;
                    }
                },
                //Templates: function (msApi) {
                //    return msApi.resolve('schedule@query');
                //},
                TemplateVM: function (msApi, $q, localStorageService) {
                	var deferred = $q.defer();
                	var templates = localStorageService.get('templates');
                	if ($.isEmptyObject(templates)) {
                		msApi.request('schedule@query').then(function (response) {
                			var schedules = response;
                			if (schedules.length > 0)
                			{
                				msApi.resolve('editTemplate@get', { Id: schedules[0].TemplateId }).then(function (response) {
                					templates = response;
                					localStorageService.set('templates', templates);
                					deferred.resolve();
                				});
                			} else {
                				deferred.resolve();
                			}
                		});
                	} else {
                		deferred.resolve();
                	}
                	return deferred.promise;
                },                  
                User: function (msApi, $q, localStorageService) {
                    var deferred = $q.defer();
                    var user = localStorageService.get('user');
                    if($.isEmptyObject(user)){
                        return msApi.resolve('userDetails@get').then(function(response){
                            user = response;
                            localStorageService.set('user', user);
                        });
                    } else {
                        deferred.resolve();
                        return deferred.promise;
                    }
                },
                Firm: function (msApi, $q, localStorageService) {
                    var deferred = $q.defer();
                    var firm = localStorageService.get('firm');
                    if($.isEmptyObject(firm)){
                        return msApi.resolve('myFirm@get').then(function(response){
                            localStorageService.set('firm', response);
                        });
                    } else {
                        deferred.resolve();
                        return deferred.promise;
                    }
                },
                Countries: function (msApi, $q, localStorageService) {
                    var deferred = $q.defer();
                    var countries = localStorageService.get('countries');
                    if($.isEmptyObject(countries)){
                        return msApi.resolve('country@query').then(function(response){
                            localStorageService.set('countries', response);
                        });
                    } else {
                        deferred.resolve();
                        return deferred.promise;
                    }
                },
                States: function (msApi, $q, localStorageService) {
                    var deferred = $q.defer();
                    var states = localStorageService.get('states');
                    if($.isEmptyObject(states)){
                        return msApi.resolve('state@query').then(function(response){
                            localStorageService.set('states', response);
                        });
                    } else{
                        deferred.resolve();
                        return deferred.promise;
                    }
                },
                // Frequencies: function (msApi) {
                //     return msApi.resolve('frequencies@query')
                // },
                TimeOfDays: function (msApi, $q, localStorageService) {
                    var deferred = $q.defer();
                    var timeOfDays = localStorageService.get('timeofdays');
                    if($.isEmptyObject(timeOfDays)){
                        return msApi.resolve('timeofday@query').then(function(response){
                            localStorageService.set('timeofdays', response);
                        });
                    } else {
                        deferred.resolve();
                        return deferred.promise;
                    }
                },
                BusinessTypes: function (msApi, $q, localStorageService) {
                    var deferred = $q.defer();
                    var businessTypes = localStorageService.get('businesstypes');
                    if($.isEmptyObject(businessTypes)){
                        return msApi.resolve('businessTypes@query').then(function(response){
                            localStorageService.set('businesstypes', response);
                        });
                    } else {
                        deferred.resolve();
                        return deferred.promise;
                    }
                },
                IndustryTypes: function (msApi, $q, localStorageService) {
                    var deferred = $q.defer();
                    var industryTypes = localStorageService.get('industrytypes');
                    if($.isEmptyObject(industryTypes)){
                        return msApi.resolve('industryTypes@query').then(function(response){
                            localStorageService.set('industrytypes', response);
                        });
                    } else {
                        deferred.resolve();
                        return deferred.promise;
                    }
                },
                PrimaryOffice: function(msApi, $q, localStorageService){
                    var deferred = $q.defer();
                    var primaryOffice = localStorageService.get('primaryoffice');
                    if($.isEmptyObject(primaryOffice)){
                        return msApi.resolve('defaultOffice@query').then(function(response){
                            if(response.length){
                                return msApi.resolve('office@get', { Id: response[0].OfficeId}).then(function(officeResponse){
                                    localStorageService.set('primaryoffice', officeResponse);
                                });
                            }
                        });
                    } else{
                        deferred.resolve();
                        return deferred.promise;
                    }
                }
            },
            bodyClass: 'home-dashboard',
            data: {
                roles: ['User', 'Firm Admin', 'Standard User', 'Super Admin']
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('apps', {
            title: '',
            group: true,
            weight: 1
        });

        // Navigation
        msNavigationServiceProvider.saveItem('apps.homedashboard', {
            title: 'Home',
            icon: 'icon-home4',
            state: 'app.homedashboard',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('apps.firmportal', {
            title: 'Firm Portal',
            icon: 'icon-briefcase',
            state: 'app.firmportal',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('apps.businesslist', {
            title: 'Client Portal',
            icon: 'icon-users2',
            state: 'app.businesslist',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('apps.previewemail', {
            title: 'MarketingHUB',
            icon: 'icon-bullhorn',
            state: 'app.previewemail',
            weight: 1
        });
    }

})();
