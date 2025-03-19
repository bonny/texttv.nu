import {
  AdMob,
  AdmobConsentStatus,
} from "@capacitor-community/admob";

/**
 * Initialize AdMob and handle consent flow
 * @param {Function} setConsentStatus - Function to update consent status
 * @returns {Promise<void>}
 */
export async function initializeAdMob(setConsentStatus) {
  try {
    console.log("initializeAdMob");

    // Init admob + consent message.
    await AdMob.initialize({
      initializeForTesting: true,
      testingDevices: ["20639CA0A77ABBB0C705B559536A5046"],
    });

    const [trackingInfo, consentInfo] = await Promise.all([
      AdMob.trackingAuthorizationStatus(),
      AdMob.requestConsentInfo(),
    ]);

    // Update initial consent status
    if (setConsentStatus && typeof setConsentStatus === 'function') {
      setConsentStatus(consentInfo.status);
    }

    if (trackingInfo.status === "notDetermined") {
      /**
       * If you want to explain TrackingAuthorization before showing the iOS dialog,
       * you can show the modal here.
       * ex)
       * const modal = await this.modalCtrl.create({
       *   component: RequestTrackingPage,
       * });
       * await modal.present();
       * await modal.onDidDismiss();  // Wait for close modal
       **/

      await AdMob.requestTrackingAuthorization();
    }

    const authorizationStatus = await AdMob.trackingAuthorizationStatus();
    if (
      authorizationStatus.status === "authorized" &&
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdmobConsentStatus.REQUIRED
    ) {
      const { status } = await AdMob.showConsentForm();
      if (setConsentStatus && typeof setConsentStatus === 'function') {
        setConsentStatus(status);
      }
    }

    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdmobConsentStatus.REQUIRED
    ) {
      const { status } = await AdMob.showConsentForm();
      if (setConsentStatus && typeof setConsentStatus === 'function') {
        setConsentStatus(status);
      }
    }
  } catch (error) {
    console.error('Error initializing AdMob:', error);
    throw error;
  }
} 