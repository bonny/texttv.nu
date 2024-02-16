# TextTV.nu: smartare SVT Text i mobilen

Här bygger vi på [TextTV.nu](https://texttv.nu/) appar för Ios och Android.
Den är skapad i Ionic och Capactitor.

- [Ios-appen för SVT Text TV](https://itunes.apple.com/se/app/texttv.nu/id607998045).
- [Android-appen för SVT Text TV](https://play.google.com/store/apps/details?id=com.mufflify.TextTVnu2).

<img src="src/images/android-app-screenshot.png" width="640" alt="Skärmdump av appen" />

Vill du göra appen bättre? Bidra med kod eller rapportera buggar eller skicka in förbättringsförslag.

## Kom igång

- Använd `rbenv local` för att få igång Ruby-version som fungar på M1. Kanske måste installera om cocoapods och ffi efter ändring av ruby-version.
- Använd `nvm use` för att använda rätt Node-version.
- `npm install`
- `npm install -g @ionic/cli`
- `rbenv local`
- `sdk use java 17.0.8-zulu`
- `npm start` eller `ionic serve` (kanske även `ionic serve --external`).
- Ios: Bygg på XCode med Intelprocessor pga får Firebase-pods-problem på M1.
- Android: Bygg i Android Studio med intelprocessor pga emulator fungerar ännu inte på M1.

### Random kommandon

- `npx cap sync` (borde göra samma sak som ovan men verkar göra med, t.ex. köra pod update för mig)
- `capacitor open android`

### Släppa ny version

- Skapa release-branch, t.ex. `release/3.3.0`
- Uppdatera version i `package.json`
- Ios:
  - Lägg till ny version på [App Store Connect](https://appstoreconnect.apple.com/apps/607998045/appstore/).
  - `$ ionic capacitor build ios` för att bygga och öppna i Xcode.
  - Uppdatera app-version i Xcode.
  - I Xcode kör Product » Archive.
  - Gå till organizer och ladda upp.
  - Välj filen i App Store Connect, klicka i alla random saker som Apple gnäller på, och välj att skicka in till review.
- Android (inte testat helt ännu):
  - Uppdatera version i `build.gradle`.
  - `$ ionic capacitor sync android`.
  - `$ ionic capacitor open android` för att öppna i Android Studio.
  - "Build => Generate Signed Bundle / APK" i Android Studio.
  - Skapa release via webben i Play Store
  - https://developer.android.com/distribute/best-practices/launch/launch-checklist
- Tagga och mergea in branch i main.

### Ändringslogg

Se [changes.md](changes.md) för att se vad som ändrats i olika versioner.
