import React, { useState, useEffect } from 'react';

export const JmriThrottleController = props => {

    const { throttleApi, speed, address } = props;

    const [ isForward, setIsForward ] = useState(null);

    useEffect(() => {
        (async () => {
            if (speed > 0 && !isForward) {
                setIsForward(true);
                await throttleApi.changeDirection(address, true);
            } else if (speed < 0 && isForward) {
                setIsForward(false);
                await throttleApi.changeDirection(address, false);
            }
            throttleApi.throttle(address, Math.abs(speed));   
        })();             
    });


    return (<></>)
}

export default JmriThrottleController;
