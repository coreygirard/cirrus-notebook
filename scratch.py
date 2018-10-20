from pprint import pprint
import random


def make_id():
    return ''.join(random.choice('0123456789abcdef') for _ in range(32))

class Cell(object):
    def __init__(self, next=None):
        self.id = make_id()
        self.next = next

"""
    def insert(self):
        if ptr is None:
            if self.next is None:
                self.next = Cell()
                return self.next.id, self
            else:
                self.next.insert()
"""


class Cells(object):
    def __init__(self):
        self.next = Cell()
        self.map = {self.next.id: self.next}

    def insert(self, ptr):
        """
        if ptr is None:
            if self.next is None:
                self.next = Cell()
                self.map[self.next.id] = self.next
                return self.next.id
        else:
            temp = Cell()
            temp.next = self.map[ptr].next
            self.map[ptr].next = temp

            i = self.map[ptr].next.id
            self.map[i] = self.map[ptr].next
            return i
        """

        temp = Cell()
        temp.next = self.map[ptr].next
        self.map[ptr].next = temp

        i = self.map[ptr].next.id
        self.map[i] = self.map[ptr].next
        return i

    def delete(self, ptr):
        self.map[ptr].next = self.map[ptr].next.next
        del self.map[ptr]

    def __iter__(self):
        ptr = self.next
        while ptr is not None:
            yield ptr.id
            ptr = ptr.next


class Notebook(object):
    def __init__(self):
        self.cells = Cells()



cells = Cells()
ptr = cells.next.id
ptr = cells.insert(ptr)
ptr2 = ptr
ptr = cells.insert(ptr)
ptr = cells.insert(ptr)
cells.insert(ptr)
cells.delete(ptr2)
for c in cells:
    print(c)

'''
class Notebook(object):
    def __init__(self):
        self.next = None
        self.map = {}

    def insert_cell(self):
        temp = Cell()
        ptr =
'''










#def make_dependencies(notebook):
#    pass


notebook = [
    {'code': [
                  "a = file('data.csv')",
             ],
     'status': 'dirty'},
    {'code': [
                  "b = a",
                  "c = a"
             ],
     'status': 'dirty'},
]


#pprint(notebook)
