//This file must be loaded before the use of modules!
//Reserved names: module

//HOW TO USE (EASY!)
/*
1) register all modules once with module.register(identification, pathToModuleFromHtmlFile) for each module (consider defining constants to identify each module)
2) call module.loadModules(callback) and run all code that needs the modules inside the callback
3) get each module with module.use(identification)
*/

//Singleton
if (window.module == (void 0))
{
	window.module = (function() {
		var modules = {};
		var numModules = 0;
		
		function loadMod(mod, callback)
		{
			var url = mod.path;
			var head = document.head || document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			
			function doCallback()
			{
				callback.call(null, mod);
			}
			
			script.onload = doCallback;
			script.onreadystatechange = doCallback;
			
			head.appendChild(script);
		}
		
		return {
			//Import a module for use
			use: function(id) {
				if (id in modules)
				{
					var mod = modules[id];
					if (mod.loaded && mod.instance != null)
					{
						return mod.instance;
					}
					else
					{
						throw "Module not loaded or not exported. Try running loadModules() first."
					}
				}
				else
				{
					throw "Module not found. Register it first with register(id, path).";
				}
			},
			//Define a module for import
			register: function(id, path) {
				if (!(id in modules))
				{
					modules[id] = {
						path: path,
						instance: null,
						loaded: false,
						num: numModules
					};
					numModules++;
				}
			}, 
			//Load all the registered modules, and callback when complete
			loadModules: function(callback) {
				var scriptsLoaded = 0;
				var callbackCalled = false;
				for (var id in modules)
				{
					if (modules.hasOwnProperty(id))
					{
						var mod = modules[id];
						if (!mod.loaded)
						{
							console.log("ABOUT TO LOAD " + id);
							loadMod(mod, function(loadedMod) {
								console.log("LOADED " + loadedMod.num);
								loadedMod.instance = Object.assign({}, window.exports); //clone
								loadedMod.loaded = true;
								scriptsLoaded++;
								if (scriptsLoaded == numModules) //If all modules have been loaded
								{
									console.log("Finished loading scripts: " + scriptsLoaded);
									callbackCalled = true;
									callback.call();
								}
							});
						}
					}
				}
				if (!callbackCalled)
				{
					callback.call();
				}
			}
		}
	})();
}