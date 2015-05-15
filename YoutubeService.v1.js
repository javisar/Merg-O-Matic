
if (typeof ServiceManager != 'undefined' && typeof ServiceManager['YOUTUBE'] == 'undefined') loadServiceYoutube();
	
function loadServiceYoutube() {
	
	ServiceManager['YOUTUBE'] = {};
	ServiceManager['YOUTUBE']['CREATE_PLAYLIST'] = {};
	ServiceManager['YOUTUBE']['CREATE_PLAYLIST']['VERSION'] = 3;
	//ServiceManager['YOUTUBE']['CREATE_PLAYLIST']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['CREATE_PLAYLIST']['RESULT'] = result; };
	ServiceManager['YOUTUBE']['CREATE_PLAYLIST']['CALL'] = function(args) {
			ServiceManager['YOUTUBE']['CREATE_PLAYLIST']['ARGS'] = args;
			//ServiceManager['YOUTUBE']['CREATE_PLAYLIST']['RESULT'] = null;
			ServiceManager.Query('YOUTUBE','CREATE_PLAYLIST',ServiceManager['YOUTUBE']['CREATE_PLAYLIST']['CALLBACK'],
				{version: '3',
				  async: false,
				 contentType: 'application/json',
				 url_in: 	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','CREATE_PLAYLIST',3), { }),
				 content_in: 	ConfigAPI.generateTemplate(ServiceManager.getBodyTemplate('YOUTUBE','CREATE_PLAYLIST',3), {'playlist_name': args.playlist_name})
				 },
				 args.ajax);
			return ServiceManager['YOUTUBE']['CREATE_PLAYLIST']['RESULT'];
		};

	ServiceManager['YOUTUBE']['DELETE_PLAYLIST'] = {};
	ServiceManager['YOUTUBE']['DELETE_PLAYLIST']['VERSION'] = 3;
	//ServiceManager['YOUTUBE']['DELETE_PLAYLIST']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['DELETE_PLAYLIST']['RESULT'] = true; };
	ServiceManager['YOUTUBE']['DELETE_PLAYLIST']['CALL'] = function(args) {
			ServiceManager['YOUTUBE']['DELETE_PLAYLIST']['ARGS'] = args;
			//ServiceManager['YOUTUBE']['DELETE_PLAYLIST']['RESULT'] = null;
			ServiceManager.Query('YOUTUBE','DELETE_PLAYLIST',ServiceManager['YOUTUBE']['DELETE_PLAYLIST']['CALLBACK'],
				{version: 	3,
				  async: false,
				 contentType: 'application/json',
				 url_in:	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','DELETE_PLAYLIST',3), {'playlistId': args.playlistId})
				},
				 args.ajax);
			return ServiceManager['YOUTUBE']['DELETE_PLAYLIST']['RESULT'];
		};

	ServiceManager['YOUTUBE']['GET_PLAYLISTS'] = {};
	ServiceManager['YOUTUBE']['GET_PLAYLISTS']['VERSION'] = 3;
	//ServiceManager['YOUTUBE']['GET_PLAYLISTS']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['GET_PLAYLISTS']['RESULT'] = result };
	ServiceManager['YOUTUBE']['GET_PLAYLISTS']['CALL'] = function(args) {
			ServiceManager['YOUTUBE']['GET_PLAYLISTS']['ARGS'] = args;
			//ServiceManager['YOUTUBE']['GET_PLAYLISTS']['RESULT'] = false;
			ServiceManager.Query('YOUTUBE','GET_PLAYLISTS',ServiceManager['YOUTUBE']['GET_PLAYLISTS']['CALLBACK'],
				{ version: 	3,
				  async: false,
				  auth_user: true,
				  url_in: 	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','GET_PLAYLISTS',3), {'mine': args.mine, 'filters': args.filters, 'channelId': args.channelId})
				},
				 args.ajax);
			return ServiceManager['YOUTUBE']['GET_PLAYLISTS']['RESULT'];
		};

	ServiceManager['YOUTUBE']['GET_PLAYLIST'] = {};
	ServiceManager['YOUTUBE']['GET_PLAYLIST']['VERSION'] = 3;
	//ServiceManager['YOUTUBE']['GET_PLAYLIST']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['GET_PLAYLIST']['RESULT'] = result; };
	ServiceManager['YOUTUBE']['GET_PLAYLIST']['CALL'] = function(args) {
			ServiceManager['YOUTUBE']['GET_PLAYLIST']['ARGS'] = args;
			//ServiceManager['YOUTUBE']['GET_PLAYLIST']['RESULT'] = null;
			ServiceManager.Query('YOUTUBE','GET_PLAYLIST',ServiceManager['YOUTUBE']['GET_PLAYLIST']['CALLBACK'],
				{version: 	3,
				 async: false,
				 contentType: 'application/json',
				 url_in:	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','GET_PLAYLIST',3), {'playlistId': 'playlistId='+args.playlistId})
				},
				 args.ajax);
			return ServiceManager['YOUTUBE']['GET_PLAYLIST']['RESULT'];
		};


		ServiceManager['YOUTUBE']['GET_VIDEO'] = {};
		ServiceManager['YOUTUBE']['GET_VIDEO']['VERSION'] = 3;
		//ServiceManager['YOUTUBE']['GET_PLAYLIST']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['GET_PLAYLIST']['RESULT'] = result; };
		ServiceManager['YOUTUBE']['GET_VIDEO']['CALL'] = function(args) {
				ServiceManager['YOUTUBE']['GET_VIDEO']['ARGS'] = args;
				//ServiceManager['YOUTUBE']['GET_PLAYLIST']['RESULT'] = null;
				ServiceManager.Query('YOUTUBE','GET_VIDEO',ServiceManager['YOUTUBE']['GET_VIDEO']['CALLBACK'],
					{version: 	3,
					 async: false,
					 contentType: 'application/json',
					 url_in:	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','GET_VIDEO',3), {'videoIdList': 'id='+args.videoIdList})
					},
					 args.ajax);
				return ServiceManager['YOUTUBE']['GET_VIDEO']['RESULT'];
			};
	ServiceManager['YOUTUBE']['SEARCH'] = {};
	ServiceManager['YOUTUBE']['SEARCH']['VERSION'] = 3;
	//ServiceManager['YOUTUBE']['SEARCH']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['SEARCH']['RESULT'] = result; };
	ServiceManager['YOUTUBE']['SEARCH']['CALL'] = function(args) {
			ServiceManager['YOUTUBE']['SEARCH']['ARGS'] = args;
			//ServiceManager['YOUTUBE']['SEARCH']['RESULT'] = null;
			ServiceManager.Query('YOUTUBE','SEARCH',ServiceManager['YOUTUBE']['SEARCH']['CALLBACK'],
				{version: 	3,
				 async: false,
				 contentType: 'application/json',
				 url_in:	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','SEARCH',3), {'query': 'q='+args.query, 'type': 'type='+args.type})
				},
				 args.ajax);
			return ServiceManager['YOUTUBE']['SEARCH']['RESULT'];
		};

	ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST'] = {};
	ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST']['VERSION'] = 3;
	//ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST']['RESULT'] = result; };
	ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST']['CALL'] = function(args) {
			ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST']['ARGS'] = args;
			//ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST']['RESULT'] = null;
			ServiceManager.Query('YOUTUBE','ADD_TO_PLAYLIST',ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST']['CALLBACK'],
				{version: 	3,
				 async: false,
				 contentType: 'application/json',
				 url_in:	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','ADD_TO_PLAYLIST',3), {}),
				 content_in: 	ConfigAPI.generateTemplate(ServiceManager.getBodyTemplate('YOUTUBE','ADD_TO_PLAYLIST',3), {'playlistId': args.playlistId, 'videoId': args.videoId, 'position': args.position})
				},
				 args.ajax);
			return ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST']['RESULT'];
		};

	ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST_BULK'] = {};
	ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST_BULK']['VERSION'] = 3;
	//ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST_BULK']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST_BULK']['RESULT'] = result; };
	ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST_BULK']['CALL'] = function(args) {
			ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST_BULK']['ARGS'] = args;
			//ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST_BULK']['RESULT'] = null;
			ServiceManager.Query('YOUTUBE','ADD_TO_PLAYLIST_BULK',ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST_BULK']['CALLBACK'],
				{version: 	3,
				 async: false,
				 contentType: 'application/json',
				 url_in:	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','ADD_TO_PLAYLIST_BULK',3), {}),
				 content_in: 	ConfigAPI.generateTemplate(ServiceManager.getBodyTemplate('YOUTUBE','ADD_TO_PLAYLIST_BULK',3), {'body': args.body})
				},
				 args.ajax);
			return ServiceManager['YOUTUBE']['ADD_TO_PLAYLIST_BULK']['RESULT'];
		};

	ServiceManager['YOUTUBE']['USER_CHANNEL'] = {};
	ServiceManager['YOUTUBE']['USER_CHANNEL']['VERSION'] = 3;
	//ServiceManager['YOUTUBE']['USER_CHANNEL']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['USER_CHANNEL']['RESULT'] = result; };
	ServiceManager['YOUTUBE']['USER_CHANNEL']['CALL'] = function(args) {
			ServiceManager['YOUTUBE']['USER_CHANNEL']['ARGS'] = args;
			//ServiceManager['YOUTUBE']['USER_CHANNEL']['RESULT'] = null;
			ServiceManager.Query('YOUTUBE','USER_CHANNEL',ServiceManager['YOUTUBE']['USER_CHANNEL']['CALLBACK'],
				{ version: 	3,
				  async: false,
				  auth_user: true,
				  url_in: 	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','USER_CHANNEL',3), {'mine': 'mine=true', 'filters': ''})
				},
				 args.ajax);
			return ServiceManager['YOUTUBE']['USER_CHANNEL']['RESULT'];
		};

	ServiceManager['YOUTUBE']['DOWNLOAD'] = { 'VERSION': 3};
	//ServiceManager['YOUTUBE']['DOWNLOAD']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['DOWNLOAD']['RESULT'] = result; };
	ServiceManager['YOUTUBE']['DOWNLOAD']['CALL'] = function(args) {
			//ServiceManager['YOUTUBE']['DOWNLOAD']['ARGS'] = args;
			//ServiceManager['YOUTUBE']['DOWNLOAD']['RESULT'] = null;
			//var url_template = "https://projects-sushilkumar.rhcloud.com/YTGrabber?url=http://www.youtube.com/watch?v=$$videoId&format=json";			
			/*
			$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
				    var jsonp_callback = options.jsonpCallback;
				    options.jsonpCallback = function(a,b,c) {
						alert(a);
						if (jsonp_callback) jsonp_callback(a,b,c);
					};								
				});
				*/
		/*
			var _parseJSON = $.parseJSON;
			 $.parseJSON = function(data) {
				 return _parseJSON('('+data+')');
			 };
		*/
		/*
			$.ajaxSetup({				  
				  converters: {
					"script json": function(data) { 
					    $.parseJSON('('+data+')');
					}
				  }
			});
			*/
			/*
			ServiceManager['YOUTUBE']['DOWNLOAD']['CALLBACK'] = function(result) { ServiceManager['YOUTUBE']['USER_CHANNEL']['RESULT'] = result; };
			ServiceManager.Query('YOUTUBE','DOWNLOAD',null,
				{ version: 	3,
				 async: true,
				 contentType: 'application/json; charset=ISO-8859-1;',
				  url_in: 	ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','DOWNLOAD',3), {'videoId': args.videoId})
				});
			
			*/
			/*
			var frame_links = $('#frame_links');
			frame_links.attr('src','');
			frame_links.empty();			
			if (args.callback) frame_links.attr('onload',args.callback);
			frame_links.attr('src',ConfigAPI.generateTemplate(ServiceManager.getUrlTemplate('YOUTUBE','DOWNLOAD',3), {'videoId': args.videoId}));
			*/
			//document.body.appendChild(document.createElement('script')).src='http://deturl.com/download-video.js?'+new Date().getTime();			
			getVideo(args.videoId);
			return ServiceManager['YOUTUBE']['DOWNLOAD']['RESULT'];
		};
	
	ServiceManager.setServiceConfig('YOUTUBE','DOWNLOAD', 3,
		{ version: 3, operation: 'GET', async: true, auth_app: false, auth_user: false,
		  cache: false, contentType: "application/json; charset=ISO-8859-1;", dataType: "jsonp", isLocal: false,
		  mimeType: 'application/json',
		  url_template:	"https://projects-sushilkumar.rhcloud.com/YTGrabber?url=http://www.youtube.com/watch?v=$$videoId&format=json"
		});
	
	//------------------------------

	//ServiceManager.setServiceConfig('YOUTUBE','youtube_user',
	//	{ version: 2, operation: 'GET', async: false, auth_app: false, auth_user: false,
	//	  cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
	//	  url_template: "http://gdata.youtube.com/feeds/api/users/$$user_name"});


	ServiceManager.setServiceConfig('YOUTUBE','CREATE_PLAYLIST', 3,
		{ version: 3, operation: 'POST', async: false, auth_app: false, auth_user: true,
		  cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		  url_template:	"https://www.googleapis.com/youtube/v3/playlists?part=snippet,status&"+ConfigAPI.getConfig('playlistManager','X-GData-Key'),
		  body_template:	'{ "snippet": { "title": "$$playlist_name" }, "status": { "privacyStatus": "unlisted" } }' });

	ServiceManager.setServiceConfig('YOUTUBE','SEARCH', 3,
		{ version: 3, operation: 'GET', async: false, auth_app: false, auth_user: true,
		  cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		  url_template:	"https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&$$query&$$type&"+ConfigAPI.getConfig('playlistManager','X-GData-Key')});

	ServiceManager.setServiceConfig('YOUTUBE','ADD_TO_PLAYLIST', 3,
		{ version: 3, operation: 'POST', async: false, auth_app: false, auth_user: true,
		  cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		  url_template:	"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&"+ConfigAPI.getConfig('playlistManager','X-GData-Key'),
		  body_template:	'{ "snippet": { "playlistId": "$$playlistId", "position": $$position, "resourceId": {"videoId": "$$videoId","kind": "youtube#video"} } }'});
		  //body_template:	'{ "snippet": { "playlistId": "$$playlistId", "resourceId": {"videoId": "$$videoId","kind": "youtube#video"} } }'});

	ServiceManager.setServiceConfig('YOUTUBE','ADD_TO_PLAYLIST_BULK', 3,
		{ version: 3, operation: 'POST', async: false, auth_app: false, auth_user: true,
		  cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		  url_template:	"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&"+ConfigAPI.getConfig('playlistManager','X-GData-Key'),
		  body_template:	'$$body'});
		  //body_template:	'{ "snippet": { "playlistId": "$$playlistId", "position": "$$position", "resourceId": {"videoId": "$$videoId","kind": "youtube#video"} } }'});


	ServiceManager.setServiceConfig('YOUTUBE','GET_PLAYLISTS', 3,
		{ version: 3, operation: 'GET', async: false, auth_app: false, auth_user: true,
		  cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		  url_template:	"https://www.googleapis.com/youtube/v3/playlists?part=id,snippet,status&maxResults=50&$$mine&$$filters&$$channelId&"+ConfigAPI.getConfig('playlistManager','X-GData-Key')});

	ServiceManager.setServiceConfig('YOUTUBE','GET_PLAYLIST', 3,
		{ version: 3, operation: 'GET', async: false, auth_app: false, auth_user: true,
		  cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		  url_template:	"https://www.googleapis.com/youtube/v3/playlistItems?part=id,snippet&maxResults=50&$$pageToken&$$playlistId&"+ConfigAPI.getConfig('playlistManager','X-GData-Key')});

	ServiceManager.setServiceConfig('YOUTUBE','GET_VIDEO', 3,
			{ version: 3, operation: 'GET', async: false, auth_app: false, auth_user: true,
			  cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
			  url_template:	"https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails,statistics&maxResults=50&$$pageToken&$$videoIdList&"+ConfigAPI.getConfig('playlistManager','X-GData-Key')});

	ServiceManager.setServiceConfig('YOUTUBE','DELETE_PLAYLIST', 3,
		{ version: 3, operation: 'DELETE', async: false, auth_app: false, auth_user: true,
		  cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		  url_template:	"https://www.googleapis.com/youtube/v3/playlists?$$playlistId&"+ConfigAPI.getConfig('playlistManager','X-GData-Key')});

	ServiceManager.setServiceConfig('YOUTUBE','USER_CHANNEL', 3,
		{ version: 3, operation: 'GET', async: false, auth_app: false, auth_user: true,
		  cache: false, contentType: "application/atom+xml; charset=UTF-8; type=feed", dataType: "xml", isLocal: false,
		  url_template:	"https://www.googleapis.com/youtube/v3/channels?part=id,snippet,contentDetails,topicDetails&$$mine&$$filters"});
	
}