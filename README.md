# recycle.js
A perfectly lightweight, utterly simple, asynchronous JavaScript module library.

### Features (rewrite this section) (WIP)
- Modules can reference other modules, even circularly.
- Asynchronous script loading, which does not block the HTML from populating.
- Seperation of modules for total encapsulation
- Does not polute global scope etc
- Modules alow for code reuse across projects

### Quick start instructions
#### Download recycle.js, and reference it from your HTML file:
recycle.js has no dependencies on other libraries, so feel free to load it in first.
```
<script type = "text/javascript" src = "recycle.js"></script>
```
#### Prepare all modules once by associating an identifier with the path to each module file:
The path should be relative to the HTML file.
The order that you list the modules will not effect their ability to interact with one another.
```
mod.prepare({
	"utils": "modules/utils.js",
	"calc":  "modules/calculus.js"
});
```
#### Load up the modules you have prepared and provide a callback function:
All code that uses the modules should be placed inside the callback, to make sure that they are loaded before they are needed.
Do not use this callback in place of a body onload, since you can never be sure which will load first.
```
mod.prepare({
	"utils": "modules/utils.js",
	"calc":  "modules/calculus.js"
});
mod.loadPrepared(function() {
	//...
});
```
#### Retrieve each module that you would like to use inside the callback:
There is no need to get the modules that you won't be using in this file.
```
mod.prepare({
	"utils": "modules/utils.js",
	"calc":  "modules/calculus.js"
});
mod.loadPrepared(function() {
	var Utils = mod.get("utils");
	//var Calc = mod.get("calc");

	console.log(Utils.captializeSentence("hello, recycle.js!"));
});
```
> Hello, recycle.js!

That's all there is to it.

### Creating a module
#### Each module is a seperate .js file:
Do not manually place the script tags in your HTML. recycle.js takes care of loading the modules for you.

#### Export your module by setting mod.exports to the desired value:
Place your code inside a closure so as not to pollute the global scope, while providing a private interface for your module.
Consider returning an object, with various methods and properties for the user to interact with.
```
//modules/utils.js
mod.exports = (function() {
	return {
		captializeSentence: function(str) {
			//...
		},
		//...
	}
})();
```

###Advanced capabilities (WIP)
modules reference other modules,
chaining,
alises for certain functions,
preparing one module at a time,
preparing modules in groups (with chaining)