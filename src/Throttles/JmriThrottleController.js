import React, { useEffect, useContext } from 'react';
import { Context } from '../Store/Store';

export const JmriThrottleController = props => {

    const [ state, dispatch ] = useContext(Context);
    const { jmriApi, speed, forward, address } = props;
    
    const handleSpeed = ({ name, speed }) => {
        console.log('handleSpeed', address, name, forward, speed);
      dispatch({ type: 'UPDATE_LOCO', payload: { address: name, speed } });
    }
    
    const handleDirection = async ({ name, forward }) => {
        console.log('handleDirection', address, name, forward, speed);
      dispatch({ type: 'UPDATE_LOCO', payload: { address: name, forward } });
      if (speed !== 0) {
        await jmriApi.throttle(address, Math.abs(speed));
      }
    }

    useEffect(() => {
        jmriApi.on('direction', 'JmriThrottleController', handleDirection);
        jmriApi.on('speed', 'JmriThrottleController', handleSpeed);
    }, [jmriApi, handleDirection, handleSpeed]);

    useEffect(() => {
        const updateThrottle = async () => {
            if (speed > 0 && forward === false) {
                await jmriApi.changeDirection(address, true);
            } else if (speed < 0 && forward === true) {
                await jmriApi.changeDirection(address, false);
            } else if (speed > 0 && forward === true) {
                await jmriApi.throttle(address, Math.abs(speed));
            } else if (speed < 0 && forward === false) {
                await jmriApi.throttle(address, Math.abs(speed));
            } else if (speed !== 0 && forward === null) {
                await jmriApi.changeDirection(address, speed > 0);
            } else if (speed === 0 && forward !== null) {
                await jmriApi.throttle(address, Math.abs(speed));
            }
        };
        updateThrottle();
    }, [jmriApi, speed, address, forward]);

    return (<></>)
}

export default JmriThrottleController;
