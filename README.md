Castro
===========

Screen recording library for Node

## Awesome features!

- Uses the [AV Foundation framework](https://developer.apple.com/av-foundation/) to record the highest-quality video you possibly could record. 

- Records in the popular MPEG-4 file format.

- Simple API. Start and stop -- that's all you need to know!

- Testing friendly. Combine with app automation tools like [Appium](http://appium.io/) or [Selenium](http://docs.seleniumhq.org/) to record movies of your tests. Screen recordings can be useful for debugging test failures.  

- Open source. (MIT License)


## Install

    npm install castro

## Example usage

    castro = require('castro')
    movie = new castro.Castro()
    movie.start()
    // Do something awesome
    movie.stop()

## Where's my movie?

Movies are stored on the Desktop...
   
    > movie.location
    '/Users/hugs/Desktop/Castro_5wmi.mp4'
    
    In other words:
    '<home>/Desktop/Castro_<short_random_string>.mp4'

... but you can change the location before you start recording.

    > movie = new castro.Castro()
    > movie.setLocation('/Users/me/epic-movies/totes-epic.mp4')
    > movie.start()

## Requirements

Castro was created with:

    $ node -v
    v0.10.25
    
    $ sw_vers
    ProductName:    Mac OS X
    ProductVersion: 10.9.2
    BuildVersion:   13C64

*Only works on OS X for now.*

## Example movies recorded with Castro
  
[![Castro](https://s3.amazonaws.com/castro-screencasts/hi-castro-medium.png "hi, castro")](http://youtu.be/0qdPCl4TFt8)
  
- Movie recorded with Castro

  + [Original (mp4, 3.9 MB)](https://s3.amazonaws.com/castro-screencasts/Castro_h41jor.mp4) 
  + [YouTube](http://youtu.be/0qdPCl4TFt8)

- Using Castro to make the above movie

  + [Original (mp4, 14.4 MB)](https://s3.amazonaws.com/castro-screencasts/Castro_8jv2t9.mp4)
  + [YouTube](http://youtu.be/PAYoa9fglMk) 
  
  (Yes, you can have two Castro movies recording at the same time!)


