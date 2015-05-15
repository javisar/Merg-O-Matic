
	/*
	https://code.google.com/apis/console/b/1/?noredirect#project:299529094319
	https://console.developers.google.com/project?authuser=1
	 */
	ConfigAPI.setConfig('playlistManager', 'suggestions', false);
	ConfigAPI.setConfig('playlistManager', 'client_id', "9999999999999-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com");
	ConfigAPI.setConfig('playlistManager', 'scope', [ 'https://www.googleapis.com/auth/youtube.readonly',
									'https://www.googleapis.com/auth/youtubepartner',
									'https://www.googleapis.com/auth/youtube',
									'https://www.googleapis.com/auth/userinfo.profile',
									'https://www.googleapis.com/auth/userinfo.email'
									]);
	ConfigAPI.setConfig('playlistManagerUI','UI_DEFAULT_LAYOUT',
		'{'
			+'"pane_channels": "position: absolute; top: 80px; left: 10px; width: 300px; height: 640px;",'
			+'"pane_login": "position: absolute; top: 5px; left: 10px; width: 140px; height: 60px;",'
			+'"pane_results": "left: 850px; top: 80px; position: absolute; width: 320px; height: 640px;",'
			+'"pane_search": "left: 390px; top: 5px; position: absolute; width: 780px; height: 60px;",'
			+'"pane_status": "position: absolute; top: 5px; left: 160px; width: 220px; height: 60px;",'
			+'"pane_tabs": "left: 320px; top: 80px; position: absolute; width: 520px; height: 640px;"'
		+'}');
	
