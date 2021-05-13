package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

import com.getcapacitor.community.firebaseanalytics.FirebaseAnalytics;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);

      // Add AdMob as a Capacitor Plugin
      add(com.getcapacitor.community.admob.AdMob.class);

      // Add Capacitor Firebase analytics plugin
      add(FirebaseAnalytics.class);
    }});
  }
}
