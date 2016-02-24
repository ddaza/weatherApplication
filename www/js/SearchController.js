
(function () {
	var appReference = angular.module('starter');
	var googleApiKey = 'googleApiKey';
	var forecastIOKey = 'forecastIOKey';

	var SearchController = function($scope, $http, $resource) {

		$scope.query = '';

		$scope.change = function(value) {
			$scope.query = value;
		};

		$scope.search = function() {
			console.log("Searching:" + $scope.query);

			var onResponseGoogle = function(response) {
				return response.data.results[0];
			};

			var onResponseForecast = function(result) {
				console.log(result.data);
				$scope.temperature = result.data.currently.temperature;
			};

			var onError = function(error) {
				console.log(error);
			};

			var fetchForecastIO = function(googleData) {
				var latitude = googleData.geometry.location.lat;
				var longitude = googleData.geometry.location.lng;
				// https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE

				var forecastIOUrl = 'https://api.forecast.io/forecast/' + forecastIOKey + '/' + latitude + ',' + longitude + '?callback=JSON_CALLBACK'; 
				var weatherResource = $resource(url, {
					callback: 'JSON_CALLBACK',
				}, {
					get: {
						method: 'JSONP'
					}
				});	

				return $http.jsonp(forecastIOUrl).then(onResponseForecast, onError);
			};

			var url = 'https://maps.googleapis.com/maps/api/geocode/json?key=' +
			googleApiKey + '&address=' + $scope.query;	

			$http.get(url).then(onResponseGoogle, onError).then(fetchForecastIO, onError); 
		};

	};

	appReference.controller('SearchController', SearchController);

}());