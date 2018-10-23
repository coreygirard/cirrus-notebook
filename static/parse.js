// parsing of actual Python code

function getLines() {
    var allLines = new Array();
    for (let line of document.getElementsByClassName("line")) {
        allLines.push(line.value);
    }
    return allLines;
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

function parseLines() {
    var request = new XMLHttpRequest();
    request.open('POST', 'http://127.0.0.1:5000/parse', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function() {
        var data = JSON.parse(this.response)["data"];
        setOutputs(data);
    }
    request.send(JSON.stringify(getLines()));
}


function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function downloadFile() {
    download("code.py", getLines().join('\n'));
}

function setLines(lines) {
    for (i = getNumLines() - 1; i > 0; i--) {
        deleteLine(i);
    }
    if (lines.length === 0) {
        return;
    }
    getLineByIndex(0).value = lines[0];
    for (i = 1; i < lines.length; i++) {
        makeNew(i - 1);
        getLineByIndex(i).value = lines[i];
    }
    parseLines();
    setFocus(0);
}

function processFile(file) {
    var lines = file.target.result.split(/[\r\n]/g);

    setLines(lines);
}

function upload(event) {
    document.body.removeChild(document.getElementById('tempForFilepath'));

    var handle = event.target.files[0];

    var reader = new FileReader();
    reader.onload = processFile;

    reader.readAsText(handle);
}

function uploadFile() {
    var element = document.createElement('input');
    element.setAttribute('type', 'file');
    element.setAttribute('id', 'tempForFilepath');

    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.getElementById('tempForFilepath').addEventListener('change', upload, false);
}