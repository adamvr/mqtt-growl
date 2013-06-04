#!/usr/bin/env node

var mqtt = require('mqtt')
  , growl = require('growl')
  , optimist = require('optimist')
  , _ = require('underscore')
  , util = require('util');

var argv = optimist
  .usage('mqtt-growl: receive growl notifications on mqtt messages\n \
    Usage: mqtt-growl -p <port> -h <host> -t <topics>')
  .options('h', {
      describe: 'broker host name'
    , default: 'localhost'
    , alias: 'host'
  })
  .options('p', {
      describe: 'broker port'
    , default: 1883
    , alias: 'port'
  })
  .options('t', {
      describe: 'topics to monitor, comma separated'
    , demand: true
    , alias: 'topics'
  })
  .options('d', {
      describe: 'Number of milliseconds to delay between message notifications'
    , default: 0
    , alias: 'delay'
  })
  .argv;

var topics = argv.t.split ? argv.t.split(',') : false
  , host = argv.h
  , delay = argv.d
  , port = argv.p;

if (!topics) {
  optimist.showHelp();
  process.exit(1);
}

var debug_on = process.env['debug'] || process.env['DEBUG'] || false;

function debug () {
  arguments[0] = util.format(
    '[mqtt-growl:%d][%s] ',
    process.pid, 
    ''+new Date()
  ) + arguments[0];
 
  if (debug_on) return console.log.apply(this, arguments);
}

growl = _.throttle(growl, delay);

var client = mqtt.createClient(port, host);

client
  .subscribe(topics, function(granted) { debug('suback', granted) })
  .on('message', function (topic, message) {
    // Escape quotes
    topic = topic.replace(/"/g, "\\\"");
    message = message.replace(/"/g, "\\\"");
    // Growl it!
    growl(message, {
        title: topic
      , image: __dirname + '/icon.png'
      , name: 'mqtt-growl'
    });
  });
