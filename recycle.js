if (window.mod == (void 0))
{
	window.mod = window.module = (function() {
		var lib = {};
		var modules = {};
		var modulesAlreadyLoaded = false;
		var modulesCurrentlyLoading = false;
		var toNotify = [];
		
		lib.exports = null;
		
		function addModule(path, id)
		{
			if (!(id in modules))
			{
				modules[id] = {
					path: path,
					instance: null
				};
			}
		}
		
		/**
		* path, identifier
		* or
		* obj
		*/
		lib.prepare = function(first, second = null) {
			if (typeof first == 'string') //Single addition
			{
				if (second == null)
				{
					throw "You must define an identifier for this module!"
				}
				addModule(first, second);
			}
			else if (typeof first == 'object') //Multiple addition, ignore second param
			{
				Object.keys(first).forEach(function(id) {
					console.log("Preparing module " + id);
					if (!(window[id] == (void 0)))
					{
						throw "A global with this module's identifier - " + id + " - already exists in the global (window) scope.";
					}
					window[id] = id; //Dynamically create a global variable to match the name of this module property so that the module can now be referenced by that identifier without quotes. (Bad?)
					addModule(first[id], id);
				});
			}
		}
		
		/**
		* Asynchronously load all modules.
		*/
		lib.loadPrepared = function(callback) {
			if (modulesCurrentlyLoading && !modulesAlreadyLoaded) //If we are loading, do not callback right away, but rather store it until we are done loading
			{
				toNotify.push(callback);
			}
			else if (modulesAlreadyLoaded) //If we are done loading, do the callback right away
				callback();
			else
			{
				modulesCurrentlyLoading = true;
				var keys = Object.keys(modules);
				keys.forEach(function(id, index) {
					var m = modules[id];
					console.log("ABOUT TO LOAD " + id);
					loadModule(m, function() {
						(function(m) {
							console.log("LOADED " + id);
							m.instance = Object.assign({}, lib.exports); //clone
							lib.exports = null;
							if (index + 1 == keys.length) //If all modules have been loaded
							{
								console.log("Finished loading scripts: " + (index + 1));
								modulesAlreadyLoaded = true;
								
								//Alert all waiting threads
								var repeat;
								var i = 0;
								do
								{
									repeat = false;
									var numberWaiting = toNotify.length;
									for (; i < numberWaiting; i++)
									{
										toNotify[i](); //Call waiting threads
									}
									if (toNotify.length > numberWaiting)
									{
										repeat = true; //Some threads have asked to be notified while we were notifying others, so repeat
									}
								}
								while (repeat == true);
								
								//Finally resume
								callback.call();
							}
						})(m);
					});
				});
			}
		}
		
		function loadModule(m, callback)
		{
			var url = m.path;
			var head = document.head || document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			
			script.onload = callback;
			script.onreadystatechange = callback;
			
			head.appendChild(script);
		}
		
		lib.get = lib.use = lib.require = function(id) {
			if (id in modules)
			{
				var m = modules[id];
				if (m.instance != null)
				{
					return m.instance;
				}
				else
				{
					throw "Module not loaded or not exported. Try running loadPrepared() first."
				}
			}
			else
			{
				throw "Module not found."; 
			}
		}
		
		lib.debug = function() {
			return modules;
		}
		
		return lib;
	})();
}