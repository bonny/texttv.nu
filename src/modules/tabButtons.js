import {
  eye,
  eyeOutline,
  home,
  homeOutline,
  list,
  listOutline,
  time,
  timeOutline,
} from "ionicons/icons";

export const tabButtons = [
  {
    tab: "hem",
    title: "Hem",
    icon: homeOutline,
    iconSelected: home,
    href: "/hem",
  },
  {
    tab: "sidor",
    title: "sidor",
    icon: listOutline,
    iconSelected: list,
    href: "/sidor",
    className: "ion-hide-lg-up",
  },
  {
    tab: "nyast",
    title: "Nyast",
    icon: timeOutline,
    iconSelected: time,
    href: "/nyast",
  },
  {
    tab: "populart",
    title: "Mest läst",
    icon: eyeOutline,
    iconSelected: eye,
    href: "/arkiv",
  },
  // {
  //   tab: "debug",
  //   title: "Debug",
  //   href: "/debug",
  // },
];
