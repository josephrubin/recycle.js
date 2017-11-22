# recycle.js
A perfectly lightweight, utterly simple, asynchronous JavaScript module library.

### Features (rewrite this section) (WIP)
- Modules can reference other modules, even circularly.
- Asynchronous script loading, which does not block the HTML from populating.
- Seperation of modules for total encapsulation
- Does not polute global scope etc
- Modules alow for code reuse across projects
- No transpiler, preprocesser, or instalation

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
	var Utils = mod.get("utils"); //You can also use mod.require (an alias to mod.get)
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

### Advanced capabilities (WIP)
#### Advanced module preperation (WIP)
mod.prepare returns a reference to mod, allowing for chainging from mod.prepare
```
mod.prepare({
	EXCLAMER: "modules/exclamer.js",
	ADDER: "modules/adder.js",
	DEPEND: "modules/depend.js"
})
.loadPrepared(function() {
	//...
});
```
You can even group sets of related module preperations (WIP, use strings teach about globals later)
```
mod.prepare({
	EXCLAMER: "modules/exclamer.js",
	ADDER: "modules/adder.js",
	DEPEND: "modules/depend.js"
})
.prepare({
	EXCLAMER: "modules/exclamer.js",
	ADDER: "modules/adder.js",
	DEPEND: "modules/depend.js"
})
```
If you prefer, you can import one module at a time (Possible remove this functionality?)(WIP)
`mod.prepare(path, identifier); //Note that in this form, the path comes first.`
Preparing and using modules without quotes in identifiers:
You can leave out the quotes when creating identifiers for modules
```example here```
You can then get the modules like this:
```example here```
This reserves global blah blah
Cannot overwrite something. Polutes global scope.
Recommend using capitals since this so you know what is what.
#### Modules can use other modules! (WIP)
#### Even circular references! (WIP)
(take care not to do initialization in the loadPrepared callback, and give a remedy for this)