/*
 * We don't document the ionActionSheet directive, we instead document
 * the $ionicActionSheet service
 */
IonicModule
.directive('ionActionSheet', ['$document', function($document) {
  return {
    restrict: 'E',
    scope: true,
    replace: true,
    link: function($scope, $element){
      var keyUp = function(e) {
        if(e.which == 27) {
          $scope.cancel();
          $scope.$apply();
        }
      };

      var backdropClick = function(e) {
        if(e.target == $element[0]) {
          $scope.cancel();
          $scope.$apply();
        }
      };
      $scope.$on('$destroy', function() {
        $element.remove();
        $document.unbind('keyup', keyUp);
      });

      $document.bind('keyup', keyUp);
      $element.bind('click', backdropClick);
    },
    template: '<div class="action-sheet-backdrop">' +
                '<div class="action-sheet-wrapper">' +
                  '<div class="action-sheet">' +
                    '<div class="action-sheet-group">' +
                      '<div class="action-sheet-title" ng-if="titleText" ng-bind-html="titleText"></div>' +
                      '<button class="button" ng-click="buttonClicked($index)" ng-repeat="button in buttons" ng-bind-html="button.text"></button>' +
                    '</div>' +
                    '<div class="action-sheet-group" ng-if="destructiveText">' +
                      '<button class="button destructive" ng-click="destructiveButtonClicked()" ng-bind-html="destructiveText"></button>' +
                    '</div>' +
                    '<div class="action-sheet-group" ng-if="cancelText">' +
                      '<button class="button" ng-click="cancel()" ng-bind-html="cancelText"></button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>'
  };
}]);
