#!/usr/bin/node

var fs                 = require('fs');
var path               = require('path');
var request            = require('request');
var imageFetcher       = require('chromecast-image-fetcher');
var commandLineArgs    = require('command-line-args');
var ProgressBar        = require('progress');
var getUsage           = require('command-line-usage');

var usage              = require('./usage');
var fileUtils          = require('./fileUtils');
var optionsDefinitions = require('./options');

var options = commandLineArgs(optionsDefinitions);

if(options.help) {
    return console.log(getUsage(usage));
}
    
var download = function(url, destinationFolder, done) {
    const fileOutputName = path.join(destinationFolder, extractNameFromUrl(url));
    request(url).pipe(fs.createWriteStream(fileOutputName))
        .on('close', () => done(null, fileOutputName))
        .on('error', (err) => done(err, null));
};

var extractNameFromUrl = function(url) {
    var beginIndex = url.lastIndexOf('/');
    return url.substr(beginIndex+1, url.length - beginIndex);
};


imageFetcher.fetchImages(function(err, images) {
    if(err) throw err;

    var outputFolder         = options['output-dir'];
    var shouldRemovePrevious = options['remove-previous'];
    
    console.log('Found ' + images.length + ' new images.');
    console.log('Output Destination: ' + outputFolder);
    console.log('Remove Old Images: ' + shouldRemovePrevious);
    console.log('');
    var bar = new ProgressBar('Downloading images [:bar] :percent :etas', {total: images.length, incomplete: ' ', width: 20});
    
    if(!outputFolder.startsWith('/')) {
        outputFolder = path.join(__dirname, outputFolder);
    }

    fileUtils.mkdirIfNotExists(outputFolder, shouldRemovePrevious);

    function callback(err, outfileName) {
        bar.tick();        
        if(bar.complete) {
            console.log('\nDone.\n');
        }
    }
    
    for(var i = 0; i < images.length; i++) {
        download(images[i].url, outputFolder, callback);
    }

});
