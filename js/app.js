var app = angular.module('loginApp',
	['ui.router','ui.bootstrap','ngResource','oc.lazyLoad','ngCookies']);
	
app.config(function($stateProvider, $urlRouterProvider,$httpProvider){
		console.log('Congigration');
		console.log($stateProvider);
		$urlRouterProvider.otherwise('/');
		$stateProvider
			
			
			.state('/',{
				url:'/',
				templateUrl:'partial/index.html',
				controller:'globalController',
				resolve:{
					deps:['$ocLazyLoad',function($ocLazyLoad,$http){
						console.log('lazyLoad Call');

						return $ocLazyLoad.load('css/demo.css');
					console.log('lazzy problem');
					}],
					checkUser:function(){
						console.log('Check USer Login');
						
						
					}
				}
			})
			.state('/login',{
				url:'/login',
				templateUrl:'partial/login.html',
				controller:'loginController',
				resolve:{
					deps:['$ocLazyLoad',function($ocLazyLoad,$http){
						console.log('Login Lazy Load call');
						
						return $ocLazyLoad.load('css/demo.css');
					}],
					checkUser:function(){
						console.log('Check USer Login');
						//var data = $cookies.getObject('data');
						
					}

				}
			})

			.state('/registration',{
				url:'/registration',
				templateUrl:'partial/registration.html',
				controller:'registrationController',
				resolve:{
					deps:['$ocLazyLoad',function($ocLazyLoad,$http){
						console.log('Registration Lazy Load Call');
						return $ocLazyLoad.load('css/demo.css');
					}],
					checkUser:function(){
						console.log('Check USer Login');
						//var data = $cookies.getObject('data');
						
					}
				}
			})
			.state('/dashboadr',{
				url:'/dashboadr',
				templateUrl:'partial/done.html',
				controller:'dashboadController',
				resolve:{
					deps:['$ocLazyLoad',function($ocLazyLoad,$http){
						console.log('Dashboar Call');
						return $ocLazyLoad.load('css/demo.css');
					}],
					checkUser:function(){
						console.log('Check User Login');
						//var data = $cookies.getObject('data');
						
					}
				}
			})
	
});




//Controller



app.controller('globalController', 
	['$scope','$cookies','$cookieStore', 'authenticateFactory','$state','$location',
	function($scope,$cookies,$cookieStore,authenticateFactory,$state,$location){
	var userPermission = $cookies.getObject('data');
	if(userPermission!=null)
	{
		$location.path('/dashboadr');
	}
	else
	{
		$location.path('/');
	}
	var promise = authenticateFactory.getUser();
		promise.then(function(response){
			console.log('Response');
			for(i=0;i<response.length;i++)
			{
				var user = response[i].userFirstName;
				console.log(user);

			}
		},
		function(error){
			console.log('Error');
			console.log('Error');
		});


		$cookies.put('user','admin');
		console.log($cookies.get('user'));

	console.log('Global Controller Load');
	
}])

app.controller('loginController', ['$scope', 
	'$cookies','$cookieStore','loginUser','$state','$location',
	function($scope,$cookies,$cookieStore,loginUser,$state,$location){
	var userPermission = $cookies.getObject('data');
	if(userPermission!=null)
	{
		$location.path('/dashboadr');
	}
	else
	{
		$location.path('/');
	}
	console.log('Login Controller');

	$scope.login = function(user){
	console.log(user);
	var promise = loginUser.loginData(user);
		promise.then(function(response){
			console.log(response);
			if(response.responseStatus == 200)
			{
				$location.path('/dashboadr');
			}
			else
			{
				$location.path('/');
			}
		},function(error){
			console.log(error);
		});

	}
	
}])

app.controller('registrationController', ['$scope', '$cookies','$state','$location',
	function($scope,$cookies,$state,$location){
	console.log('RegistrationContoller Call');
	var userPermission = $cookies.getObject('data');
	if(userPermission!=null)
	{
		$location.path('/dashboadr');
	}
	else
	{
		$location.path('/');
	}
	
}])

app.controller('dashboadController', ['$scope','$cookies','$state','$location',
	function($scope,$cookies,$state,$location){
	console.log('DashboadController Call');
	var userPermission = $cookies.getObject('data');
	$scope.logout = function()
					{
						console.log('Cookies Remove');
						$cookies.remove('data');
						$location.path('/');
					}
	if(userPermission!=null)
	{
		$location.path('/dashboadr');
	}
	else
	{
		$location.path('/');
	}
	
}])


//factory 

app.factory('authenticateFactory', ['$http','$q', function($http,$q){
	return {
		getUser: function(){
			var deferred = $q.defer();
			$http.get('http://e-grocery.insuurelife.com/api/tblUsers')
				.success(function(response){
					//console.log(response);

					var arra = [];
					angular.forEach(response, function(element){
						arra.push(element);
					});
					deferred.resolve(arra);
				})
				.error(function(e) {
					console.log('Error Show');
					deferred.resolve(e);
				});
			return deferred.promise;
			
		}
	};
}])


app.factory('loginUser',['$http','$q','$cookies','$cookieStore',
				function($http,$q,$cookies,$cookieStore){
	return{
		loginData: function(user){
			$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
			console.log(user);
			console.log('Login Factory');
			var deferred = $q.defer();
			var userData = $.param({userEmail:user.email,userPassword:user.password});
			console.log(userData);
			$http.post('http://e-grocery.insuurelife.com/api/login',userData)
				.success(function(response){

					deferred.resolve(response);
					console.log(response.data);
					/*var data = response.data;*/
					$cookies.putObject('data',response);
					var getData = $cookies.getObject('data');
					console.log("Response in factory"+getData);

				})
				.error(function(e) {
					deferred.resolve(e);
					console.log('Error');
				});
				return deferred.promise;

		}
	}
}]);


