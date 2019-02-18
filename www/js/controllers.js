var app = angular.module('app.controllers', ['ionic-timepicker', 'ionic', 'ngCordova', 'app.routes', 'app.services', 'app.directives', 'firebase']);

// colorPicker start ---------
app.controller('colorPickerCtrl', function ($scope, $interval, $rootScope, dataService) {
    // Topic init

    $scope.ledTest_1 = "McLighting01/in";
    $scope.ledTest_2 = "McLighting02/in";
    $scope.ledTest_3 = "McLighting03/in";
    $scope.ledTest_4 = "McLighting04/in";

    $scope.effect = [];

    var effect_name = ["Blink", "Breath", "Color_Wipe", "Color_Wipe_Inverse", "Color_Wipe_Reverse", "Color_Wipe_Reverse_Inverse",
        "Color_Wipe_Random", "Random_Color", "Single_Dynamic", "Multi_Dynamic", "Rainbow", "Rainbow_Cycle",
        "Scan", "Dual_Scan", "Fade", "Theater_Chase", "Theater_Chase_Rainbow", "Running_Lights", "Twinkle",
        "Twinkle_Random", "Twinkle_Fade", "Twinkle_Fade_Random", "Sparkle", "Flash_Sparkle", "Hyper_Sparkle",
        "Strobe", "Strobe_Rainbow", "Multi_Strobe", "Blink_Rainbow", "Chase_White", "Chase_Color", "Chase_Random",
        "Chase_Rainbow", "Chase_Flash", "Chase_Flash_Random", "Chase_Rainbow_White", "Chase_Blackout",
        "Chase_Blackout_Rainbow", "Color_Sweep_Random", "Running_Color", "Running_Red_Blue",
        "Running_Random", "Larson_Scanner", "Comet", "Fireworks", "Fireworks_Random", "Merry_Chrismas",
        "Fire_Flicker", "Fire_Flicker(Soft)", "Fire_Flicker(intense)", "Circus_Combustus", "Halloween",
        "Bicolor_Chase", "Tricolor_Chase", "ICU"
    ];

    for (var i = 0; i < effect_name.length; i++) {
        $scope.effect.push({effectName: effect_name[i], value: i + 1})
    }

    // var payload = new Paho.MQTT.Message("=rainbow");
    // payload.destinationName = "McLighting01/in";
    // client.send(payload);

    $scope.show_Effect = function (value, value2) {

        var effect_value = "/" + value;
        var topic_name = value2;

        console.log("effect : " + effect_value + "  topic : " + topic_name);

        const payload = new Paho.MQTT.Message(effect_value);
        payload.destinationName = topic_name;
        client.send(payload);

    }


    // On/Off Switch
    $scope.switch_change = function (topic_name, switch_check) {

        var payload_code = "=off";

        if (switch_check) {
            payload_code = "/0";
        }

        const payload = new Paho.MQTT.Message(payload_code);
        payload.destinationName = topic_name;
        client.send(payload);

    }


    // realtime toggle check
    $scope.refresh = function () {
        $interval(function () {
            console.log("color picker ctrl check");
        }, 500, 1);

    }
});

// colorPicker end ---------


// side menu Controller start -------
//'dataService', '$scope', '$ionicModal', '$interval',
// app.controller('side_test', ['dataService', '$scope', '$ionicModal', '$interval', '$rootScope', 'sharedUtils','$rootScope','$ionicHistory', function (dataService, $scope, $ionicModal,
//                                                                                                                          $interval, $rootScope, $ionicSideMenuDelegate, sharedUtils, $rootScope, $ionicHistory) {

