# TextTV.nu: smartare SVT Text i mobilen

Här bygger vi på [TextTV.nu](https://texttv.nu/) appar för Ios och Android.

- [iOS appen](https://itunes.apple.com/se/app/texttv.nu/id607998045).
- [Android-appen för SVT Text TV](https://play.google.com/store/apps/details?id=com.mufflify.TextTVnu2).

<img src="https://texttv.nu/bloggimages/2021-11-ny-android-app.png" width="640" alt="Skärmdump av appen" />

Vill du göra appen bättre? Bidra med kod eller rapportera buggar eller skicka in förbättringsförslag.

## Kom igång

- Använd `rbenv local` för att få igång Ruby-version som fungar på M1. Kanske måste installera om cocoapods och ffi efter ändring av ruby-version.
- Använd `nvm use` för att använda rätt Node-version.
- `npm install -g @ionic/cli`
- `npm start` eller `ionic serve`
- Ios: Bygg på XCode med Intelprocessor pga får Firebase-pods-problem på M1.
- Android: Bygg i Android Studio med intelprocessor pga emulator fungerar ännu inte på M1.

### Random kommandon

- `ionic capacitor sync`
- `npx cap sync` (borde göra samma sak som ovan men verkar göra med, t.ex. köra pod update för mig)
- `capacitor open android`

### Släppa ny version

- Skapa release-branch, t.ex. `release/1.2.3`
- Uppdatera version i `package.json`
- Ios
  - Lägg till ny version på [App Store Connect](https://appstoreconnect.apple.com/apps/607998045/appstore/).
  - `$ ionic capacitor sync ios`.
  - `$ ionic capacitor open ios` för att öppna Xcode.
  - Uppdatera app-version i Xcode.
  - I Xcode kör Product » Archive.
  - Gå till organizer och ladda upp.
  - Välj filen i App Store Connect, klicka i alla random saker som Apple gnäller på, och välj att skicka in till review.
- Android (inte testat helt ännu)
  - Uppdatera version i `build.gradle`
  - `$ ionic capacitor sync android`
  - I Android Studio: "Build => Generate Signed Bundle / APK"
  - Skapa release via webben i Play Store
  - https://developer.android.com/distribute/best-practices/launch/launch-checklist
- Tagga och mergea in branch i main.

### Ändringslogg

#### Under utveckling

- Lagt till kontakta oss-sida, vilket är ett krav från Google Play Store för att kunna visas i nyhets-kategorin.
- Lagt till källa (svt.se/text-tv/nnn) under sidorna.

#### Version 3.2 (mmm 2021)

- Lagt till brödsmulor för att förenkla navigering tillbaka till innehållets kategori. (#12)
- Lagra och visa statistik för antal starter av appen och vilka sidor som besökts. Statistik går att se på https://app.texttv.nu/statistik eller under sidor-menyn i appen. (#14)
- Fråga efter en recension av appen när man använt appen ett tag. (#7)

#### Version 3.1.1 (augusti 2021)

- Fixat problem med att navigera på äldre Ios-enheter, t.ex. Ipad med Ios 12.5.4. (#13)
- Placera `toasts` ovanför flikar och annons. Löser problem där toast hamnade delvis bakom annonser. (#5)
- Använd olika `appid` vid anrop till API beroende på platform (web/ios/android). (#8)

#### Version 3.1 (juli 2021)

- Uppdaterat NPM-paket och Capacitor till version 3.
- Navigation mellan sidor är nu snabbare.
- Tryck på hem-fliken för att ladda om favoriterna på nytt.
- Sidnumret för en nyhet visas nu i listan på nyaste sidorna och på mest lästa sidorna.
- Färgerna är mer korrekta nu (se gärna den galna tekniktestsidan 777 (https://texttv.nu/777) för exempel på färger och grafik!
- Navigation är mer konsekvent. T.ex. så finns tillbaka-knappen och "Gå till sida"-rutan även på "Nyast" och "Mest läst".
- Meddelande om att det finns en uppdatering av sidan visas mer korrekt. Den var lite väl tjatig förut...
- Meddelande om att sidan har en uppdatering skriver ut sidnumret, så man vet vilken av sida som faktiskt fått en uppdatering.
- Blandade småfixar här och där för att göra appen allmänt trevligare att umgås med.
- Bättre logik och känsla när man går tillbaka i historiken och när man klickar på en flik (går till flikens "start" istället för senast besökta sida på fliken)
- Mer konsekvent navigation, Tillbaka-knapp och "Gå till sida"-input finns nu även på "Nyast" och "Mest läst", så navigationen blir mer konsekvent.

#### Version 3.0.2 (25 feb 2020)

- Mer text får plats på mindre skärmar, t.ex för de med Iphone 5/SE.
- Bättre känsla vid svepning mellan sidor
- Ikonerna matchar bättre nyare versioner av iOS
- Blandade mindre fixar.

#### Version 3.0.1

- Favoriterna är tillbaka
- Snabbare och mer direkta svepningar med mindre lagg.
- Startsidan för väder, sidan 400, är nu med direkt i menyn.

#### Version 3.0

- Ny design.
- Större klickyta, bra t.ex. för små mobiler där det kan vara svårt att pricka sidnummret.
- Tillbaka-knapp fungerar på Android.
- Tydligare gränssnitt med lättare tillgång till
  - startsida
  - vanliga sidor
  - senast uppdaterade sidorna
  - mest lästa och delade sidorna för idag, igår och i förrgår
- Sökruta/gå till sida-ruta alltid tillgänglig.
- App som fungerar både i mobila webbläsaren (PWA) och som egen app i appstore.
- Texten till en eller flera sidor går att kopiera direkt till urklipp
- Direktlänk/permalänk till en eller flera sidor går att kopiera till urklipp.
