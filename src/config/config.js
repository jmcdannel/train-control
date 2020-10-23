export const getConfig = () => {
    try {
        return require('./config.local.json');
    } catch (e) {
        console.warn('Loading default config');
        return require('./config.default.json');
    }
}

export const getApiHost = () => {
    return getConfig().apiHost;
}

export const getApi = () => {
    return getConfig().api;
}

export const getJmri = () => {
    return getConfig().jmri;
}
export const getSerial = () => {
    return getConfig().serial;
}

export default getConfig;