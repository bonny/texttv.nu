import {
  IonMenu,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonIcon,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonMenuToggle,
  IonButton
} from "@ionic/react";
import React from "react";
import { TextTVSidorLista } from "./modules/TextTVSidorLista";
import { withRouter } from "react-router";

const navItems = [
  {
    title: "Best of SVT Text",
    href: "http://bestofsvttext.eskapism.se",
    icon: "document"
  },
  {
    title: "TextTV.nu på Facebook",
    href: "https://www.facebook.com/texttv.nu/",
    icon: "logo-facebook"
  },
  {
    title: "Utvecklingsblogg",
    href: "https://texttv.nu/blogg",
    icon: "information-circle-outline"
  },
  {
    title: "TextTV.nu på Twitter",
    href: "https://twitter.com/texttv_nu",
    icon: "logo-twitter"
  },
  {
    title: "@text_tv_sport",
    href: "https://twitter.com/text_tv_sport",
    icon: "logo-twitter"
  },
  {
    title: "@text_tv_nyheter",
    href: "https://twitter.com/text_tv_nyheter",
    icon: "logo-twitter"
  },
  {
    title: "Omnämnt av Polisen",
    href: "https://texttv.nu/sida/polisen",
    icon: "alert"
  },
  {
    title: "Om TextTV.nu",
    href: "https://texttv.nu/sida/om-texttv-nu",
    icon: "help"
  }
];

const navItemsAlsoLike = [
  {
    title: "SVT Nyheter",
    href: "https://www.svt.se/",
    icon: "paper"
  },
  {
    title: "SVT Nyheter på Twitter",
    href: "https://twitter.com/svtnyheter",
    icon: "logo-twitter"
  },
  {
    title: "SVT Sport på Twitter",
    href: "https://twitter.com/SVTSport",
    icon: "logo-twitter"
  },
  {
    title: "❤️ 377",
    href: "https://twitter.com/svt377",
    icon: "logo-twitter"
  }
];

const Menu = props => {
  console.log("menu props", props);

  return (
    <IonMenu side="end" menuId="mainMenu" contentId="main" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Menu</IonTitle>
          <IonButtons slot="end">
            <IonMenuToggle menu="mainMenu">
              <IonButton>
                <IonIcon slot="icon-only" name="close" />
              </IonButton>
            </IonMenuToggle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <TextTVSidorLista {...props} />

        <IonList>
          <IonListHeader>Länkar</IonListHeader>
          <IonMenuToggle auto-hide="false">
            {navItems.map(item => {
              const icon = item.icon ? item.icon : "document";
              return (
                <IonItem href={item.href} key={item.href}>
                  <IonIcon slot="start" name={icon} />
                  <IonLabel>{item.title}</IonLabel>
                </IonItem>
              );
            })}
          </IonMenuToggle>
        </IonList>

        <IonList>
          <IonListHeader>Vi på TextTV.nu gillar också...</IonListHeader>
          <IonMenuToggle>
            {navItemsAlsoLike.map(item => {
              const icon = item.icon ? item.icon : "document";
              return (
                <IonItem href={item.href} key={item.href}>
                  <IonIcon slot="start" name={icon} />
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
