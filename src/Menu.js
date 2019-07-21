import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import {
  close,
  document,
  logoFacebook,
  informationCircleOutline,
  logoTwitter,
  alert,
  help,
  paper
} from "ionicons/icons";
import React from "react";
import { withRouter } from "react-router";
import TextTVSidorLista from "./modules/TextTVSidorLista";

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

const Menu = props => {
  return (
    <IonMenu side="start" menuId="mainMenu" contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar color="primary" mode="md">
          <IonTitle>Meny</IonTitle>
          <IonButtons slot="end">
            <IonMenuToggle menu="mainMenu">
              <IonButton>
                <IonIcon slot="icon-only" icon={close} />
              </IonButton>
            </IonMenuToggle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <TextTVSidorLista {...props} showHeader={false} />

        <IonList>
          <IonListHeader color="dark">Länkar</IonListHeader>
          <IonMenuToggle auto-hide="false">
            {navItems.map(item => {
              const icon = item.icon ? item.icon : document;
              return (
                <IonItem href={item.href} key={item.href}>
                  <IonIcon slot="start" icon={icon} />
                  <IonLabel>{item.title}</IonLabel>
                </IonItem>
              );
            })}
          </IonMenuToggle>
        </IonList>

        <IonList>
          <IonListHeader color="dark">
            Vi på TextTV.nu gillar också
          </IonListHeader>
          <IonMenuToggle auto-hide={false}>
            {navItemsAlsoLike.map(item => {
              const icon = item.icon ? item.icon : document;
              return (
                <IonItem href={item.href} key={item.href}>
                  <IonIcon slot="start" icon={icon} />
                  <IonLabel>{item.title}</IonLabel>
                </IonItem>
              );
            })}
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

const MenuWithRouter = withRouter(Menu);

export default Menu;
export { MenuWithRouter };
