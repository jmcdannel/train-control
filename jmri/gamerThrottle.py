import jarray
import jmri

class Test14(jmri.jmrit.automat.AbstractAutomaton) :

    def init(self):
        # init() is called exactly once at the beginning to do
        # any necessary configuration.
        print "Inside init(self)"

        
        # get loco address. For long address change "False" to "True"
        self.throttle = self.getThrottle(3, False)  # short address 14

        return

    def handle(self):
        # handle() is called repeatedly until it returns false.
        print "Inside handle(self)"

        # set loco to forward
        print "Set Loco Forward"
        self.throttle.setIsForward(True)

        # wait 1 second for layout to catch up, then set speed
        self.waitMsec(1000)
        print "Set Speed"
        self.throttle.setSpeedSetting(0.2)

        self.waitMsec(3000)
        print "Set Speed Stop"
        self.throttle.setSpeedSetting(0)

        self.waitMsec(2000)
        print "Set Loco Reverse"
        self.throttle.setIsForward(False)
        self.waitMsec(1000)                 # wait 1 second for Xpressnet to catch up
        print "Set Speed"
        self.throttle.setSpeedSetting(0.2)

        self.waitMsec(3000)
        print "Set Speed Stop"
        self.throttle.setSpeedSetting(0)

        # and continue around again
        print "End of Loop"
        # return 1
        return
        # (requires JMRI to be terminated to stop - caution
        # doing so could leave loco running if not careful)

# end of class definition

# start one of these up
Test14().start()
