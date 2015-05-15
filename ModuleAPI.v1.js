
if (typeof ModuleAPI == 'undefined') loadModuleAPI();

function loadModuleAPI() {
		ModuleAPI = {};
		ModuleAPI.MODULES_PATH = '/';
		ModuleAPI['MODULES'] = {};
		ModuleAPI['LISTENERS'] = {};
		ModuleAPI['STATE'] = {};


		ModuleAPI.loaded = false;
		ModuleAPI.isLoaded = function() { return ModuleAPI.loaded; };

		ModuleAPI.loadFile = function(filename, filetype){
			 //loadjscssfile("javascript.php", "js") //loadjscssfile("mystyle.css", "css")
			 if (filetype=="js"){ //if filename is a external JavaScript file
				var fileref=document.createElement('script');
				fileref.setAttribute("type","text/javascript");
				fileref.setAttribute("src", filename);
			 }
			 else if (filetype=="css"){ //if filename is an external CSS file
				var fileref=document.createElement("link");
				fileref.setAttribute("rel", "stylesheet");
				fileref.setAttribute("type", "text/css");
				fileref.setAttribute("href", filename);
			 }
			 if (typeof fileref!="undefined") {
				 var els = document.getElementsByTagName("head");
				 if (els.length > 0) els[0].appendChild(fileref);
				}
			return true;
		};

		ModuleAPI.newConfig = function(idx,version,filepath,type) {
			return {'id':idx,
					 'version':version,
					 'type': type,
					 'filepath': ModuleAPI.MODULES_PATH+filepath
					};
		};

		ModuleAPI._loadModule = function(moduleId,filepath) {
			if (ModuleAPI.isModulePrepared(moduleId)) {
				if (filepath) {
					ModuleAPI.setState(moduleId,1);
					setTimeout("ModuleAPI.loadFile('"+filepath+"','js');",100);
					return;
				}
			}

			if (ModuleAPI.isModuleLoading(moduleId)) {
				setTimeout("ModuleAPI._loadModule('"+moduleId+"');",100);
				return;
			}

			if (ModuleAPI.isModuleLoaded(moduleId)) {
				if (ModuleAPI['MODULES'][moduleId].isLoaded()) {
					ModuleAPI.setState(moduleId,2);
					if (ModuleAPI['LISTENERS']['module_loaded']) {
						ModuleAPI['LISTENERS']['module_loaded'](moduleId);
					}
					return;
				}
				ModuleAPI.setState(moduleId,3);
			}

			if (ModuleAPI.isModuleFail(moduleId)) {
				alert("Cannot load module '"+moduleId+"'");
			}
			return;
		};

		ModuleAPI.loadModule = function(moduleConfig) {
			if (!ModuleAPI.moduleExists(moduleConfig.id)) {
				ModuleAPI.setState(moduleConfig.id,0);
			}
			setTimeout("ModuleAPI._loadModule('"+moduleConfig.id+"','"+moduleConfig.filepath+"');",100);
		};

		ModuleAPI.registerListener = function(id,callback)
			{ ModuleAPI['LISTENERS'][id] = callback; };
		ModuleAPI.unregisterListener = function(id)
			{ ModuleAPI['LISTENERS'][id] = undefined; };

		ModuleAPI.setState = function(moduleId,state)
			{ ModuleAPI['STATE'][moduleId] = status; };
		ModuleAPI.getState = function(moduleId)
			{ if (!ModuleAPI.moduleExists(moduleId)) { return -1; } else { return ModuleAPI['STATE'][moduleId]; } };

		ModuleAPI.moduleExists = function(moduleId)
			{ if (!ModuleAPI['MODULES'][moduleId]) { return false; } else { return true; } };
		ModuleAPI.isModulePrepared = function(moduleId)
			{ if (ModuleAPI.getState(moduleId) >= 0) { return true; } else { return false; } };
		ModuleAPI.isModuleLoading = function(moduleId)
			{ if (ModuleAPI.getState(moduleId) >= 1) { return true; } else { return false; } };
		ModuleAPI.isModuleLoaded = function(moduleId)
			{ if (ModuleAPI.getState(moduleId) >= 2) { return true; } else { return false; } };
		ModuleAPI.isModuleFail = function(moduleId)
			{ if (ModuleAPI.getState(moduleId) < 0) { return true; } else { return false; } };

		ModuleAPI.loaded = true;
	}



