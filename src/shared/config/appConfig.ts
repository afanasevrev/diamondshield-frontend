export interface AppConfig {
  appName: string;
  appVersion: string;
  centralApiUrl: string;
  localApiUrl: string;
  realtimeUrl: string;
  defaultLocalServerToken: string;
  buildMode: string;
  buildTime: string;
}

export const appConfig: AppConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Diamond Shield',
  appVersion: import.meta.env.VITE_APP_VERSION || '0.1.0',

  centralApiUrl:
    import.meta.env.VITE_CENTRAL_API_URL || 'http://localhost:8080',

  localApiUrl:
    import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:8090',

  realtimeUrl:
    import.meta.env.VITE_REALTIME_URL || 'http://localhost:8080/api/realtime/stream',

  defaultLocalServerToken:
    import.meta.env.VITE_DEFAULT_LOCAL_SERVER_TOKEN ||
    'local-server-token-123',

  buildMode: import.meta.env.MODE,

  buildTime:
    import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
};