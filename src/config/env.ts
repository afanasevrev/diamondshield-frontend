export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'Diamond Shield',

  centralApiBaseUrl:
    import.meta.env.VITE_CENTRAL_API_BASE_URL || 'http://localhost:8080',

  localApiBaseUrl:
    import.meta.env.VITE_LOCAL_API_BASE_URL || 'http://localhost:8090',

  centralWsBaseUrl:
    import.meta.env.VITE_CENTRAL_WS_BASE_URL || 'ws://localhost:8080',

  localWsBaseUrl:
    import.meta.env.VITE_LOCAL_WS_BASE_URL || 'ws://localhost:8090',
};