app.controller('side_test', function (dataService, $scope, $ionicModal, $interval,
                                      $rootScope, $ionicSideMenuDelegate, sharedUtils,
                                      $ionicHistory, $state, $ionicPopup, listStorage) {

    var sm = this;
    sm.connectValue = 0;

    // setting Form modal
    $ionicModal.fromTemplateUrl('settingsForm', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    })

    $rootScope.test = function () {
        sm.connectValue = 1;
        dataService.setConnectValue(sm.connectValue);
    }


    $scope.goLoginPage = function () {
        $ionicSideMenuDelegate.toggleLeft(false);
    }

    // Connect
    $rootScope.connect = function () {

        /*

        var randomCode = Math.floor((Math.random() * 5) + 1);
        client = new Paho.MQTT.Client("m15.cloudmqtt.com", 33738, "baosight");

        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        var options = {
            timeout: 3,
            useSSL: true,
            onSuccess: onConnect,
            userName: "crzllkoq",
            onFailure: doFail,
            password: "GkzF0rb1HKYf",
        };
        // console.log("TXSS",options);
        client.connect(options);

         */

        var randomCode = Math.floor((Math.random() * 5) + 1);
        client = new Paho.MQTT.Client("m15.cloudmqtt.com", 33738, "baosight");

        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        var options = {
            timeout: 3,
            useSSL: true,
            onSuccess: onConnect,
            userName: "crzllkoq",
            onFailure: doFail,
            password: "GkzF0rb1HKYf",
        };
        // console.log("TXSS",options);
        client.connect(options);

        function onConnect() {
            var message = new Paho.MQTT.Message("Mqtt success");
            message.destinationName = "mqtt/test";
            client.send(message);
            sm.connectValue = 1;
            dataService.setConnectValue(sm.connectValue);
            alert("connected");
        }

        function doFail(responseObject) {
            const alertPopup = $ionicPopup.alert({
                title: 'error',
                template: responseObject.errorMessage
            })
        }

        function onConnectionLost (responseObject) {
            if (responseObject.errorCode !== 0) {
                const alertPopup = $ionicPopup.alert({
                    title: 'Connection Lost',
                    template: responseObject.errorMessage
                })
                sm.connectValue = 0;
                dataService.setConnectValue(sm.connectValue);
            }
        }

        function onMessageArrived(message) {
            alert(message.payloadString);
        }

        $scope.refresh();
    }

        // cordova.plugins.CordovaMqTTPlugin.connect({
        //     url: "tcp://m15.cloudmqtt.com", //a public broker used for testing purposes only. Try using a self hosted broker for production.
        //     port: 13738,
        //     clientId: randomCode,
        //     connectionTimeout: 3000,
        //     willTopicConfig: {
        //         qos: 0,
        //         retain: true,
        //         topic: "ebtest",
        //         payload: "Messaggio di prova"
        //     },
        //     username: "crzllkoq",
        //     password: 'GkzF0rb1HKYf',
        //     keepAlive: 60,
        //     success: function (s) {
        //         sm.connectValue = 1;
        //         dataService.setConnectValue(sm.connectValue);
        //         alert("Connect Success!");
        //     },
        //     error: function (e) {
        //         alert('Connect error' + '<br>' + 'Error code : 001');
        //         sm.connectValue = 0;
        //         dataService.setConnectValue(sm.connectValue);
        //     },
        //     onConnectionLost: function () {
        //         console.log("disconnect");
        //         sm.connectValue = 0;
        //         dataService.setConnectValue(sm.connectValue);
        //         alert("connect error");
                // var alertPopup = $ionicPopup.alert({
                //     title: 'error',
                //     template: 'conneciton lost'
                // });
            // }
            // messageArrived : function(){
            //     console.log("message Arrived");
            // }

    // DisConnect
    $scope.disconnect = function () {

        client.disconnect();
        sm.connectValue = 0;
        dataService.setConnectValue(sm.connectValue);

        const alertPopup = $ionicPopup.alert({
            title : 'Disconnect Success',
            template : 'Client disconnected'
        });
        $scope.refresh();
    };

    //logout
    $scope.logoutEmail = function () {
        sharedUtils.showLoading();

        firebase.auth().signOut().then(function () {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                $scope.disconnect();
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {});
            }, function (error) {
                sharedUtils.showAlert("error", "Logout Failed")
            }
        )
    }


    // realtime connection check
    $scope.refresh = function () {
        $interval(function () {
            console.log("side test check");
        }, 500, 1);
    }

    $scope.test_ng = function () {
        listStorage._setToLocalStorage(null);
    }
});


