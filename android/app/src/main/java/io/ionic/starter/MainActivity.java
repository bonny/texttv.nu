package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

import com.getcapacitor.community.firebaseanalytics.FirebaseAnalytics;

public class MainActivity extends BridgeActivity {
  // Inaktivera init pga plugins auto-laddas från och med
  // Capacitor 3.0
  // https://capacitorjs.com/docs/updating/3-0#switch-to-automatic-android-plugin-loading
  
  // @Override
  // public void onCreate(Bundle savedInstanceState) {
  //   super.onCreate(savedInstanceState);

  //   // Initializes the Bridge
  //   this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
  //     // Additional plugins you've installed go here
  //     // Ex: add(TotallyAwesomePlugin.class);

  //     // Add AdMob as a Capacitor Plugin.
  //     registerPlugin(com.getcapacitor.community.admob.AdMob.class);

  //     // Add Capacitor Firebase analytics plugin
  //     add(FirebaseAnalytics.class);
  //   }});
  // }
}
