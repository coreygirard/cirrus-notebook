function setupDefault() {
    pe1 = ["# Project Euler 1",
        "from pprint import pprint",
        "",
        "# try changing this to 1000",
        "n = 10",
        "",
        "stream = list(range(n))",
        "stream = [i for i in stream if not (i%3 and i%5)]",
        "",
        "pprint(stream, compact=True)",
        "",
        "print(sum(stream))"
    ]

    pe2 = ["# Project Euler 2",
        "from pprint import pprint",
        "",
        "a = [(0, 2)]",
        "",
        "get_next_fib = lambda seq: (seq[-1][1], seq[-1][0]+seq[-1][1])",
        "while a[-1][1] < 4_000_000: a.append(get_next_fib(a))",
        "",
        "a = [e[0] for e in a]",
        "pprint(a)",
        "",
        "a = [n for n in a if not n%2]",
        "pprint(a, width=20)",
        "",
        "print(sum(a))"
    ]

    setLines(pe1);
}