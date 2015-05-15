
if (typeof ServiceManager != 'undefined' && typeof ServiceManager['GOOGLE'] == 'undefined') loadConfigAPI();
	
function loadServiceGoogle() {		
	
	ServiceManager['GOOGLE'] = {};
	ServiceManager['GOOGLE']['SUGGEST_QUERIES'] = {};
	ServiceManager['GOOGLE']['SUGGEST_QUERIES']['VERSION'] = 3;
	ServiceManager['GOOGLE']['SUGGEST_QUERIES']['CALLBACK'] = function(result) { ServiceManager['GOOGLE']['SUGGEST_QUERIES']['RESULT'] = result; };
	ServiceManager['GOOGLE']['SUGGEST_QUERIES']['CALL'] = function(args) {
			ServiceManager['GOOGLE']['SUGGEST_QUERIES']['ARGS'] = args;
			//ServiceManager['GOOGLE']['SUGGEST_QUERIES']['RESULT'] = null;
			if (args.callback) ServiceManager['GOOGLE']['SUGGEST_QUERIES']['CALLBACK'] = args.callback;
			ServiceManager.Query('GOOGLE','SUGGEST_QUERIES',ServiceManager['GOOGLE']['SUGGEST_QUERIES']['CALLBACK'],
				{version: '3',
				  async: true,
				  contentType: 'text/javascript;',
				  url_in: 	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('GOOGLE','SUGGEST_QUERIES',3), {'client': args.client, 'ds': args.ds, 'query': args.query})
				 });
			return ServiceManager['GOOGLE']['SUGGEST_QUERIES']['RESULT'];
		};
	//------------------------------

	ServiceManager.setServiceConfig('GOOGLE','SUGGEST_QUERIES', 3,
		{ version: 3, operation: 'GET', async: true, auth_app: false, auth_user: false,
		  cache: false, contentType: "text/javascript; charset=UTF-8;", dataType: "xml", isLocal: true,
		  url_template:	"https://suggestqueries.google.com/complete/search?client=$$client&ds=$$ds&q=$$query"});
		  //url_template:	"https://www.googleapis.com/youtube/v3/playlists?part=snippet&"+ConfigAPI.getConfig('playlistManager','X-GData-Key'),

}
