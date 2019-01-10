# SLApp-Ionic-v1

## Introduction

This repo is the software part of an intelligent lighting system for family use, which was run on an ESP8266-Arduino board with Android 4.4.
It's a fork of https://github.com/w-zx/LightIntel

Here is a simple *demo*:

![Demo](http://ww3.sinaimg.cn/mw690/a60a3287jw1f56m6vacwyg208t0g9tsf.gif)

It was a Hybrid app based on Ionic-V1, which is a great platform with swift development ability and rich tool chains for debugging. It is also a practise of Google Angular framework with Ionic.

As for the hardware part, 
[![Demo video WebClient](https://j.gifs.com/kRPrzN.gif)](https://youtu.be/rc6QVHKAXBs)
[![Demo video Apple Homekit integration](https://j.gifs.com/gJP2o6.gif)](https://youtu.be/4JnGXZaPnrw)


## How to use

You must have the following dependency installed first:

- Ionic + Cordova `$ npm install -g ionic cordova`

- Install modules `npm install`

- [ngCordova](http://ngcordova.com)

and then install MQTT plugin with:

`$ ionic cordova plugin add https://github.com/arcoirislabs/cordova-plugin-mqtt.git`

add a platform with:

`$ ionic cordova platform add android`

and then test the result with:

`$ ionic cordova run android -device`

or

`$ ionic serve`

## License

MIT License
