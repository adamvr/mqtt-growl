# mqtt-growl

A simple little app that subscribes to a given list of mqtt topics
on the specified broker and generates a growl notification whenever
a message arrives

## dependencies

[mqtt.js](http://github.com/adamvr/MQTT.js)
[node-growl](http://github.com/visionmedia/node-growl)
[optimist](http://github.com/substack/optimist)

## todo

Notifications on growl servers other than localhost

## Known problems

Tends to crash on very busy mqtt brokers (such as test.mosquitto.org).
This is likely due to node-growl spawning a bunch of processes.
The stop gap solution is the -d parameter, which allows node-growl
to spawn a process only ever x milliseconds.
