// Castro: Screen*cast ro*bot
// Copyright (c) 2014 Jason Huggins <jrhuggins@gmail.com>
// License: MIT

// TODO:
// Custom recording rect
// Handle pause/restart

var $ = require('NodObjC');
$.framework('AVFoundation');
$.framework('Foundation');

var Castro = function(){
    this._started = false;
    this._used = false;
    this.pool = $.NSAutoreleasePool('alloc')('init');

    this.session = $.AVCaptureSession('alloc')('init');

    // Set the main display as capture input
    this.displayId = $.CGMainDisplayID();
    this.input = $.AVCaptureScreenInput('alloc')('initWithDisplayID', this.displayId);
    if (this.session('canAddInput', this.input)) {
        this.session('addInput', this.input);
    }

    // Set a movie file as output
    this.movieFileOutput = $.AVCaptureMovieFileOutput('alloc')('init');
    if (this.session('canAddOutput', this.movieFileOutput)) {
        this.session('addOutput', this.movieFileOutput);
    }

    this.session('startRunning');
    this.setLocation();
}

Castro.prototype = {

    // Set recording file location
    setLocation: function(path) {
        // TODO: Does file exist at the file location path? If so, do something about it...
        //var defaultManager = $.NSFileManager('alloc')('init')
        //if (defaultManager('fileExistsAtPath',NSlocation)) {
        //    console.log("File already exists!")
        //}

        if (!path){
            // Default Destination: e.g. "/Users/hugs/Desktop/Castro_uul3di.mov"
            var homeDir =  $.NSHomeDirectory();
            var desktopDir = homeDir.toString() + '/Desktop/';
            var randomString = (Math.random() + 1).toString(36).substring(12);
            var filename = 'Castro_' + randomString + '.mp4';
            this.location = desktopDir + filename;
        } else {
            // TODO: Make sure path is legit.
            this.location = path;
        }
        this.NSlocation = $.NSString('stringWithUTF8String', this.location);
        this.NSlocationURL = $.NSURL('fileURLWithPath', this.NSlocation);
    },

    // Start recording
    start: function() {
        if (!this._started) {
            if (!this._used) {
                this.movieFileOutput('startRecordingToOutputFileURL', this.NSlocationURL,
                                     'recordingDelegate', this.movieFileOutput);
                this._started = true;
            } else {
                throw new Error("Recording has completed. To make a new recording, create a new Castro object.");
            }
        } else {
            throw new Error("A recording is already in progress.");
        }
    },

    // Stop recording
    stop: function() {
        if (!this._used) {
            if (this._started) {
                this.movieFileOutput('stopRecording');
                this.pool('drain');
                this._started = false;
                this._used = true;
                return this.location;
            } else {
                throw new Error("Try starting it first!");
            }
        } else {
            throw new Error("Recording has completed. To make a new recording, create a new Castro object.");
        }
    },

    test: function() {
        console.log("Castro will record the main display for 10 seconds...");

        console.log("Now starting...");
        this.start();


        setTimeout(function(_this){
            console.log("Now stopping...");
            _this.stop();

            console.log("File location:");
            console.log(_this.location);
        }, 10*1000, this);
    }
}

module.exports.Castro = Castro;
