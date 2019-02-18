angular.module('app.services', [])
    .factory('fireBaseData', function ($firebase) {
        var ref = new Firebase("https://adept-crossing-189001.firebaseio.com/"),
            refMqtt = new Firebase("https://adept-crossing-189001.firebaseio.com/mqtt");
        return {
            ref: function () {
                return ref;
            },
            refMqtt: function () {
                return refMqtt;
            }
        }
    })

    .factory('sharedUtils', ['$ionicLoading', '$ionicPopup', function ($ionicLoading, $ionicPopup) {

        var functionObj = {};

        functionObj.showLoading = function () {
            $ionicLoading.show({
                content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
                animation: 'fade-in', // The animation to use
                showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
                maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
                showDelay: 0 // The delay in showing the indicator
            });
        };
        functionObj.hideLoading = function () {
            $ionicLoading.hide();
        };


        functionObj.showAlert = function (title, message) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: message
            });
        };

        return functionObj;

    }])

    .factory('BlankFactory', [function () {

    }])

    .service('BlankService', [function () {

    }])

    .factory('BlankFactory', [function () {

    }])

    .service('dataService', function () {
        var stringValue = 12;
        var red;
        var green;
        var blue;
        var chosenColor;
        var brightness;
        var pluseWidth;
        var alarmTime;
        var weather;
        var sunrise;
        var sunset;
        var alarmTrigger = false;
        var connectValue = 0;
        var userInfo;

        return {

            //user_info(email ... etc )
            getUserInfo: function () {
                return userInfo;
            },
            setUserInfo : function (value){
                return userInfo = value;
            },

            //connect check
            getConnectValue: function () {
                return connectValue;
            }
            ,
            setConnectValue: function (value) {
                connectValue = value;
            }
            ,
            // currentTime check
            getCurrentTime() {
                return currentTime;
            }
            ,
            setCurrentTime(value) {
                currentTime = value;
            }
            ,

            setRgb: function (value) {
                rgb = value;
            }
            ,
            getRgb: function () {
                return rgb;
            }
            ,
            getString: function () {
                return stringValue;
            }
            ,
            setString: function (value) {
                stringValue = value;
            }
            ,
            setColor: function (value) {
                chosenColor = value;
            }
            ,
            getColor: function () {
                return chosenColor;
            }
            ,
            setCountDownLight: function () {
                //chosenColor = {"r": 255, "g": 0, "b": 0, "a": 0};
                //alert("countdown")
            }
            ,
            setBrightness: function (value) {
                brightness = value;
            }
            ,
            setAlarmTime: function (value) {
                alarmTime = value;
                //alert(alarmTime);
            }
            ,
            getAlarmTime: function () {
                return alarmTime;
            }
            ,
            setAlarmTrigger: function (value) {
                alarmTrigger = value;
            }
            ,
            getAlarmTrigger: function () {
                return alarmTrigger;
            }
            ,
            setWeather: function (value) {
                if (value === "Rain") {
                    return {"r": 0, "g": 0, "b": 255, "a": 0};
                } else if (value === "Sunny") {
                    return {"r": 255, "g": 0, "b": 0, "a": 0};
                } else {
                    return {"r": 0, "g": 255, "b": 0, "a": 0};
                }
            }
            ,
            getSunrise: function () {
                return sunrise;
            }
            ,
            setSunrise: function (value) {
                sunrise = value;
            }
            ,
            getSunset: function () {
                return sunset;
            }
            ,
            setSunset: function (value) {
                sunset = value;
            }
        }
    })

    .factory('listStorage', function () {
        var list_data = "list_data";

        var storage_list = {
            lists: [],
            get: function () {
                angular.copy(storage_list._getFromLocalStorage(), storage_list.lists);
                return storage_list.lists;
            },

            _setToLocalStorage: function (data) {
                localStorage.setItem(list_data, JSON.stringify(data));
            },

            _getFromLocalStorage: function () {
                return JSON.parse(localStorage.getItem(list_data)) || [];
            },
        }
        return storage_list;
    })


