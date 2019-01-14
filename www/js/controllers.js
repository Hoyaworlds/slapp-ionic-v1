var app = angular.module('app.controllers', ['ionic-timepicker', 'ionic', 'ngCordova', 'app.routes', 'app.services', 'app.directives']);
app.controller('settingsCtrl', function ($scope, dataService) {
    $scope.connect = function () {
        cordova.plugins.CordovaMqTTPlugin.connect({
            url: "tcp://m15.cloudmqtt.com", //a public broker used for testing purposes only. Try using a self hosted broker for production.
            port: 13738,
            clientId: "MY_CLIENT_ID_20160814",
            connectionTimeout: 3000,
            willTopicConfig: {
                qos: 2,
                retain: true,
                topic: "ebtest",
                payload: "Messaggio di prova"
            },
            username: "crzllkoq",
            password: '76Jm1o3A3gKZ',
            keepAlive: 60,
            success: function (s) {
                console.log("connectess");
            },
            error: function (e) {
                console.log("connectr");
            },
            onConnectionLost: function () {
                console.log("disconnect");
                var alertPopup = $ionicPopup.alert({
                    title: 'error',
                    template: 'conneciton lost'
                });
            }
        });
    };
    $scope.on = function () {
        cordova.plugins.CordovaMqTTPlugin.publish({
            topic: "McLighting01/in",
            payload: "=rainbow",
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
    $scope.off = function () {
        cordova.plugins.CordovaMqTTPlugin.publish({
            topic: "McLighting01/in",
            payload: "=off",
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
    $scope.disconnect = function () {
        cordova.plugins.CordovaMqTTPlugin.disconnect({
            success: function (s) {
                var alertPopup = $ionicPopup.alert({
                    title: 'success',
                    template: 'client disconnected'
                });
            },
            error: function (e) {
                var alertPopup = $ionicPopup.alert({
                    title: 'error',
                    template: 'error while disconnecting'
                });
            }
        })
    }
})
app.controller('supportCtrl', function ($scope, dataService) {

})
app.controller('colorPickerCtrl', function ($scope, dataService) {

})


app.controller('alarmCtrl', function ($http, $timeout, $interval, $ionicPlatform, $cordovaBluetoothSerial, $scope, ionicTimePicker, dataService) {

    $scope.time = "0:00";
    var ipObj1 = {
        callback: function (val) { //Mandatory
            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTime = new Date(val * 1000);
                $scope.time = selectedTime.getUTCHours() + " : " + selectedTime.getUTCMinutes();
                dataService.setAlarmTime(selectedTime);
                dataService.setAlarmTrigger(false);
                //console.log(dataService.getAlarmTime().getMinutes());
            }
        },
        inputTime: 50400, //Optional
        format: 12, //Optional
        step: 1, //Optional
        setLabel: 'Set' //Optional
    };

    $scope.init = function () {
        ionicTimePicker.openTimePicker(ipObj1);
    }

    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + this.getSeconds();
    }
    $scope.currentTime = new Date().timeNow();

    var timer = $interval(function () {
        var currentTime = new Date();
        var currentHour = currentTime.getHours();
        var currentMinute = currentTime.getMinutes();
        var currentSecond = currentTime.getSeconds();
        //console.log(dataService.getAlarmTime().getMinutes());
        //console.log("currentMinute " + currentMinute);

        if ((currentMinute === dataService.getAlarmTime().getMinutes()) && !dataService.getAlarmTrigger()) {
            dataService.setAlarmTrigger(true);
            //console.log("hit " + currentMinute);

            // Fetch the data from the public API through JSONP.
            // See http://openweathermap.org/API#weather.

            var url = 'http://api.openweathermap.org/data/2.5/weather?q=nanjing,cn&appid=a3d8211a84683044c29515ead39fff2b';
            $http.jsonp(url, {
                params: {
                    q: $scope.city,
                    callback: 'JSON_CALLBACK'
                }
            }).success(function (data, status, headers, config) {
                //console.log(data.weather[0].main);
                //console.log(dataService.setWeather(data.weather[0].main));
                //alert(dataService.setWeather(data.weather[0].main));
                $ionicPlatform.ready(function () {
                    $cordovaBluetoothSerial.write(JSON.stringify(dataService.setWeather(data.weather[0].main)), function () {
                    }, function () {
                    });
                    //alert("done");
                })
            }).error(function (data, status, headers, config) {
                // Log an error in the browser's console.
                //$log.error('Could not retrieve data from ' + url);
                alert("fail");
            });
        }
    }, 1000);
})

app.controller('weatherCtrl', ['$scope', 'dataService', '$rootScope', '$http', '$log', '$ionicPlatform', '$cordovaBluetoothSerial', function ($scope, $rootScope, dataService, $http, $log, $ionicPlatform, $cordovaBluetoothSerial) {
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

    $scope.getWeather = function () {
        // Fetch the data from the public API through JSONP.
        // See http://openweathermap.org/API#weather.

        $scope.city = 'nanjing, cn';
        var url = 'http://api.openweathermap.org/data/2.5/weather?q=nanjing,cn&appid=a3d8211a84683044c29515ead39fff2b';
        $http.jsonp(url, {
            params: {
                q: $scope.city,
                callback: 'JSON_CALLBACK'
            }
        }).success(function (data, status, headers, config) {
            $scope.place = data.name + ", " + data.sys.country;
            $scope.main = data.weather[0].main;
            //dataService.setWeather($scope.main);
            $scope.description = data.weather[0].description;
            $scope.Sunrise = timeCon(data.sys.sunrise);
            $scope.Sunset = timeCon(data.sys.sunset);
        }).error(function (data, status, headers, config) {
            // Log an error in the browser's console.
            $log.error('Could not retrieve data from ' + url);
        });
    }

    $scope.work = function () {
        $scope.w = {"r": 255, "g": 255, "b": 255, "a": 0};
        $cordovaBluetoothSerial.write(JSON.stringify($scope.w), function () {
        }, function () {
        });
    }
    $scope.clam = function () {
        $scope.c = {"r": 255, "g": 205, "b": 157, "a": 0};
        $cordovaBluetoothSerial.write(JSON.stringify($scope.c), function () {
        }, function () {
        });
    }
    $scope.bed = function () {
        $scope.b = {"r": 51, "g": 39, "b": 28, "a": 0};
        $cordovaBluetoothSerial.write(JSON.stringify($scope.b), function () {
        }, function () {
        });
    }


}])

//
// app.controller('paletteCtrl', ['$scope', 'dataService', '$rootScope', '$http', '$log', '$ionicPlatform', '$cordovaBluetoothSerial', function ($scope, $rootScope, dataService, $http, $log, $ionicPlatform, $cordovaBluetoothSerial) {
//
//     alert("ddd2");
//
//     $scope.color = function () {
//         alert("sada");
//     }
// }]);
