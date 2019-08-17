import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader
} from "@ionic/react";
import {
  alert,
  document,
  help,
  informationCircleOutline,
  logoFacebook,
  logoTwitter,
  paper
} from "ionicons/icons";
import React from "react";
import TextTVSidorLista from "./TextTVSidorLista";

const navItems = [
  {
    title: "Best of SVT Text",
    href: "http://bestofsvttext.eskapism.se",
    icon: document
  },
  {
    title: "TextTV.nu på Facebook",
    href: "https://www.facebook.com/texttv.nu/",
    icon: logoFacebook
  },
  {
    title: "Utvecklingsblogg",
    href: "https://texttv.nu/blogg",
    icon: informationCircleOutline
  },
  {
    title: "TextTV.nu på Twitter",
    href: "https://twitter.com/texttv_nu",
    icon: logoTwitter
  },
  {
    title: "@text_tv_sport",
    href: "https://twitter.com/text_tv_sport",
    icon: logoTwitter
  },
  {
    title: "@text_tv_nyheter",
    href: "https://twitter.com/text_tv_nyheter",
    icon: logoTwitter
  },
  {
    title: "Omnämnt av Polisen",
    href: "https://texttv.nu/sida/polisen",
    icon: alert
  },
  {
    title: "Om TextTV.nu",
    href: "https://texttv.nu/sida/om-texttv-nu",
    icon: help
  }
];

const navItemsAlsoLike = [
  {
    title: "SVT Nyheter",
    href: "https://www.svt.se/",
    icon: paper
  },
  {
    title: "SVT Nyheter på Twitter",
    href: "https://twitter.com/svtnyheter",
    icon: logoTwitter
  },
  {
    title: "SVT Sport på Twitter",
    href: "https://twitter.com/SVTSport",
    icon: logoTwitter
  },
  {
    title: "❤️ 377",
    href: "https://twitter.com/svt377",
    icon: logoTwitter
  }
];

const MenuItem = ({ item }) => {
  const icon = item.icon ? item.icon : document;
  return (
    <IonItem href={item.href} rel="external" target="_blank">
      <IonIcon slot="start" icon={icon} />
      <IonLabel>{item.title}</IonLabel>
    </IonItem>
  );
};

const MenuItems = props => {
  return (
    <>
      <TextTVSidorLista {...props} showHeader={false} />

      <IonList>
        <IonListHeader>Externa länkar om texttv.nu</IonListHeader>
        {navItems.map(item => {
          return <MenuItem item={item} key={item.href} />;
        })}
      </IonList>

      <IonList>
        <IonListHeader>Vi på TextTV.nu gillar också</IonListHeader>
        {navItemsAlsoLike.map(item => {
          return <MenuItem item={item} key={item.href} />;
        })}
      </IonList>
    </>
  );
};

export default MenuItems;
