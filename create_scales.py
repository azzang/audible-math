import itertools
import operator
import csv

# Code used to make scales.csv:

intervals = [i for i in range(1,12)]
header = ['P1','m2','M2','m3','M3','P4','A4','P5','m6','M6','m7','M7']
scale = [1] + [0]*11

with open("scales.csv", "wb") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerow(scale)
    for integer in intervals:
        combos = itertools.combinations(intervals,integer)
        for combo in combos:
            scale = [1] + [0]*11
            map(lambda x: operator.setitem(scale,x,1), combo)
            writer.writerow(scale)