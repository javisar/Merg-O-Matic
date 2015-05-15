
	$.fn.textWidth = function(){
	  var html_org = $(this).html();
	  var html_calc = '<span>' + html_org + '</span>';
	  $(this).html(html_calc);
	  var width = $(this).find('span:first').width();
	  $(this).html(html_org);
	  return width;
	};
	
	$.fn.textHeight = function(width){
		  if (!width) width = $(this).textWidth();
		  var html_org = $(this).html();
		  var html_calc = '<span style="width: '+width+'px">' + html_org + '</span>';
		  $(this).html(html_calc);
		  var height = $(this).find('span:first').height();
		  $(this).html(html_org);
		  return height;
		};

	if (typeof PlaylistManagerUI == 'undefined') {
		PlaylistManagerUI = {};
		
		PlaylistManagerUI.rowHeight = 70;

		PlaylistManagerUI.loaded = false;
		PlaylistManagerUI.isLoaded = function() { return PlaylistManagerUI.loaded; };


		PlaylistManagerUI.UI_init = function() {
			PlaylistManagerUI.UI_load_templates();
			PlaylistManagerUI.UI_create_widgets();
			PlaylistManagerUI.UI_init_widgets();
			PlaylistManagerUI.UI_load_layout();			
		};

		//PlaylistManagerUI.addListTab('tabs_center','tabs_center-7','tabla_to_dups','Compare',tabs-list-template-action,['playlist_destiny','video_destiny']);
		//PlaylistManagerUI.addListTab = function(tabContainerId,tabId,listId,actionName,actionFunc,listClasses) {
		PlaylistManagerUI.UI_wrapper_drop = null;
		
		PlaylistManagerUI.addListTab = function(args) {
			// Creamos un nuevo nodo para el menu
			var newMenu = $('#tabs-list-template-menu').clone();
			newMenu.attr('id','tabs-list-'+args.listId+'-template-menu');
			newMenu.children().attr('href','#'+args.tabId);
			newMenu.children().text(args.actionName);
			// A�adimos la nueva lista a la barra
			$('#'+args.tabContainerId+' a').first().add(newMenu);
			
			var newTab = $('#'+args.template).clone();
			newTab.attr('id',args.tabId);
			
			var newInput = newTab.find('.tabs-list-template-input');
			newInput.attr('id','tabs-list-'+args.listId+'-template-input');
			if (!args.actionInput) newInput.parent().css('visibility','hidden');
			
			var newButton = newTab.find('.tabs-list-template-button');
			newButton.attr('id','tabs-list-'+args.listId+'-template-button');
			newButton.text(args.actionName);
			newButton.click(args.actionFunc);
			if (!args.actionButton) newButton.parent().css('visibility','hidden');
			
			var newClear = newTab.find('.tabs-list-template-clear');
			newClear.attr('id','tabs-list-'+args.listId+'-template-clear');
			newClear.click(PlaylistManagerUI.UI_clear);
			if (!args.clearButton) newClear.parent().css('visibility','hidden');
			
			
			var newList = newTab.find('.table_to_template');
			newList.attr('id',args.listId);
			newList.removeClass('table_to_template');
			for (var cl in args.listClasses) newList.addClass(args.listClasses[cl]);					
			
			if (newList.hasClass('tabs-list-template-body-append')) {
				newList.droppable({
						activeClass: "ui-state-default",
						hoverClass: "ui-state-hover",
						accept: function(d) { return true;},
						drop: function( ev, ui ) {
							setTimeout("$('#"+args.listId+" .placeholder').remove();");
							ev.stopPropagation();
							//PlaylistManagerUI.UI_total_resize(args.listId,PlaylistManagerUI.rowHeight);
						}
			    	}).sortable({
						placeholder: "placeholder",
						items: "li:not(.placeholder)",
					    sort: function() {
					        // gets added unintentionally by droppable interacting with sortable
					        // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
					        $( this ).removeClass( "ui-state-default" );
					    },
						revert: "invalid" 
					}).disableSelection();
			}
			
			if (newList.hasClass('tabs-list-template-body-append-auto')) {
				newList.droppable({
					activeClass: "ui-state-default",
					hoverClass: "ui-state-hover",
					accept: function(d) { return true;},
					drop: function( ev, ui ) {
						//$( this ).find( ".placeholder" ).remove();
						setTimeout("$('#"+args.listId+" .placeholder').remove();");
						ev.stopPropagation();
						UI_download(ui.draggable);
					}
			    });
			}
			
			if (newList.hasClass('tabs-list-template-body-append-play')) {
				newList.droppable({
					activeClass: "ui-state-default",
					hoverClass: "ui-state-hover",
					accept: function(d) { return true;},
					drop: function( ev, ui ) {
						//$( this ).find( ".placeholder" ).remove();
						setTimeout("$('#"+args.listId+" .placeholder').remove();");
						ev.stopPropagation();
						
						UI_play(ui.draggable);
					}
			    });
			}

			
			//$('#'+args.tabContainerId+' ul').not('.connectedSortable').add(newMenu);
			$('#'+args.tabContainerId+' ul').not('.connectedSortable').append(newMenu);
			$('#'+args.tabContainerId).append(newTab);	
			
			newMenu.css('visibility','visible');
			newTab.css('visibility','visible');			
		};
		
		PlaylistManagerUI.addListPane = function(args) {		
			var newTab = $('#'+args.template).clone();
			newTab.attr('id',args.tabId);
			
			var newResult = newTab.find('.pane-template-results');
			newResult.attr('id',args.listId);
			newResult.removeClass('pane-template-results');

			var menuOpt;
			for (var i=1;i<11;i++) {
				for (var j=1;j<11;j++) {
					for (var k=1;k<11;k++) {
						menuOpt = newResult.find('.pane-template-results-n'+i+'_'+j+'_'+k);
						menuOpt.attr('id',args.listId+'_'+i+'_'+j+'_'+k);
						menuOpt.removeClass('pane-template-results-n'+i+'_'+j+'_'+k);
					}
					menuOpt = newResult.find('.pane-template-results-n'+i+'_'+j);
					menuOpt.attr('id',args.listId+'_'+i+'_'+j);
					menuOpt.removeClass('pane-template-results-n'+i+'_'+j);
				}
				menuOpt = newResult.find('.pane-template-results-n'+i);
				menuOpt.attr('id',args.listId+'_'+i);
				menuOpt.removeClass('pane-template-results-n'+i);
			}						
			
			newResult.find('.rescale_button').attr('id',args.listId+'_rescale_button').removeClass('rescale_button');
			newResult.find('.save_config_button').attr('id',args.listId+'_save_config_button').removeClass('save_config_button');
			newResult.find('.cancel_config_button').attr('id',args.listId+'_cancel_config_button').removeClass('cancel_config_button');
			newResult.find('.login_button').attr('id',args.listId+'_login_button').removeClass('login_button');
			
			
			var newResultBody = newTab.find('.pane-template-results-body');
			newResultBody.attr('id','tab_result_'+args.listId);
			newResultBody.removeClass('pane-template-results-body');
			
			var newInput = newTab.find('.pane-template-input');
			newInput.attr('id','pane-'+args.listId+'-template-input');
			if (!args.actionInput) newInput.parent().css('visibility','hidden');
			
			var newButton = newTab.find('.pane-template-button');
			newButton.attr('id','pane-'+args.listId+'-template-button');
			newButton.text(args.actionName);
			newButton.click(args.actionFunc);
			if (!args.actionButton) newButton.parent().css('visibility','hidden');
			
			var newClear = newTab.find('.pane-template-clear');
			newClear.attr('id','pane-'+args.listId+'-template-clear');
			newClear.click(PlaylistManagerUI.UI_clear);
			if (!args.clearButton) newClear.parent().css('visibility','hidden');
			
			
			var newList = newTab.find('.pane_to_template');
			newList.attr('id',args.listId);
			newList.removeClass('pane_to_template');
			for (var cl in args.listClasses) newList.addClass(args.listClasses[cl]);
						
			
			$('#'+args.tabContainerId).append(newTab);	
			
			newTab.css('visibility','visible');			
		};

		
		PlaylistManagerUI.UI_load_templates = function() {
			//$("#tabs-list-panes").load("./TemplatesPane.html");
			//$("#tabs-list-panes").load("./TemplatesTab.html");
			$(function() {
			    $( document ).tooltip();
			  });
		};
		
		PlaylistManagerUI.UI_clear = function() {
			var tabContainer = $( "#pane_tabs .pane-template-body-tabs-fixed");
			var nActiveTab = tabContainer.tabs('option','active');
			var activeTab = tabContainer.find('.ui-tabs-panel' )[nActiveTab];
			
			if (!confirm('this will reset the current list, are you sure?')) return;
			
			$('#'+activeTab.id+' .table_list').empty();
		};
		
		PlaylistManagerUI.UI_delete = function() {
			
			/*
			var dest_list_name = $('#input_delete_list_name').attr("value");
			if (dest_list_name.length == 0) {
				alert('Please, select a playlist to delete');
				return;
			}
			var result = deletePlaylist(dest_list_name);
			UI_reload_playlists();
			*/
			
		}
		
		PlaylistManagerUI.UI_dups_playlists = function() {

			
			var lists_to_dups = Table2AttrArray(table_to_dups,'id_yt');
		
			if (lists_to_dups.length == 0) {
				alert('There is no playlists to compare.');
				return;
			}

			//var result = mergePlaylists(dest_list_name,lists_to_merge);
			var result = PlaylistManager.dupsPlaylistsBulk(lists_to_dups);

			PlaylistManagerUI.UI_reload_channel_playlists();
		};
		

		PlaylistManagerUI.UI_compose_playlists = function() {

			//var dest_list_name = $('#input_compose_list_name').attr("value");
			var dest_list_name = $('#tabs-list-table_to_compose-template-input').attr("value");
			if (dest_list_name.length == 0) {
				alert('Please, enter a playlist name to create');
				return;
			}
			var result = composePlaylist(dest_list_name,$('#table_to_compose li'));

			//a�adir los videos
			UI_reload_playlists();
		};

		PlaylistManagerUI.UI_merge_playlists = function() {

			//var dest_list_name = $('#input_merge_list_name').attr("value");
			var dest_list_name = $('#tabs-list-table_to_merge-template-input').attr("value");
			var lists_to_merge = Table2AttrArray(table_to_merge,'id_yt');

			if (dest_list_name.length == 0) {
				alert('Please, enter a dest playlist name.');
				return;
			}
			if (lists_to_merge.length == 0) {
				alert('There is no playlists to merge.');
				return;
			}

			//var result = mergePlaylists(dest_list_name,lists_to_merge);
			var result = mergePlaylistsBulk(dest_list_name,lists_to_merge);

			PlaylistManagerUI.UI_reload_channel_playlists();
		};
		
		PlaylistManagerUI.UI_create_from_ids_playlists = function() {

			//var dest_list_name = $('#input_merge_list_name').attr("value");
			var dest_list_name = $('#tabs-list-table_to_create-template-input').attr("value");
			var id_list_raw = $('#create_id_list').val();
			var id_list = id_list_raw.split('\n');
			id_list = id_list.filter(function (el) {
                     return el !== "";
                    });
			
			if (dest_list_name.length == 0) {
				alert('Please, enter a dest playlist name.');
				return;
			}
			if (id_list.length == 0) {
				alert('There is no videos to add.');
				return;
			}

			//var result = mergePlaylists(dest_list_name,lists_to_merge);
			//var result = mergePlaylistsBulk(dest_list_name,lists_to_create);
			
			var result = composePlaylistIdList(dest_list_name,id_list);

			//PlaylistManagerUI.UI_reload_channel_playlists();
			
		};
		
		PlaylistManagerUI.UI_reload_channel_playlists = function() {
			if (!isAuth()) {
				alert("Please, log in your youtube account and allow some operations");
				return;
			}
			getUserPlaylistsGAPI(UI_update_channel,'table_channel_playlists');

		};

		
		PlaylistManagerUI.UI_load_layout = function() {		
			var design = ConfigAPI.getCookie('plm_design');
			//if (typeof design == 'undefined') design = UI_DEFAULT_LAYOUT;
			if (typeof design == 'undefined') design = ConfigAPI.getConfig('playlistManagerUI','UI_DEFAULT_LAYOUT');
			
			PlaylistManagerUI.setDesign(design);
			ConfigAPI.setCookie('plm_design',design,365);
		};	

		
		PlaylistManagerUI.UI_create_widgets = function() {	

			
			// Panes
			/*
			PlaylistManagerUI.addListPane({	
				'actionName': 'My Channel',	'actionButton': true,				'actionInput': false,					'clearButton': false,
				'tabId': 'pane_channels',	'tabContainerId': 'tabs-list-panes','listId': 'table_channel_playlists',	'actionFunc': PlaylistManagerUI.UI_reload_channel_playlists,
				'template': 'pane-template-body-pager',							'listClasses': []});
			*/
			
			PlaylistManagerUI.addListPane({	
				'actionName': '',			'actionButton': false,				'actionInput': false,					'clearButton': false,
				'tabId': 'pane_tabs',		'tabContainerId': 'tabs-list-panes','listId': 'tabs_center',				'actionFunc': null,
				'template': 'pane-template-body-tabs-fixed',						'listClasses': []});
			
			PlaylistManagerUI.addListPane({	
				'actionName': 'SearchResults',	'actionButton': false,			'actionInput': false,					'clearButton': true,
				'tabId': 'pane_results',	'tabContainerId': 'tabs-list-panes','listId': 'tabs_left',					'actionFunc': null,
				'template': 'pane-template-body-tabs-closeable',							'listClasses': []});
			
			PlaylistManagerUI.addListPane({	
				'actionName': 'Status',			'actionButton': false,			'actionInput': false,					'clearButton': false,
				'tabId': 'pane_status',		'tabContainerId': 'tabs-list-panes','listId': 'progress_bar',				'actionFunc': null,
				'template': 'pane-template-body-status',							'listClasses': []});

			PlaylistManagerUI.addListPane({	
				'actionName': 'Menu',			'actionButton': false,			'actionInput': false,					'clearButton': false,
				'tabId': 'pane_login',			'tabContainerId': 'tabs-list-panes','listId': 'config_menu',			'actionFunc': null,
				'template': 'pane-template-body-login',							'listClasses': []});
			
			PlaylistManagerUI.addListPane({	
				'actionName': 'Search',			'actionButton': true,			'actionInput': true,					'clearButton': false,
				'tabId': 'pane_search',			'tabContainerId': 'tabs-list-panes','listId': 'search_type',			'actionFunc': UI_search,
				'template': 'pane-template-body-search',							'listClasses': []});
			
			// Tabs			
			/*			
			PlaylistManagerUI.addListTab({	
				'actionName': '',		'actionButton': false,				'actionInput': false,		'clearButton': false,
				'tabId': 'my_channel_playlist',	'tabContainerId': 'tabs_right',	'listId': 'table_channel_playlists', 'actionFunc': null,
				'template': 'tabs-list-template-body-append',						'listClasses': ['playlist_destiny']});		
			*/
			
			PlaylistManagerUI.addListTab({	
				'actionName': 'Merge',		'actionButton': true,				'actionInput': true,		'clearButton': true,
				'tabId': 'tabs_center-3',	'tabContainerId': 'tabs_center',	'listId': 'table_to_merge', 'actionFunc': PlaylistManagerUI.UI_merge_playlists,
				'template': 'tabs-list-template-body-append',						'listClasses': ['playlist_destiny']});

			PlaylistManagerUI.addListTab({	
				'actionName': 'Compose',	'actionButton': true,				'actionInput': true,		'clearButton': true,
				'tabId': 'tabs_center-4',	'tabContainerId': 'tabs_center',	'listId': 'table_to_compose','actionFunc': PlaylistManagerUI.UI_compose_playlists,
				'template': 'tabs-list-template-body-append',						'listClasses': ['video_destiny']});

			PlaylistManagerUI.addListTab({	
				'actionName': 'Download',	'actionButton': false,				'actionInput': true,		'clearButton': false,
				'tabId': 'tabs_center-5',	'tabContainerId': 'tabs_center',	'listId': 'table_to_download','actionFunc': null,
				'template': 'tabs-list-template-body-append-auto',						'listClasses': ['video_destiny']});

			PlaylistManagerUI.addListTab({	
				'actionName': 'Compare',	'actionButton': true,				'actionInput': false,		'clearButton': true,
				'tabId': 'tabs_center-6',	'tabContainerId': 'tabs_center',	'listId': 'table_to_dups','actionFunc': PlaylistManagerUI.UI_dups_playlists,
				'template': 'tabs-list-template-body-append',						'listClasses': ['playlist_destiny']});
			
			PlaylistManagerUI.addListTab({	
				'actionName': 'Delete',		'actionButton': true,				'actionInput': false,		'clearButton': true,
				'tabId': 'tabs_center-7',	'tabContainerId': 'tabs_center',	'listId': 'table_to_delete','actionFunc': PlaylistManagerUI.UI_delete,
				'template': 'tabs-list-template-body-append',					'listClasses': ['playlist_destiny','video_destiny']});
			
			PlaylistManagerUI.addListTab({	
				'actionName': 'Play',	'actionButton': false,				'actionInput': true,		'clearButton': true,
				'tabId': 'tabs_center-8',	'tabContainerId': 'tabs_center',	'listId': 'table_to_play','actionFunc': null,
				'template': 'tabs-list-template-body-append-play',						'listClasses': ['video_destiny']});
			
			PlaylistManagerUI.addListTab({	
				'actionName': 'Create',		'actionButton': true,				'actionInput': true,		'clearButton': true,
				'tabId': 'tabs_center-9',	'tabContainerId': 'tabs_center',	'listId': 'table_to_create', 'actionFunc': PlaylistManagerUI.UI_create_from_ids_playlists,
				'template': 'tabs-list-template-body-create_from_ids',						'listClasses': ['playlist_destiny']});

		};
				
		
		PlaylistManagerUI.UI_total_resize = function(newId,maxh) {
			  //var tabsHeight = $($('#'+newId).parent().children()[0]).outerHeight();
			  //var tabsHeight = $("#"+pane).outerHeight();
			  
			var tabsHeight = 0;
			  var table = $('#'+newId+' ul.table_results');
			  if (table.length <= 0) {
				  table = $('#'+newId);
				  tabsHeight = $("#"+newId).parent().parent().outerHeight();
			  }
			  else {
				  tabsHeight = $("#"+newId).parent().outerHeight();
			  }
			  
			  //var navHeight = $("#"+pane+" .simplePagerNav").outerHeight();
			  //var list_per_page = Math.floor((($("#pane_results").outerHeight()-tabsHeight))/(60))-1;
			  
			  var list_per_page = Math.floor((tabsHeight)/maxh);
			  
			  var navHeight = table.getPagerNavHeight({pagerLocation:"before", pageSize: list_per_page });
			  var parentHeight = table.parent().outerHeight();
			  //var navHeight = 0;
			  var list_per_page = Math.floor((tabsHeight-navHeight)/maxh);
			  ////UI_repage_table(newId,'table_results_'+newId,'pane_results',list_per_page);
			  //UI_repage_table(newId,$('#'+newId+' ul.table_results').attr('id'),pane,list_per_page);
			  			  
			  table.quickPager({pagerLocation:"before", pageSize: list_per_page});
		};
		

		
		PlaylistManagerUI.UI_repage_table_old = function(id,tableId,paneId,list_per_page) {
			if (typeof id == 'object') $(id).find('.simplePagerNav').remove();
			else $('#'+id+' .simplePagerNav').remove();
			//if (resultList) {
			//	$('#'+tableId).html(resultList);
			//}
			
			//var tabsHeight = $($('#'+id).parent().children()[0]).outerHeight();
			//var list_per_page = Math.floor((($("#"+paneId).outerHeight()-tabsHeight)-25)/(60));
			//alert(($("#"+paneId).outerHeight()-tabsHeight)-25);
			//alert($("#"+paneId).outerHeight()+'-'+tabsHeight+'='+list_per_page);
			$("#"+tableId).quickPager({pagerLocation:"before", pageSize: list_per_page});
			
			
		};

		PlaylistManagerUI.currentResult = null;
		
		PlaylistManagerUI.UI_init_widgets = function() {
			// Panes
			$('.pane_tab_body' ).tabs({
				beforeLoad: function( event, ui ) {
					ui.jqXHR.error(function() {
						ui.panel.html('Error loading this tab');
					});
				}
			});
			
			/*
			var tabsResults = $( "#tabs_left" ).tabs();
			tabsResults.delegate( "span.ui-icon-close", "click", function() {				 
			      UI_remove_result_tab(this);
			    });
			*/
			/*
			$('.pane_tab_body_complex' ).live( "click", function() {
				var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
				$( "#" + panelId ).remove();
				$('.pane_tab_body_complex' ).tabs().tabs( "refresh" );
			});
			*/
			
			//var li = genTabTemplate('SearchResults','Results'+getTypeFlag('playlist'),tabResultTemplate);
			
			var tabsResults = $( "#tabs_left" ).tabs({
				active: 0,
				beforeActivate: function( event, ui ) {
					  var newId = ui.newPanel.attr('id');
					  PlaylistManagerUI.currentResult = newId;
					  //PlaylistManagerUI.UI_total_resize('pane_results',newId,PlaylistManagerUI.rowHeight);
					  /*
					  var tabsHeight = $($('#'+newId).parent().children()[0]).outerHeight();
					  //var list_per_page = Math.floor((($("#pane_results").outerHeight()-tabsHeight))/(60))-1;
					  var list_per_page = Math.floor($("#pane_results").outerHeight()/66);
					  //UI_repage_table(newId,'table_results_'+newId,'pane_results',list_per_page);
					  UI_repage_table(newId,$('#'+newId+' ul.table_results').attr('id'),'pane_results',list_per_page);
					  */
					  //alert(newId);
					  //$('#'+newId+' .simplePagerContainer').width($('#'+newId).parent().width()-4);						
				  },
				activate: function( event, ui) {
					PlaylistManagerUI.UI_total_resize(ui.newPanel.attr('id'),PlaylistManagerUI.rowHeight);
				  }
				}).delegate( "span.ui-icon-close", "click", function() {				 
					UI_remove_result_tab(this,'tabs_left');
			    }).delegate( "span.ui-icon-refresh", "click", function() {
			    	//UI_remove_result_tab(this,'tabs_left');
			    	PlaylistManagerUI.UI_reload_channel_playlists();
			    	var newId = 'table_channel_playlists';
			    	//PlaylistManagerUI.UI_total_resize(newId,PlaylistManagerUI.rowHeight);
			    	/*
			    	var tabsHeight = $($('#'+newId).parent().children()[0]).outerHeight();
					  //var list_per_page = Math.floor((($("#pane_results").outerHeight()-tabsHeight))/(60))-1;
					  var list_per_page = Math.floor($("#pane_results").outerHeight()/66);
					  //UI_repage_table(newId,'table_results_'+newId,'pane_results',list_per_page);
					  UI_repage_table(newId,$('#'+newId+' ul.table_results').attr('id'),'pane_results',list_per_page);
					 */
			    	$( "#tabs_left" ).tabs( "option", "active", 0);
			    	$( "#tabs_left" ).tabs( "refresh");

			    });
			
			var li = $(genTabTemplate('table_channel_playlists','My Channel',tabResultTemplate)); 
			//li.find(".ui-icon-close").remove();
			li.find(".ui-icon-close").toggleClass('ui-icon-close').toggleClass('ui-icon-refresh').text('Reload');
			/*
			li.click( function(ev) {
					PlaylistManagerUI.UI_reload_channel_playlists();
					}
				);
			*/
			tabsResults.find(".ui-tabs-nav" ).append( li );
			tabsResults.tabs( "refresh" );
			//var tabContent = '';
			//tabsResults.append( "<div id='" + 'SearchResults' + "' class='div_results'><table style='width: 100%; height: 80%; border: 0px;'><tr><td style='height: 25px; text-align: center; vertical-align: top;'>&nbsp;</td></tr><tr><td style='width: 100%; text-align: center; vertical-align: top;'><ul id='table_results_"+'SearchResults'+"' class='connectedSortable table_results'>" + tabContent + "</ul></td></tr></table></div>" );
			//tabsResults.append( "<div id='" + 'SearchResults' + "' class='div_results'><table style='width: 100%; height: 80%; border: 0px;'><tr><td style='height: 5px; text-align: center; vertical-align: top;'></td></tr><tr><td style='width: 100%; text-align: center; vertical-align: top;'><ul id='table_results_"+'SearchResults'+"' class='connectedSortable table_results'></ul></td></tr></table></div>" );
			tabsResults.append( "<div id='" + 'table_channel_playlists' + "' class='div_results'><table style='width: 100%; height: 80%; border: 0px;'><tr><td style='height: 5px; text-align: center; vertical-align: top;'></td></tr><tr><td style='width: 100%; text-align: center; vertical-align: top;'><ul id='table_results_"+'table_channel_playlists'+"' class='connectedSortable table_results'></ul></td></tr></table></div>" );
			tabResultCounter++; 
			//tabsResults.append(tabContent);
			//tabsResults.tabs({ active: 0 });
			//updateResultsTab('SearchResults',{request: {type:'playlist'}});
			//UI_update_results({request: {type:'playlist'}},'SearchResults_playlist_0');
			
			//
			/*
			var tabsChannels = $( "#tabs_right" ).tabs({
				active: 0,
				beforeActivate: function( event, ui ) {
					  var newId = ui.newPanel.attr('id');
					  var tabsHeight = $($('#'+newId).parent().children()[0]).outerHeight();
					  var list_per_page = Math.floor((($("#pane_channels").outerHeight()-tabsHeight))/(60))-1;
					  UI_repage_table(newId,'table_channels_'+newId,'pane_channels',list_per_page);
					  //alert(newId);
					  //$('#'+newId+' .simplePagerContainer').width($('#'+newId).parent().width()-4);						
				  }
				}).delegate( "span.ui-icon-close", "click", function() {				 
			      UI_remove_result_tab(this,'tabs_right');
			    });
			//tabsChannels.find(".ui-tabs-nav" ).append( li );
			tabsChannels.tabs( "refresh" );
			//tabsResults.append( "<div id='" + 'SearchResults' + "' class='div_results'><table style='width: 100%; height: 80%; border: 0px;'><tr><td style='height: 25px; text-align: center; vertical-align: top;'>&nbsp;</td></tr><tr><td style='width: 100%; text-align: center; vertical-align: top;'><ul id='table_results_"+'SearchResults'+"' class='connectedSortable table_results'>" + tabContent + "</ul></td></tr></table></div>" );
			//tabsChannels.append( "<div id='" + 'SearchResults' + "' class='div_results'><table style='width: 100%; height: 80%; border: 0px;'><tr><td style='height: 5px; text-align: center; vertical-align: top;'></td></tr><tr><td style='width: 100%; text-align: center; vertical-align: top;'><ul id='table_results_"+'SearchResults'+"' class='connectedSortable table_results'>" + tabContent + "</ul></td></tr></table></div>" );
			//tabsResults.append(tabContent);
			//tabsChannels.tabs({ active: 0 });
			*/			
			//
			
			
			// Tabs
			//$( "#pane_search, #pane_login, #pane_results, #pane_tabs, #pane_channel, #pane_status" ).addClass('movable-widget')
			$(".tabs-list-pane").addClass('draggable ui-widget-content movable-widget');
			
			// Menu
			$("#config_menu" ).menu();
			$("#config_menu_1_1" ).bind('mouseenter',enter_handler);
			
			menu_config_items = $("#config_menu .ui-menu-item").length;

			UI_set_menu_option('#config_menu_rescale_button',true);
			UI_set_menu_option('#config_menu_save_config_button',false);
			UI_set_menu_option('#config_menu_cancel_config_button',false);

			UI_set_menu_option('#config_menu_login_button',true);
			
						
			// Search
			//$("#query_channel").googleSuggest({ service: 'youtube', secure: true });
			//$("#query_channel").suggest({filter:'(all type:/film/director)', key: ConfigAPI.getConfig('playlistManager','API-Key')});
			if (ConfigAPI.getConfig('playlistManager', 'suggestions')) {
				$("#pane-search_type-template-input").suggest({ animate: true, key: ConfigAPI.getConfig('playlistManager','API-Key')});
			}
		
			$( "#search_type" )
				.menu( {
					position: { my: "left bottom", at: "left top" },
					icons: { submenu: "ui-icon-triangle-1-s" }
				});											
			$( "#search_type li ul" ).bind('mouseenter',enter_handler);			
			$( "#search_type li ul li a" )												
				.click( function(ev) {
						//$('#search_type_1').text($(this).text());
						var icon = $('#search_type_1 .ui-menu-icon')
						$('#search_type_1').text($(this).text());
						$('#search_type_1').append(icon);
					}
				);			
		
			// Status bar
			$( "#progressbar" ).progressbar({
				value: 0
			});						
			
			// Various
			$( ".a_button" ).button().click(function( event ) {
				event.preventDefault();
			});
			
			
			
		};
		
		
		PlaylistManagerUI.getDesign = function() {
			var design = {};
			var panes = $('.draggable');
			for (var i=0;i<panes.length;i++) {
				design[panes[i].id] = $(panes[i]).attr('style');
			}
			return design;
		};

		PlaylistManagerUI.setDesign = function(design) {	
			var dsg;
			if (typeof design == 'string') dsg = JSON.parse(design);
			for (var d in dsg) {
				$('#'+d).attr('style',dsg[d]);
			}
			UI_resize_inner_containers();
		};


		PlaylistManagerUI['CONFIGS'] = {};
		PlaylistManagerUI.loadConfig = function(file) {
			var cfg_idx = PlaylistManagerUI.File2Idx(file);
			if (!PlaylistManagerUI['CONFIGS'][cfg_idx]) { PlaylistManagerUI['CONFIGS'][cfg_idx] = {}; }

			return ModuleAPI.loadFile(file,'js');
		};

		PlaylistManagerUI.getConfig = function(config,name) {
			if (!name) { return PlaylistManagerUI['CONFIGS'][config]; }
			return PlaylistManagerUI['CONFIGS'][config][name];
		};
		PlaylistManagerUI.setConfig = function(config,name,value) {
			if (!PlaylistManagerUI['CONFIGS'][config]) { PlaylistManagerUI['CONFIGS'][config] = {}; }
			PlaylistManagerUI['CONFIGS'][config][name] = value;
			return true;
		};

		
		PlaylistManagerUI.loaded = true;
	};




	var channel_videoList = undefined;
	var search_resultList = {};
	var playlist_dataList = {};
	var video_dataList = {};
	
		
	//var defaultResultTab = true;
	
	function leave_handler(ev) {
		$( this ).unbind( "mouseleave", leave_handler);
		var src = ev.srcElement;
		var target = ev.relatedTarget;
		
		if (src.id.indexOf('search_type_1_1') >= 0) {
			if (target.id.indexOf('search_type_1') < 0) {
				$('#search_type').menu('collapseAll');
			}
		}
		else if (src.id.indexOf('config_menu_1_1') >= 0) {

			if (target.id.indexOf('config_menu_1') < 0) {
				$('#config_menu').menu('collapseAll');
			}
			else if (target.id.indexOf('config_menu_1_1_1') >= 0) {
				$("#config_menu_1_1_1" ).bind('mouseleave',leave_handler);
			}
			else {
				$('#config_menu').menu('collapseAll');
			}
		}												
		else if (src.id.indexOf('config_menu_1_1_1') >= 0) {
			if (target.id.indexOf('config_menu_1') < 0 && target.id.indexOf('config_menu_1_1')) {
				$('#config_menu').menu('collapseAll');
			}
		}
		else {
			$('#config_menu').menu('collapseAll');
			$('#search_type').menu('collapseAll');
		}						
		
		ev.stopPropagation();
	} 
	
	function enter_handler(ev) {						
		$( this ).bind( "mouseleave", leave_handler);
		//ev.stopPropagation();
	} 

	function UI_user_playlist_ONCLICK(id) {
		var list_name_selected = $('#'+id).text();
		//$('#input_merge_list_name').attr("value",list_name_selected);
		$('#tabs-list-table_to_merge-template-input').attr("value",list_name_selected);		
		//$('#input_delete_list_name').attr("value",list_name_selected);
	};

	function UI_channel_playlist_ONCLICK(id) {
		console.log(id);
	};


	var menu_config_items = 0;

	function UI_update_menu_config(noptions) {
		if (typeof noptions == 'undefined') noptions = menu_config_items;
		//alert(noptions);
		//$("#config_menu .ui-accordion-content").height((noptions)*36)
	};


	function UI_close_menu_config() {
		//$('#config_menu .ui-accordion-header').click();
		$('#config_menu').menu('collapseAll');
	};
	
	function UI_set_menu_option(filter,flag) {
		var menu = $(filter); //$('#config_menu .ui-accordion-content');
		if (flag) {
			//menu.show();
			if (menu.css('display') == 'none') {
				//menu.show();
				menu_config_items++;
			}
			menu.show();

		}
		else {
			//menu.hide();
			if (menu.css('display') == 'block' || menu.css('display') == 'inline-block') {
				//menu.hide();
				menu_config_items--;
			}
			menu.hide();

		}
		UI_update_menu_config();
	};
	
	function UI_save_config() {
		UI_set_menu_option('#config_menu_save_config_button',false);
		//if ($('#rescale_button').hasClass('rescaling')) {
			ConfigAPI.setCookie('plm_design',JSON.stringify(PlaylistManagerUI.getDesign()),365);
		//	menu_config_items--;
		//}

		UI_cancel_config();
		//UI_close_menu_config();
	};

	function UI_cancel_config() {
		UI_set_menu_option('#config_menu_cancel_config_button',false);

		if ($('.rescale_button').hasClass('rescaling')) {
			$( ".movable-widget" ).resizable( "destroy" ).draggable( "destroy" );
			//$('#save_config_button').hide();

			$('.rescale_button').removeClass('rescaling');
			//$('#rescale_button').show();
			//menu_config_items--;
		}
		//$('#rescale_button').show();
		//UI_resize_menu_config(2);
		UI_set_menu_option('#config_menu_save_config_button',false);
		UI_set_menu_option('#config_menu_rescale_button',true);
	};
	
	function UI_resize_inner_containers(target) {
		if (!target || target.id == 'pane_tabs') {
			$('.keep_inside').each(function() {
			$(this).height(Math.ceil($(this).parent().height()-40));
			});
		}
		//$('.keep_inside-list').each(function() {
		//    $(this).height(Math.ceil($(this).parent().parent().height()-50));
		//});
		//$('.keep_inside-list').each(function() {
			//$(this).parent().empty();
		
		//if (!target || (target.id == 'pane_channels' && typeof channel_videoList != 'undefined')) {
		if (target != undefined && target.id == 'pane_channels' && channel_videoList != undefined) {
			//UI_update_channel_playlists(channel_videoList);
			//UI_update_channel(channel_videoList);
			if (channel_videoList.htmlId != undefined)
				UI_reflow_result_text(channel_videoList,'pane_channels');
			//PlaylistManagerUI.UI_total_resize('pane_channels',search_resultList[r].htmlId,PlaylistManagerUI.rowHeight);
			
			if (PlaylistManagerUI.currentResult != null) {
				PlaylistManagerUI.UI_total_resize(PlaylistManagerUI.currentResult,PlaylistManagerUI.rowHeight);
			}
			//$("#pane_results span.ui-icon-refresh").click()
		}
		
		
		//if (!target || (target.id == 'pane_results' && typeof search_resultList != 'undefined')) {
		if (target != undefined && target.id == 'pane_results' && search_resultList != undefined) {
			
			for (r in search_resultList) {
				//UI_update_results(search_resultList[r]);
				if (search_resultList[r] != undefined && search_resultList[r].htmlId != undefined)
					UI_reflow_result_text(search_resultList[r],'pane_results');
			//	PlaylistManagerUI.UI_total_resize(r,PlaylistManagerUI.rowHeight);
			}
			if (PlaylistManagerUI.currentResult != null) {
				PlaylistManagerUI.UI_total_resize(PlaylistManagerUI.currentResult,PlaylistManagerUI.rowHeight);
			}
			
			
			//$("#pane_results span.ui-icon-refresh").click();
			//UI_resize_inner_containers({id: 'pane_tabs'});
			//UI_resize_inner_containers({id: 'pane_results'});
		}
		
		
		//});
	};
	
	function UI_rescale_panes() {
		UI_set_menu_option('#config_menu_rescale_button',false);

		$( ".movable-widget" )
			.resizable({
				grid: [20,20],
				stop: function(ev) {
					//$(ev.target).width(Math.ceil($(ev.target).width()));
					if (Math.ceil($(ev.target).width())<=320) {
						$(ev.target).width(320);
					}
					else {
						$(ev.target).width(Math.ceil($(ev.target).width()));
					}
					$(ev.target).height(Math.ceil($(ev.target).height()));
					UI_resize_inner_containers(ev.target);

					//ConfigAPI.setCookie('plm_design',JSON.stringify(getDesign()),365);
				}
			})
			.draggable({
				grid: [20,20],
				stop: function(ev) {
					$(ev.target).css('top',Math.floor($(ev.target).position().top)+'px');
					$(ev.target).css('left',Math.floor($(ev.target).position().left)+'px');
					//ConfigAPI.setCookie('plm_design',JSON.stringify(getDesign()),365);
				}
			});
		$('.rescale_button').addClass('rescaling');


		UI_set_menu_option('#config_menu_save_config_button',true);
		UI_set_menu_option('#config_menu_cancel_config_button',true);
	};

	function UI_login_logout(action) {
		if (action == 'login') ServiceManager.Call('OATH','AUTHORIZE',{ 'immediate': false, 'callback': handleAuthResult },true);
		else if (action == 'logout') ServiceManager.Call('OATH','DROP_AUTHORIZATION',{ 'callback': handleAuthResult },true);
	};

	function UI_exec_menu_option(action) {

		if (action == 'save') {
			UI_save_config();
		}
		else if (action == 'cancel') {
			UI_cancel_config();
		}
		else if (action == 'rescale') {
			UI_rescale_panes();
		}
		else if (action == 'login' || action == 'logout') {
			UI_login_logout(action);
		}
		else {
			return false;
		}

		UI_close_menu_config();
		return true;

	};
	
	
	//var tabResultTemplate = "<li id='#{tab_result_id}'><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' onclick='UI_remove_result_tab($(this))'>Remove Tab</span></li>";
	var tabResultTemplate = "<li id='#{tab_result_id}' style='width: 98%;'><table style='width:100%;'><tr><td style='width:90%;'><a style='width:100%;' href='#{href}'>#{label}</a></td><td><span class='ui-icon ui-icon-close'>Remove Tab</span></td></li>";
	//var videoResultTemplate = "<li class='ui-state-default' id='#{id}' id_yt='#{id_yt}'><table class='plm-video-result'><tr><td>#{title}</td><td><img src='#{img}'/></td></tr></table></li>"
	//var videoResultTemplate = "<li class='ui-state-default' id='#{id}' id_yt='#{id_yt}'><table class='plm-video-result'><tr><td>#{title}</td><td><div style='background: url(#{img}) no-repeat center right;'></div></td></tr></table></li>";
	/*
	var videoResultTemplate = 	"<li class='ui-state-default' id='#{id}' id_yt='#{id_yt}'>"+
								"	<table class='plm-video-result' style='height:58px; border-spacing: 0px;'>" +
								"		<tr style='height: 100%; vertical-align: top;'>" +
								"			<td style='width: auto; text-align: left;'>" +
								"				<table style='border-spacing: 0px; height: 100%;'>" +
								"					<tr style='vertical-align: top; height: auto;'>" +
								"						<td class='result_title' style='text-align: left; font-size: 10px; font-weight: bold; width: auto;'>#{title}</td>" +
								"						<td class='result_total' style='text-align: right; font-size: 10px; width: 1%;'></td>" +
								"					</tr>" +																
								"					<tr style='vertical-align: middle; height: 99%;'>" +
								"						<td class='result_description' style='font-size: 10px;' colspan='2' >#{description}</td>" +
								"					</tr>" +
								"				</table>" +
								"			</td>" +
								"			<td style='width: 2px;'/>" +
								"			<td style='width: 72px; height: 56px; text-align: right;'>" +
								"				<div class='result_img' style='width: 100%; height: 100%; background: url(#{img}) no-repeat center right;'></div>" +
								"			</td>" +
								"		</tr>" +
								"	</table>" +
								"</li>";
	
	*/

	var tabResultCounter = 0;
	var tabResultNextId = 0;
	
	function getResultNextId(q,t) {
		var newId = (q).replace( / /g, '_');
		if (t) newId += '_'+t;
		return  newId+'_'+(tabResultNextId++);
	};

	function genTabTemplate(id,label,tabTemplate) {
		return $( tabResultTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ).replace( /#\{tab_result_id\}/g, 'tab_result_'+id ).replace( /#\{.*\}/g, ' ' ) )
	};
	
	function fillTemplate(template,fields) {		
		var filled = template;
		for (f in fields) {
			var rg = new RegExp("#\{"+f+"\}","g");
			filled = filled.replace( rg, fields[f] );			
		}
		filled = filled.replace( /#\{.*\}/g, ' ' );
		return filled;
	};
	
	function clipText(text,maxw,maxh,style) {
		
		var htmlRefDiv = $('#html_sizes_ref');
		var htmlRefSpan = htmlRefDiv.find('span');
		
		if (htmlRefSpan.length < 1) return text;
		
		/*
		htmlRefSpan.css('font-size',fontsize);
		htmlRefSpan.css('font-family',fonttype);
		htmlRefDiv.width(maxw);
		htmlRefDiv.height(maxh);
		*/
		htmlRefSpan.attr('style',style);
		htmlRefSpan.html(text);
		
		htmlRefDiv.width(maxw);
		htmlRefDiv.height(maxh);
		
		//var maxw = htmlRefSpan.css('width');
		//var maxh = htmlRefSpan.css('height');
		var _w,_h;
		var newText = text;
		
		//console.log(_w+','+_h);
		
		_h = htmlRefSpan.textHeight();		
		if (maxh!=undefined && maxh < _h) {
			
			//newText = newText.substring(0,_h/maxh)+'..';
			//var numChars = (newText.length/(maxh/_h))*(maxh/_h);
			//var numChars = text.length*(maxh/_h);
			//newText = newText.substring(0,numChars)+((numChars < text.length-1) ? '..' : '');
			
			while (1) {
				newText = newText.substring(0,newText.length-1);
				htmlRefSpan.html(newText);
				_h = htmlRefSpan.textHeight();
				if (_h <= maxh) break;
			}
			
			//newText = clipText(newText,fontsize,maxw,maxh);
		}
		
		_w = htmlRefSpan.textWidth();		
		if (maxw!=undefined && maxw < _w) {
			while (1) {
				newText = newText.substring(0,newText.length-1);
				htmlRefSpan.html(newText);
				_w = htmlRefSpan.textWidth();
				if (_w <= maxw) break;
			}
			
			//newText = newText.substring(0,maxw)+'..';
		}
		
		if (text.length > newText.length) {
			newText = newText.substring(0,newText.length-2);
			newText+='..';
		}
		
		
		htmlRefSpan.html('');
		// get maximo en horizontal
		//var _w = htmlRef.textWidth();
		
		return newText;
		//document.$('')
	};
	
	function genResultList(result) {
		if (!result || !result["items"]) return '';
		
		var tabContent = '';
		var num_playlist = result["items"].length;
		for (var i = 0; i < num_playlist; i++) {
			//$('#table_playlists').append( '<li class="ui-state-default" id="merge_playlist_'+i+'" id_yt="'+$(playlists).find("entry:eq("+i+") playlistId").text()+'" >' + $(playlists).find("entry:eq("+i+") title").text() + "</li>" );
			var resultData =	{	'id': 		'channel_'+i,
							//'id_yt':	result.items[i].id[result.request.type+"Id"],
							'id_yt':	(typeof result.items[i].id == 'string' ? result.items[i].id : result.items[i].id[result.request.type+"Id"]),
							'title':	clipText(result.items[i].snippet.title,$('#pane_results').width()-120,14,'font-weight: bold; font-size: 10px; font-family: Verdana;'),
							'description':	clipText(result.items[i].snippet.description,$('#pane_results').width()-100,42,'font-size: 10px; font-family: Verdana;'),
							'channel':		result.items[i].snippet.channelTitle,
							'img':		result.items[i].snippet.thumbnails.default.url
							//'title':		clipText(result.items[i].snippet.title,'10px','Verdana',$('#pane_results').width()-130,14),//result.items[i].snippet.title,
							//'result_title_tooltip': (resultData.title.length == result.items[i].snippet.title) ? '' : result.items[i].snippet.title,
							//'description':	clipText(result.items[i].snippet.description,'10px','Verdana',$('#pane_results').width()-100,42),//result.items[i].snippet.description,
							//'result_description_tooltip': (resultData.description.length == result.items[i].snippet.description) ? '' : result.items[i].snippet.description,
						};
			
			resultData['result_title_tooltip'] = (resultData.title.length == result.items[i].snippet.title.length) ? '' : result.items[i].snippet.title;
			resultData['result_description_tooltip'] = (resultData.description.length == result.items[i].snippet.description.length) ? '' : result.items[i].snippet.description;
			
			//tabContent += fillTemplate(videoResultTemplate, resultData);
			var template = $('#plm-result-template').html();
			tabContent += fillTemplate(template,resultData);
			//tabContent+= '<li class="ui-state-default" id="channel_'+i+'" id_yt="'+result["items"][i]["id"][result.request.type+"Id"]+'" >' + result["items"][i]["snippet"]["title"] + "</li>" ;
			
		}
		return tabContent;
	};
	
	
	function getTypeFlag(type) {
		if (type.indexOf('playlist') >= 0) 	return ' (P)';
		if (type.indexOf('channel') >= 0) 	return ' (C)';
		if (type.indexOf('video') >= 0) 	return ' (V)'; 
		return '';
	};
	
	function UI_updateVideoData(result) {
		var htmlResult = $('[id_yt='+result.request.videoIdList+']');
		var _total = htmlResult.find('.result_total');
		
		
		try {
			var duration = result.items[0].contentDetails.duration;
			_total.text('['+duration.substring(2)+']');
			var likes = parseInt(result.items[0].statistics.likeCount);
			var dislikes = parseInt(result.items[0].statistics.dislikeCount);
			_total +=' ['+(likes/(likes+dislikes)).toFixed(2)+']';
		}
		catch (e) {
			
		}		
	};
	
	function UI_getVideoData_callback(result) {
		//result = ServiceManager.doEval(result);
		if (typeof result ==' undefined' || result == null) return;
		video_dataList[result.request.videoId] = result;
		
		UI_updateVideoData(result);
	};
	
	function UI_updatePlaylistData(result) {
		var htmlResult = $('[id_yt='+result.request.playlistId+']');
		var _total = htmlResult.find('.result_total');
		_total.text('['+result.pageInfo.totalResults+']');
	};
	
	function UI_getPlayList_callback(result) {
		//result = ServiceManager.doEval(result);
		if (typeof result ==' undefined' || result == null) return;
		playlist_dataList[result.request.playlistId] = result;
		
		UI_updatePlaylistData(result);
		//var htmlResult = $('[id_yt='+result.request.playlistId+']');
		//var _total = htmlResult.find('.result_total');
		//_total.text('['+result.pageInfo.totalResults+']');
		/*
		var _title = htmlResult.find('.result_title');
		
		var _channel = htmlResult.find('.result_channel');
		var _desc = htmlResult.find('.result_description');
		
		_total.text(result.pageInfo.totalResults);
		_channel.text(result.pageInfo.totalResults);
		_channel.text(result.pageInfo.totalResults);
		titleResult.text(titleResult.text());
		*/
				
		
		//titleResult.text(titleResult.text()+'('+result.pageInfo.totalResults+')');
		//console.log(result.pageInfo.totalResults);
		//result.request = {q:channel_name,type:search_type};
		//result.htmlId = encodeID(channel_name);
		//console.log(result.request.playlistId + '('+result.pageInfo.totalResults+')');
	};

	function updateResultsTab(tabTitle,result,resultId) {
		var _id = result.htmlId;
		var resultTab = UI_getResultTabPane(result);
		
		if (result == undefined || result["items"] == undefined) return null;
		//var _id  = tabTitle;
		if (result) _id += '_'+result.request.type+'_';
		var newId =  null;
		
		
		var tabContent = genResultList(result);		
		
		var tabsResults = $( "#"+resultTab ).tabs();
		//var id = //getResultNextId(tabTitle,result.request.type); //tabTitle;
		if (!search_resultList[_id]) {			
			var id = tabTitle;
			var type = '';
			if (result) {
				type = result.request.type;
				id = getResultNextId(_id,type);
				//resultId = id;
			}

			newId=id;
			var label = tabTitle || "Tab " + tabResultCounter;
			label = clipText(label,tabsResults.find('.ui-tabs-nav').width()-24,25,'font-size: 12px; font-family: Verdana;')
			//id = "tabs-result-" + tabResultCounter,
			//id = tabTitle,
			//li = genTabTemplate(id,label+getTypeFlag(type),tabResultTemplate);
			li = $(genTabTemplate(id,label,tabResultTemplate));
		
			
			if (resultId != undefined && resultId == 'table_channel_playlists') {
				//li.find('.ui-icon-close').remove();
				/*
				li.find(".ui-icon-close").toggleClass('ui-icon-close').toggleClass('ui-icon-refresh').text('Reload');
				li.find('a').attr('href','#'+resultId);
				li.attr('id','tab_result_'+resultId);				
				tabsResults.append( "<div id='" + resultId + "' class='div_results'><table style='width: 100%; height: 80%; border: 0px;'><tr><td style='height: 5px; text-align: center; vertical-align: top;'></td></tr><tr><td style='width: 100%; text-align: center; vertical-align: top;'><ul id='table_results_"+id+"' class='connectedSortable table_results'>" + tabContent + "</ul></td></tr></table></div>" );
				tabsResults.find( ".ui-tabs-nav" ).prepend( li );
				*/
				//UI_remove_result_tab($('#tab_result_table_channel_playlists span')[0],'tabs_left');
				$('#table_channel_playlists').remove();
				var content = "<div id='" + resultId + "' class='div_results'><table style='width: 100%; height: 80%; border: 0px;'><tr><td style='width: 100%; text-align: center; vertical-align: top;'><ul id='table_results_"+id+"' class='connectedSortable table_results'>" + tabContent + "</ul></td></tr></table></div>";
				tabsResults.append(content);
				//tabsResults.find(".ui-tabs-nav li#table_channel_playlists").html(content);
				
				var num_playlist = result["items"].length;
				//alert(num_playlist);
				for (var i = 0; i < num_playlist; i++) {
					var playlistId = result.items[i].id;
					if (typeof playlistId == 'object') playlistId = playlistId[result.request.type+"Id"];
					if (playlistId == undefined) continue;
					//result.request.playlistId = playlistId;
					//playlist_dataList[playlistId] = result;
					if (playlist_dataList[playlistId] == undefined) {
						getPlaylistData(playlistId,UI_getPlayList_callback);
					}
					else { 
						UI_updatePlaylistData(playlist_dataList[playlistId]);
					}
					
				}
				//PlaylistManagerUI.UI_total_resize('table_channel_playlists',PlaylistManagerUI.rowHeight);
			}
			else {
				var content = "<div id='" + id + "' class='div_results'><table style='width: 100%; height: 80%; border: 0px;'><tr><td style='width: 100%; text-align: center; vertical-align: top;'><ul id='table_results_"+id+"' class='connectedSortable table_results'>" + tabContent + "</ul></td></tr></table></div>";				
				tabsResults.append(content);
				tabsResults.find( ".ui-tabs-nav" ).append( li );
				tabResultCounter++;
				
				var num_videos = result["items"].length;
				//alert(num_playlist);
				for (var i = 0; i < num_videos; i++) {
					var videoId = result.items[i].id;
					if (typeof videoId == 'object') videoId = videoId[result.request.type+"Id"];
					if (videoId == undefined) continue;
					//result.request.playlistId = playlistId;
					//playlist_dataList[playlistId] = result;
					if (video_dataList[videoId] == undefined) {
						getVideoData(videoId,UI_getVideoData_callback);
					}
					else { 
						UI_updateVideoData(video_dataList[videoId]);
					}					
				}
				//PlaylistManagerUI.UI_total_resize(id,PlaylistManagerUI.rowHeight);
			}
			
			/*
			if (id.indexOf('SearchResults') >= 0) {
				$('#tab_result_SearchResults').hide();
				//$('#tabs_left .tab-search-result').hide();
				//defaultResultTab = true;		
			}
			*/
			
			
			
			//tabsResults.append( "<div id='" + id + "' class='div_results'><ul id='table_results_"+id+"' class='connectedSortable table_results'>" + tabContent + "</ul></div>" );
			//console.log(id);
			//$('#'+id).click()
			//tabsResults.append(tabContent);
			
			
		}
		else {
			//var id = tbr.attr('id');
			newId=_id;
			
			//$('#'+_id+' .simplePagerNav').remove();
			//$('#table_results_'+_id).html(genResultList(result));
		}
				
		
		
		tabsResults.tabs( "refresh" );
		
		return newId;
	};

	function UI_remove_result_tab(tab,tabPane) {		
		if (tabResultCounter == 0) return;
		
		var tabResult = $('#'+tabPane);
		//var activeTab = tabResult.tabs('enable',tabResult.tabs( "option", "active" )).attr('id');
		var activeTabIdx = tabResult.tabs( "option", "active" );
		if (!activeTabIdx) activeTabIdx=0;
			
		var allTabs = $('#'+tabPane+' .div_results');
		var activeTab = allTabs[activeTabIdx].id;		
		var menuTab = $( tab ).closest( "li" );		
		var panelId = menuTab.attr( "aria-controls" );		
		
		if (tabPane == "tabs_left" && tabResultCounter < 2) {
			//$('#tab_result_SearchResults').show();
			//tabResultCounter--;
		}
		else {
			if (activeTab == panelId) {
				if (panelId == 'table_channel_playlist') activeTabIdx=0;
				else if (activeTabIdx-1 > 0) activeTabIdx--;	// 0 for Default
				else if (activeTabIdx+1 < allTabs.length) activeTabIdx++;
				
				tabResult.tabs( "option", "active", activeTabIdx);
			}
		}
		
		
		search_resultList[panelId] = undefined;		
		
		menuTab.remove();
		tabResult.find("#" + panelId ).remove();					
			
		tabResult.tabs( "refresh" );
	};

	

	function UI_reflow_result_text(result,containerId) {
		for (var i=0; i<result.items.length; i++) {
			var item = result.items[i].id;
			if (typeof item != 'object') item = $('[id_yt='+item+']');
			else {
				if (item.playlistId) item = $('[id_yt='+item.playlistId+']');
				if (item.videoId) item = $('[id_yt='+item.videoId+']');
				if (item.channelId) item = $('[id_yt='+item.channelId+']');
			}
			if (item.css("display") != "list-item") continue;
			//var width = $('#'+containerId+" .simplePagerContainer").width();
			var width = $('#'+containerId+" .div_results").width();
			var resultData =	{
					'title':	clipText(result.items[i].snippet.title,width-150,14,'font-weight: bold; font-size: 10px; font-family: Verdana;'),
					'description':	clipText(result.items[i].snippet.description,width-110,36,'font-size: 10px; font-family: Verdana;')							
				};
			item.find(".result_title").html(resultData.title);
			item.find(".result_description").html(resultData.description);
		}
	};
	
	function UI_update_channel(result) {
		if (!result) return;
		result.request.q = 'table_channel_playlists';
		result.request.type = 'playlist'
		UI_update_results(result);
		/*
		var tabsHeight = $('#pane_results .ui-tabs-nav').outerHeight();
		var resultsPerPage = Math.floor((($("#pane_results").outerHeight()-tabsHeight))/(60))-1;
		//UI_repage_table('pane_results','table_channel_playlists','pane_results',resultsPerPage);
		UI_repage_table('pane_results',$('#table_channel_playlists ul.table_results').attr('id'),'pane_results',resultsPerPage);
		*/
		
		/*
		channel_videoList = result;		
		
		$('#table_channel_playlists').empty();
		//var num_playlist = $(playlists).find("totalResults:eq(0)").text();
		var num_playlist = Number(result["pageInfo"]["totalResults"]);
		var dest_table = type2destiny(result);		
		//var htmlList = $('');
		for (var i = 0; i < num_playlist; i++) {
			//$('#table_playlists').append( '<li class="ui-state-default" id="merge_playlist_'+i+'" id_yt="'+$(playlists).find("entry:eq("+i+") playlistId").text()+'" >' + $(playlists).find("entry:eq("+i+") title").text() + "</li>" );
			//var list_elem =  $('<li class="ui-state-default" id="channel_playlist_'+i+'" id_yt="'+result["items"][i]["id"]+'" >' + result["items"][i]["snippet"]["title"] + "</li>");			
			var resultData =	{	'id': 		'channel_playlist_'+i,
							'id_yt':	result.items[i].id,
							'title':	clipText(result.items[i].snippet.title,$('#pane_channels').width()-120,14,'font-weight: bold; font-size: 10px; font-family: Verdana;'),
							'description':	clipText(result.items[i].snippet.description,$('#pane_channels').width()-100,42,'font-size: 10px; font-family: Verdana;'),
							'img':		result.items[i].snippet.thumbnails.default.url
							//'title':	clipText(result.items[i].snippet.title,'10px','Verdana',$('#pane_channels').width()-130,14), //result.items[i].snippet.title,
							//'result_title_tooltip': (resultData.title.length == result.items[i].snippet.title) ? '' : result.items[i].snippet.title,
							//'channel':		result.items[i].snippet.channelTitle,
							//'description':	clipText(result.items[i].snippet.description,'10px','Verdana',$('#pane_results').width()-100,42),//result.items[i].snippet.description,
							//'result_description_tooltip': (resultData.description.length == result.items[i].snippet.description) ? '' : result.items[i].snippet.description,							
						};
			
			resultData['result_title_tooltip'] = (resultData.title.length == result.items[i].snippet.title.length) ? '' : result.items[i].snippet.title;
			resultData['result_description_tooltip'] = (resultData.description.length == result.items[i].snippet.description.length) ? '' : result.items[i].snippet.description;
			//var list_elem = $(fillTemplate(videoResultTemplate, resultData));
			var template = $('#plm-result-template').html();
			var list_elem = $(fillTemplate(template, resultData));
			
			$('#table_channel_playlists').append(list_elem);
			//htmlList.append(list_elem);
			
			$('#channel_playlist_'+i).bind("click",function(evt) {
				UI_channel_playlist_ONCLICK(evt.target.getAttribute('id_yt'));
			});
		}
		if (dest_table.length > 0) {			
			$( "#table_channel_playlists li").draggable({
				 connectToSortable: "."+dest_table,
				  helper: "clone",
				  revert: "invalid"
			}).disableSelection();
		}
		var tabsHeight = $('#pane_channels .ui-tabs-nav').outerHeight();
		var resultsPerPage = Math.floor((($("#pane_channels").outerHeight()-tabsHeight))/(60))-1;
		UI_repage_table('pane_channels','table_channel_playlists','pane_channels',resultsPerPage);
		*/
	};

	function type2destiny(result) {
		var dest_table = '';
		if (result && result.request && result.request.type) {
			if (result.request.type == 'playlist') dest_table = 'playlist_destiny';
			if (result.request.type == 'channel') dest_table = '';
			if (result.request.type == 'video') dest_table = 'video_destiny';
		}
		return dest_table;
	};
	
	function type2destinyBak(result) {
		var dest_table = '';
		if (result && result.request && result.request.type) {
			if (result.request.type == 'playlist') dest_table = 'table_to_merge';
			if (result.request.type == 'channel') dest_table = '';
			if (result.request.type == 'video') dest_table = 'table_to_compose';
		}
		return dest_table;
	};
	
	
	function encodeID(s) {
	    if (s==='') return '_';
	    return s.replace(/[^a-zA-Z0-9.-]/g, function(match) {
	        return '_'+match[0].charCodeAt(0).toString(16)+'_';
	    });
	};

	function UI_getResultTabPane(result) {
		//return (result.request.type == 'playlist' ? 'tabs_right' : (result.request.type == 'channel' ? 'tabs_right' : 'tabs_left'));
		return (result.request.type == 'playlist' ? 'tabs_left' : (result.request.type == 'channel' ? 'tabs_left' : 'tabs_left'));
	};
	
	function UI_getResultPane(result) {
		//return (result.request.type == 'playlist' ? 'pane_channels' : (result.request.type == 'channel' ? 'pane_channels' : 'pane_results'));
		return (result.request.type == 'playlist' ? 'pane_results' : (result.request.type == 'channel' ? 'pane_results' : 'pane_results'));
	};
	
	function UI_update_results(result,id) {
		
		var resultPane = UI_getResultPane(result);
		
		var newId = null
		if (id) { 
			newId = id;
			result.htmlId = encodeID(id);
			//UI_repage_table(newId,'table_results_'+newId,'pane_results',genResultList(result));
			
		}
		else  {
			if (!result)	{	id = 'dummy';		}
			else		{	id = result.request.q;	}
			
			if (result.request.type == 'video') {
				result.htmlId = encodeID(id);			
				newId = updateResultsTab(id,result);
			}
			else if (result.request.type == 'playlist') {
				if (id != 'table_channel_playlists') {
					result.htmlId = encodeID(id);			
					newId = updateResultsTab(id,result);
				}
				else {
					result.htmlId = 'table_channel_playlists';
					
					newId = updateResultsTab('My Channel',result,'table_channel_playlists');
				}
			}
			else if (result.request.type == 'channel') {
				
				result.htmlId = encodeID(id);			
				newId = updateResultsTab(id,result);								
			}
			
			if (!newId) {
				alert('cannot update the results');
				return;
			}
			//UI_repage_table(newId,'table_results_'+newId,'pane_results',genResultList(result));
		}
		
		
		
		
		search_resultList[newId] = result;		
		
		var dest_table = type2destiny(result);		
		
		if (dest_table.length > 0) {			
			//$( "#"+result.htmlId+" ul.table_results li").draggable({
			//$("#pane_results ul.table_results li").draggable({
			$("#"+resultPane+" ul.table_results li").draggable({
			//$( "ul.table_results li").draggable({
				 connectToSortable: "."+dest_table,
				  helper: "clone",
				  revert: "invalid"
			}).disableSelection();
			
		}

		
		if (resultPane == 'pane_results' && tabResultCounter > 0) {				
			//var newId = updateResultsTab('SearchResults');
			//$('#tabs_left a').filter(function() { return $(this).text() == 'SearchResults'; }).siblings('.ui-icon-close').css('display','none');
			//defaultResultTab = true;		
			$('#tab_result_SearchResults').hide();
			//$('#SearchResults_playlist_0').show();
			//$('#tabs_left .tab-search-result').hide();
			if (newId) {
				var tb = $('#tabs_left li[role=tab] a');
				if (tb.length > 0) tb[tb.length-1].click();
			}
		}
		UI_resize_inner_containers({id: 'pane_results'});
		//if (defaultResultTab) {
			//$('#tabs_left span.ui-icon-close')[0].click();
			//$('#SearchResults').remove();			
			//defaultResultTab = false;
		//}
		
		
	};
	
	function UI_search() {

		var channel_name = $("#pane-search_type-template-input").attr("value").toLowerCase();
		//var search_type = $('#search_type').attr("value");
		var search_type = $('#search_type_1').text().toLowerCase();
		if (channel_name.length == 0) {
			alert('Please, enter a channel name to search');
			return;
		}
		var result = search(channel_name,search_type);
		if (!result) result = {};
		result.request = {q:channel_name,type:search_type};
		result.htmlId = encodeID(channel_name);
		UI_update_results(result);
	};


	function UI_create_playlists() {

		//var dest_list_name = $('#input_create_list_name').attr("value");
		var dest_list_name = $('#tabs-list-table_to_create-template-input').attr("value");
		if (dest_list_name.length == 0) {
			alert('Please, enter a playlist name to create');
			return;
		}
		var result = createPlaylist(dest_list_name);
		UI_reload_playlists();
	};
	
	
	
	function UI_links_loaded() {
		alert('loaded');
	};
	function UI_download_callback(result) {
		var flinks = $('#frame_links');
		if (flinks.attr('src').length <= 0) return;
		
		var links = $('#frame_links').html();
		result = links;
		
		if (!result) {
			alert("Cannot retrieve links for the element!");
			return;
		}
		console.log(result);
	};
	
	function UI_download(obj) {
		var id = $(obj).attr('id_yt');
		download(id,'videoId',UI_download_callback);
	};
	
	
	function UI_play(obj) {
		var id = $(obj).attr('id_yt');
		
		var player = $('<iframe id="ytplayer" text="text/html" width="400" height="300" frameborder="0" allowfullscreen/>');
		player.attr('src','http://www.youtube.com/embed/'+id+'?autoplay=1');
		
		$('#ytplayer').remove();
		$('#play_container').append(player);
	};

	function Table2AttrArray(table,field) {
			var lists_ = [];
		
			var childs = $(table).children();
			for (var t=0; t < childs.length; t++) {
				if ($(childs[t]).attr(field) == undefined) continue;
				lists_[lists_.length] = $(childs[t]).attr(field);
			}
			return lists_;
		};

