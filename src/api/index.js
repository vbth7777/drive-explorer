import { initializeApp } from "firebase/app";
import { GOOGLE_API } from "../../env";
const firebaseConfig = {
  apiKey: GOOGLE_API,
  authDomain: "drive-explorer-ytoe7.firebaseapp.com",
  projectId: "drive-explorer-ytoe7",
  storageBucket: "drive-explorer-ytoe7.firebasestorage.app",
  messagingSenderId: "300872010383",
  appId: "1:300872010383:web:5771a1d3a73ad631633efa",
};

const app = initializeApp(firebaseConfig);
