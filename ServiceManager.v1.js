if (typeof ServiceManager == 'undefined') loadServiceManager();
	
	function loadServiceManager() {
	
		ServiceManager = {};

		ServiceManager.loaded = false;
		ServiceManager.isLoaded = function() { return ServiceManager.loaded; };

		ServiceManager.logContainer = null;
		ServiceManager.setLogContainer = function(container) { logContainer = container; };

		ServiceManager.Service2Idx = function(api,serv) { return api+'_'+serv; };
		//ServiceManager.getServiceConfig = function(api,serv,ver) { return ConfigAPI.getConfig(api,serv,ver); };
		ServiceManager.getServiceConfig = function(api,serv,ver) { return ConfigAPI.getConfig(api,ServiceManager.Service2Idx(serv,ver)); };
		//ServiceManager.setServiceConfig = function(api,serv,params) { return ConfigAPI.setConfig(ServiceManager.Service2Idx(api,serv,params)); };
		ServiceManager.setServiceConfig = function(api,serv,ver,params) { return ConfigAPI.setConfig(api,ServiceManager.Service2Idx(serv,ver),params); };
		ServiceManager.getUrlTemplate = function(api,serv,ver) { return ServiceManager.getServiceConfig(api,serv,ver).url_template;};
		ServiceManager.getBodyTemplate = function(api,serv,ver) { return ServiceManager.getServiceConfig(api,serv,ver).body_template;};

		ServiceManager.doEval = function(result) {
			var evaluated = null;
			try {
				evaluated = eval('('+result+')');
				return evaluated;
			} catch(ex) { alert(ex); }
			return null;
		};
		
		
		
		ServiceManager.getLastResult = function(api,service) {
			var results = ServiceManager[api][service]['RESULT'];
			if (results == undefined) return null;
			if (results.length < 1) return results;
			
			return ServiceManager[api][service]['RESULT'][results.length-1];
		};
		
		ServiceManager.Call = function(api,service,args,doEval) {
			var result = null;
			if (!doEval) doEval = true;
			if (ServiceManager[api][service]['RESULT'] == undefined) ServiceManager[api][service]['RESULT'] = [];
			ServiceManager[api][service]['ARGS'] = args;
			ServiceManager[api][service]['_CALLBACK'] = function(result) {		
				if (!result) return null;
				
				if (doEval && (typeof result == 'string')) result = ServiceManager.doEval(result);
				result.request = args;		
				result.resultId = ServiceManager[api][service]['RESULT'].push(result);
				
				return (args.callback) ? args.callback(result) : result;
			};
			
			var serviceAPI = this[api][service]; //ServiceManager[service_name];
			var service_config = this.getServiceConfig(api,service,serviceAPI.VERSION);			
			var async = ConfigAPI.NVL(service_config['async'],false);
			if (typeof args.ajax != 'undefined' && typeof args.ajax.async != 'undefined') async = args.ajax.async;
			
			
			if (async) {
				
				//if (args.callback) ServiceManager[api][service]['CALLBACK'] = args.callback;
				ServiceManager[api][service]['CALLBACK'] =  ServiceManager[api][service]['_CALLBACK'];
				result = ServiceManager[api][service].CALL(args);
				
				//result = ServiceManager[api][service]['_CALLBACK'](result);			
			}
			else {	
				//if (args.callback) ServiceManager[api][service]['CALLBACK'] = args.callback;
				ServiceManager[api][service]['CALLBACK'] =  ServiceManager[api][service]['_CALLBACK'];
				result = ServiceManager[api][service].CALL(args);
				
				//result = ServiceManager[api][service]['_CALLBACK'](result);				
				result = ServiceManager[api][service]['_CALLBACK'](ServiceManager.getLastResult(api,service));
			}
			
			//result = ServiceManager[api][service].CALL(args);
			
			//if (args.callback) ServiceManager[api][service]['CALLBACK'] = args.callback;
			
			//if (doEval && (typeof result == 'string')) {
			//	result = ServiceManager.doEval(result);
			//}
			
			//ServiceManager[api][service]['RESULT'] = result;			
			//result = ServiceManager[api][service]['CALLBACK'](result);
			
			return result;
		};

		ServiceManager.Query = function(api,service_name,callback,ajax_config,user_ajax_config) {
			var auth_user,auth_app;
			var ajax_data = {};
			//var logContainer = ServiceManager.logContainer;
			////
			//ajax_data["timestamp"] = (new Date()).getTime();
			//var ServiceManager = this[api];
			var serviceAPI = this[api][service_name]; //ServiceManager[service_name];
			var service_config = this.getServiceConfig(api,service_name,serviceAPI.VERSION);
			//serviceAPI['RESULT'] = null;
			//serviceAPI['CALLBACK'] =  function(result) { serviceAPI['RESULT'] = result; };
			//if (callback) serviceAPI['CALLBACK'] = callback;
			
			if (typeof service_config != 'undefined') {
				ajax_data["cache"] = service_config['cache'];
				ajax_data["contentType"] = service_config['contentType'];
				ajax_data["dataType"] = service_config['dataType'];
				ajax_data["isLocal"] = service_config['isLocal'];


				ajax_data["url"] = '';//url_in;//+'?timestamp='+(new Date()).getTime();
				ajax_data["type"] = service_config['operation'];
				ajax_data["GData-Version"] = service_config['version'];
				ajax_data["async"] = service_config['async'];
				ajax_data["data"] = ConfigAPI.NVL(service_config['default_data'],'');
				auth_app = service_config['auth_app'];
				auth_user = service_config['auth_user'];
				}
			////

			if (typeof ajax_config != 'undefined') {
				//for (var c in ajax_config) ajax_data[c]			= ajax_config[c];
				
				if (ajax_config.cache) 			ajax_data["cache"]			= ajax_config.cache;
				if (ajax_config.contentType) 	ajax_data["contentType"]	= ajax_config.contentType;
				if (ajax_config.dataType) 		ajax_data["dataType"]		= ajax_config.dataType;
				if (ajax_config.isLocal) 			ajax_data["isLocal"]		= ajax_config.isLocal;
	
				if (ajax_config.url_in) 			ajax_data["url"]			= ajax_config.url_in+(typeof ajax_data["url"] != 'undefined' ? ajax_data["url"] : '');
				if (ajax_config.operation)		ajax_data["type"] 			= ajax_config.operation;
				if (ajax_config.version)			ajax_data["GData-Version"] 	= ajax_config.version;
				if (ajax_config.async) 			ajax_data["async"]			= ajax_config.async;
				if (ajax_config.content_in) 		ajax_data["data"] 			+= ajax_config.content_in;
				if (ajax_config.auth_app) 		auth_app  = ajax_config.auth_app;
				if (ajax_config.auth_user) 		auth_user = ajax_config.auth_user;
				
			}
			
			if (typeof user_ajax_config != 'undefined') {
				for (var c in user_ajax_config) ajax_data[c]			= user_ajax_config[c];
			}
			
			ajax_data["headers"] = {};
			var auth_data = this['OATH']['AUTHORIZE']['RESULT']; //this.getServiceConfig('OATH','authentication',2);
			if (auth_user && auth_data && auth_data.access_token)
				{ ajax_data["headers"]['Authorization'] ="Bearer "+auth_data.access_token; }
			if (auth_app)
				{ ajax_data["headers"]['X-GData-Key'] = ConfigAPI.getConfig('playlistManager','X-GData-Key'); }

			//if (logContainer) $(logContainer).empty();
			//if (logContainer) $(logContainer).append(ServiceManager.object2string($(ajax_data)));
			$.ajax(ajax_data).done(function( msg ) {
				//if (logContainer) $(logContainer).append(ServiceManager.object2string($(msg)));
				//ServiceManager[api][service_name]['RESULT'] = msg;
				if (callback) { callback(msg); }
			}).fail(function(jqXHR, textStatus, error) {
				var type = jqXHR.getResponseHeader('Content-Type');
				if (jqXHR.status == 200) {
					if (type) {					
						if (type.indexOf('application/json') >= 0) {
							if (callback) { callback(jqXHR.responseText); }
						}
						else {
							console.log(textStatus); console.log(error); console.log(jqXHR); 
							if (callback) { callback(null); }
						}
					//if (logContainer) $(logContainer).append(jqXHR.responseText);
					//ServiceManager[api][service_name]['RESULT'] = jqXHR.responseText;
					}
					else {
						console.log(textStatus); console.log(error); console.log(jqXHR); 
						if (callback) { callback(null); }
					}
				} else {
					console.log(textStatus); console.log(error); console.log(jqXHR); 
					if (callback) { callback(null); }
					//if (logContainer) $(logContainer).append(ServiceManager.object2string($(msg)));
				}
			});

		};
		
		ServiceManager.loaded = true;
	}



