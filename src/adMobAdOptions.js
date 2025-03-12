import { BannerAdPosition, BannerAdSize } from "@capacitor-community/admob";
import { isPlatform } from "@ionic/react";

// "TextTV.nu IOS React App"
const adIdIos = "ca-app-pub-1689239266452655/6481628543";

// "TextTVAndroidBottomBanner"
const adIdAndroid = "ca-app-pub-1689239266452655/3120424769";

// Nya annonser 2025-03-10 för Ios och Android.

// "TextTV.nu IOS React App, ad 2"
const adIdIos2 = "ca-app-pub-1689239266452655/3416329385";

// "Text TV Android banner 2"
const adIdAndroid2 = "ca-app-pub-1689239266452655/7406473455";

// Ad to use.
const adId = isPlatform("android") ? adIdAndroid2 : adIdIos2;

const adMobAdOptions = {
  // Banner: TextTV.nu IOS React App
  // https://apps.admob.com/v2/apps/5314264801/adunits/list
  // adId: "ca-app-pub-1689239266452655/6481628543",
  //
  // TextTV.nu iOS Banner (gamla IOS-appen)
  // adIdPrevApp: "ca-app-pub-1689239266452655/6790998004",
  // Google test ad
  // https://developers.google.com/admob/android/test-ads#sample_ad_units
  // adId: "ca-app-pub-3940256099942544/6300978111",
  //
  // Banner: TextTV.nu Android React App
  // https://apps.admob.com/v2/apps/1859283602/adunits/list
  // adIdAndroid: "ca-app-pub-1689239266452655/7602900801",
  adId: adId,
  adSize: BannerAdSize.ADAPTIVE_BANNER,
  position: BannerAdPosition.BOTTOM_CENTER,
  isTesting: false,
};

export { adMobAdOptions };
