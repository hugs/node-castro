Castro
===========

A screen recording library for Node


## Install

    npm install castro

## Example usage

    > castro = require('castro')
    > movie = new castro.Castro()
    > movie.start()
    > // Do something awesome
    > movie.stop()

## Where's my movie?

Movies are stored on the Desktop...

    ~/Desktop/Castro_<short_random_string>.mp4

... but you can change the location before you start recording.

    > movie = new castro.Castro()
    > movie.setLocation('/Users/me/epic-movies/totes-epic.mp4')
    > movie.start()
