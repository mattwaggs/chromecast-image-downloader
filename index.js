#!/usr/bin/node

var fs              = require('fs');
var path            = require('path');
var imageFetcher    = require('chromecast-image-fetcher');
var commandLineArgs = require('command-line-args');
var request         = require('request');

const optionDefinitions = [
    { name: 'output-dir', alias: 'o', type: String, defaultOption: './images'},
    { name: 'remove-previous', alias: 'r', type: Boolean, defaultOption: false}
];

const options = commandLineArgs(optionDefinitions);

var mkdirIfNotExists = function(path, clearIfNotEmpty) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if(e.code == 'EEXIST') {
            if(clearIfNotEmpty) {
                fs.rmdirSync(path);
                fs.mkdirSync(path);
            }
        }else{
            throw e;
        }
    }
};

var download = function(url, outputFolder, done) {
    const fileName = extractNameFromUrl(url);
    const fileOutputName = path.join(outputFolder, fileName);
    request(url).pipe(fs.createWriteStream(fileOutputName)).on('close', function() {
        console.log('downloaded: ' + fileOutputName);
        done();
    });
};

var extractNameFromUrl = function(url) {
    var beginIndex = url.lastIndexOf('/');
    var endIndex = url.length;
    return url.substr(beginIndex+1, endIndex - beginIndex);
};

imageFetcher.fetchImages(function(err, images) {
    if(err) throw err;

    var outputFolder = options['output-dir'];
    if(!outputFolder.startsWith('/')) {
        outputFolder = path.join(__dirname, outputFolder);
    }
    
    mkdirIfNotExists(outputFolder, options['remove-previous']);
    
    for(var i = 0; i < images.length; i++) {
        download(images[i].url, outputFolder, function() {});
    }
    
});
