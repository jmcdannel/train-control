import RPi.GPIO as gpio
from time import sleep
 
class Shifter():
 
	inputB=11
	clock=12
	clearPin=13
 
 
	def __init__(self):
		self.setupBoard()
		self.pause=0
	def tick(self):
		gpio.output(Shifter.clock,gpio.HIGH)
		sleep(self.pause)
		gpio.output(Shifter.clock,gpio.LOW)
		sleep(self.pause)		
 
	def setValue(self,value):
		for i in range(24):
			bitwise=0x800000>>i
			bit=bitwise&value
			if (bit==0):
				gpio.output(Shifter.inputB,gpio.LOW)
			else:
				gpio.output(Shifter.inputB,gpio.HIGH)
			Shifter.tick(self)
 
	def clear(self):
		gpio.output(Shifter.clearPin,gpio.LOW)
		Shifter.tick(self)
		gpio.output(Shifter.clearPin,gpio.HIGH)
 
	def setupBoard(self):
		gpio.setup(Shifter.inputB,gpio.OUT)
		gpio.output(Shifter.inputB,gpio.LOW)
		gpio.setup(Shifter.clock,gpio.OUT)
		gpio.output(Shifter.clock,gpio.LOW)
		gpio.setup(Shifter.clearPin,gpio.OUT)
		gpio.output(Shifter.clearPin,gpio.HIGH)