# Cirrus Notebook

Experimental minimalist notebook-style IDE providing an instantaneous feedback loop for development


### Try it!

- Clone repo
- Install `pipenv` with `pip install pipenv`
- Run `pipenv run python main.py`
- Visit `127.0.0.1:5000` in Chrome. Other browsers may work, but are untested


### Currently unsupported

- Imports other than the standard library
- Multi-line structures of any kind: loops, conditionals, etc
  - This sort of hacky stuff works though: `while n > 0: n -= 1`
