
	if (typeof PlaylistManager == 'undefined') {
		PlaylistManager = {};
		PlaylistManager['CONFIGS'] = {};


		PlaylistManager.loaded = false;
		PlaylistManager.isLoaded = function() { return PlaylistManager.loaded; };

		PlaylistManager.loadConfig = function(file) {
			var cfg_idx = PlaylistManager.File2Idx(file);
			if (!PlaylistManager['CONFIGS'][cfg_idx]) { PlaylistManager['CONFIGS'][cfg_idx] = {}; }

			return ModuleAPI.loadFile(file,'js');
		};

		PlaylistManager.getConfig = function(config,name) {
			if (!name) { return PlaylistManager['CONFIGS'][config]; }
			return PlaylistManager['CONFIGS'][config][name];
		};
		PlaylistManager.setConfig = function(config,name,value) {
			if (!PlaylistManager['CONFIGS'][config]) { PlaylistManager['CONFIGS'][config] = {}; }
			PlaylistManager['CONFIGS'][config][name] = value;
			return true;
		};		

		PlaylistManager.log = function(obj) {		console.log(obj[a]);	};
		
		PlaylistManager.onAuthLoaded = function(callback) {
			return ServiceManager.Call('OATH','INIT',{ 'callback': callback },true);
		};

		PlaylistManager.onAuthLoaded_callback = function(result) {
			setTimeout(function() { ServiceManager.Call('OATH','AUTHORIZE',{ 'immediate': true, 'callback': handleAuthResult },true); }, 2);
		  };
		  
		PlaylistManager.init = function() {
			gapi.client.setApiKey(ConfigAPI.getConfig('playlistManager','API-Key'));
			gapi.client.load('youtube', 'v3', function() { console.log('youtube api loaded.'); });
		
			PlaylistManager.onAuthLoaded(PlaylistManager.onAuthLoaded_callback);
			
			PlaylistManagerUI.UI_init();
		}
		
		PlaylistManager.dupsPlaylistsBulk = function(lists_to_dups) {
			if (!isAuth()) return;

			//alert(lists_to_dups);
			
			var user_pl = getUserPlaylists();		

			var completeVideolist = [];
			var totalVideos = 0;
					
			for (var plc = 0; plc < lists_to_dups.length; plc++) {
				var playlistId = lists_to_dups[plc];
				var nextPageToken = '';
				while (1) {
					var playlistPage = ServiceManager.Call('YOUTUBE','GET_PLAYLIST',{ 'playlistId': playlistId, 'pageToken': nextPageToken },true);
					if (!playlistPage) {
						alert("Cannot retrieve playlist '"+playlistId+"' videos");
						return null;
					}

					if (completeVideolist[plc] == undefined) completeVideolist[plc] = [];
					
					for (var vlc = 0; vlc < playlistPage['items'].length; vlc++) {
						//completeVideolist[playlistId][completeVideolist[playlistId].length] = playlistPage['items'][vlc]['snippet']['resourceId']['videoId'];
						completeVideolist[plc][completeVideolist[plc].length] = playlistPage['items'][vlc];
						totalVideos++;
					}
					nextPageToken = playlistPage['nextPageToken'];
					if (typeof nextPageToken == 'undefined') break;
				}
			}

			if (!confirm(totalVideos+' videos will be compared, are you sure?')) return;

			var duplicates = {};
			var dupId = 0;
			
			for (var plc1=0;plc1<completeVideolist.length;plc1++) {			
				var playlistVideos1 = completeVideolist[plc1];
				var playlistId1 = playlistVideos1[0]['snippet']['playlistId'];
				
				for (var plc2=0;plc2<completeVideolist.length;plc2++) {				
					var playlistVideos2 = completeVideolist[plc2];
					var playlistId2 = playlistVideos2[0]['snippet']['playlistId'];;
					
					var same = false;
					if (playlistId1 == playlistId2) same = true; // It is the same list
					
					
					for (var i1=0;i1<playlistVideos1.length;i1++) {
						for (var i2=0;i2<playlistVideos2.length;i2++) {
							if (same && i1 == i2) continue;
							
							if (playlistVideos1[i1]['snippet']['resourceId']['videoId'] != playlistVideos2[i2]['snippet']['resourceId']['videoId']) continue;
							
							var videoId = playlistVideos1[i1]['snippet']['resourceId']['videoId'];
							
							if (duplicates[videoId] == undefined) duplicates[videoId] = {};						
							if (duplicates[videoId][playlistId1] == undefined) duplicates[videoId][playlistId1] = {};
							if (duplicates[videoId][playlistId1][playlistId2] == undefined) duplicates[videoId][playlistId1][playlistId2] = {};
							if (duplicates[videoId][playlistId2] == undefined) duplicates[videoId][playlistId2] = {};		
							if (duplicates[videoId][playlistId2][playlistId1] == undefined) duplicates[videoId][playlistId2][playlistId1] = {};
							
							if (duplicates[videoId][playlistId1][playlistId2].dupId != undefined
									|| duplicates[videoId][playlistId2][playlistId1].dupId != undefined)
								continue;
							
							//console.log(playlistId1 + ' - ' +playlistId2 + ': '+videoId+'\n');
							
							duplicates[videoId][playlistId1][playlistId2] = {'dupId': dupId, 'videoId': videoId, 'playlistId1': playlistId1, 'playlistId2': playlistId2, 'item1': playlistVideos1[i1], 'item2': playlistVideos2[i2]}
							dupId++;
							//duplicates[videoId] = {'playlistId1': playlistId1, 'playlistId2': playlistId2, 'item1': playlistVideos1[i1], 'item2': playlistVideos2[i2]}
							//duplicates[duplicates.length] = [];
							//duplicates[duplicates.length-1] = {	'playlistId1': playlistId1, 'playlistId2': playlistId2, 'videoId': playlistVideos1[i1]};
						}
					}
					
				}					
			}
					
			if (!confirm(dupId+' duplicates were found, fill Delete tab with them?')) return;
			
			
			/*
			var out = '';
			for (var dup in duplicates) {
				for (var p1 in duplicates[dup]) {
					for (var p2 in duplicates[dup][p1]) {
						//duplicates[dup][p1][p2]
						out += dup +': '+ p1 + ' - ' + p2
					}
				}
				//out += dup +': '+duplicates[dup].playlistId1+' - '+duplicates[dup].playlistId2+'\n';			
			}
			console.log(out);
			*/
					
					
			return true;
			
		}
		
		PlaylistManager.deleteBulk = function(lists_to_dups) {
			if (!isAuth()) return;

			//alert(lists_to_dups);
			/*
			var user_pl = getUserPlaylists();		

			var completeVideolist = [];
			var totalVideos = 0;
					
			for (var plc = 0; plc < lists_to_dups.length; plc++) {
				var playlistId = lists_to_dups[plc];
				var nextPageToken = '';
				while (1) {
					var playlistPage = ServiceManager.Call('YOUTUBE','GET_PLAYLIST',{ 'playlistId': playlistId, 'pageToken': nextPageToken },true);
					if (!playlistPage) {
						alert("Cannot retrieve playlist '"+playlistId+"' videos");
						return null;
					}

					if (completeVideolist[plc] == undefined) completeVideolist[plc] = [];
					
					for (var vlc = 0; vlc < playlistPage['items'].length; vlc++) {
						//completeVideolist[playlistId][completeVideolist[playlistId].length] = playlistPage['items'][vlc]['snippet']['resourceId']['videoId'];
						completeVideolist[plc][completeVideolist[plc].length] = playlistPage['items'][vlc];
						totalVideos++;
					}
					nextPageToken = playlistPage['nextPageToken'];
					if (typeof nextPageToken == 'undefined') break;
				}
			}

			if (!confirm(totalVideos+' videos will be compared, are you sure?')) return;

			var duplicates = {};
			var dupId = 0;
			
			for (var plc1=0;plc1<completeVideolist.length;plc1++) {			
				var playlistVideos1 = completeVideolist[plc1];
				var playlistId1 = playlistVideos1[0]['snippet']['playlistId'];
				
				for (var plc2=0;plc2<completeVideolist.length;plc2++) {				
					var playlistVideos2 = completeVideolist[plc2];
					var playlistId2 = playlistVideos2[0]['snippet']['playlistId'];;
					
					var same = false;
					if (playlistId1 == playlistId2) same = true; // It is the same list
					
					
					for (var i1=0;i1<playlistVideos1.length;i1++) {
						for (var i2=0;i2<playlistVideos2.length;i2++) {
							if (same && i1 == i2) continue;
							
							if (playlistVideos1[i1]['snippet']['resourceId']['videoId'] != playlistVideos2[i2]['snippet']['resourceId']['videoId']) continue;
							
							var videoId = playlistVideos1[i1]['snippet']['resourceId']['videoId'];
							
							if (duplicates[videoId] == undefined) duplicates[videoId] = {};						
							if (duplicates[videoId][playlistId1] == undefined) duplicates[videoId][playlistId1] = {};
							if (duplicates[videoId][playlistId1][playlistId2] == undefined) duplicates[videoId][playlistId1][playlistId2] = {};
							if (duplicates[videoId][playlistId2] == undefined) duplicates[videoId][playlistId2] = {};		
							if (duplicates[videoId][playlistId2][playlistId1] == undefined) duplicates[videoId][playlistId2][playlistId1] = {};
							
							if (duplicates[videoId][playlistId1][playlistId2].dupId != undefined
									|| duplicates[videoId][playlistId2][playlistId1].dupId != undefined)
								continue;
							
							//console.log(playlistId1 + ' - ' +playlistId2 + ': '+videoId+'\n');
							
							duplicates[videoId][playlistId1][playlistId2] = {'dupId': dupId, 'videoId': videoId, 'playlistId1': playlistId1, 'playlistId2': playlistId2, 'item1': playlistVideos1[i1], 'item2': playlistVideos2[i2]}
							dupId++;
							//duplicates[videoId] = {'playlistId1': playlistId1, 'playlistId2': playlistId2, 'item1': playlistVideos1[i1], 'item2': playlistVideos2[i2]}
							//duplicates[duplicates.length] = [];
							//duplicates[duplicates.length-1] = {	'playlistId1': playlistId1, 'playlistId2': playlistId2, 'videoId': playlistVideos1[i1]};
						}
					}
					
				}					
			}
					
			if (!confirm(dupId+' duplicates were found, fill Delete tab with them?')) return;
			*/					
			return true;
			
		}
		

		PlaylistManager.loaded = true;
	}




	var merge_playlistId = undefined;
	var merge_videoList = undefined;
	var merge_currentVideo = 0;
	var autocomplete_resultList = [];


	function getAuthResult() {
			return ServiceManager['OATH']['AUTHORIZE']['RESULT'];
	};

	function isAuth() {
		return (getAuthResult() != undefined)
	};
	
	function handleAuthResult(authResult) {
		if (authResult && !authResult.error) {
			ServiceManager['OATH']['AUTHORIZE']['RESULT'] = authResult;

			$('.login_button').text("Logout");
		} else {
			ServiceManager['OATH']['AUTHORIZE']['RESULT'] = null;
			var message;
			if (authResult && authResult.error) {
				alert("Authentication failed: " + authResult.error);
				message = "Login";
			} else {
				message = "Login";
			}
			$('.login_button').text(message);
		}
	};
	  

	function download(id,type,callback) {
		var args = { 'callback': callback };
		args[type] = id;
		var result =  ServiceManager.Call('YOUTUBE','DOWNLOAD',args, true);
		return result;
	};

	function findPlaylistsByTitle(title,xml_data) {
		//var matches = $(xml_data).find("entry title:contains('"+title+"')");
		//return matches;
		var matches = [];
		var counter = 0;
		for (i in xml_data['items']) {
			if (xml_data['items'][i]['snippet']['title'].indexOf(title) >= 0) {
				matches[counter++]=xml_data['items'][i]['id'];
			}
		}
		return matches;
	}


	function search(query,type) {
		var result = null;

		result = ServiceManager.Call('YOUTUBE','SEARCH',{'query': query, 'type':type}, true);
		//search_resultList[query] = result;
		if (!result) {
			alert("Cannot search '"+type+"' for '"+query+"'");
			return null;
		}
		return result;
	}
	
	
	function getVideoData(videoIdList,callback) {
		var result = null;

		ServiceManager.Call('YOUTUBE','GET_VIDEO',{'videoIdList': videoIdList, 'callback': callback, 'ajax': {'async': true}}, true);
		
	}
	
	function getPlaylistData(playlistId,callback) {
		var result = null;

		ServiceManager.Call('YOUTUBE','GET_PLAYLIST',{'playlistId': playlistId, 'callback': callback, 'ajax': {'async': true}}, true);
		
	}

	function createPlaylist(dest_list_name) {
		var result = null;
		var user_pl = getUserPlaylists();
		var already_exists = findPlaylistsByTitle(dest_list_name,user_pl);
		if (already_exists.length > 0) {
			alert('The playlist already exists');
			return;
		}

		result = ServiceManager.Call('YOUTUBE','CREATE_PLAYLIST',{'playlist_name': dest_list_name},true);
		if (!result) {
			alert("Cannot create playlist '"+dest_list_name+"'");
			return null;
		}
		return result;
	}


	function deletePlaylist(dest_list_name) {
		var result = null;
		var user_pl = getUserPlaylists();
		var already_exists = findPlaylistsByTitle(dest_list_name,user_pl);
		if (already_exists.length == 0) {
			alert('The playlist does not exists');
			return;
		}
		for (var i=0; i<$(already_exists).length; i++) {
				var playlistId = already_exists[i];
				if (confirm('You will delete "'+dest_list_name+'"\nid: ['+playlistId+'].\nAre you sure?')) {
					result = ServiceManager.Call('YOUTUBE','DELETE_PLAYLIST',{'playlistId': 'id='+playlistId},true);
					if (!result) {
						alert("Cannot delete playlist '"+playlistId+"'");
						return null;
					}
				}
			}

		return result;
	}

	//function addToPlaylist(playlistId,videoId) {
	//	var result = CALL_GOOGLE_SERVICE('YOUTUBE','ADD_TO_PLAYLIST',{'playlistId':playlistId,'videoId':videoId},true);
	//	return result;
	//}
	/*
	function getSuggestQueries_callback(result) {
		autocomplete_resultList = result;
		console.log(result);
	}
	
	function getSuggestQueries(client,ds,query) {
		var result = ServiceManager.Call('GOOGLE','SUGGEST_QUERIES',{'client': client, 'ds': ds, 'query': query, 'callback': getSuggestQueries_callback},true);
		return result;
	}
	*/
	function getChannelPlaylists(mine,channelId) {
		//var result = ServiceManager.Call('YOUTUBE','GET_PLAYLISTS',{},true);
		var result = null;
		if (mine)
			result = ServiceManager.Call('YOUTUBE','GET_PLAYLISTS',{'mine': 'mine='+mine, 'filters': '', 'channelId': '' },true);
		else
			result = ServiceManager.Call('YOUTUBE','GET_PLAYLISTS',{'mine': '', 'filters': '', 'channelId': 'channelId='+channelId },true);
		//channel_videoList = result;
		return result;
	}

	function getUserPlaylists() {
		//var result = ServiceManager.Call('YOUTUBE','GET_PLAYLISTS',{},true);
		var result = ServiceManager.Call('YOUTUBE','GET_PLAYLISTS',{'mine': 'mine=true', 'filters': '', 'channelId':'' },true);
		return result;
	}

	function addItemToPlaylist(playlistId,videoId,position) {
		var result = ServiceManager.Call('YOUTUBE','ADD_TO_PLAYLIST',{ 'playlistId': playlistId, 'videoId': videoId, 'position': position },true);
		return result;
	}

	function addItemToPlaylistBulk(body) {
		var result = ServiceManager.Call('YOUTUBE','ADD_TO_PLAYLIST_BULK',{ 'body': body },true);
		return result;
	}

	function mergePlaylists(dest_list_name,lists_to_merge) {
		if (!isAuth()) return;

		var user_pl = getUserPlaylists();
		var already_exists = findPlaylistsByTitle(dest_list_name,user_pl);
		if (already_exists.length > 0) {
			alert('The dest playlist already exists');
			return null;
		}

		var completeVideolist = [];
		var totalVideos = 0;

		for (var plc = 0; plc < lists_to_merge.length; plc++) {
			var playlistId = lists_to_merge[plc];
			var nextPageToken = '';
			while (1) {
				var playlistPage = ServiceManager.Call('YOUTUBE','GET_PLAYLIST',{ 'playlistId': playlistId, 'pageToken': nextPageToken },true);
				if (!playlistPage) {
					alert("Cannot retrieve playlist '"+playlistId+"' videos");
					return null;
				}

				for (var vlc = 0; vlc < playlistPage['items'].length; vlc++) {
					completeVideolist[totalVideos++] = playlistPage['items'][vlc]['snippet']['resourceId']['videoId'];
				}
				nextPageToken = playlistPage['nextPageToken'];
				if (typeof nextPageToken == 'undefined') break;
			}
		}

		if (!confirm(completeVideolist.length+' will be mixed to the new list named '+dest_list_name)) return;

		var result = createPlaylist(dest_list_name);
		user_pl = getUserPlaylists();
		var already_exists = findPlaylistsByTitle(dest_list_name,user_pl);
		if (already_exists.length == 0) {
			alert('Cannot create the dest playlist');
			return null;
		}

		var dest_list_id = already_exists[already_exists.length-1];
		var total_added = 0;
		var errors = '';
		for (var vc = 0; vc < completeVideolist.length; vc++) {
			var counter = 0;
			var added = false;
			while (!added && counter < 10) {
				added = addItemToPlaylist(dest_list_id,completeVideolist[vc],total_added+1);
				if (!added) alert("Failed to add video '"+completeVideolist[vc]+"' to playlist. Retrying ...");
				counter++;
			}
			if (!added) {
				errors+="Cannot add item '"+completeVideolist[vc]+"' to playlist '"+playlistId+"'\n";
				break;
			}
			total_added++;
		}
		alert('Total items added: '+total_added);
		if (errors.length>0)
			alert('ERRORS:\n'+errors);

		return result;
	}


	function mergePlaylistsBulkOld(dest_list_name,lists_to_merge) {
		if (!isAuth()) return;

		var user_pl = getUserPlaylists();
		var already_exists = findPlaylistsByTitle(dest_list_name,user_pl);
		if (already_exists.length > 0) {
			alert('The dest playlist already exists');
			return null;
		}

		var completeVideolist = [];
		var totalVideos = 0;

		for (var plc = 0; plc < lists_to_merge.length; plc++) {
			var playlistId = lists_to_merge[plc];
			var nextPageToken = '';
			while (1) {
				var playlistPage = ServiceManager.Call('YOUTUBE','GET_PLAYLIST',{ 'playlistId': playlistId, 'pageToken': nextPageToken },true);
				if (!playlistPage) {
					alert("Cannot retrieve playlist '"+playlistId+"' videos");
					return null;
				}

				for (var vlc = 0; vlc < playlistPage['items'].length; vlc++) {
					completeVideolist[totalVideos++] = playlistPage['items'][vlc]['snippet']['resourceId']['videoId'];
				}
				nextPageToken = playlistPage['nextPageToken'];
				if (typeof nextPageToken == 'undefined') break;
			}
		}

		if (!confirm(completeVideolist.length+' will be mixed to the new list named '+dest_list_name)) return;

		var result = createPlaylist(dest_list_name);
		user_pl = getUserPlaylists();
		var already_exists = findPlaylistsByTitle(dest_list_name,user_pl);
		if (already_exists.length == 0) {
			alert('Cannot create the dest playlist');
			return null;
		}

		var dest_list_id = already_exists[already_exists.length-1];
		var total_added = 0;
		var errors = '';
		var body = '';
		for (var vc = 0; vc < completeVideolist.length; vc++) {
			body += '{ "snippet": { "playlistId": "'+dest_list_id+'", "position": "'+(total_added+1)+'", "resourceId": {"videoId": "'+completeVideolist[vc]+'","kind": "youtube#video"} } }';
			if (vc < completeVideolist.length-1) body += ', ';
			total_added++;
		}
		alert('Total items added: '+total_added);


		var added = addItemToPlaylistBulk(body);

		return result;
	}
	
	var merge_done_array = [];
	var merge_done_map  = {};
	var errors = [];
	function addError() {
		var errObj = [];
		for (var a=0; a<arguments.length; a++) errObj[errObj.length] = arguments[a];
		errors[errors.length] = errObj;
	};

	function update_merge_done(id) {
		var dataMap = merge_done_map[id]
		if (!dataMap) return false;
		
		var dataArray = merge_done_array[dataMap.idx];
		
		if (!dataArray.sended) 	addError("Video '"+id+"' has not been sended before!",dataArray);
		if (dataArray.done) 	{
			addError("Video '"+id+"' has been already added!",dataArray);
			return false;
		}
		else {
			dataArray.done = true;
			merge_currentVideo++;
			return true;
		}		
	};
	
	function get_next_merge() {
		if (merge_currentVideo >= merge_videoList.length) return false;
		
		for (var m=0; m<merge_done_array.length; m++) {
			if (!merge_done_array[m].done && !merge_done_array[m].sended) {
				merge_done_array[m].sended = true;
				
				return merge_done_array[m];
			}
		}
		return false;
	};
	
	function get_id_safe(type,response) {
		try {			return response.result.snippet.resourceId[type];	}
		catch(ex) {	return false;		}		
	};
	
	
		
	function run_merge(response) {
		if (typeof merge_videoList == 'undefined') return;
		
		var id = get_id_safe('videoId',response);
		
		if (typeof response == 'undefined' || typeof response.error != 'undefined' || !id) {
			addError('Not valid response received!',response);
		}
		else {
			update_merge_done(id);
			//merge_currentVideo++;
		}
		
		var merge = get_next_merge();
		if (!merge) {
			alert('No more objects to merge!');
			if (errors.length > 0) { alert('There were errors during the process. See the log.'); for (e in errors) console.log(errors[e]); }
			return;
		}		
				
		//var nextVideoId = merge_videoList[merge_currentVideo];
		var nextVideoId = merge_videoList[merge.idx];
		addToPlaylist(nextVideoId);

	}


	// Add a video to a playlist.
	function addToPlaylist(id, startPos, endPos) {
	  var details = {
		videoId: id,
		kind: 'youtube#video'
	  }
	  if (startPos != undefined) {
		details['startAt'] = startPos;
	  }
	  if (endPos != undefined) {
		details['endAt'] = endPos;
	  }
	  var request = gapi.client.youtube.playlistItems.insert({
		part: 'snippet',
		resource: {
		  snippet: {
			playlistId: merge_playlistId,
			resourceId: details
		  }
		}
	  });
	  request.execute(function(response) {
		if (merge_currentVideo == merge_videoList.length) {
			alert(merge_currentVideo+" merged");
			merge_playlistId = undefined;
			merge_videoList = undefined;
			merge_currentVideo = 0;
			return;
		}
		run_merge(response);
	  });
	}

	function mergePlaylistsBulk(dest_list_name,lists_to_merge) {
		if (!isAuth()) return;

		var user_pl = getUserPlaylists();
		var already_exists = findPlaylistsByTitle(dest_list_name,user_pl);
		if (already_exists.length > 0) {
			alert('The dest playlist already exists');
			return null;
		}

		var completeVideolist = [];
		var totalVideos = 0;

		for (var plc = 0; plc < lists_to_merge.length; plc++) {
			var playlistId = lists_to_merge[plc];
			var nextPageToken = '';
			while (1) {
				var playlistPage = ServiceManager.Call('YOUTUBE','GET_PLAYLIST',{ 'playlistId': playlistId, 'pageToken': nextPageToken },true);
				if (!playlistPage) {
					alert("Cannot retrieve playlist '"+playlistId+"' videos");
					return null;
				}

				for (var vlc = 0; vlc < playlistPage['items'].length; vlc++) {
					completeVideolist[totalVideos++] = playlistPage['items'][vlc]['snippet']['resourceId']['videoId'];
				}
				nextPageToken = playlistPage['nextPageToken'];
				if (typeof nextPageToken == 'undefined') break;
			}
		}

		if (!confirm(completeVideolist.length+' will be mixed to the new list named '+dest_list_name)) return;

		var result = createPlaylist(dest_list_name);
		user_pl = getUserPlaylists();
		var already_exists = findPlaylistsByTitle(dest_list_name,user_pl);
		if (already_exists.length == 0) {
			alert('Cannot create the dest playlist');
			return null;
		}

		var dest_list_id = already_exists[already_exists.length-1];

		merge_playlistId = dest_list_id;
		merge_videoList = completeVideolist;
		merge_currentVideo = 0;

		merge_done_array = [];
		merge_done_map = {};
		errors = [];
		for (var i=0; i<merge_videoList.length;i++) {
			merge_done_array[i] = {'id': merge_videoList[i], 'sended': false, 'done': false, 'idx': i };
			merge_done_map[merge_videoList[i]] = {'id': merge_videoList[i], 'idx': i };
		}
		
		run_merge();
		/*
		var total_added = 0;
		var errors = '';
		var body = '';
		for (var vc = 0; vc < completeVideolist.length; vc++) {
			body += '{ "snippet": { "playlistId": "'+dest_list_id+'", "position": "'+(total_added+1)+'", "resourceId": {"videoId": "'+completeVideolist[vc]+'","kind": "youtube#video"} } }';
			if (vc < completeVideolist.length-1) body += ', ';
			total_added++;
		}
		alert('Total items added: '+total_added);


		var added = addItemToPlaylistBulk(body);

		return result;
		*/
		return true;
	}


	
	
	function composePlaylist(playlist_name, video_list) {
		var vlist = [];
		for (var vc = 0; vc < video_list.length; vc++) {
			vlist.push($(video_list[vc]).attr('id_yt'));
		}
		composePlaylistIdList(vlist);
	}

	function composePlaylistIdList(playlist_name, video_list) {
		var result = createPlaylist(playlist_name);
		var playlist_id = result.id;
		var total_added = 0;
		var errors = '';
		for (var vc = 0; vc < video_list.length; vc++) {
			var counter = 0;
			var added = false;
			while (!added && counter < 10) {
				var video_id = video_list[vc]
				if (video_id.indexOf("/watch") >= 0) {
					video_id = video_id.substring(video_id.indexOf("v=")+2);
					video_id = video_id.split("&")[0];
				}
				added = addItemToPlaylist(playlist_id,video_id,total_added+1);
				if (!added) alert("Failed to add video '"+completeVideolist[vc]+"' to playlist. Retrying ...");
				counter++;
			}
			if (!added) {
				errors+="Cannot add item '"+completeVideolist[vc]+"' to playlist '"+playlistId+"'\n";
				break;
			}
			total_added++;
		}
		alert('Total items added: '+total_added);
		if (errors.length>0)
			alert('ERRORS:\n'+errors);
	}

