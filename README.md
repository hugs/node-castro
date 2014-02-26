Castro
===========

A screen recording library for Node


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

## Example movies recorded with Castro
  
- [Movie recorded with Castro](https://s3.amazonaws.com/castro-screencasts/Castro_h41jor.mp4) (mp4, 3.9 MB)

- [Using Castro to make the above movie.](https://s3.amazonaws.com/castro-screencasts/Castro_8jv2t9.mp4) (mp4, 14.4 MB) Yes, you can have two Castro movies recording at the same time!
