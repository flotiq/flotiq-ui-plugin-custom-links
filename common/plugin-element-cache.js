const appRoots = {};

export const onElementRemoved = (element, callback) => {
  new MutationObserver(function () {
    if (!document.contains(element)) {
      callback();
      this.disconnect();
    }
  }).observe(element.parentElement, { childList: true });
};

export const addElementToCache = (element, key, data = {}) => {
  appRoots[key] = {
    element,
    data,
  };

  element.addEventListener(
    'flotiq.attached',
    () => onElementRemoved(element, () => delete appRoots[key]),
    true,
  );
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