//----------------------------------------

	var channelId = '';

	function getTimeStamp() {
		return (new Date()).getTime()
	};

	function hasClass(classNames,cName) {
		//if (typeof classNames == 'string') classNames[0] = classNames;
		//for (var cn in classNames) if (classNames[a])
		if (classNames.indexOf(cName) >= 0) return true;
		return false;
	};

	function getSourceClass(event) {	return event.fromElement.className; }
	function getTargetClass(event) {	return event.toElement.className; }


	function CallGAPI(request,doEval,callback) {
			//var result = ServiceManager[api][service].CALL(args);
			request.execute(function(response) {
			  if ('error' in response) {
				alert(response.error.message);
				//return null;
			  } else {
				var result = response;				
				if (doEval && (typeof result == 'string')) {
					var evaluated = null;
					try {
						evaluated = eval('('+result+')');
						result = evaluated;
					} catch(ex) { alert(ex); }
				}
				result.request = request;
				callback(result);
				//return result;
			  }
			});
		};

	function getUserPlaylistsGAPI(callback,id) {
		// https://developers.google.com/youtube/v3/docs/channels/list
		/*
		var request = gapi.client.youtube.playlists.list({
		  // "mine: true" indicates that you want to retrieve the authenticated user's channel.
		  maxResults: 40,
		  mine: true,
		  part: 'id,snippet'
		});
		request.type = 'playlist';

		CallGAPI(request,true,callback);
		*/
		var result = getChannelPlaylists(true);
		result.request = {'type':'playlist'};
		if (id) result.htmlId = id;
		callback(result);
	  }
	