app.controller("dashboardCtrl", function ($scope, listStorage, $ionicModal, $rootScope, dataService, $firebaseArray, $firebaseObject, $ionicHistory, $ionicSideMenuDelegate, sharedUtils, $state) {


// control room refresh
    firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $ionicSideMenuDelegate.canDragContent(false);
                $rootScope.extras = true;
                dataService.setUserInfo(user);
                sharedUtils.hideLoading();
                $state.go('tabsController.colorPicker', {});
                // var user = dataService.getUserInfo();

                var ref = firebase.database().ref('LED Control List / ' + user.uid);
                $scope.list = $firebaseArray(ref);

                // data read (cloud -> local)
                $scope.list.$loaded().then(function () {
                    var local_list = [];
                    for (let i = 0; i < $scope.list.length; i++) {
                        var insertList = {
                            title: $scope.list[i]["title"],
                            href_link: $scope.list[i]["href_link"]
                        };
                        local_list.push(insertList);
                    }
                    listStorage._setToLocalStorage(local_list);
                })

            } else {
                dataService.setUserInfo(null);
            }
        }
    );

    // test button
    $scope.loginRefresh = function () {
    }

    $scope.addList = function (href_value) {
        // need arrangement
        const check_obj = document.getElementById("list");
        const titleNames = check_obj[0].value.trim();

        const local_Lists = listStorage.get();
        var duplication_check = true;

        for (let i = 0; i < local_Lists.length; i++) {
            if (href_value === local_Lists[i]["href_link"]) {
                duplication_check = false;
            }
        }

        if (titleNames.length !== 0) { // titleName null check
            if ($scope.list.length < 4) { // control room full check
                if (duplication_check) { // duplication topic check
                    var insertList = {
                        title: titleNames,
                        href_link: href_value,
                        // subtitle: "go"
                    };
                    local_Lists.push(insertList);

                    $scope.list.$add({
                        title: insertList.title,
                        href_link: insertList.href_link,
                        // link_title: insertList.subtitle
                    }).then(function (ref) {
                        let id = ref.key;
                        console.log(id);
                        $scope.list.$indexFor(id);
                    });

                    listStorage._setToLocalStorage(local_Lists);

                } else {
                    alert("already topic checked");
                }
            } else {
                alert("stack is full");
            }
        } else {
            alert("text is empty.");
        }
        $scope.modal.listTitle = "";
        $scope.modal.hide();
    };

    $scope.remove = function (list) {

        // 정리 필요
        const list_id = $scope.list.$keyAt(list);
        const list_number = $scope.list.$indexFor(list_id);
        var local_list = listStorage.get();

        // return;
        $scope.list.$remove(list)
            .then(function (ref) {
                // localStorage section
                local_list.splice(list_number, 1);
                listStorage._setToLocalStorage(local_list);
            });
    };

    // room create modal
    $ionicModal.fromTemplateUrl('createForm', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;

    });

});

app.controller('loginCtrl', function ($scope, $rootScope, $ionicHistory, $state, sharedUtils, $ionicSideMenuDelegate, dataService) {


    // var client = new Paho.MQTT.Client("m15.cloudmqtt.com", 33798,"baosight");
    var client;

    $scope.$on('$ionicView.enter', function (ev) {
        if (ev.targetScope !== $scope) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        }
    })

    // session check (login section)
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $ionicSideMenuDelegate.canDragContent(false);
            $rootScope.extras = true;
            // connect
            $rootScope.connect();
            dataService.setUserInfo(user);
            sharedUtils.hideLoading();
            $state.go('tabsController.colorPicker', {});
        } else {
            dataService.setUserInfo("test");
        }
    });

    //login check ( additional -> connect function)
    $scope.loginsEmail = function (formName, cred) {

        if (formName.$valid) {
            //login --> connect
            // 1.login
            sharedUtils.showLoading();
            firebase.auth().signInWithEmailAndPassword(cred.email, cred.password).then(function (result) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $rootScope.extras = true;
                    // 2. connect
                    $rootScope.connect();
                    sharedUtils.hideLoading();
                    $state.go('tabsController.colorPicker', {});
                },
                function (error) {
                    sharedUtils.hideLoading();
                    sharedUtils.showAlert("check", "Authientication Error");
                }
            )
        } else {
            alert("error");
        }
    }

    $scope.testConnect = function (formName, cred) {
        // sharedUtils.showLoading();
        // firebase.auth().signInWithEmailAndPassword(cred.email, cred.password).then(function (result) {
        //         $ionicHistory.nextViewOptions({
        //             historyRoot: true
        //         });
        //         sharedUtils.hideLoading();
        //     },
        //     function (error) {
        //         sharedUtils.hideLoading();
        //         sharedUtils.showAlert("check", "Authientication Error");
        //     }
        // )

        console.log("start");

        var randomCode = Math.floor((Math.random() * 5) + 1);
        client = new Paho.MQTT.Client("m15.cloudmqtt.com", 33738, "baosight");

        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        var options = {
            timeout: 3,
            useSSL: true,
            onSuccess: onConnect,
            userName: "crzllkoq",
            onFailure: doFail,
            password: "GkzF0rb1HKYf",
        };
        // console.log("TXSS",options);
        client.connect(options);

        function doFail(responseObject) {
            alert("fail" + responseObject.errorMessage);
        }

        function onConnect() {
            alert("connected.");
            var message = new Paho.MQTT.Message("Hello");
            message.destinationName = "mqtt/test";
            client.send(message);
            console.log(client);
        }

        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost : " + responseObject.errorMessage);
            }
        }

        function onMessageArrived(Message) {
            alert(message.payloadString);
        }
    }

    $scope.on = function () {
        var payload = new Paho.MQTT.Message("=rainbow");
        payload.destinationName = "McLighting01/in";
        client.send(payload);
    }

    $scope.testLogout = function () {
        // sharedUtils.showLoading();
        //
        // firebase.auth().signOut().then(function () {
        //         $ionicHistory.nextViewOptions({
        //             historyRoot: true
        //         });
        //         sharedUtils.hideLoading();
        //         alert("Logout success");
        //     }, function (error) {
        //         sharedUtils.showAlert("error", "Logout Failed")
        //     }
        //)
    }

    $scope.userTest = function () {
        var payload = new Paho.MQTT.Message("=rainbow");
        payload.destinationName = "McLighting01/in";
        client.send(payload);
    }


})


