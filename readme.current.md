# Aktuellt arbete

### Just nu

## Blandat Todo

- [ ] Går till hem = sida ska alltid laddas om. Även vid klick på tab.
- [ ] när går till sida laddas för många sidor in, typ nuvarande sida + kommande sida + även startsidan?!
- [ ] Senast + mest läst: alltid&max två rader så innehållet inte hoppar
- [ ] "Nyare version av sidan finns"
  - [ ] kommer upp för ofta
  - [ ] synlig på andra sidor än den man är på
  - [ ] synlig när man redigerar favoriter
- [ ] Mindre "flicker" vid byte av sida
- [ ] Genvägar till samma sidor som svt.se/text-tv har, så användare känner igen sig.
  - [ ] Eller om det är favoriter man lägger längst upp helt enkelt
  - [ ] Så kan ändra-knappen vara längst till höger
  - [ ] Som standard = samma sidor som hos svt
  - [ ] Alltid synliga på alla sidor. Snabbt och smidigt!
- [ ] När man klickar på mest lästa/senaste ett par gånger så verkar det laddas dubbla ajax + sidor laddas fast inga visas?
- [ ] lägg till debug-context som visar debug-meddelanden i nån ruta
- [ ] statistik på omladdningar och när favoriter ändras osv. även när tab klickas? få koll på vilka funktioner som faktiskt används.
- [ ] statistik saknas när man går till sida, loggas aldrig till Firebase?
- [ ] koppla ihop admob med firebase https://mail.google.com/mail/u/0/#all/FMfcgxwLtszrLRqMqXcpTpqnNzWPQQrW
- [ ] kolla att admob är korrekt ihopkopplat https://mail.google.com/mail/u/0/#all/FMfcgxwLsKBxCKFJdmLGTZqkWbJBzGzq

## Changelog

- [x] Uppdatera NPM-paket
- [x] Ta bort ev. animationer vid navigering, https://ionicframework.com/docs/api/router-outlet#:~:text=animated
- [x] Bättre logik och känsla när man går tillbaka i historiken och när man klickar på en flik (går till flikens "start" istället för senast besökta sida på fliken)
- [x] sätt fallback-font till någon som är lika bred som Ubuntu mono
  - [x] förslag: Consolas (mkt lik, samma bredd, finns i windows), Inconsolata (open source-variant av consolas)
- [x] Ta bort pil upp/ner på desktop på sidnummerinputen
- [x] "404-sida" om man manuellt anger sida som inte finns
- [x] Mest lästa/senast: får nån ram mellan varje item under load/skeleton
