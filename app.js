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
               // title: @
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
        //
        // var origTitle = "List of Searched Items";
        // list.title = origTitle + " (" + list.matched.length + " items )";
}

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
     // search in controller
   // ctrl.IsEmpty = function () {
   //     if (ctrl.found != undefined && ctrl.found.length === 0) {
   //         return true;
   //    }
   //  };
    //Remove in controller
     ctrl.removeItem = function (itemIndex) {
         ctrl.found.splice(itemIndex, 1);
     };
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
