from flask import Flask, render_template, jsonify, request
import sys
import io
import random


app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('site.html', random_n=random.randint(0, 10**6))

def render_HTML(line):
    line = line.replace('\n', '<br>')
    line = line.replace(' ', '&nbsp;')
    return line


def ev(lines):
    stdout = sys.stdout

    o = []
    g, l = {}, {}
    for line in lines:
        sys.stdout = io.StringIO()

        try:
            exec(line, g, l)
            error = False
        except Exception as e:
            print(e)
            error = True

        # get output
        captured_output = sys.stdout.getvalue()
        o.append({'output': render_HTML(captured_output),
                  'error': error,
                  'visible': captured_output != ''})

    # restore sys.stdout
    sys.stdout = stdout

    return o


@app.route('/parse')
def parse():
    lines = eval(request.args.get('data'))

    data = {"data": ev(lines)}

    return jsonify(data)

app.run(debug=True, port=5000)
