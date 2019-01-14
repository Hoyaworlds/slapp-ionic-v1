// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ionic-color-picker', 'ionic-timepicker', 'angular-svg-round-progress'])

    .run(function ($ionicPlatform, dataService) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        })
    })

    .controller('TimeCtrl', ['$interval', '$http', '$scope', '$timeout', 'dataService', '$rootScope', '$ionicPlatform', '$cordovaBluetoothSerial', function ($interval, $http, $scope, $timeout, dataService, $rootScope, $ionicPlatform, $cordovaBluetoothSerial) {
        function timeCon(unix_timestamp) {
            var date = new Date(unix_timestamp * 1000);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();
            // Will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            return formattedTime;
        }
    }])

    .controller('BluetoothCtrl', ['$scope', 'dataService', '$rootScope', '$ionicPlatform', '$cordovaBluetoothSerial', function ($scope, dataService, $rootScope, $ionicPlatform, $cordovaBluetoothSerial) {
        $ionicPlatform.ready(function () {
            //alert("ready");
            var macAddress = "20:15:12:23:89:83";

            $scope.connect = function () {
                //alert("connecting");
                $cordovaBluetoothSerial.connect("20:15:12:23:89:83", function () {
                }, function () {
                });
            }

            $scope.write = function () {
                //console.log(JSON.stringify(dataService.getColor()));
                $cordovaBluetoothSerial.write(JSON.stringify(dataService.getColor()), function () {
                }, function () {
                });
            }

            $scope.enable = function () {
                $cordovaBluetoothSerial.isConnected(alert("connected"), alert("not connected"));
            }
        })
    }])

    .controller('ColorCtrl', ['$scope', 'dataService', '$rootScope', '$ionicPlatform', '$cordovaBluetoothSerial', function ($scope, dataService, $rootScope, $ionicPlatform, $cordovaBluetoothSerial) {
        var vm = this;
        vm.testColors = '';

        var red = 0;
        var green = 0;
        var blue = 0;
        var color = document.getElementById('color-temp');
        $scope.set = function () {

            // * put off bluetooths Setting

            // dataService.setColor(vm.testColors);
            // $ionicPlatform.ready(function () {
            // 	$cordovaBluetoothSerial.write(JSON.stringify(dataService.getColor()), function() {}, function() {});
            // })

            // Convert to HEXcode

            var rgbArray = [vm.testColors.r, vm.testColors.g, vm.testColors.b];
            vm.hexCode = "#";

            for (var i = 0; i < rgbArray.length; i++) {
                if (rgbArray[i] < 16) {
                    vm.hexCode += "0" + rgbArray[i].toString(16);
                } else {
                    vm.hexCode += (rgbArray[i]).toString(16);
                }
            }
            dataService.setColor(vm.hexCode);

            // hardcoding

            cordova.plugins.CordovaMqTTPlugin.publish({
                topic: "McLighting01/in",
                payload: vm.hexCode,
                qos: 0,
                retain: false,
                success: function (s) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'success',
                        template: 'message sent'
                    });
                },
                error: function (e) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'error',
                        template: 'message publication failed'
                    });
                }
            })
        };

        $scope.brightdrag = function (value) {

            var brightness_value = "%" + value;

            cordova.plugins.CordovaMqTTPlugin.publish({
                topic: "McLighting01/in",
                payload: brightness_value,
                qos: 0,
                retain: false,
                success: function (s) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'success',
                        template: 'message sent'
                    });
                },
                error: function (e) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'error',
                        template: 'message publication failed'
                    });
                }
            })
        };

        $scope.speed_check = function (value) {
            var speed_value = "?" + value;

            cordova.plugins.CordovaMqTTPlugin.publish({
                topic: "McLighting01/in",
                payload: speed_value,
                qos: 0,
                retain: false,
                success: function (s) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'success',
                        template: 'message sent'
                    });
                },
                error: function (e) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'error',
                        template: 'message publication failed'
                    });
                }
            })
        };

        $scope.drag = function (value) {
            $scope.rangeValue = value;

            // ColorTemperature to RGB
            var temperature = value / 100.0;
            var red, green, blue;

            if (temperature < 66.0) {
                red = 255;
            } else {
                red = temperature - 55.0;
                red = 351.97690566805693 + 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
                if (red < 0) red = 0;
                if (red > 255) red = 255;
            }

            /* Calculate green */

            if (temperature < 66.0) {
                green = temperature - 2;
                green = -155.25485562709179 - 0.44596950469579133 * green + 104.49216199393888 * Math.log(green);
                if (green < 0) green = 0;
                if (green > 255) green = 255;

            } else {
                green = temperature - 50.0;
                green = 325.4494125711974 + 0.07943456536662342 * green - 28.0852963507957 * Math.log(green);
                if (green < 0) green = 0;
                if (green > 255) green = 255;

            }

            /* Calculate blue */

            if (temperature >= 66.0) {
                blue = 255;
            } else {

                if (temperature <= 20.0) {
                    blue = 0;
                } else {
                    blue = temperature - 10;
                    blue = -254.76935184120902 + 0.8274096064007395 * blue + 115.67994401066147 * Math.log(blue);
                    if (blue < 0) blue = 0;
                    if (blue > 255) blue = 255;
                }
            }

            $scope.rgb = {r: Math.round(red), g: Math.round(green), b: Math.round(blue)};
            dataService.setColor($scope.rgb);
            vm.testColors = $scope.rgb;
            $ionicPlatform.ready(function () {
                $cordovaBluetoothSerial.write(JSON.stringify(dataService.getColor()), function () {
                }, function () {
                });
            })

            red = $scope.rgb.red;
            green = $scope.rgb.green;
            blue = $scope.rgb.blue;

            color.style.backgroundColor = rgbForCss(red, green, blue);
        }

        function rgbForCss(r, g, b) {
            return "rgb(" + r + "," + g + "," + b + ")";
        }

        $scope.rangeValue = 2700;
    }])

    .controller('counterCtrl', ['$scope', 'dataService', '$rootScope', '$ionicPlatform', '$cordovaBluetoothSerial', '$ionicModal', '$timeout', function ($scope, dataService, $rootScope, $ionicPlatform, $cordovaBluetoothSerial, $ionicModal, $timeout) {
        // Timer
        var mytimeout = null; // the current timeoutID
        // actual timer method, counts down every second, stops on zero
        $scope.onTimeout = function () {
            if ($scope.timer === 0) {
                $scope.$broadcast('timer-stopped', 0);
                $timeout.cancel(mytimeout);
                return;
            }
            $scope.timer--;
            mytimeout = $timeout($scope.onTimeout, 1000);
        };
        // functions to control the timer
        // starts the timer
        $scope.startTimer = function () {
            mytimeout = $timeout($scope.onTimeout, 1000);
            $scope.started = true;
        };

        // stops and resets the current timer
        $scope.stopTimer = function (closingModal) {
            if (closingModal != true) {
                $scope.$broadcast('timer-stopped', $scope.timer);
            }
            $scope.timer = $scope.timeForTimer;
            $scope.started = false;
            $scope.paused = false;
            $timeout.cancel(mytimeout);
        };
        // pauses the timer
        $scope.pauseTimer = function () {
            $scope.$broadcast('timer-stopped', $scope.timer);
            $scope.started = false;
            $scope.paused = true;
            $timeout.cancel(mytimeout);
        };

        // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
        $scope.$on('timer-stopped', function (event, remaining) {
            if (remaining === 0) {
                $scope.done = true;
                dataService.setCountDownLight();
                $ionicPlatform.ready(function () {
                    $cordovaBluetoothSerial.write("r,0,255,255", function () {
                    }, function () {
                    });
                })
            }
        });
        // UI
        // When you press a timer button this function is called
        $scope.selectTimer = function (val) {
            $scope.timeForTimer = val;
            $scope.timer = val
            $scope.started = false;
            $scope.paused = false;
            $scope.done = false;
        };

        // This function helps to display the time in a correct way in the center of the timer
        $scope.humanizeDurationTimer = function (input, units) {
            // units is a string with possible values of y, M, w, d, h, m, s, ms
            if (input == 0) {
                return 0;
            } else {
                var duration = moment().startOf('day').add(input, units);
                var format = "";
                if (duration.hour() > 0) {
                    format += "H[h] ";
                }
                if (duration.minute() > 0) {
                    format += "m[m] ";
                }
                if (duration.second() > 0) {
                    format += "s[s] ";
                }
                return duration.format(format);
            }
        };
        // function for the modal
        $ionicModal.fromTemplateUrl('templates/timer.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
    }])

    .controller('paletteCtrl', ['$scope', 'dataService', '$rootScope', '$ionicPlatform', '$cordovaBluetoothSerial', '$ionicModal', '$timeout', function ($scope, dataService, $rootScope, $ionicPlatform, $cordovaBluetoothSerial, $ionicModal, $timeout) {

        var brightness_value = "%" + 255;

        $scope.palette_color = function(hex_code) {

            cordova.plugins.CordovaMqTTPlugin.publish({
                topic : "McLighting01/in",
                payload : hex_code,
                qos : 0,
                retain : false,
                success : function(s) {
                    var alertPopup = $ionicPopup.alert({
                        title : 'success',
                        template : 'message sent'
                    });
                },
                error : function(s) {
                    var alertPopup = $ionicPopup.alert({
                        title : 'error',
                        template : 'message publication failed'
                    });
                }
            });

            cordova.plugins.CordovaMqTTPlugin.publish({
                topic : "McLighting01/in",
                payload : brightness_value,
                qos : 0,
                retain : false,
                success : function(s) {
                    var alertPopup = $ionicPopup.alert({
                        title : 'success',
                        template : 'message sent'
                    });
                },
                error : function(s) {
                    var alertPopup = $ionicPopup.alert({
                        title : 'error',
                        template : 'message publication failed'
                    });
                }
            });


        }
    }]);
