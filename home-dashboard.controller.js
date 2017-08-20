(function() {
    'use strict';

    angular
        .module('app.homedashboard')
        .controller('HomeDashboardController', HomeDashboardController);

    /** @ngInject */
    function HomeDashboardController($rootScope, $scope, $interval,msApi, $mdDialog, $document, $timeout, $state, localStorageService) {
        var vm = this;

        var Firm  = localStorageService.get('firm');
        var User = localStorageService.get('user');
        var SFApps = localStorageService.get('my');
        var TemplateVM = localStorageService.get('templates');

        $rootScope.Title = "PANALITIX";
        if (TemplateVM !== null) {
            vm.emailTemplateModel = localStorageService.get('emailTemplateModel');
            if (vm.emailTemplateModel == undefined) {
                localStorageService.set('emailTemplateModel', setTemplateVm(TemplateVM));
            }
            else {
                localStorageService.remove('emailTemplateModel');
                localStorageService.set('emailTemplateModel', setTemplateVm(TemplateVM));
                vm.emailTemplateModel = localStorageService.get('emailTemplateModel');
            }
        }

        var sessionId = null;
        var sessionToken = null;
        var apps = null;
        var appNames = [];


        vm.Apps = SFApps;
        sessionId = vm.Apps.SessionId;
        sessionToken = vm.Apps.SessionToken;
        apps = vm.Apps.SalesforceApplications;


        if(vm.Apps.IsNewUser) {
            showPrompt();
        }

        checkPermission(apps);

    	/**
         * Load Urls for HOME
         *
         *
         * @param sessionId, sessionToken
     	*/
        function loadUrls(sessionId, sessionToken, apps) {
        	$scope.urlPAN = "https://app.panalitix.com/Accountant/MemberLogin.aspx?userid=" + sessionId + "&token=" + sessionToken;
        	$scope.urlPSS = "https://pssae.panalitix.com/account/MemberLogin.aspx?userid=" + sessionId + "&token=" + sessionToken;
        }

        /**
         * Check Available App
         *
         *
         * @param apps
     	*/
     	function checkPermission(apps) {
     		for(var p in apps) {
     			appNames.push(apps[p].Name);

     			if (apps[p].Name == "PANALITIX" || apps[p].Name == "Proactive Success System") {
                    loadUrls(sessionId, sessionToken, apps);
                }
     		}
            
     	}

     	$scope.isAccessible = function (app) {
     		var ind = $.inArray( app, appNames);

     		if(ind < 0)
     			return false;
     		else
     			return true;
     	}

        $scope.loadPage = function(app) {

            $('#vertical-navigation1').addClass('hidden');

            if (!$('#panBody').is(".ms-navigation-folded")) {
                $timeout(function () {
                    $('#mainNav').trigger('click');
                }, 10);
            }

            if(app.includes("firmportal")) {
                $rootScope.isFirmPortal = true;
                $rootScope.isClientPortal = false;
                $rootScope.isMarketingHub = false;
            }
            else if (app.includes("businesslist")) {
                $rootScope.isClientPortal = true;
                $rootScope.isFirmPortal = false;
                $rootScope.isMarketingHub = false;
            } else {
                $rootScope.isMarketingHub = true;
                $rootScope.isFirmPortal = false;
                $rootScope.isClientPortal = false;
            }


            $state.go(app);
        }

     	$scope.loadFrame = function(event) {

            if (!$('#panBody').is(".ms-navigation-folded")) {
                $timeout(function () {
                    $('#mainNav').trigger('click');
                }, 50);
            }

            $('#trustFrame').attr('src', $('#trustFrame').attr('src'));
            $state.go('app.trust');
     	}

        function showPrompt() {
            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                controller: 'HomeDialogController',
                controllerAs: 'vm',
                scope: $scope,
                templateUrl: 'app/main/apps/home-dashboard/dialog/home-dialog.html',
                parent: angular.element($document.find('#content-container')),
                clickOutsideToClose: false
            }).then(function (url) {
                //success
            });;
        };

        function setTemplateVm(result) {
            return {
                TemplateId: result.TemplateId,
                BaseTemplateId: result.BaseTemplateId == undefined ? 1 : result.BaseTemplateId,
                LogoPositioning: result.LogoPositioning,
                Subject: result.Subject,
                FromName: result.FromName,
                FromEmail: result.FromEmail,
                IncludeWebSiteURL: result.IncludeWebSiteURL,
                IncludeOfficePhoneNumber: result.IncludeOfficePhoneNumber,
                IncludeSocialMediaLinks: result.IncludeSocialMediaLinks,
                EmailPrefix: result.EmailPrefix,
                EmailMessage: result.EmailMessage,
                EmailSignOff: result.EmailSignOff,
                Vzaar: {
                    Id: result.Vzaar.Id,
                    ImageUrl: result.Vzaar.ImageUrl,
                    Url: result.Vzaar.Url,
                    Content: result.Vzaar.Content,
                    GlobalContentId: result.Vzaar.GlobalContentId
                },
                Article: {
                    Url: result.Article.Url,
                    Content: result.Article.Content,
                    Title: result.Article.Title,
                    GlobalContentId: result.Article.GlobalContentId,
                    Id: result.Article.Id
                },
                CaseStudy: {
                    Url: result.CaseStudy.Url,
                    Content: result.CaseStudy.Content,
                    Title: result.CaseStudy.Title,
                    Id: result.CaseStudy.Id,
                    GlobalContentId: result.CaseStudy.GlobalContentId
                },
                Schedule: {
                    StreamName: Firm.Name + ' Email News Letter',
                    StartDate: moment(new Date()).format('YYYY-MM-DD'),
                    SendOnHolidays: false,
                    FrequencyId: 1,
                    TimeOfDayId: 2
                },
                ToEmail: '',
                FirmId: Firm.Id,
                ArticleDefaultContent: result.ArticleContent,
                CaseStudyDefaultContent: result.CaseStudyContent,
                VzaarDefaultContent: result.VzaarDescription,
                ArticleDefaultTitle: result.ArticleTitle,
                CaseStudyDefaultTitle: result.CaseStudyTitle,
                Type: 'POST'
            };
        }
    }

})();