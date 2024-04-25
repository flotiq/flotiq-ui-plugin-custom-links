import i18n from 'i18next';

i18n.init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'pl'],
  resources: {
    en: {
      translation: {
        ContentTypes: 'Content types',
        LinkTemplate: 'Link name template',
        Settings: 'Settings',
        UrlTemplate: 'URL template',
      },
    },
    pl: {
      translation: {
        ContentTypes: 'Definicje typu',
        LinkTemplate: 'Szablon nazwy przycisku',
        Settings: 'Ustawienia',
        UrlTemplate: 'Szablon adresu URL',
      },
    },
  },
});

export default i18n;
