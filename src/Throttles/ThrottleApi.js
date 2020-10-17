let isSetup = false;
let isReady = false;
var $jmri = null;
var $debug = false;
var $ = window.jQuery;
var log = new window.Logger();
var promises = {
	speed: {
		resolve: () => {},
		reject: () => {}
	},
	direction: {
		resolve: () => {},
		reject: () => {}
	},
	acquire: {
		resolve: () => {},
		reject: () => {}
	},
	setup: {
		resolve: () => {},
		reject: () => {}
	}
}
 
window.onerror = function(errMsg, errUrl, errLineNumber) {
	if ($jmri) $jmri.closeSocket();
	console.error('\nError running javascript:\n' + errMsg + '\n\nURL:\n' + errUrl + '\n\nLine Number: ' + errLineNumber);
	return true;
};

window.onunload = function() {
	if ($jmri) {
		// $jmri.setJMRI('throttle', $locoAddress, {"release":null});
		$jmri.closeSocket();
	}
};

var jmriLostComm = function(message) {
    console.log('Communication lost.', message);
};

var jmriReady = function(jsonVersion, jmriVersion, railroadName) {
	console.log('__jmriReady', jsonVersion, jmriVersion, railroadName);
	isReady = true;
	promises.setup.resolve(isReady);
}

//----------------------------------------- [from server] Last selected throttle address
var throttleState = function(name, address, speed, forward, fs) {
	// console.log('__throttleState', name, address, speed, forward, fs, arguments);
	promises.acquire.resolve(address);
	if (address !== undefined) throttleAcquisition(address);
	if (forward !== undefined) throttleDirection(name, forward);
	if (speed !== undefined) throttleSpeed(name, speed);
	for (var i = 0; i < 29; i++) if (fs[i] != undefined) throttleFunctionState(name, i, fs[i]);
};

const throttleAcquisition = address => {
    console.log('__throttleAcquisition', address);
	promises.acquire.resolve(address);
}

const throttleDirection = function(name, forward) {
    console.log('__throttleDirection', name, forward);
	promises.direction.resolve(forward);
}

const throttleSpeed = function(name, speed) {
    console.log('__throttleSpeed', name, speed);
	promises.speed.resolve(speed);
};

const throttleFunctionState = function(name, functionNumber, active) {
    // console.log('__throttleFunctionState', name, functionNumber, active);
};

const layoutPowerState = function(state) {
    console.log('__layoutPowerState', state);
	// var power = $('#power');
	// power.attr('state', state);
	// power.removeClass('powerUnknown powerOff powerOn');
	// switch (state) {
	// 	case $jmri.powerOFF:
	// 		power.addClass('powerOff');
	// 		break;
	// 	case $jmri.powerON:
	// 		power.addClass('powerOn');
	// 		break;
	// 	default:
	// 		power.addClass('powerUnknown');
	// 		break;
	// }
};

const setup = () => {
    console.log('Setup', $, window.jQuery, window);
    isSetup = true;

    $jmri = $.JMRI('ws://192.168.86.24:12080/json/', {
		//*** Callback Functions available in '$jmri' object
		toSend: function(data) {$debug && log.log(new Date() + ' - ' + document.title + '\n' + 'JSONtoSend: ' + data);},	//Nothing to do
		fullData: function(data) {$debug && log.log(new Date() + ' - ' + document.title + '\n' + 'JSONreceived: ' + data);},	//Nothing to do
                error: function (code, message) {
                    if (code === 0)
                        jmriLostComm(message);
                    else if (code === 200)
                        console.log(message);
                    else
                        console.log('Error: ' + code + ' - ' + message);
                },
		end: function() {jmriLostComm('The JMRI WebSocket service was turned off.\nSolve the problem and refresh web page.');},
		ready: function(jsonVersion, jmriVersion, railroadName) {jmriReady(jsonVersion, jmriVersion, railroadName);},	//When WebSocket connection established - continue next steps
		throttle: function(name, address, speed, forward, fs) {throttleState(name, address, speed, forward, fs);},
		light: function(name, userName, comment, state) {},	//Nothing to do
		reporter: function(name, userName, state, comment, report, lastReport) {},	//Nothing to do
		sensor: function(name, userName, comment, inverted, state) {},	//Nothing to do
		// turnout: function(name, userName, comment, inverted, state) {layoutTurnoutState(name, userName, comment, inverted, state);},
		signalHead: function(name, userName, comment, lit, appearance, held, state, appearanceName) {},	//Nothing to do
		signalMast: function(name, userName, aspect, lit, held, state) {},	//Nothing to do
		// route: function(name, userName, comment, state) {layoutRouteState(name, userName, comment, state);},
        memory: function(name, userName, comment, value) {},	//Nothing to do
        power: function(state) {layoutPowerState(state);},
	});
	if (!$jmri) throw new Error('private~Could not open JMRI WebSocket.');
	return createPromise('setup');
}

const throttle = async (address, speed) => {
    const speedValue = speed / 100;
    var speedValueFormated = '' + speedValue;
	if (speedValue === 0) speedValueFormated = $jmri.STOP;
	if (speedValue === 1) speedValueFormated = $jmri.FULL_SPEED;
	validateCommand() && $jmri.setJMRI('throttle', address, { 
		'speed': speedValueFormated
	});
	return createPromise('speed', 'New throttle action dispatched.');
}

const changeDirection = (address, forward) => {
    validateCommand() && $jmri.setJMRI('throttle', address, { 
		throttle: address, 
		forward: !!forward
	 });
	 return createPromise('direction', 'New throttle action dispatched.');
}

const requestLoco = async address => {
	validateCommand(promises.acquire.reject) && $jmri.setJMRI('throttle', address, { 
        throttle: address,
        address
	});
	return createPromise('acquire', 'New throttle action dispatched.');
}

const createPromise = (obj, rejectMsg) => {
	const promise = new Promise((resolve, reject) => {
		rejectMsg && promises[obj].reject(rejectMsg);
		promises[obj].resolve = resolve;
		promises[obj].reject = reject;
	});
	return promise;
}

const validateCommand = reject => {
	let errorMessage;
	if (!isSetup) {
		errorMessage =  'Setup not called';
    } else if (!isReady) {
		errorMessage =  'Comm not ready';
	}
	if (errorMessage) {
		console.error(errorMessage);
		if (reject) {
			reject(errorMessage)
		}
        return false;
	} else { 
		return true;
	}
}
    
export const throttleApi = {
    setup, 
    throttle,
	requestLoco,
	changeDirection
};

export default throttleApi;