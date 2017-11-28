var app = angular.module('imageApp', ['ui.bootstrap','ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  
      $urlRouterProvider.otherwise('/home');
  
      $stateProvider
  
          // HOME STATES AND NESTED VIEWS ========================================
          .state('home', {
              url: '/home',
              templateUrl: 'home.html'
              // controller:myCtrl
          })
  
          .state('list', {
              url: '/list',
              templateUrl: 'listById.html'
          })
          .state('getImage', {
            url: '/getImage/:id',
            templateUrl: 'getImageLocal.html'
        })
          ;

          
  
  });

app.controller('myCtrl', function($scope,$http,$rootScope,$state) {

  $scope.loader  = false;

  $scope.getImage = function(url){
      var postData = {
        searchKeyWord: url
      }
      $scope.loader  = true;
      $http.post('/api/imageScrapeAndProcessing',postData)
      .then(function(response){
        $scope.loader  = false;
        $scope.links = response.data;      
        $scope.link = "";
        });
  }

  $scope.getList = function(){
    // 
    $http.get('/api/getAllSearch')
    .then(function(response){
      $scope.linkData = response.data;      
      });
  }

  $scope.getImageById = function(){ 
    $http.get('/api/getSearchById/'+$state.params.id)
    .then(function(response){
      $scope.picImage = response.data;      
      });
  }
});



