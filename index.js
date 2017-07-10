const markdown = require('markdown').markdown;
const ld = require('lodash');

function parser (markdownString) {
    const basicHTML = markdown.toHTML(markdownString);
    return blockParser(basicHTML);
}

function blockParser (basicHTML) {
    const regex = /^(<p>)((!+)#)(\[.*\])((\(.*\))?)(<\/p>)[\n+]/gum;
    const regexOutput = [];
    let match;
    while ((match = regex.exec(basicHTML))) {
        regexOutput.push(match);
    }
    const matchesArray = parseRegexOutput(regexOutput);
    if (matchesArray.length === 0) {
        return basicHTML;
    }
    return parseToHTML(basicHTML, matchesArray);
    // return regex.exec(basicHTML);
}

function parseRegexOutput (regexMatches) {
    const matchesArray = [];
    for (let i in regexMatches) {
        const match = regexMatches[i];
        const elementDetails = match[4].replace('[', '').replace(']', '').split('.');
        let attributes = [];
        if (match[5] && match[5] !== '') {
            match[5].replace(/[()]/g, '').split(',').forEach(d => {
                attributes.push(ld.unescape(d));
            });
        }
        matchesArray.push({
            fullMatch: match[0],
            blockLevel: match[3].length,
            elementName: elementDetails.shift(),
            classes: elementDetails,
            attributes: attributes,
            index: match.index
        });
    }
    return matchesArray;
}

function parseToHTML (basicString, matchesArray, index = 0) {
    let resultString = '';
    const match = matchesArray[index];
    const nextMatch = (index + 1 < matchesArray.length) ? matchesArray[index + 1] : { blockLevel: match.blockLevel, index: basicString.length };
    if (index === 0 && match.index !== 0) {
        // If there is text at the begining without a block
        // Just add it plainly to the resultString
        resultString = basicString.substring(0, match.index);
    }

    const innerString = basicString.substring(match.index + match.fullMatch.length, nextMatch.index);
    const classString = match.classes.join(' ');
    const attributesString = match.attributes.join(' ');

    if (nextMatch.blockLevel <= match.blockLevel) {
        // That's it… just add this to result string
        resultString += `<${match.elementName} class="${classString}">${innerString}</${match.elementName}>`;
    } else if (nextMatch.blockLevel > match.blockLevel) {
        // There are nested blocks
        const nestedString = parseToHTML(basicString, matchesArray, index + 1);

        resultString += `<${match.elementName} class="${classString}" ${attributesString}>${innerString} ${nestedString}</${match.elementName}>`;
    }

    return resultString;
}

module.exports = parser;
