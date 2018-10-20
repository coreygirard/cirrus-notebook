from flask import Flask, render_template, jsonify, request
import sys
import io


app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('site.html')

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
    py = [request.args.get(e)[1:-1] for e in sorted(list(request.args.keys()))]

    return jsonify(ev(py))

app.run(debug=True, port=5000)
