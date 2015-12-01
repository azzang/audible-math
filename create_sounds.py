import pydub
from pydub import AudioSegment
import csv

# 12 sine waves (from http://www.audiocheck.net/audiofrequencysignalgenerator_sinetone.php), making a chromatic scale:

P1 = AudioSegment.from_mp3(r"0.mp3")
m2 = AudioSegment.from_mp3(r"1.mp3")
M2 = AudioSegment.from_mp3(r"2.mp3")
m3 = AudioSegment.from_mp3(r"3.mp3")
M3 = AudioSegment.from_mp3(r"4.mp3")
P4 = AudioSegment.from_mp3(r"5.mp3")
A4 = AudioSegment.from_mp3(r"6.mp3")
P5 = AudioSegment.from_mp3(r"7.mp3")
m6 = AudioSegment.from_mp3(r"8.mp3")
M6 = AudioSegment.from_mp3(r"9.mp3")
m7 = AudioSegment.from_mp3(r"10.mp3")
M7 = AudioSegment.from_mp3(r"11.mp3")

mapper = {0:m2,1:M2,2:m3,3:M3,4:P4,5:A4,6:P5,7:m6,8:M6,9:m7,10:M7}  # maps scale indices to individual tones above

scales = csv.reader(open('scales.csv'))
scales.next()

# creating an mp3 for each scale (for smoother playback) by concatenating individual tones:

for scale in scales:
    sound = P1
    title = '0'
    for index, note in enumerate(scale[1:]):
        if note == '1':
            sound+=mapper[index]
            title+=','+str(index+1)
    l = r"sounds/{0}.mp3".format(title)
    sound.export(l,format="mp3")