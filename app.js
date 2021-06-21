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
            scope: {
               matched: '<',
               onRemove: '&',
               title: '@'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'list',
            bindToController: true
        };

        return ddo;
    }
    //for error
    function FoundItemsDirectiveController() {
        var list = this;

        list.IsEmpty = function () {
            if (list.matched != undefined && list.matched.length === 0) {
                return true;
            }
        };
}

// Search
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        var origTitle = "List of Searched Items";
        ctrl.title = "Fill the form and Press the button!";

    ctrl.narrowItDown = function () {
        if (ctrl.searchTerm) {
            var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
            promise.then(function (response) {
                ctrl.found = response;
                ctrl.title = origTitle + " (" + ctrl.found.length + " items )";
            })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            ctrl.found = [];
        }

    };
    //Remove in controller
     ctrl.removeItem = function (itemIndex) {
         ctrl.found.splice(itemIndex, 1);
         ctrl.title = origTitle + " (" + ctrl.found.length + " items )";
     }
 }

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
            if ((item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)||
                (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)) {

                foundItems.push(item);
            }
        };
        return foundItems;
    });
};
}


})();
