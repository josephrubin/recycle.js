# recycle.js
A perfectly lightweight, utterly simple, JavaScript module library.

## How to use (easy!):
#### Download recycle.js, and reference it from your HTML file:
recycle.js has no dependencies on other libraries, so feel free to load it in first.
```
<script type = "text/javascript" src = "recycle.js"></script>
```
#### Prepare all modules once by associating an identifier with the path to the module file:
The path should be relative to the HTML file.
```
mod.prepare({
	"Utils": "modules/utils.js",
	"Calculus": "modules/calc.js"
});
```
2) Call module.loadModules(callback) and run all code that needs the modules inside the callback.
	If modules have already been previously loaded, they will not be loaded again (callback may be called immediately).
3) Inside the callback, get each module with module.use(identification).
	Do not attempt to use module.use outside of the module.loadModules callback, because perhaps the modules have not been loaded yet! (An error will be thrown in such a case).
	Do not use this callback in place of body onload or $(document).ready. True, that these asynchronous script loads will probably take longer than the body to load, but it is bad form to rely on such timing specifics. Instead, if the body needs to be loaded for your code to work, use both callbacks.

Creating a module:
1) Each module is a seperate .js file which is not linked to from the HTML (the library adds the <script> tags for you when necessary).
2) Your module's code will be run at most once, and the user of module.use(identification) will be given the value exported in your module.
3) Your module exports its value by setting window.exports to the desired return value.
	Consider returning an object, which will have properties and methods for the caller to use.
	Consider creating this object inside a closure, so as not to pollute the global namespace, while providing a private interface for your object.