#!/usr/bin/env python
#================================================
#
#	This program is for SunFounder SuperKit for Rpi.
#
#	Extend use of 8 LED with 74HC595.
#
#	Change the	WhichLeds and sleeptime value under
#	loop() function to change LED mode and speed.
#
#=================================================

import RPi.GPIO as gpio
from time import sleep
from utils.shifter import Shifter

SDI   = 11
RCLK  = 12
SRCLK = 13
IR1   = 7

#===============   LED Mode Defne ================
#	You can define yourself, in binay, and convert it to Hex 
#	8 bits a group, 0 means off, 1 means on
#	like : 0101 0101, means LED1, 3, 5, 7 are on.(from left to right)
#	and convert to 0x55.

LED0 = [0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80]	#original mode
LED1 = [0x01,0x03,0x07,0x0f,0x1f,0x3f,0x7f,0xff]	#blink mode 1
LED2 = [0x01,0x05,0x15,0x55,0xb5,0xf5,0xfb,0xff]	#blink mode 2
LED3 = [0x02,0x03,0x0b,0x0f,0x2f,0x3f,0xbf,0xff]	#blink mode 3
#=================================================

def print_msg():
	print 'Program is running...'
	print 'Please press Ctrl+C to end the program...'

# def setup():
# 	GPIO.setmode(GPIO.BOARD)    # Number GPIOs by its physical location
# 	GPIO.setup(SDI, GPIO.OUT)
# 	GPIO.setup(RCLK, GPIO.OUT)
# 	GPIO.setup(SRCLK, GPIO.OUT)
# 	GPIO.setup(IR1, GPIO.IN)
# 	GPIO.output(SDI, GPIO.LOW)
# 	GPIO.output(RCLK, GPIO.LOW)
# 	GPIO.output(SRCLK, GPIO.LOW)
# 	shifter=Shifter()

# def hc595_in(dat):
# 	for bit in range(0, 8):	
# 		GPIO.output(SDI, 0x80 & (dat << bit))
# 		GPIO.output(SRCLK, GPIO.HIGH)
# 		time.sleep(0.001)
# 		GPIO.output(SRCLK, GPIO.LOW)

# def hc595_out():
# 	GPIO.output(RCLK, GPIO.HIGH)
# 	time.sleep(0.001)
# 	GPIO.output(RCLK, GPIO.LOW)

# def loop():
# 	WhichLeds = LED0	# Change Mode, modes from LED0 to LED3
# 	sleeptime = 0.1		# Change speed, lower value, faster speed
# 	while True:
# 		for i in range(0, len(WhichLeds)):
# 			hc595_in(WhichLeds[i])
# 			hc595_out()
# 			time.sleep(sleeptime)

# 		for i in range(len(WhichLeds)-1, -1, -1):
# 			hc595_in(WhichLeds[i])
# 			hc595_out()
# 			time.sleep(sleeptime)

def destroy():   # When program ending, the function is executed. 
	GPIO.cleanup()
	running=False

def main():
	pause=0.5
	gpio.setmode(gpio.BOARD)
	shifter=Shifter()
	running=True
	while running==True:
		try:
      
			shifter.clear()
			shifter.setValue(1)
			sleep(1)
			shifter.clear()
			# shifter.setValue(0x0AAAAAA)
			# sleep(pause)
			# shifter.clear()
			# shifter.setValue(0x0555555)
			# sleep(pause)
		except KeyboardInterrupt:
			destroy()


if __name__=="__main__":
	print_msg()
	main()

# if __name__ == '__main__': # Program starting from here 
# 	print_msg()
# 	setup() 
# 	try:
# 		loop()  
# 	except KeyboardInterrupt:  
# 		destroy()  
    