app.controller('signupCtrl', function ($scope, $rootScope, sharedUtils, $ionicHistory, $ionicSideMenuDelegate, $state) {

    $scope.signupEmail = function (formName, cred) {
        if (formName.$valid) {
            sharedUtils.showLoading();
            firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function (result) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $ionicSideMenuDelegate.canDragContent(false);
                    $rootScope.extras = true;
                    sharedUtils.hideLoading();
                    $state.go('tabsController.colorPicker', {});
                }, function (error) {
                    sharedUtils.hideLoading();
                    sharedUtils.showAlert('sing up error');
                }
            )
        } else {
            sharedUtils.showAlert('value error');
        }
    }
})

app.controller('remoteCtrl', function ($scope, $ionicPopup, listStorage) {

    // 다시 테스트

    // const remote_control_value = 4;
    // $scope.re = [];
    //
    // for (let i = 1; i < remote_control_value ; i++){
    //     let list = {
    //         toggle_name : 'switch0' + i,
    //         model_name : "remote_swtich0" + i,
    //         value : "0"+i
    //     }
    //     $scope.re.push(list);
    // }


    // 갯수만큼 가져오게 x
    // disabled
    // $scope.list = listStorage.get();



    $scope.remote_Switch = function (switch_value) {

        const front_name = "McLighting0";
        const last_name = "/in";
        const hex_code = "#FFFFFF";

        var payload_code = "=off";

        if (switch_value) {
            payload_code = "/0";
        }



        // var payload = new Paho.MQTT.Message("=rainbow");
        // payload.destinationName = "McLighting01/in";
        // client.send(payload);


        // need changed logic
        for (let i = 0; i < $scope.list.length; i++) {
            cordova.plugins.CordovaMqTTPlugin.publish({
                topic: front_name + (i + 1) + last_name,
                payload: payload_code,
                qos: 0,
                retain: false,
                success: function (s) {
                },
                error: function (e) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'error occurred',
                        template: 'Remote Switch Error  Error code : 409'
                    });
                }
            })
        }

        // white change
        if (payload_code === "/0") {
            for (let i = 0; i < $scope.list.length; i++) {
                cordova.plugins.CordovaMqTTPlugin.publish({
                    topic: front_name + (i + 1) + last_name,
                    payload: hex_code,
                    qos: 0,
                    retain: false,
                    success: function (s) {
                    },
                    error: function (e) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'error occurred',
                            template: 'Remote Switch Error Error code : 410'
                        })
                    }
                })
            }
        }
    }


})

// tabs loginCheck
app.controller('tabsCtrl', function ($scope, $rootScope) {

    $scope.login_check = function (test) {
        if ($rootScope.extras) {
            window.location.href = test;
        } else {
            alert("Please login in Firebase")
        }
    }
})


