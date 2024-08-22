const apiFetch = (endpoint, options = {}) => {
    const baseUrl = 'http://localhost:3000';
    return fetch(`${baseUrl}${endpoint}`, options);
};

export default apiFetch;
  