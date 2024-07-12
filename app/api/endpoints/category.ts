const categories = 'http://178.18.250.240:9050/api/admin/categories';

export const getCategory = async () => {
  const response = await fetch(categories, {
    headers: {
      Accept: 'application/json',
      'X-Application-Platform': 'Web-Browser',
    },
  });

  return response.json();
};
