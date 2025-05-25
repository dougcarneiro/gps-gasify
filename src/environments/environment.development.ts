import encKey from './encryptionKey';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  localHostDevelopment: false,
  debugMode: true,
  encryptionKey: encKey,
  currentInstance: 'development',

  // Firebase
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "V"
  }
};
