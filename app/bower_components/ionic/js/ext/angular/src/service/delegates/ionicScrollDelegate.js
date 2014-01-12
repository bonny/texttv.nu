(function() {
'use strict';

angular.module('ionic.ui.service.scrollDelegate', [])

.factory('ScrollDelegate', ['$rootScope', function($rootScope) {
  return {
    /**
     * Trigger a scroll-to-top event on child scrollers.
     */
    scrollTop: function(animate) {
      $rootScope.$broadcast('scroll.scrollTop', animate);
    },
    tapScrollToTop: function(element) {
      var _this = this;

      ionic.on('tap', function(e) {
        var el = element[0];
        var bounds = el.getBoundingClientRect();

        if(ionic.DomUtil.rectContains(e.gesture.touches[0].pageX, e.gesture.touches[0].pageY, bounds.left, bounds.top, bounds.left + bounds.width, bounds.top + 20)) {
          _this.scrollTop();
        } 
      }, element[0]);
    },
    /**
     * Register a scope for scroll event handling.
     * $scope {Scope} the scope to register and listen for events
     */
    register: function($scope, $element) {
      $element.bind('scroll', function(e) {
        $scope.onScroll({
          event: e,
          scrollTop: e.detail ? e.detail.scrollTop : e.originalEvent ? e.originalEvent.detail.scrollTop : 0,
          scrollLeft: e.detail ? e.detail.scrollLeft: e.originalEvent ? e.originalEvent.detail.scrollLeft : 0
        });
      });

      $scope.$parent.$on('scroll.resize', function(e) {
        // Run the resize after this digest
        $timeout(function() {
          $scope.$parent.scrollView && $scope.$parent.scrollView.resize();
        });
      });

      // Called to stop refreshing on the scroll view
      $scope.$parent.$on('scroll.refreshComplete', function(e) {
        $scope.$parent.scrollView && $scope.$parent.scrollView.finishPullToRefresh();
      });

      /**
       * Called to scroll to the top of the content
       *
       * @param animate {boolean} whether to animate or just snap
       */
      $scope.$parent.$on('scroll.scrollTop', function(e, animate) {
        $scope.$parent.scrollView && $scope.$parent.scrollView.scrollTo(0, 0, animate === false ? false : true);
      });
    }
  };
}]);

})(ionic);
