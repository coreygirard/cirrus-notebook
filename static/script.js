function keyUp() {
    var i = getFocusIndex();
    if (i === false) {
        return true;
    }
    if (i <= 0) {
        return true;
    }


    var thisLine = getLineByIndex(i);
    var prevLine = getLineByIndex(i - 1);

    var cursorPosition = getCursorPosition(thisLine);
    thisLine.blur();
    prevLine.focus();
    setCursorPosition(prevLine, Math.min(cursorPosition, prevLine.value.length));

    return false;
}

function keyDown() {
    var i = getFocusIndex();
    if (i === false) {
        return true;
    }
    if (i >= getNumLines() - 1) {
        return true;
    }

    var thisLine = getLineByIndex(i);
    var nextLine = getLineByIndex(i + 1);

    thisLine.blur();
    nextLine.focus();

    return false;
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
    setCursorPosition(prevLine, cursorLoc);
    return false; // Kill normal input behavior
}

function keyEnter() {
    var i = getFocusIndex();

    var thisLine = getLineByIndex(i);
    var overflow = getAfterCursor(thisLine);
    thisLine.value = getBeforeCursor(thisLine);

    var newLine = makeNew(i);

    newLine.value = overflow;
    newLine.setSelectionRange(0, 0);

    thisLine.blur();
    newLine.focus();

    return false;
}

// https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
document.onkeydown = function(e) {
    if (e.keyCode == 38) { // up arrow
        return keyUp();
    } else if (e.keyCode == 40) { // down arrow
        return keyDown();
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