
module.exports = [
    { 
        name: 'output-dir',
        alias: 'o', 
        type: String, 
        defaultValue: './images',
        description: 'The directory to put the downloaded images in.'
    },
    { 
        name: 'remove-previous',
        alias: 'r', 
        type: Boolean, 
        defaultValue: false,
        description: 'Deletes any images that may have been left in this directory.'
    },
    { 
        name: 'help',
        alias: 'h', 
        type: Boolean, 
        defaultValue: false,
        description: 'Print command usage.'
    }
];
