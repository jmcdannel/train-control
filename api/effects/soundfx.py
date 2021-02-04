import os
import pygame as pg
import time


path = os.path.dirname(__file__) + '/../../sounds/'
currentChannels = []
# pg.mixer.init()
# pg.init()

# a1Note = pg.mixer.Sound(path + 'departing-train.wav')
# a2Note = pg.mixer.Sound(path + 'diesel-train-arrives-and-departs.wav')
# a3Note = pg.mixer.Sound(path + 'noisy-street-car-moving.wav')
# a4Note = pg.mixer.Sound(path + 'train-upon-us.wav')
# a5Note = pg.mixer.Sound(path + 'bike-horn-1.wav')
# channel0 = pg.mixer.Channel(0)
# channel1 = pg.mixer.Channel(1)
# num_channels = pg.mixer.get_num_channels()
# print(num_channels)
# pg.mixer.set_num_channels(50)


# for i in range(25):
# while True:
#   try:
#     channel0.play(a1Note)
#     time.sleep(0.3)
#     channel0.play(a2Note)
#     a2Note.play()
#     time.sleep(4)
#     channel1.play(a5Note)
#   except KeyboardInterrupt:
#     channel0.stop()
#     channel1.stop()
#     print('Stopped the sounds')
#     break


def init():
  pg.mixer.init()
  pg.init()

def play(file, whichChannel='right', volume=1):
    if os.path.exists(path + file):
        channel = pg.mixer.find_channel()
        print(path + file)
        sound = pg.mixer.Sound(path + file)
        leftVolume = 0 if whichChannel == 'right'  else 1
        rightVolume = 0 if whichChannel == 'left'  else 1
        channel.set_volume(leftVolume, rightVolume)
        print('channel = ' + str(whichChannel))
        print('leftVolume = ' + str(leftVolume))
        print('rightVolume = ' + str(rightVolume))
        channel.play(sound)
        currentChannels.append(channel)
    else:
        print(file + ' does not exist')
