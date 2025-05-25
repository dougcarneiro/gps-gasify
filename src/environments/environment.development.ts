import encKey from './encryptionKey';

declare var process: any;

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  localHostDevelopment: false,
  debugMode: true,
  encryptionKey: encKey,
  currentInstance: 'development',

  // Firebase
  firebaseConfig: {
    apiKey: process.env["NG_APP_APIKEY"],
    authDomain: process.env["NG_APP_AUTHDOMAIN"],
    projectId: process.env["NG_APP_PROJECTID"],
    storageBucket: process.env["NG_APP_STORAGEBUCKET"],
    messagingSenderId: process.env["NG_APP_MESSAGINGSENDERID"],
    appId: process.env["NG_APP_APPID"],
    measurementId: process.env["NG_APP_MEASUREMENTID"],
  }
};
