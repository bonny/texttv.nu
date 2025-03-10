// Must import the package once to make sure the web support initializes
// import "@capacitor-community/firebase-analytics";
import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import "firebase/analytics";
import { Capacitor } from "@capacitor/core";

if (Capacitor.getPlatform() === "web") {
  // Konfig för web. När app körs sätts dessa via app/capacitor tror jag.
  console.log("init analytics");
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
