(function () {
'use strict';

angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .directive('menuFromMatched', MenuFromMatched);

    NarrowItDownController.$inject = ['$scope'];
    function NarrowItDownController($scope) {
        $scope.colors = ['#ffffff', '#f1f1f1'];
    }

    function MenuFromMatched() {
        var ddo = {
            replace: true,
            templateUrl: 'MenuFromMatched.html'
        };

        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
    var ctrl = this;

    var promise = MenuSearchService.getMatchedMenuItems();

    promise.then(function (response) {
        ctrl.menu_items = response.data.menu_items;
    })
    .catch(function (error) {
        console.log("Something went terribly wrong.");
    })
    ctrl.removeItem = function (itemIndex) {
        ctrl.menu_items.splice(itemIndex, 1);
    };
    }
    
MenuSearchService.$inject =['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function () {
        var response = $http({
            method: "GET",
            url:  (ApiBasePath + "/menu_items.json")
        });
        return response;
        
    }
}

})();