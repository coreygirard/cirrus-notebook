// parsing of actual Python code

function getLines() {
    var allLines = new Array();

    for (let line of document.getElementsByClassName("line")) {
        allLines.push(line.value);
    }

    allLines = JSON.stringify(allLines);
    allLines = encodeURIComponent(allLines);

    return allLines;
}

function renderHTML(data) {
    data = data.replace(/(\n)/g, '<br>');
    data = data.replace(/ /g, '&nbsp;');
    return data;
}

function setOutputs(data) {
    var outputs = document.getElementsByClassName("output");
    for (i = 0; i < outputs.length; i++) {
        outputs[i].innerHTML = data[i]['output'];
        if (data[i]['visible']) {
            outputs[i].className = "output output-visible";
        } else {
            outputs[i].className = "output output-invisible";
        }
        if (data[i]['error']) {
            outputs[i].className += ' error';
        }
    }
}

function setOutputVisibility() {
    var outputs = document.getElementsByClassName("output");
    for (i = 0; i < outputs.length; i++) {}
}

function parseLines() {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://127.0.0.1:5000/parse?data=' + getLines(), true);
    request.onload = function() {
        var data = JSON.parse(this.response)["data"];
        setOutputs(data);
        setOutputVisibility();
    }
    request.send();
}



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

function shiftFocusDown() {
    var i = getFocusIndex();
    if (i === false) {
        return;
    }
    if (i >= getNumLines() - 1) {
        return;
    }
    setBlur(i);
    setFocus(i + 1);
}

function shiftFocusUp() {
    var i = getFocusIndex();
    if (i === false) {
        return;
    }
    if (i <= 0) {
        return;
    }
    setBlur(i);
    setFocus(i - 1);
}

function keyLeft() {
    var i = getFocusIndex();
    if (i == 0) {
        return true;
    }

    var thisLine = getLineByIndex(i);
    var prevLine = getLineByIndex(i - 1);

    // if we have a selection
    if (existsSelection(thisLine)) {
        return true; // Don't kill normal input behavior
    }

    // if we're not at the end of the line
    if (!isCursorAtStart(thisLine)) {
        return true; // Don't kill normal input behavior
    }

    thisLine.blur();
    prevLine.focus();

    prevLine.setSelectionRange(prevLine.value.length, prevLine.value.length);
    return false;
}

function keyRight() {
    var i = getFocusIndex();
    if (i == getNumLines() - 1) {
        return true;
    }

    var thisLine = getLineByIndex(i);
    var nextLine = getLineByIndex(i + 1);

    if (thisLine.selectionStart !== thisLine.value.length) {
        return true;
    }

    thisLine.blur();
    nextLine.focus();

    nextLine.setSelectionRange(0, 0);
    return false;
}

// https://www.abeautifulsite.net/adding-and-removing-elements-on-the-fly-using-javascript
function deleteLine(i) {
    var elem = getLineByIndex(i)
    elem.parentNode.removeChild(elem);
    var elem = getOutputByIndex(i)
    elem.parentNode.removeChild(elem);
}



function isCursorAtStart(line) {
    return (line.selectionStart === 0)
}

function isCursorAtEnd(line) {
    return (line.selectionEnd === line.value.length)
}

function getBeforeCursor() {
    var line = getLineByIndex(getFocusIndex());
    return line.value.slice(0, line.selectionStart);
}

function getAfterCursor() {
    var line = getLineByIndex(getFocusIndex());
    return line.value.slice(line.selectionEnd, line.length);
}

function existsSelection(line) {
    return (line.selectionStart !== line.selectionEnd);
}

function getSelection() {
    var line = getLineByIndex(getFocusIndex());
    return line.value.slice(line.selectionStart, line.selectionEnd);
}

function deleteSelection() {
    var line = getLineByIndex(getFocusIndex());
    var carat = line.selectionStart;
    line.value = line.value.slice(0, line.selectionStart) + line.value.slice(line.selectionEnd, line.value.length);
    line.setSelectionRange(carat, carat);
}

