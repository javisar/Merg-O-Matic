
if (typeof ConfigAPI == 'undefined') loadConfigAPI();
	
function loadConfigAPI() {	
	
		ConfigAPI = {};
		ConfigAPI['CONFIGS'] = {};


		ConfigAPI.loaded = false;
		ConfigAPI.isLoaded = function() { return ConfigAPI.loaded; };

		ConfigAPI.File2Idx = function(file) { return file.substring(0,file.indexOf('.js')); }
		ConfigAPI.loadConfig = function(file) {
			var cfg_idx = ConfigAPI.File2Idx(file);
			if (!ConfigAPI['CONFIGS'][cfg_idx]) { ConfigAPI['CONFIGS'][cfg_idx] = {}; }

			return ModuleAPI.loadFile(file,'js');
		};

		ConfigAPI.getConfig = function(config,name) {
			if (!name) { return ConfigAPI['CONFIGS'][config]; }
			return ConfigAPI['CONFIGS'][config][name];
		};
		ConfigAPI.setConfig = function(config,name,value) {
			if (!ConfigAPI['CONFIGS'][config]) { ConfigAPI['CONFIGS'][config] = {}; }
			ConfigAPI['CONFIGS'][config][name] = value;
			return true;
		};

		ConfigAPI.replaceAll = function(text, busca, reemplaza) {
			while (text.toString().indexOf(busca) != -1) {
				text = text.toString().replace(busca,reemplaza);
			}
			return text;
		};
		ConfigAPI.generateTemplate = function(template,substitutions) {
			var output = template;
			for (a in substitutions) {
				if (substitutions[a] != undefined && substitutions[a] != null) {
					output = ConfigAPI.replaceAll(output,'$$'+a,substitutions[a]);
				}
			}
			return output;
		};

		ConfigAPI.logObject = function(obj) {
			for (var a in obj) {
				console.log("obj["+a+"] = "+obj[a]);
			}
		};

		ConfigAPI.Object2String = function(obj) {
			var blkstr = [];
			$.each(obj, function(idx2,val2) {
				var str = '';
				if (val2 && val2.dataType == 'xml') {
					str = idx2 + ":" + $.getJSON('json',val2);
				} else {
					str = idx2 + ":" + val2;
				}
				blkstr.push(str);
			});
			return blkstr.join('<br/>');
		};


		ConfigAPI.NVL = function(txt,txt_def) {
			if (txt == undefined || txt == null || txt.length == 0) {
				return txt_def;
			}
			return txt;
		};

		ConfigAPI.IsAtom = function(obj) {
			if ($(obj).prop("tagName")) {
				return true;
			}
			return false;
		};

		ConfigAPI.setCookie = function(c_name,value,exdays)
		{
			var exdate=new Date();
			exdate.setDate(exdate.getDate() + exdays);
			var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
			document.cookie=c_name + "=" + c_value;
		};

		ConfigAPI.getCookie = function(c_name)
		{
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++)
		{
		  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		  x=x.replace(/^\s+|\s+$/g,"");
		  if (x==c_name)
			{
			return unescape(y);
			}
		  }
		};

		ConfigAPI.loaded = true;
	}



