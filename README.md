# texttv.nu – en fin och bra mobilapp för SVT Text TV

Här bygger vi [iOS appen](https://itunes.apple.com/se/app/texttv.nu/id607998045) för [TextTV.nu](https://texttv.nu/).

[Android-appen för SVT Text TV](https://play.google.com/store/apps/details?id=com.mufflify.TextTVnu&hl=sv) är också rätt så baserad på denna kod också.

![Skärmdump som visar hur appen ser ut](https://raw.githubusercontent.com/bonny/texttv.nu/main/src/images/text-tv-app-2019-sk%C3%A4rmdump.png)

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

### Nyheter i nya text-tv-appen

#### Version 3.1 (juli 2021)

- @HERE: sammanfatta finare vad som är nytt
- TODO:
  - [x] favoriter är tomma när man startar på android
  - [x] share fungerar ej på android
  - [x] annonser syns ej på android
  - [ ] kolla att URLar fungerar att öppna i appen
  - [ ] testa att annonser fungerar på iphone/ios
  - [ ] uppdatera version
  - [ ] lägga till 401 som standard för favoriter
  - [ ] skriv changelog/vad är nytt
  - [ ] bygg till ios + ladda till app store
  - [ ] när okej till ios bygg + publicera till android/play store
- Diverse smått och gott (T.ex. uppdaterade NPM-paket).
- Snabbare navigation mellan sidor (t.ex. inga jobbiga animationer).
- Bättre logik och känsla när man går tillbaka i historiken och när man klickar på en flik (går till flikens "start" istället för senast besökta sida på fliken)
- Startsidan/hemsidan laddas nu om när du trycker på fliken i navigationen (ett snabbt och smart sätt att ladda om dina favoriter).
- Sidnummer visas nu i listan på nyaste sidorna och på mest lästa sidorna.
- Färgerna är mer korrekt nu (se gärna sidan https://texttv.nu/777 för exempel på färger och grafik!)
- Mer konsekvent navigation, Tillbaka-knapp och "Gå till sida"-input finns nu även på "Nyast" och "Mest läst", så navigationen blir mer konsekvent.
- Meddelande om att det finns en uppdatering av sidan visas mer korrekt. Den var lite väl tjatig förut...
- Meddelande om att sidan har en uppdatering skriver även ut sidnumret, så du vet vilken av dina favoritsidor som faktiskt fått en uppdatering.

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
