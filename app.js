(function () {
'use strict';

angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
    var ctrl = this;

    var promise = MenuSearchService.getMatchedMenuItems();

    promise.then(function (response) {
        ctrl.menu_items = response.data;
    })
    .catch(function (error) {
        console.log("Something went terribly wrong.");
    })
    }
    
MenuSearchService.$inject =['$http']
function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function () {
        var response = $http({
            method: "GET",
            url:  ("https://davids-restaurant.herokuapp.com/menu_items.json")
        });
        return response;
        
    };
    
}

})();