angular.module('app.routes', [])

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider


            .state('tabsController.colorPicker', {
                url: '/page2',
                views: {
                    'tab1': {
                        templateUrl: 'templates/colorPicker.html',
                        controller: 'colorPickerCtrl'
                    }
                }
            })

            .state('tabsController.alarm', {
                url: '/page3',
                views: {
                    'tab2': {
                        templateUrl: 'templates/alarm.html',
                        controller: 'alarmCtrl'
                    }
                }
            })

            .state('tabsController.weather', {
                url: '/page4',
                views: {
                    'tab3': {
                        templateUrl: 'templates/weather.html',
                        controller: 'weatherCtrl'
                    }
                }
            })
            .state('tabsController.settings', {
                url: '/page5',
                views: {
                    'tab4': {
                        templateUrl: 'templates/settings.html',
                        controller: 'settingsCtrl'
                    }
                }
            })

            .state('tabsController.support', {
                url: '/page6',
                views: {
                    'tab5': {
                        templateUrl: 'templates/support.html',
                        controller: 'supportCtrl'
                    }
                }
            })
            .state('tabsController.colorPalette', {
                url: '/page7',
                views: {
                    'tab6': {
                        templateUrl: 'templates/colorPalette.html',
                        // new controller
                        controller: 'paletteCtrl'
                    }
                }
            })
            .state('tabsController', {
                url: '/page1',
                templateUrl: 'templates/tabsController.html',
                abstract: true
            })
        $urlRouterProvider.otherwise('/page1/page2')
    });