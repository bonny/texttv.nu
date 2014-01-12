(function() {
'use strict';

angular.module('ionic.ui.content', ['ionic.ui.service'])

/**
 * Panel is a simple 100% width and height, fixed panel. It's meant for content to be
 * added to it, or animated around.
 */
.directive('pane', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      element.addClass('pane');
    }
  };
})

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', ['$parse', '$timeout', 'Platform', 'ScrollDelegate', function($parse, $timeout, Platform, ScrollDelegate) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="scroll-content"></div>',
    transclude: true,
    scope: {
      onRefresh: '&',
      onRefreshOpening: '&',
      onScroll: '&',
      onScrollComplete: '&',
      refreshComplete: '=',
      onInfiniteScroll: '=',
      infiniteScrollDistance: '@',
      hasBouncing: '@',
      scroll: '@',
      hasScrollX: '@',
      hasScrollY: '@',
      scrollbarX: '@',
      scrollbarY: '@',
      scrollEventInterval: '@'
    },

    compile: function(element, attr, transclude) {
      if(attr.hasHeader == "true") { element.addClass('has-header'); }
      if(attr.hasSubheader == "true") { element.addClass('has-subheader'); }
      if(attr.hasFooter == "true") { element.addClass('has-footer'); }
      if(attr.hasTabs == "true") { element.addClass('has-tabs'); }

      return function link($scope, $element, $attr) {
        var clone, sc, sv,
          addedPadding = false,
          c = $element.eq(0);

        // If they want plain overflow scrolling, add that as a class
        if($scope.scroll === "false") {
          clone = transclude($scope.$parent);
          $element.append(clone);
        } else if(attr.overflowScroll === "true") {
          c.addClass('overflow-scroll');
          clone = transclude($scope.$parent); 
          $element.append(clone);
        } else {
          sc = document.createElement('div');
          sc.className = 'scroll';
          if(attr.padding == "true") {
            sc.className += ' padding';
            addedPadding = true;
          }
          $element.append(sc);

          // Pass the parent scope down to the child
          clone = transclude($scope.$parent);
          angular.element($element[0].firstElementChild).append(clone);

          var refresher = $element[0].querySelector('.scroll-refresher');
          var refresherHeight = refresher && refresher.clientHeight || 0;

          if(attr.refreshComplete) {
            $scope.refreshComplete = function() {
              if($scope.scrollView) {
                refresher && refresher.classList.remove('active');
                $scope.scrollView.finishPullToRefresh();
                $scope.$parent.$broadcast('scroll.onRefreshComplete');
              }
            };
          }

          // Otherwise, supercharge this baby!
          $timeout(function() {
            var hasBouncing = $scope.$eval($scope.hasBouncing);
            var enableBouncing = !Platform.is('Android') && hasBouncing !== false;
            // No bouncing by default for Android users, lest they take up pitchforks
            // to our bouncing goodness
            sv = new ionic.views.Scroll({
              el: $element[0],
              bouncing: enableBouncing,
              scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
              scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
              scrollingX: $scope.$eval($scope.hasScrollX) === true,
              scrollingY: $scope.$eval($scope.hasScrollY) !== false,
              scrollEventInterval: parseInt($scope.scrollEventInterval, 10) || 20,
              scrollingComplete: function() {
                $scope.onScrollComplete({
                  scrollTop: this.__scrollTop,
                  scrollLeft: this.__scrollLeft
                });
              }
            });

            // Activate pull-to-refresh
            if(refresher) {
              sv.activatePullToRefresh(50, function() {
                refresher.classList.add('active');
              }, function() {
                refresher.classList.remove('refreshing');
                refresher.classList.remove('active');
              }, function() {
                refresher.classList.add('refreshing');
                $scope.onRefresh();
                $scope.$parent.$broadcast('scroll.onRefresh');
              });
            }

            // Register for scroll delegate event handling
            ScrollDelegate.register($scope, $element);

            // Let child scopes access this 
            $scope.$parent.scrollView = sv;
          });

          // Check if this supports infinite scrolling and listen for scroll events
          // to trigger the infinite scrolling
          var infiniteScroll = $element.find('infinite-scroll');
          var infiniteStarted = false;
          if(infiniteScroll) {
            // Parse infinite scroll distance
            var distance = attr.infiniteScrollDistance || '1%';
            var maxScroll;
            if(distance.indexOf('%')) {
              // It's a multiplier
              maxScroll = function() {
                return sv.getScrollMax().top * ( 1 - parseInt(distance, 10) / 100 );
              };
            } else {
              // It's a pixel value
              maxScroll = function() {
                return sv.getScrollMax().top - parseInt(distance, 10);
              };
            }
            $element.bind('scroll', function(e) {
              if( sv && !infiniteStarted && (sv.getValues().top > maxScroll() ) ) {
                infiniteStarted = true;
                infiniteScroll.addClass('active');
                var cb = function() {
                  sv.resize();
                  infiniteStarted = false;
                  infiniteScroll.removeClass('active');
                };
                $scope.$apply(angular.bind($scope, $scope.onInfiniteScroll, cb));
              }
            });
          }
        }

        // if padding attribute is true, then add padding if it wasn't added to the .scroll
        if(attr.padding == "true" && !addedPadding) {
          c.addClass('padding');
        }

      };
    }
  };
}])

.directive('refresher', function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['^?content', '^?list'],
    template: '<div class="scroll-refresher"><div class="ionic-refresher-content"><i class="icon ion-arrow-down-c icon-pulling"></i><i class="icon ion-loading-d icon-refreshing"></i></div></div>',
    scope: true
  };
})

.directive('scrollRefresher', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="scroll-refresher"><div class="scroll-refresher-content" ng-transclude></div></div>'
  };
})

.directive('infiniteScroll', function() {
  return {
    restrict: 'E',
    replace: false,
    template: '<div class="scroll-infinite"><div class="scroll-infinite-content"><i class="icon ion-loading-d icon-refreshing"></i></div></div>'
  };
});

})();
