const appRoots = {};

export const onElementRemoved = (element, callback) => {
  new MutationObserver(function () {
    if (!document.contains(element)) {
      callback();
      this.disconnect();
    }
  }).observe(element.parentElement, { childList: true });
};

export const addElementToCache = (element, root, key) => {
  appRoots[key] = {
    element,
    root,
  };

  element.addEventListener(
    'flotiq.attached',
    () => onElementRemoved(element, () => delete appRoots[key]),
    true,
  );
};

export const removeRoot = (key) => {
  delete appRoots[key];
};

export const getCachedElement = (key) => {
  return appRoots[key];
};

export const registerFn = (pluginInfo, callback) => {
  if (window.FlotiqPlugins?.add) {
    window.FlotiqPlugins.add(pluginInfo, callback);
    return;
  }
  if (!window.initFlotiqPlugins) window.initFlotiqPlugins = [];
  window.initFlotiqPlugins.push({ pluginInfo, callback });
};

/**
 * Read key value deep inside object
 * @param {string} key
 * @param {object} object
 * @returns {*} example: read 'object[0].key' from 'object: [{key: value}]
 */
export const deepReadKeyValue = (key, object) => {
  return key
    .split(/[[.\]]/)
    .filter((kp) => !!kp)
    .reduce((nestedOptions, keyPart) => {
      return nestedOptions?.[keyPart];
    }, object);
};