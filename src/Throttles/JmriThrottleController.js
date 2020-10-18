import React, { useState, useEffect } from 'react';

export const JmriThrottleController = props => {

    const { jmriApi, speed, address } = props;

    const [ isForward, setIsForward ] = useState(null);

    useEffect(() => {
        (async () => {
            if (speed > 0 && !isForward) {
                setIsForward(true);
                await jmriApi.changeDirection(address, true);
            } else if (speed < 0 && isForward) {
                setIsForward(false);
                await jmriApi.changeDirection(address, false);
            }
            jmriApi.throttle(address, Math.abs(speed));
        })();             
    }, [jmriApi, speed, address, isForward, setIsForward]);


    return (<></>)
}

export default JmriThrottleController;
