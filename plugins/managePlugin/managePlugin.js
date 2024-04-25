import i18n from '../i18n';

let configCache = null;

export const handleManagePlugin = (
  { plugin, contentTypes, modalInstance },
  pluginInfo,
  getLanguage,
) => {
  if (plugin?.id !== pluginInfo.id) return null;

  if (configCache) return configCache;

  const ctds = (contentTypes || [])
    .filter((ctd) => !ctd.internal || ctd.name === '_media')
    .map(({ name }) => name);

  const language = getLanguage();
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }

  configCache = {};

  configCache.schema = {
    id: pluginInfo.id,
    name: 'custom_links',
    label: 'Custom links',
    workflowId: 'generic',
    internal: false,
    schemaDefinition: {
      type: 'object',
      allOf: [
        {
          $ref: '#/components/schemas/AbstractContentTypeSchemaDefinition',
        },
        {
          type: 'object',
          properties: {
            settings: {
              type: 'array',
              items: {
                type: 'object',
                required: ['url_template', 'link_template'],
                properties: {
                  url_template: {
                    type: 'string',
                    minLength: 1,
                  },
                  content_types: {
                    type: 'array',
                  },
                  link_template: {
                    type: 'string',
                    minLength: 1,
                  },
                },
              },
              minItems: 1,
            },
          },
        },
      ],
      required: [],
      additionalProperties: false,
    },
    metaDefinition: {
      order: ['settings'],
      propertiesConfig: {
        settings: {
          items: {
            order: ['url_template', 'link_template', 'content_types'],
            propertiesConfig: {
              url_template: {
                label: i18n.t('UrlTemplate'),
                unique: false,
                helpText: '',
                inputType: 'text',
              },
              content_types: {
                label: i18n.t('ContentTypes'),
                unique: false,
                options: ctds,
                helpText: '',
                inputType: 'select',
                isMultiple: true,
              },
              link_template: {
                label: i18n.t('LinkTemplate'),
                unique: false,
                helpText: '',
                inputType: 'text',
              },
            },
          },
          label: i18n.t('Settings'),
          unique: false,
          helpText: '',
          inputType: 'object',
        },
      },
    },
  };

  modalInstance.promise.then(() => (configCache = null));

  return configCache;
};
