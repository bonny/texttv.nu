import { IonBackButton } from "@ionic/react";

/**
 * Tillbacka-knapp som endast visas om det finns historik att gå tillbaka till.
 * Om history.action är PUSH så kan vi gå tillbaka i historiken.
 */
export const BackButton = function (props) {
  const history = props.history;
  const canGoback = history.action === "PUSH";

  if (!canGoback) {
    return null;
  }

  const backButtonDefaultHref = `/hem?default`;
  const backButton = (
    <IonBackButton defaultHref={backButtonDefaultHref} text="" />
  );

  return backButton;
};
