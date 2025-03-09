# Ändringslogg

## Version 3.5.3 (utveckling)

- Uppdaterat Node.js från version 18 till version 22.

## Version 3.5.2 (februari 2024)

- Fixat så att texten inte blir för bred på Android-enheter där användarna har valt att ha större textstorlek i systeminställningarna.

## Version 3.5.1 (oktober 2023)

- Fixat så att man går till en sida direkt när man angett 3 siffror i "Gå till sida"-rutan.

## Version 3.5.0 (oktober 2023)

- Uppdaterat alla paket till senaste versioner.
- Återinfört svep-funktionalitet för att gå till nästa/föregående sida (följde guiden ["Migrating From IonSlides to Swiper.js"](https://ionicframework.com/docs/react/slides)).

## Version 3.4.0

- Lagt till Google consent-message pga GDRP.
- Uppdaterat alla paket till senaste versioner.
- Tagit bort svep-funktionen för att gå till nästa/föregående sida, pga Ionic har tagit bort den.
- Lade till FAB-knappar för att byta till nästa/föregående sida.

## Version 3.3

- Lagt till kontakta oss-sida, vilket är ett krav från Google Play Store för att kunna visas i nyhets-kategorin.
- Lagt till källa (svt.se/text-tv/nnn) under sidorna.

## Version 3.2 (mmm 2021)

- Lagt till brödsmulor för att förenkla navigering tillbaka till innehållets kategori. (#12)
- Lagra och visa statistik för antal starter av appen och vilka sidor som besökts. Statistik går att se på https://app.texttv.nu/statistik eller under sidor-menyn i appen. (#14)
- Fråga efter en recension av appen när man använt appen ett tag. (#7)

## Version 3.1.1 (augusti 2021)

- Fixat problem med att navigera på äldre Ios-enheter, t.ex. Ipad med Ios 12.5.4. (#13)
- Placera `toasts` ovanför flikar och annons. Löser problem där toast hamnade delvis bakom annonser. (#5)
- Använd olika `appid` vid anrop till API beroende på platform (web/ios/android). (#8)

## Version 3.1 (juli 2021)

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

## Version 3.0.2 (25 feb 2020)

- Mer text får plats på mindre skärmar, t.ex för de med Iphone 5/SE.
- Bättre känsla vid svepning mellan sidor
- Ikonerna matchar bättre nyare versioner av iOS
- Blandade mindre fixar.

## Version 3.0.1

- Favoriterna är tillbaka
- Snabbare och mer direkta svepningar med mindre lagg.
- Startsidan för väder, sidan 400, är nu med direkt i menyn.

## Version 3.0

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
