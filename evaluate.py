# https://stackoverflow.com/questions/22822267/python-capture-print-output-of-another-module/22823751
# https://docs.python.org/3/library/functions.html#exec

import sys
import io

py = ['a = 3',
      'b = a + 4',
      'print(b)',
      'print(5)']

def ev(lines):
    stdout = sys.stdout

    o = []
    g, l = {}, {}
    for line in lines:
        sys.stdout = io.StringIO()

        exec(line, g, l)

        # get output and restore sys.stdout
        output = sys.stdout.getvalue()
        o.append(output)

    sys.stdout = stdout

    return o


ev(py)
print(ev(py))
