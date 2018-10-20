from flask import Flask, render_template, jsonify, request
import sys
import io
import random


app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('site.html', random_n=random.randint(0, 10**6))

def ev(lines):
    stdout = sys.stdout

    o = []
    g, l = {}, {}
    for line in lines:
        sys.stdout = io.StringIO()

        try:
            exec(line, g, l)
        except Exception as e:
            print(e)

        # get output
        o.append(sys.stdout.getvalue())

    # restore sys.stdout
    sys.stdout = stdout

    return o


@app.route('/parse')
def parse():
    lines = eval(request.args.get('data'))

    return jsonify(ev(lines))

app.run(debug=True, port=5000)
