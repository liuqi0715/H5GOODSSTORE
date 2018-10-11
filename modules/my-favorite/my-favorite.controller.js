(function () {

    'use strict';

    angular
        .module('app')
        .controller('MyFavoriteController', MyFavoriteController);

    MyFavoriteController.$inject = ['$scope', '$state', 'API', 'ENUM', 'MyFavoriteModel'];

    function MyFavoriteController($scope, $state, API, ENUM, MyFavoriteModel) {

      $scope.myFavoriteModel = MyFavoriteModel;

      $scope.touchProduct = _touchProduct;
      $scope.touchDelete = _touchDelete;
      $scope.touchDialogCancel = _touchDialogCancel;
      $scope.touchDialogConfirm = _touchDialogConfirm;

        $scope.cartgroups = {};
        $scope.cartgroups.isLoaded = false;
        $scope.delePro;
      function _touchProduct( product ) {
        $state.go('product', { product:product.goodId });
      }
      function _touchDelete( product ) {
          $scope.showDialog = true;
          $scope.delePro  = product;
          $scope.cartgroups.isLoaded = true;
      }
      function _touchDialogCancel(){
          $scope.showDialog = false;
          $scope.cartgroups.isLoaded = false;
      }
      function _touchDialogConfirm(){
          $scope.showDialog = false;
          $scope.myFavoriteModel.delete($scope.delePro);
      }
      $scope.myFavoriteModel.reload();
    }

})();
