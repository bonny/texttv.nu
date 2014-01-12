/**
 * Create a wrapping module to ease having to include too many
 * modules.
 */
angular.module('ionic.service', [
  'ionic.service.platform',
  'ionic.service.actionSheet',
  'ionic.service.gesture',
  'ionic.service.loading',
  'ionic.service.modal',
  'ionic.service.popup',
  'ionic.service.templateLoad',
  'ionic.service.view'
]);

// UI specific services and delegates
angular.module('ionic.ui.service', [
  'ionic.ui.service.scrollDelegate',
  'ionic.ui.service.slideBoxDelegate',
]);

angular.module('ionic.ui', [
                            'ionic.ui.content',
                            'ionic.ui.scroll',
                            'ionic.ui.tabs',
                            'ionic.ui.viewState',
                            'ionic.ui.header',
                            'ionic.ui.sideMenu',
                            'ionic.ui.slideBox',
                            'ionic.ui.list',
                            'ionic.ui.checkbox',
                            'ionic.ui.toggle',
                            'ionic.ui.radio'
                           ]);


angular.module('ionic', [
    'ionic.service',
    'ionic.ui.service',
    'ionic.ui',
    
    // Angular deps
    'ngAnimate',
    'ngRoute',
    'ngTouch',
    'ngSanitize',
    'ui.router'
]);
