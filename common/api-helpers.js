let cachedCtds = null;

export const getContentTypes = async (client, toast, t) => {
  if (cachedCtds) return cachedCtds;

  cachedCtds = client
    .getContentTypes({
      limit: 1000,
      page: 1,
      order_by: 'label',
      order_direction: 'asc',
    })
    .then(({ body, status }) => {
      if (status < 200 || status >= 300) {
        throw new Error();
      }

      return body.data || [];
    })
    .catch(() => {
      toast.error(t('ContentTypesErrors'));
      return [];
    });

  return cachedCtds;
};
