import {
  addElementToCache,
  getCachedElement,
  deepReadKeyValue,
} from '../../common/plugin-helpers';

const onClick = (e) => {
  e.preventDefault();
  const url = e.target.href;
  window.open(url, '_blank');
};

export const handlePanelPlugin = (
  { contentType, contentObject, duplicate, create },
  pluginInfo,
  getPluginSettings,
) => {
  const pluginSettings = getPluginSettings();
  if (
    !contentObject ||
    !contentType?.name ||
    create ||
    duplicate ||
    !pluginSettings
  )
    return null;

  const settingsForCtd = JSON.parse(pluginSettings)?.settings?.filter(
    (plugin) =>
      plugin.content_types.length === 0 ||
      plugin.content_types.find((ctd) => ctd === contentType.name),
  );

  if (!settingsForCtd.length) return null;

  const cacheKey = `${pluginInfo.id}-${contentType.name}-${contentObject.id}`;

  let element = getCachedElement(cacheKey)?.element;

  if (!element) {
    element = document.createElement('div');
    element.setAttribute('class', 'plugin-custom-links panel');
  }

  const links = settingsForCtd.map((settings) => {
    const url = settings.url_template.replace(
      /{(?<key>[^{}]+)}/g,
      (...params) => {
        const { key } = params[4];
        return deepReadKeyValue(key, contentObject);
      },
    );

    const displayName = settings.link_template.replace(
      /{(?<key>[^{}]+)}/g,
      (...params) => {
        const { key } = params[4];
        return deepReadKeyValue(key, contentObject);
      },
    );

    const link = document.createElement('a');
    link.setAttribute('class', 'link-button');
    link.setAttribute('href', url);

    const span = document.createElement('span');
    span.textContent = displayName;

    link.appendChild(span);
    link.addEventListener('click', onClick);

    return link;
  });

  if (element.children.length) {
    element.innerHTML = '';
  }

  element.append(...links);

  addElementToCache(element, cacheKey);

  return element;
};

export const loadPanelPlugin = (pluginPanelPreviewRoot) => {
  if (pluginPanelPreviewRoot) {
    const element = handlePanelPlugin(
      {
        contentType: { name: 'ctd' },
        contentObject: { id: 'id', name: 'co name' },
        duplicate: false,
        create: false,
      },
      { id: 'plugin-id' },
      () =>
        // eslint-disable-next-line max-len
        '{"settings":[{"url_template":"example.com","link_template":"Link","content_types":[]}, {"url_template":"example.com","link_template":"Link to {name}","content_types":[]}]}',
    );

    element.style.border = '1px solid #DAE3F2';
    element.style.maxWidth = '400px';

    pluginPanelPreviewRoot.appendChild(element);
  }
};
