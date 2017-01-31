// Castro: Screen*cast ro*bot
// Copyright (c) 2014-2016 Jason Huggins <jrhuggins@gmail.com>
// License: MIT

// TODO:
// Custom recording rect
// Handle pause/restart
// Capture frame/screenshots: (https://developer.apple.com/library/ios/qa/qa1702/_index.html)

const EventEmmiter = require('events');
const $ = require('nodobjc');
$.framework('AVFoundation');
$.framework('Foundation');

function checkRect(rect) {
    return typeof rect === 'object' && 'x' in rect && 'y' in rect && 'w' in rect && 'h' in rect;
}

class Castro extends EventEmmiter {
    constructor(rect, captureMouseClicks, scaleFactor) {
        super();
        this._started = false;
        this._used = false;
        this.pool = $.NSAutoreleasePool('alloc')('init');

        this.session = $.AVCaptureSession('alloc')('init');

        // Set the main display as capture input
        this.displayId = $.CGMainDisplayID();

        const cropRect = checkRect(rect)
                ? $.CGRectMake(rect.x, rect.y, rect.w, rect.h)
                : null;

        this.input = $.AVCaptureScreenInput('alloc')('initWithDisplayID', this.displayId);
        this.input('setCapturesMouseClicks', !!captureMouseClicks);
        if (cropRect) {
            this.input('setCropRect', cropRect);
        }
        if (scaleFactor) {
            this.input('setScaleFactor', scaleFactor);
        }

        if (this.session('canAddInput', this.input)) {
            this.session('addInput', this.input);
        }

        // Set a movie file as output
        this.movieFileOutput = $.AVCaptureMovieFileOutput('alloc')('init');

        if (this.session('canAddOutput', this.movieFileOutput)) {
            this.session('addOutput', this.movieFileOutput);
        }

        // sampling code

        // const FileOutputDelegate = $.NSObject.extend('AVCaptureFileOutputDelegate');
        // FileOutputDelegate.addMethod('captureOutputShouldProvideSampleAccurateRecordingStart:', 'B@:@', (self, _cmd, captureOutput) => {
        //     console.log('captureOutputShouldProvideSampleAccurateRecordingStart', captureOutput)
        //     return $.YES
        // });
        // FileOutputDelegate.addMethod('captureOutput:didOutputSampleBuffer:fromConnection:', 'v@:@@@', (self, _cmd, captureOutput, didSampleBuffer, fromConnection) => {
        //     // console.log('captureOutput:didOutputSampleBuffer:fromConnection:', captureOutput, didSampleBuffer, fromConnection)
        // });
        // FileOutputDelegate.register()
        // const fileOutputDelegate = FileOutputDelegate('alloc')('init')
        // this.movieFileOutput('setDelegate', fileOutputDelegate)

        const Delegate = $.NSObject.extend('AVCaptureFileOutputRecordingDelegate');
        Delegate.addMethod('captureOutput:didFinishRecordingToOutputFileAtURL:fromConnections:error:', 'v@:@@@', () => {
            // didFinishRecordingToOutputFileAtURL never fires
            // we have to listen for willFinishRecordingToOutputFileAtURL and wait for a few s to avoid corruption of file
        });
        Delegate.addMethod('captureOutput:didStartRecordingToOutputFileAtURL:fromConnections:', 'v@:@@@', () => {
            this.emit('didStartRecording');
        });
        Delegate.addMethod('captureOutput:willFinishRecordingToOutputFileAtURL:fromConnections:error:', 'v@:@@@@', () => {
            this.emit('willFinishRecording');
        });
        Delegate.register();
        this.delegate = Delegate('alloc')('init');

        this.session('startRunning');
        this.setLocation();
    }

    // Set recording file location
    setLocation(path) {
        // TODO: Does file exist at the file location path? If so, do something about it...
        //var defaultManager = $.NSFileManager('alloc')('init')
        //if (defaultManager('fileExistsAtPath',NSlocation)) {
        //    console.log('File already exists!')
        //}

        if (!path){
            // Default Destination: e.g. '/Users/hugs/Desktop/Castro_uul3di.mov'
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
    }

    // Start recording
    start() {
        if (this._started) {
            throw new Error('A recording is already in progress.');
        }
        if (this._used) {
            throw new Error('Recording has completed. To make a new recording, create a new Castro object.');
        }
        this.movieFileOutput(
            'startRecordingToOutputFileURL', this.NSlocationURL,
            'recordingDelegate', this.delegate
        );
        this._started = true;
    }

    // Stop recording
    stop() {
        if (this._used) {
            throw new Error('Recording has completed. To make a new recording, create a new Castro object.');
        }
        if (!this._started) {
            throw new Error('Try starting it first!');
        }
        this.movieFileOutput('stopRecording');
        this.session('stopRunning');
        this.pool('drain');
        this._started = false;
        this._used = true;
        return this.location;
    }

    test() {
        console.log('Castro will record the main display for 10 seconds...');

        console.log('Now starting...');
        this.start();

        setTimeout(function(_this){
            console.log('Now stopping...');
            _this.stop();

            console.log('File location:');
            console.log(_this.location);
        }, 10*1000, this);
    }
}

module.exports = Castro;
module.exports.Castro = Castro;
