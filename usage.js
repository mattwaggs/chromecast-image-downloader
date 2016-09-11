var getUsage = require('command-line-usage');
var options = require('./options');

const sections = [
    {
        header: 'chromecast-image-downloader',
        content: 'Downloads backdrop images used by the Google Chromecast to a specified folder.'
    },
    {
        header: 'Options',
        optionList: options
    },
    {
        content: 'Project home: [underline]{https://github.com/mattwaggs/chromecast-image-downloader}'
    }
];

module.exports = sections;
