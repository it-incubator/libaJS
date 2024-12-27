export const makeRequest = async <T>(url: RequestInfo | URL) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as T;
};
