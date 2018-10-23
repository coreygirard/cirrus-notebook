from hypothesis import given, assume
from hypothesis.strategies import text, composite

import string

from yapf.yapflib.yapf_api import FormatCode


@composite
def strategy_valid_python(draw):
    while True:
        out = draw(text(string.printable))
        if '\n' in out or '\r' in out:
            continue

        try:
            exec(out, {}, {})
            break
        except:
            pass
    return out


@given(strategy_valid_python())
def test_thing(t):
    assume('\n' not in t)

    assume(t != '\\')

    formatted = FormatCode(t)[0][:-1]
    assert '\n' not in formatted
