(function () {
'use strict';

angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)

NarrowItDownController.$inject = ['NarrowItDownController'];
function NarrowItDownController(NarrowItDownController) {
    var ctrl = this;

    var promise = MenuSearchService.MenuSearchService();

    promise.then(function (response) {
        ctrl.categories = response.data;
    })
        .catch(function (error) {
            console.log("Something went terribly wrong.");
        });

    ctrl.logMenuItems = function (shortName) {
        var promise = MenuSearchService.getMatchedMenuItems(shortName);

        promise.then(function (response) {
            console.log(response.data);
        })
            .catch(function (error) {
                console.log(error);
            })
    };

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

//     getMatchedMenuItems(searchTerm)
//     $http service
//         ```javascript
//   return $http(...).then(function (result) {
//       // process result and only keep items that match
//       var foundItems...

//       // return processed items
//       return foundItems;
//   
//   ```