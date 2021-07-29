import { isPlatform } from "@ionic/react";

const adIdIos = "ca-app-pub-1689239266452655/6481628543";
const adIdAndroid = "ca-app-pub-1689239266452655/7602900801";
const adId = isPlatform("android") ? adIdAndroid : adIdIos;
console.log("admob adid is", adId);

const adMobAdOptions = {
  // Banner: TextTV.nu IOS React App
  // https://apps.admob.com/v2/apps/5314264801/adunits/list
  //adId: "ca-app-pub-1689239266452655/6481628543",
  // TextTV.nu iOS Banner (gamla IOS-appen)
  // adIdPrevApp: "ca-app-pub-1689239266452655/6790998004",
  // Google test ad
  // https://developers.google.com/admob/android/test-ads#sample_ad_units
  // adId: "ca-app-pub-3940256099942544/6300978111",
  // Banner: TextTV.nu Android React App
  // https://apps.admob.com/v2/apps/1859283602/adunits/list
  //adIdAndroid: "ca-app-pub-1689239266452655/7602900801",
  adId: adId,
  adSize: "SMART_BANNER",
  position: "BOTTOM_CENTER",
  isTesting: false,
};

export { adMobAdOptions };
