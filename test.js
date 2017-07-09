const markdownBlocks = require('./index.js');
const fs = require('fs');

fs.readFile('./testMarkdown.md', (err, data) => {
    if (err) {
        console.log('file read error');
        return;
    }
    const mdString = data.toString();
    const htmlString = markdownBlocks(mdString);
    console.log(mdString);
    console.log('--------------------');
    console.log(htmlString);
});
