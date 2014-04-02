cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.socialsharing/www/SocialSharing.js",
        "id": "nl.x-services.plugins.socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.console/www/console-via-logger.js",
        "id": "org.apache.cordova.console.console",
        "clobbers": [
            "console"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.console/www/logger.js",
        "id": "org.apache.cordova.console.logger",
        "clobbers": [
            "cordova.logger"
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
    },
    {
        "file": "plugins/com.danielcwilson.plugins.googleanalytics/www/analytics.js",
        "id": "com.danielcwilson.plugins.googleanalytics.UniversalAnalytics",
        "clobbers": [
            "analytics"
        ]
    },
    {
        "file": "plugins/com.patrickheneise.cordova.statusbar/www/StatusBar.js",
        "id": "com.patrickheneise.cordova.statusbar.StatusBar",
        "clobbers": [
            "navigator.statusbar"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.device": "0.2.8",
    "nl.x-services.plugins.socialsharing": "4.0.8",
    "org.apache.cordova.console": "0.2.7",
    "org.apache.cordova.splashscreen": "0.2.7",
    "com.phonegap.TapToScroll": "0.1.0",
    "com.danielcwilson.plugins.googleanalytics": "0.2.0",
    "com.patrickheneise.cordova.statusbar": "0.0.2"
}
// BOTTOM OF METADATA
});