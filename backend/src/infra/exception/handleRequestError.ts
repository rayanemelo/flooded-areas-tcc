import { AxiosError } from 'axios';

export function handleRequestError(error: AxiosError) {
  if (error.response) {
    console.error(
      `Request failed with status code ${error.response.status}. `,
      JSON.stringify({
        request: {
          headers: error.config?.headers,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          data: error.config?.data,
        },
        response: JSON.stringify(error.response.data),
      })
    );
  } else if (error.request) {
    console.error('Request failed without response. ', error);
  } else {
    console.error('Request failed due to unknown error. ', error);
  }
}
