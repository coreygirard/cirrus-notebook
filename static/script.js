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

function setOutputVisibility() {
    var outputs = document.getElementsByClassName("output");
    for (i = 0; i < outputs.length; i++) {
        if (outputs[i].innerHTML === "") {
            outputs[i].className = "output output-invisible";
        } else {
            outputs[i].className = "output output-visible";
        }
    }
}

function parseLines() {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://127.0.0.1:5000/parse?data=' + getLines(), true);
    request.onload = function() {
        var data = JSON.parse(this.response);

        var outputs = document.getElementsByClassName("output");
        for (i = 0; i < outputs.length; i++) {
            outputs[i].innerHTML = renderHTML(data[i]);
        }
        setOutputVisibility();
    }
    request.send();
}

function setFocus(i) {
    if (i < 0) {
        return;
    }
    var n = document.getElementsByClassName("line").length;
    if (i >= n) {
        return;
    }
    document.getElementsByClassName("line")[i].focus();
}

function setBlur(i) {
    if (i < 0) {
        return;
    }
    var n = document.getElementsByClassName("line").length;
    if (i >= n) {
        return;
    }
    document.getElementsByClassName("line")[i].blur();
}

function getFocusIndex() {
    var n = document.getElementsByClassName("line").length;
    for (i = 0; i < n; i++) {
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
    if (i >= document.getElementsByClassName("line").length - 1) {
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

// https://www.abeautifulsite.net/adding-and-removing-elements-on-the-fly-using-javascript
function deleteFocused() {
    var i = getFocusIndex();
    var elem = document.getElementsByClassName("line")[i]
    elem.parentNode.removeChild(elem);
    var elem = document.getElementsByClassName("output")[i]
    elem.parentNode.removeChild(elem);
}

function removeDelete() {
    var i = getFocusIndex();
    console.log(document.getElementsByClassName("line")[i].value);
    console.log(document.getElementsByClassName("line")[i].selectionStart);
    //deleteFocused();
    //setFocus(getFocusIndex());
}

// https://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
function removeBackspace() {
    var i = getFocusIndex();

    // if we're at the first line
    if (i === 0) {
        return true; // Don't delete focused line
    }

    // if we're not at the beginning of the line
    if (document.getElementsByClassName("line")[i].selectionStart !== 0) {
        return true; // Don't delete focused line
    }

    // if the line isn't blank
    if (document.getElementsByClassName("line")[i].value !== "") {
        var cursorLoc = document.getElementsByClassName("line")[i - 1].value.length;
        document.getElementsByClassName("line")[i - 1].value += document.getElementsByClassName("line")[i].value;
        deleteFocused();
        setFocus(i - 1);
        document.getElementsByClassName("line")[i - 1].setSelectionRange(cursorLoc, cursorLoc);
        return false; // Delete focused line
    }


    deleteFocused();
    setFocus(i - 1);
    return false; // Delete focused line
}

// https://plainjs.com/javascript/manipulation/insert-an-element-after-or-before-another-32/
function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function insertNew() {
    var i = getFocusIndex();
    // Need to make sure we insert after the output, not the input
    var ref = document.getElementsByClassName("output")[i];

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

// https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
document.onkeydown = function(e) {
    if (e.keyCode == 38) { // up arrow
        shiftFocusUp();
        return false;
    } else if (e.keyCode == 40) { // down arrow
        shiftFocusDown();
        return false;
    } else if (e.keyCode == 8) { // backspace
        return removeBackspace();
    } else if (e.keyCode == 46) { // delete
        removeDelete();
        return false;
    } else if (e.keyCode == 13) { // enter
        insertNew();
        shiftFocusDown();
        return false;
    }
};