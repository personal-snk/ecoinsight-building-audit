var routerApp = angular.module('routerApp', ['ui.router','angularUtils.directives.dirPagination']);

routerApp.config(function($stateProvider, $urlRouterProvider,$locationProvider){
      
  $urlRouterProvider.when("", "/buildings/list");
  $urlRouterProvider.when("/", "/buildings/list");
  
  // For any unmatched url, send to /route1
  $urlRouterProvider.otherwise("/buildings/list");
  
  $stateProvider
    .state('buildings', {
        abstract: true,
        url: '/buildings',
        templateUrl: 'head.html'
    })
    .state('buildings.add', {
        url: '/add',
        // loaded into ui-view of parent's template
        templateUrl: 'add.html',
        controller: 'listController'
    })
    .state('buildings.list', {
        url: '/list',
        // loaded into ui-view of parent's template
        templateUrl: 'list.html',
        controller: 'listController'
    })
    .state('buildings.detail', {
        url: '/:code',
        // loaded into ui-view of parent's template
        templateUrl: 'detail.html',
        controller: 'listController'
    })
    .state('buildings.detail.floors', {
        url: '/:code/:floor',
        // loaded into ui-view of parent's template
        templateUrl: 'Floorslist.html',
        controller: 'listController'
    })

    $locationProvider.html5Mode(true);
});

routerApp.filter('trustThisUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);  

routerApp.service('buildingService', function($http, $log, $q) {

  var result;
  this.loadedData;

  var self = this;

  this.getAPI = function()
  {
    result = $http.get('buildings.json').success(function(data,status){
        result = (data);
        self.loadedData = result;
    }).error(function(){
        alert("Something went wrong");
    });

    return result;
  }

 });

routerApp.controller('listController', ['$rootScope','$scope', '$http', '$state', '$location','buildingService',function($rootScope,$scope, $http, $state, $location,buildingService) {
    
    $scope.grid_view=true;

    $scope.thisAlbum = $state.params.code;

      // if($rootScope.dataLocations === undefined)
      if(buildingService.loadedData === undefined)
        var result = buildingService.getAPI().success(function(data)
        {
            $rootScope.dataLocations = data;
            //$scope.locations = $rootScope.dataLocations;
            $scope.locations = buildingService.loadedData ;
        })
        else
        {
            // $scope.locations = $rootScope.dataLocations;
            $scope.locations = buildingService.loadedData ;
        }


    $scope.saveChanges= function(data)
    {
        $scope.locations = data;
        $state.go('buildings.list');
    }

    $scope.addNewBuilding = function(location)
    {
        $scope.locations.push(location);
        $state.go('buildings.list');
    }
}]);