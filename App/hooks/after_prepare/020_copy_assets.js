#!/usr/bin/env node

// Files to be copied, with source and destination
var fs = require('fs');

var drawableDir = './platforms/android/res/drawable';
if (!fs.existsSync(drawableDir)){
    fs.mkdirSync(drawableDir);
}
var ncp = require('ncp').ncp,
    transfers = [{
        'source': './hooks/android/release-signing.properties',
        'destination': './platforms/android/release-signing.properties'
    },{
        'source': './hooks/android/debug-signing.properties',
        'destination': './platforms/android/debug-signing.properties'
    },{
        'source': './hooks/android/gradle.properties',
        'destination': './platforms/android/gradle.properties'
    },{
        'source': './hooks/android/production.keystore',
        'destination': './platforms/android/production.keystore'
    }];

ncp.limit = 16;

transfers.forEach(function(transfer) {
    ncp(transfer.source, transfer.destination, function(err) {
        if (err) {
            return console.error(err);
        }
        console.log('====== Assets moved from ' + transfer.source + ' to ' + transfer.destination + ' ======');
    });
});
