import os
import pygame as pg
import time


# pg.mixer.init()
# pg.init()

# path = os.path.dirname(__file__) + '/../../sounds/'
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

currentChannels = []

# for i in range(25):
while True:
  try:
    channel0.play(a1Note)
    time.sleep(0.3)
    channel0.play(a2Note)
    a2Note.play()
    time.sleep(4)
    channel1.play(a5Note)
  except KeyboardInterrupt:
    channel0.stop()
    channel1.stop()
    print('Stopped the sounds')
    break

def init():
  pg.mixer.init()
  pg.init()

def play(file, channel='right', volume=1):
  channel = pg.mixer.find_channel()
  sound = pg.mixer.Sound(path + file)
  leftVolume = 0 if channel == 'right'  else 1
  rightVolume = 0 if channel == 'left'  else 1
  channel.set_volume(leftVolume, rightVolume)
  channel.play(sound)
  currentChannels.append(channel)
