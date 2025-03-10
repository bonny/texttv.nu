import {
  alert,
  document,
  informationCircleOutline,
  logoFacebook,
  logoTwitter,
  newspaper,
} from "ionicons/icons";

export const navItems = [
  {
    title: "Best of SVT Text",
    href: "https://bestofsvttext.eskapism.se",
    icon: document,
  },
  {
    title: "Utvecklingsblogg",
    href: "https://texttv.nu/blogg",
    icon: informationCircleOutline,
  },
  {
    title: "Omnämnt av Polisen",
    href: "https://texttv.nu/sida/polisen",
    icon: alert,
  },
];

export const navItemsAlsoLike = [
  {
    title: "SVT Nyheter",
    href: "https://www.svt.se/",
    icon: newspaper,
  },
  {
    title: "SVT Nyheter på Twitter",
    href: "https://twitter.com/svtnyheter",
    icon: logoTwitter,
  },
  {
    title: "SVT Sport på Twitter",
    href: "https://twitter.com/SVTSport",
    icon: logoTwitter,
  },
];
