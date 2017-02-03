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

function getNSURL(path) {
    const NSlocation = $.NSString('stringWithUTF8String', path);
    return $.NSURL('fileURLWithPath', NSlocation);
}

class Castro extends EventEmmiter {
    constructor() {
        super();
        this._started = false;

        this.session = $.AVCaptureSession('alloc')('init');

        // Set the main display as capture input
        this.displayId = $.CGMainDisplayID();

        this.input = $.AVCaptureScreenInput('alloc')('initWithDisplayID', this.displayId);
        this.output = $.AVCaptureMovieFileOutput('alloc')('init');

        if (this.session('canAddInput', this.input)) this.session('addInput', this.input);
        if (this.session('canAddOutput', this.output)) this.session('addOutput', this.output);

        const Delegate = $.NSObject.extend('AVCaptureFileOutputRecordingDelegate');
        Delegate.addMethod('captureOutput:didStartRecordingToOutputFileAtURL:fromConnections:', 'v@:@@@', () => {
            this.emit('didStartRecording');
        });
        Delegate.addMethod('captureOutput:willFinishRecordingToOutputFileAtURL:fromConnections:error:', 'v@:@@@@', () => {
            this.emit('willFinishRecording');
        });
        Delegate.register();
        this.delegate = Delegate('alloc')('init');

        this.session('startRunning');
    }

    start(videoLocation, rect, captureMouseClicks, scaleFactor) {
        const cropRect = checkRect(rect) ? $.CGRectMake(rect.x, rect.y, rect.w, rect.h) : null;

        if (captureMouseClicks) this.input('setCapturesMouseClicks', true);
        if (cropRect)           this.input('setCropRect', cropRect);
        if (scaleFactor)        this.input('setScaleFactor', scaleFactor);

        this.pool = $.NSAutoreleasePool('alloc')('init');

        if (this._started) throw new Error('A recording is already in progress.');

        this.output(
            'startRecordingToOutputFileURL', getNSURL(videoLocation),
            'recordingDelegate', this.delegate
        );
        this._started = true;
    }

    stop() {
        if (!this._started) throw new Error('Video did not start recording.');

        this.output('stopRecording');
        this.pool('drain');
        this._started = false;

        return this.location;
    }
}

module.exports = Castro;
module.exports.Castro = Castro;
