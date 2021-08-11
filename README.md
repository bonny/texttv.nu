# texttv.nu – en fin och bra mobilapp för SVT Text TV

Här bygger vi [iOS appen](https://itunes.apple.com/se/app/texttv.nu/id607998045) för [TextTV.nu](https://texttv.nu/).

[Android-appen för SVT Text TV](https://play.google.com/store/apps/details?id=com.mufflify.TextTVnu&hl=sv) är också rätt så baserad på denna kod också.

<img src="https://user-images.githubusercontent.com/221570/129085488-6617f74b-f893-4e2c-b03a-6866b11d3020.png" width="320" />

Vill du göra appen bättre? Bidra med kod eller rapportera buggar eller skicka in förbättringsförslag.

## Kom igång

- Använd `rbenv local` för att få igång Ruby-version som fungar på M1. Kanske måste installera om cocoapods och ffi efter ändring av ruby-version.
- `npm install -g @ionic/cli`
- `npm start` eller `ionic serve`
- Ios: Bygg på XCode med Intelprocessor pga får Firebase-pods-problem på M1.
- Android: Bygg i Android Studio med intelprocessor pga emulator fungerar ännu inte på M1.

### Random kommandon

- `ionic capacitor sync`
- `npx cap sync` (borde göra samma sak som ovan men verkar göra med, t.ex. köra pod update för mig)
- `capacitor open android`

### Släppa ny version

- Uppdatera version i `package.json`
- Ios
  - Lägg till ny version på [App Store Connect](https://appstoreconnect.apple.com/apps/607998045/appstore/).
  - `$ ionic capacitor sync ios`.
  - `$ ionic capacitor open ios` för att öppna Xcode.
  - Uppdatera app-version i Xcode.
  - I XCode kör Product » Archive.
  - Gå till organizer och ladda upp.
  - Välj filen i App Store Connect, klicka i alla random saker som Apple gnäller på, och välj att skicka in till review.
- Android (inte testat helt ännu)
  - I Android Studio: "Build => Generate Signed Bundle / APK”
  - Skapa release via webben i Play Store
  - https://developer.android.com/distribute/best-practices/launch/launch-checklist

### Nyheter i nya text-tv-appen

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
