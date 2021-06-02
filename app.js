(function () {
'use strict';

angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .directive('menuFromMatched', MenuFromMatched);

// Directive
    function MenuFromMatched() {
        var ddo = {
            replace: true,
            templateUrl: 'MenuFromMatched.html',
            //for search
            controller: FoundItemsDirectiveController,
            controllerAs: 'list',
            bindToController: true
        };

        return ddo;
    }
    //for search
    FoundItemsDirectiveController.$inject = ['$scope'];
    function FoundItemsDirectiveController($scope) {
        $scope.colors = ['#f1f1f1','#ffffff'];
        var list = this;
        //Returns true if list is empty
        list.checkFoundList = function () {
            return typeof list.items !== 'undefined' && list.items.length === 0
        };
    }
/* // Display menu from url
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
    var ctrl = this;

    var promise = MenuSearchService.getMatchedMenuItems();

    promise.then(function (response) {
        ctrl.menu_items = response.data.menu_items;
    })
    .catch(function (error) {
        console.log("Something went terribly wrong.");
    })  */
// Search
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;

    ctrl.narrowItDown = function () {
        if (ctrl.searchTerm) {
            var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
            promise.then(function (response) {
                ctrl.found = response;
            })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            ctrl.found = [];
        }

    };
    
    //Remove
    ctrl.removeItem = function (itemIndex) {
        ctrl.found.splice(itemIndex, 1);  // instead found menu_items in display mode
    };
}
   // service
/* // service for display from url 

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
} */
// service for search
MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
    var service = this;

service.getMatchedMenuItems = function (searchTerm) {
    return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
    }).then(function (response) {
        
        var foundItems = [];
        var menuItemsLength = response.data.menu_items.length;
        
        for (var i = 0; i < menuItemsLength; i++) {
            var item = response.data.menu_items[i];
            if (item.description.indexOf(searchTerm) !== -1) {
                
                foundItems.push(item);
            }
        };
        return foundItems;
    });
};
}


})();