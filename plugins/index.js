import { registerFn } from '../common/plugin-helpers';
import { handlePanelPlugin, loadPanelPlugin } from './panelPlugin/panelPlugin';
import { handleManagePlugin } from './managePlugin/managePlugin';
import cssString from 'inline:./styles/index.css';
import cssPanelString from 'inline:./styles/panel.css';
import cssButtonString from 'inline:./styles/button.css';
import pluginInfo from '../plugin-manifest.json';

const loadStyles = () => {
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement('style');
    style.id = `${pluginInfo.id}-styles`;
    style.textContent = cssString + cssButtonString + cssPanelString;
    document.head.appendChild(style);
  }
};

registerFn(
  pluginInfo,
  (handler, _client, { getLanguage, getPluginSettings }) => {
    loadStyles();

    handler.on('flotiq.plugins.manage::form-schema', (data) =>
      handleManagePlugin(data, pluginInfo, getLanguage),
    );
    handler.on('flotiq.form.sidebar-panel::add', (data) =>
      handlePanelPlugin(data, pluginInfo, getPluginSettings),
    );
  },
);

const pluginManagePreviewRoot = document.getElementById('manage-preview-root');
const pluginPanelPreviewRoot = document.getElementById('panel-preview-root');

if (pluginManagePreviewRoot && pluginPanelPreviewRoot) {
  loadStyles();
  loadPanelPlugin(pluginPanelPreviewRoot);
}
