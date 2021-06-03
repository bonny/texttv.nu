# Aktuellt arbete

### Just nu

## Blandat Todo

- [ ] Ta bort referenser till gamla header
- [ ] Lägg till statistik till Firebase
  - [ ] när sida visas via klick
  - [ ] när sida gås till via "sök"-rutan
  - [ ] när sida gås till via meny
  - [ ] när man byter flik
  - [ ] när man går till sida på nyast
  - [ ] när man går till sida på mest läst
  - [x] när man väljer att redigera favoriter
  - [x] när man sparar favoriter
  - [x] vilka favoriter man sparar?
- [ ] Nav-knappar längst ner för föregående/nästa sida. Kanske num-input i mitten?
- [ ] "Nyare version av sidan finns"
  - [ ] Aktivera igen
  - [ ] kommer upp för ofta
  - [ ] synlig på andra sidor än den man är på
  - [ ] synlig när man redigerar favoriter
- [ ] Genvägar till samma sidor som svt.se/text-tv har, så användare känner igen sig.
  - [ ] Eller om det är favoriter man lägger längst upp helt enkelt
  - [ ] Så kan ändra-knappen vara längst till höger
  - [ ] Som standard = samma sidor som hos svt
  - [ ] Alltid synliga på alla sidor. Snabbt och smidigt!
- [ ] koppla ihop admob med firebase https://mail.google.com/mail/u/0/#all/FMfcgxwLtszrLRqMqXcpTpqnNzWPQQrW
- [ ] kolla att admob är korrekt ihopkopplat https://mail.google.com/mail/u/0/#all/FMfcgxwLsKBxCKFJdmLGTZqkWbJBzGzq

## Todo API/import/på servern

- [ ] Import "Sidan ej i sändning"-sidor ska bli lika hög som andra sidorna, har ren text nu men måste få markup
- [ ]

## Changelog

- [x] Uppdatera NPM-paket
- [x] Ta bort ev. animationer vid navigering, https://ionicframework.com/docs/api/router-outlet#:~:text=animated
- [x] Bättre logik och känsla när man går tillbaka i historiken och när man klickar på en flik (går till flikens "start" istället för senast besökta sida på fliken)
- [x] sätt fallback-font till någon som är lika bred som Ubuntu mono
  - [x] förslag: Consolas (mkt lik, samma bredd, finns i windows), Inconsolata (open source-variant av consolas)
- [x] Ta bort pil upp/ner på desktop på sidnummerinputen
- [x] "404-sida" om man manuellt anger sida som inte finns
- [x] Mest lästa/senast: får nån ram mellan varje item under load/skeleton
- [x] Går till hem = sida ska alltid laddas om. Även vid klick på tab.
- [x] när går till sida laddas för många sidor in, typ nuvarande sida + kommande sida + även startsidan?!
- [x] Kolla bundle size https://create-react-app.dev/docs/analyzing-the-bundle-size/ npm run build, npm run analyze
- [x] Senast + mest läst: visa sidnummer
- [x] När man klickar på mest lästa/senaste ett par gånger så verkar det laddas dubbla ajax + sidor laddas fast inga visas?
- [x] Ladda in "nyast" och "mest läst" när man klickar på fliken
- [x] Korrigerat färger
- [x] Fixa färgerna, se testsida 777
- [x] I Desktop Safari och mobile chrome så går localhost:8100/ --> localhost:8100/hem och sen går det inte att swipe'a vidare
- [x] Mindre "flicker" vid byte av sida, typ tona in nya sidan?
- [x] Tillbaka-knapp även på sidor-sidan