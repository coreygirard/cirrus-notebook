function getLines() {
    var allLines = new Array();

    for (let line of document.getElementsByClassName("line")) {
        allLines.push(line.value);
    }

    allLines = JSON.stringify(allLines);
    allLines = encodeURIComponent(allLines);

    return allLines;
}

function parseLines() {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://127.0.0.1:5000/parse?data=' + getLines(), true);
    request.onload = function() {
        var data = JSON.parse(this.response);

        var outputs = document.getElementsByClassName("output");
        for (i = 0; i < outputs.length; i++) {
            if (data[i] === "") {
                outputs[i].className = "output output-invisible";
            } else {
                outputs[i].className = "output output-visible";
            }

            var temp = data[i];
            temp = temp.replace(/(\n)/g, '<br>');
            temp = temp.replace(/ /g, '&nbsp;');
            outputs[i].innerHTML = temp;
        }
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
    setBlur(i);
    setFocus(i + 1);
}

function shiftFocusUp() {
    var i = getFocusIndex();
    if (i === false) {
        return;
    }
    setBlur(i);
    setFocus(i - 1);
}

function deleteFocused(n) {
    var i = getFocusIndex();
    var elem = document.getElementsByClassName("line")[i]
    elem.parentNode.removeChild(elem);

    document.getElementsByClassName("line")[i + n].focus();
}

// https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 38: // up
            shiftFocusUp();
            return false;

        case 40: // down
            shiftFocusDown();
            return false;

        case 8: // backspace
            deleteFocused(-1);
            return false;
    }
};