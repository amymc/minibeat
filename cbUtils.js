var cbApi = (function  () {

  var api = {},
	  baseUrl = 'http://api.chartbeat.com/',
	  path = 'live/toppages/v3/',
	  apiKey = '317a25eccba186e0f6b558f45214c0e7',
	  host = 'gizmodo.com';

  api.getData = function(callback) {
	var requestUrl = baseUrl + path + '?apikey=' + apiKey + '&host=' + host;
	var request = new XMLHttpRequest();
	request.open('get', requestUrl, true);
	request.onload = function(e) {
	  var response = request.response;
	  response = JSON.parse(response);
	  callback(response);
	};
	request.onerror = function(e) {
	  callback(request.response, e);
	};
	request.send();
  };
  return api;

})();
