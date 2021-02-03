import * as Colors from 'material-ui/colors';

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

const defaultColor = Colors.grey[500];

export const linesConfig = [
    { lineId: 'Mainline Red', color: Colors.red[500] },
    { lineId: 'Mainline Green', color: Colors.green[500] },
    { lineId: 'Tamarack Station', color: Colors.cyan[500] }
];
  
export const sectionsConfig = [
    { sectionId: 'Tamarack South', color: Colors.blueGrey[500] },
    { sectionId: 'Tamarack North', color: Colors.purple[500] },
    { sectionId: 'Tamarack Plaza', color: Colors.teal[500] },
    { sectionId: 'City North', color: Colors.orange[500] }
];
  
export const effectsConfig = [
    { effectId: 'Light', color: Colors.red[500] },
    { effectId: 'Lighting Animation', color: Colors.amber[500] },
    { effectId: 'Sound Loop', color: Colors.teal[500] },
    { effectId: 'Signal', color: Colors.green[500] }
];

export const getSectionColor = sectionId => {
    const section = sectionsConfig.find(s => s.sectionId === sectionId);
    return section ? section.color : defaultColor;
}

export const getLineColor = lineId => {
    const line = linesConfig.find(s => s.lineId === lineId);
    return line ? line.color : defaultColor;
}

export const getEffectColor = effectId => {
    const effect = effectsConfig.find(s => s.effectId === effectId);
    console.log('getEffectColor', effectId, effect);
    return effect ? effect.color : defaultColor;
}

export default getConfig;