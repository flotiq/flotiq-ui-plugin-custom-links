const appRoots = {};

export const addElementToCache = (element, key, data = {}) => {
  appRoots[key] = {
    element,
    data,
  };

  setTimeout(
    () =>
      element.addEventListener('flotiq.detached', () => {
        delete appRoots[key];
      }),
    50,
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
