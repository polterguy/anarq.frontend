
// Production overrides.
export const environment = {
  production: true,
  apiUrl: () => {
    return window.location.protocol + "//api." + window.location.host + '/';
  },
};