// -------------- color control start  ----------------

    .controller('ColorCtrl', ['$ionicPopup', '$scope', 'dataService', '$rootScope', '$ionicPlatform', '$cordovaBluetoothSerial', '$ionicModal', '$firebaseArray', function ($ionicPopup, $scope, dataService, $rootScope, $ionicPlatform, $cordovaBluetoothSerial, $ionicModal, $firebaseArray) {
        var vm = this;
        vm.testColors = '';

        var red = 0;
        var green = 0;
        var blue = 0;
        var color = document.getElementById('color-temp');

        // rgb slider control function....

        $scope.set = function (value) {

            var topic_name = value;

            console.log("topic : " + topic_name);

            // Convert to HEXcode
            if ($scope.connectCheck()) {

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


                // var payload = new Paho.MQTT.Message("=rainbow");
                // payload.destinationName = "McLighting01/in";
                // client.send(payload);

                const payload = new Paho.MQTT.Message(vm.hexCode);
                payload.destinationName(topic_name);
                client.send(payload);


            } else {
                alert("Check your network connection status error code : 404");
            }

        };

        // bright control function...

        $scope.brightdrag = function (value, value2) {

            var brightness_value = "%" + value;
            var topic_name = value2;

            console.log("bright : " + brightness_value + "   topic : " + value2);

            const payload = new Paho.MQTT.Message(brightness_value);
            payload.destinationName(topic_name);
            client.send(payload);

        };

        // speed Control function...

        $scope.speed_check = function (value, value2) {

            var speed_value = "?" + value;
            var topic_name = value2;

            console.log("speed : " + speed_value + "topic : " + topic_name);


            const payload = new Paho.MQTT.Message(speed_value);
            payload.destinationName(topic_name);
            client.send(payload);
        };

        // Color Picker function...

        $scope.palette_color = function (hexCode, value) {

            // bright 255 fix
            var brightness_value = "%255";
            // topic name var
            var topic_name = value;

            console.log("bright : " + brightness_value + "topic : " + topic_name);

            var arrayload = {hexCode,brightness_value};

            for (let i = 0 ; i < arrayload ; i++){
                const payload = new Paho.MQTT.Message(arrayload[i]);
                payload.destinationName(topic_name);
                client.send(payload);
            }
        };

        // static , blink
        $scope.color_change_test = function (value, value2) {

            var color_value = "/" + value;
            var topic_name = value2;

            console.log("color : " + color_value + "topic : " + topic_name);

            const payload = new Paho.MQTT.Message(color_value);
            payload.destinationName(topic_name);
            client.send(payload);

        }

        // temperature rgb
        $scope.drag = function (value, value2) {

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
                if (green < 0) {
                    green = 0;
                }
                green = -155.25485562709179 - 0.44596950469579133 * green + 104.49216199393888 * Math.log(green);

                if (green < 0) {
                    green = 0;
                }
                if (green > 255) {
                    green = 255;
                }

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

            var rgb_array = [$scope.rgb.r, $scope.rgb.g, $scope.rgb.b];
            var hexcode = "#";
            var topic_name = value2;


            //console.log
            console.log("range : " + $scope.rangeValue + "  topic : " + topic_name);

            for (var i = 0; i < rgb_array.length; i++) {
                if (rgb_array[i] < 16) {
                    hexcode += 0 + rgb_array[i].toString(16);
                } else {
                    hexcode += rgb_array[i].toString(16);
                }
            }
            Cordova_connect(hexcode, topic_name);
        }


        function Cordova_connect(hex_code, topic_name) {
            const payload = new Paho.MQTT.Message(hex_code);
            payload.destinationName(payload);
            client.send(payload);
        };


        // Color Picker Method
        $ionicModal.fromTemplateUrl('colorPalette', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });


        $scope.connectCheck = function () {

            var connectValue = dataService.getConnectValue();
            console.log(" connection value : " + connectValue);
            var flag = true;

            if (connectValue !== 1) {
                flag = false;
            }
            return flag;
        }

        // $scope.firebase_test = function(test){
        //
        //     var newPostKey = firebase.database().ref().child('posts').push().key;
        //
        //     var postData = {
        //         test_1 : newPostKey,
        //         test_2 : "test eng",
        //         test_3 : "test 한국어",
        //         test_date : Date.now()
        //     };
        //
        //     var updates = {};
        //     updates['/board/' + newPostKey ] = postData;
        //     firebase.database().ref().update(updates);


        // const ref = firebase.database().ref();
        //
        // $scope.messages = $firebaseArray(ref);
        //
        // $scope.messages.$add({
        //     user : 'Guest',
        //     message : test
        // });

        // }


    }]);
