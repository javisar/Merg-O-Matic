
if (typeof ServiceManager != 'undefined' && typeof ServiceManager['OATH'] == 'undefined') loadServiceOath();
	
function loadServiceOath() {
	ServiceManager['OATH'] = {};

	ServiceManager['OATH']['INIT'] = {};
	ServiceManager['OATH']['INIT']['VERSION'] = 2;
	//ServiceManager['OATH']['INIT']['CALLBACK'] = function(result) { ServiceManager['OATH']['INIT']['RESULT'] = result; };
	ServiceManager['OATH']['INIT']['CALL'] = function(args) {
			//ServiceManager['OATH']['INIT']['ARGS'] = args;
			//ServiceManager['OATH']['INIT']['RESULT'] = null;
			//if (args.callback) ServiceManager['OATH']['INIT']['CALLBACK'] = args.callback;
			gapi.auth.init(ServiceManager['OATH']['INIT']['CALLBACK']);	
			//ServiceManager['OATH']['AUTHORIZE']['CALLBACK'] = function(result) { ServiceManager['OATH']['AUTHORIZE']['RESULT'] = result; };
			return ServiceManager['OATH']['INIT']['RESULT'];
		};
		
	ServiceManager.setServiceConfig('OATH','INIT',2, {
		version: 2,
		operation: 'POST', async: false, auth_app: false, auth_user: false,
		cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		url_template: "https://www.googleapis.com/auth/youtube"
	});	
	
	ServiceManager['OATH']['AUTHORIZE'] = {};
	ServiceManager['OATH']['AUTHORIZE']['VERSION'] = 2;
	//ServiceManager['OATH']['AUTHORIZE']['CALLBACK'] = function(result) { ServiceManager['OATH']['AUTHORIZE']['RESULT'] = result; };
	ServiceManager['OATH']['AUTHORIZE']['CALL'] = function(args) {
			//ServiceManager['OATH']['AUTHORIZE']['ARGS'] = args;
			//ServiceManager['OATH']['AUTHORIZE']['RESULT'] = null;
			//if (args.callback) ServiceManager['OATH']['AUTHORIZE']['CALLBACK'] = args.callback;
			gapi.auth.authorize({
				//scope: ['https://www.googleapis.com/auth/youtube','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'],
				// client_id: "546600131994.apps.googleusercontent.com",
				scope: ConfigAPI.getConfig('playlistManager','scope'),
				client_id: ConfigAPI.getConfig('playlistManager','client_id'),
				immediate: args.immediate
			}, ServiceManager['OATH']['AUTHORIZE']['CALLBACK']);
			//ServiceManager['OATH']['AUTHORIZE']['CALLBACK'] = function(result) { ServiceManager['OATH']['AUTHORIZE']['RESULT'] = result; };
			return ServiceManager['OATH']['AUTHORIZE']['RESULT'];
		};
		
	ServiceManager.setServiceConfig('OATH','AUTHORIZE',2, {
		version: 2,
		operation: 'POST', async: false, auth_app: false, auth_user: false,
		cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		url_template: "https://www.googleapis.com/auth/youtube"
	});	
	
		
	ServiceManager['OATH']['DROP_AUTHORIZATION'] = {};
	ServiceManager['OATH']['DROP_AUTHORIZATION']['VERSION'] = 2;
	//ServiceManager['OATH']['DROP_AUTHORIZATION']['CALLBACK'] = function(result) { ServiceManager['OATH']['DROP_AUTHORIZATION']['RESULT'] = result; };
	ServiceManager['OATH']['DROP_AUTHORIZATION']['CALL'] = function(args) {
			//ServiceManager['OATH']['DROP_AUTHORIZATION']['ARGS'] = args;
			//ServiceManager['OATH']['DROP_AUTHORIZATION']['RESULT'] = null;
			//if (args.callback) ServiceManager['OATH']['DROP_AUTHORIZATION']['CALLBACK'] = args.callback;
			var token = gapi.auth.getToken();
			if (token) {
				var sc = $("<script>");
				sc.attr('type','text/html');
				sc.attr('src',ConfigAPI.generateTemplate(ServiceManager.getServiceConfig('OATH','DROP_AUTHORIZATION',2).url_template,{ 'token': token.access_token}));
				//var sc =  $("<script type='text/html' src='"+ConfigAPI.generateTemplate(ServiceManager.getServiceConfig('OATH','DROP_AUTHORIZATION',2).url_template,{ 'token': token.access_token})+"'>");
				$('body').append(sc);
				sc.remove();					
			}
			gapi.auth.setToken(null);
			//ServiceManager['OATH']['DROP_AUTHORIZATION']['CALLBACK'](null);			
			//ServiceManager['OATH']['DROP_AUTHORIZATION']['RESULT'] = null;
			//ServiceManager['OATH']['AUTHORIZE']['CALLBACK'] = function(result) { ServiceManager['OATH']['AUTHORIZE']['RESULT'] = result; };
			return ServiceManager['OATH']['DROP_AUTHORIZATION']['RESULT'];
		};
		
	ServiceManager.setServiceConfig('OATH','DROP_AUTHORIZATION',2, {
		version: 2,
		operation: 'POST', async: false, auth_app: false, auth_user: false,
		cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		url_template: "https://accounts.google.com/o/oauth2/revoke?token=$$token"
	});

		
	// VIENE DE authGoogle.v1.js
	// Load config
	
	/*
	function handleAuthResult(authResult) {
		if (authResult && !authResult.error) {
			ServiceManager['OATH']['AUTHORIZE']['RESULT'] = authResult;

			$('#login_button').text("Logout");
		} else {
			ServiceManager['OATH']['AUTHORIZE']['RESULT'] = null;
			var message;
			if (authResult && authResult.error) {
				alert("Authentication failed: " + authResult.error);
				message = "Login";
			} else {
				message = "Login";
			}
			$('#login_button').text(message);
		}
	  };

	function authorize(immediate) {
		gapi.auth.authorize({
			//scope: ['https://www.googleapis.com/auth/youtube','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'],
			scope: ConfigAPI.getConfig('playlistManager','scope'),
			client_id: ConfigAPI.getConfig('playlistManager','client_id'),
			immediate: immediate
		  }, handleAuthResult);
	  };


	
	function dropAuthorization() {
		var token = gapi.auth.getToken();
		if (token) {
		  var script = document.createElement("script");
		  script.src = ConfigAPI.generateTemplate(ServiceManager.getServiceConfig('OATH','DROP_AUTHORIZATION',2).url_template,{ 'token': token.access_token});

		  document.body.appendChild(script);
		  document.body.removeChild(script);
		}
		gapi.auth.setToken(null);
		handleAuthResult(null);
	  };
	  */
}