function keyDelete() {
    var i = getFocusIndex();

    // if we're at the last line
    if (i === getNumLines() - 1) {
        return true; // Don't kill normal input behavior
    }

    var thisLine = getLineByIndex(i);
    var nextLine = getLineByIndex(i + 1);

    // if we have a selection
    if (existsSelection(thisLine)) {
        return true; // Don't kill normal input behavior
    }

    // if we're not at the end of the line
    if (!isCursorAtEnd(thisLine)) {
        return true; // Don't kill normal input behavior
    }

    var cursorLoc = thisLine.value.length;
    thisLine.value += nextLine.value;
    deleteLine(i + 1);
    thisLine.setSelectionRange(cursorLoc, cursorLoc);
    return false; // Kill normal input behavior
}

// https://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
function keyBackspace() {
    var i = getFocusIndex();

    // if we're at the first line
    if (i === 0) {
        return true; // Don't kill normal input behavior
    }

    var thisLine = getLineByIndex(i);
    var prevLine = getLineByIndex(i - 1);

    // if we have a selection
    if (existsSelection(thisLine)) {
        return true; // Don't kill normal input behavior
    }

    // if we're not at the beginning of the line
    if (!isCursorAtStart(thisLine)) {
        return true; // Don't kill normal input behavior
    }

    var cursorLoc = prevLine.value.length;
    prevLine.value += thisLine.value;
    deleteLine(i);
    setFocus(i - 1);
    prevLine.setSelectionRange(cursorLoc, cursorLoc);
    return false; // Kill normal input behavior
}

// https://plainjs.com/javascript/manipulation/insert-an-element-after-or-before-another-32/
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function makeNew(ref) {
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
}

function keyEnter() {
    var i = getFocusIndex();

    var overflow = getAfterCursor();
    getLineByIndex(i).value = getBeforeCursor();

    // Need to make sure we insert after the output, not the input
    var ref = getOutputByIndex(i);
    makeNew(ref);

    getLineByIndex(i + 1).value = overflow;
    getLineByIndex(i + 1).setSelectionRange(0, 0);

    setBlur(i);
    setFocus(i + 1);

    return false;
}

function parseAfter(f) {
    var output = f();
    parseLines();
    return output;
}

// https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
document.onkeydown = function(e) {
    if (e.keyCode == 38) { // up arrow
        shiftFocusUp();
        return false;
    } else if (e.keyCode == 40) { // down arrow
        shiftFocusDown();
        return false;
    } else if (e.keyCode == 37) { // left arrow
        return keyLeft();
    } else if (e.keyCode == 39) { // right arrow
        return keyRight();
    } else if (e.keyCode == 8) { // backspace
        return parseAfter(keyBackspace);
    } else if (e.keyCode == 46) { // delete
        return parseAfter(keyDelete);
    } else if (e.keyCode == 13) { // enter
        return parseAfter(keyEnter);
    }
};

function setupDefault() {
    lines = ["# Project Euler 1",
        "from pprint import pprint",
        "",
        "# try changing this to 1000",
        "n = 10",
        "",
        "stream = list(range(n))",
        "stream = [i for i in stream if not (i%3 and i%5)]",
        "",
        "pprint(stream, compact=True)",
        "",
        "print(sum(stream))"
    ]

    pe2 = ["# Project Euler 2",
        "from pprint import pprint",
        "",
        "a = [(0, 2)]",
        "",
        "get_next_fib = lambda seq: (seq[-1][1], seq[-1][0]+seq[-1][1])",
        "while a[-1][1] < 4_000_000: a.append(get_next_fib(a))",
        "",
        "a = [e[0] for e in a]",
        "pprint(a)",
        "",
        "a = [n for n in a if not n%2]",
        "pprint(a, width=20)",
        "",
        "print(sum(a))"
    ]

    for (i = 0; i < lines.length; i++) {
        document.getElementsByClassName("line")[i].value = lines[i];
    }

    parseLines();
    setFocus(0);
}