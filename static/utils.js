// utilities

function getLineByIndex(i) {
    return document.getElementsByClassName("line")[i];
}

function getOutputByIndex(i) {
    return document.getElementsByClassName("output")[i];
}

function getNumLines() {
    return document.getElementsByClassName("line").length;
}

function setFocus(i) {
    if (i < 0) {
        return;
    }
    if (i >= getNumLines()) {
        return;
    }
    getLineByIndex(i).focus();
}

function setBlur(i) {
    if (i < 0) {
        return;
    }
    if (i >= getNumLines()) {
        return;
    }
    document.getElementsByClassName("line")[i].blur();
}

function getFocusIndex() {
    for (i = 0; i < getNumLines(); i++) {
        if (document.getElementsByClassName("line")[i] === document.activeElement) {
            return i;
        }
    }
    return false;
}

// https://www.abeautifulsite.net/adding-and-removing-elements-on-the-fly-using-javascript
function deleteLine(i) {
    var elem = getLineByIndex(i)
    elem.parentNode.removeChild(elem);
    var elem = getOutputByIndex(i)
    elem.parentNode.removeChild(elem);
}

function getCursorPosition(line) {
    return line.selectionEnd;
}

function setCursorPosition(line, i) {
    line.setSelectionRange(i, i);
}

function isCursorAtStart(line) {
    return (line.selectionStart === 0);
}

function isCursorAtEnd(line) {
    return (line.selectionEnd === line.value.length);
}

function getBeforeCursor(line) {
    return line.value.slice(0, line.selectionStart);
}

function getAfterCursor(line) {
    return line.value.slice(line.selectionEnd, line.length);
}

function existsSelection(line) {
    return (line.selectionStart !== line.selectionEnd);
}

function getSelection(line) {
    return line.value.slice(line.selectionStart, line.selectionEnd);
}

function deleteSelection(line) {
    var carat = line.selectionStart;
    line.value = line.value.slice(0, line.selectionStart) + line.value.slice(line.selectionEnd, line.value.length);
    line.setSelectionRange(carat, carat);
}

// https://plainjs.com/javascript/manipulation/insert-an-element-after-or-before-another-32/
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function parseAfter(f) {
    var output = f();
    parseLines();
    return output;
}

function makeNew(i) {
    var ref = getOutputByIndex(i);

    //'<input type="text" class="line" oninput="parseLines()">'
    var newLine = document.createElement('input');
    newLine.type = "text";
    newLine.className = "line";
    newLine.addEventListener('input', parseLines, true);
    insertAfter(newLine, ref);

    //'<p class="output output-invisible"></p>'
    var newOutput = document.createElement('p');
    newOutput.className = "output output-invisible";
    insertAfter(newOutput, newLine);

    return newLine;
}