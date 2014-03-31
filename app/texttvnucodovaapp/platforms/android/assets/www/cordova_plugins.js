cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/nl.x-services.plugins.socialsharing/www/SocialSharing.js",
        "id": "nl.x-services.plugins.socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.statusbar/www/statusbar.js",
        "id": "org.apache.cordova.statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/com.phonegap.TapToScroll/www/taptoscroll.js",
        "id": "com.phonegap.TapToScroll.TapToScroll",
        "clobbers": [
            "window.TapToScroll"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "nl.x-services.plugins.socialsharing": "4.0.8",
    "org.apache.cordova.console": "0.2.7",
    "org.apache.cordova.device": "0.2.8",
    "org.apache.cordova.statusbar": "0.1.3",
    "org.apache.cordova.splashscreen": "0.2.7",
    "com.phonegap.TapToScroll": "0.1.0"
}
// BOTTOM OF METADATA
});