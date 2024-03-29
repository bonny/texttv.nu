// Must import the package once to make sure the web support initializes
// import "@capacitor-community/firebase-analytics";
import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import "firebase/analytics";
import { isRunningInWebBrowser } from "./functions";

if (isRunningInWebBrowser()) {
  // Konfig för web. När app körs sätts dessa via app/capacitor tror jag.
  const firebaseConfig = {
    apiKey: "AIzaSyD74YswGldkaY4lpbebtHPMD6p26CeFqEk",
    authDomain: "teletext-a4d17.firebaseapp.com",
    databaseURL: "https://teletext-a4d17.firebaseio.com",
    projectId: "teletext-a4d17",
    storageBucket: "teletext-a4d17.appspot.com",
    messagingSenderId: "30223179902",
    appId: "1:30223179902:web:1c9e49796a9a29c30bf82f",
    measurementId: "G-F8Y7QYLTHQ",
  };

  /**
   * Platform: Web
   * Configure and initialize the firebase app.
   * @param options - firebase web app configuration options
   * */
  FirebaseAnalytics.initializeFirebase(firebaseConfig);
  // firebase.analytics();
}

export { FirebaseAnalytics };
