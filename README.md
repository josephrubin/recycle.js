# recycle.js
A perfectly lightweight, utterly simple, asynchronous JavaScript module library.

## Features
- Asynchronous script loading, which does not block the HTML from populating, or other scripts from running at the same time.
- Modules can reference other modules, and even circular dependancies among modules work.
- No need to install anything, or run a transpiler or any other sort of preprocesser on your code.

### Why use modules?
- Modules alow for code reuse across projects.
- Seperation of code for better encapsulation.
- Modules inside closures do not polute the global scope.

## Quick start instructions
### Download recycle.js, and reference it from your HTML file
>index.html
```
<script type = "text/javascript" src = "recycle.js"></script> <!-- Load recycle.js -->
<script type = "text/javascript" src = "main.js"></script> <!-- Code that uses recycle.js -->
```
recycle.js has no dependencies on other libraries, so feel free to load it first.
### Prepare all modules once by associating an identifier with the path to each module file
The path should be relative to the HTML file.
>main.js
```
mod.prepare({
    "utils": "modules/utils.js",
    "calc":  "modules/calculus.js"
});
```
The order that you list the modules will not effect their ability to interact with one another.
### Load up the modules you have prepared and provide a callback function
All code that uses the modules should be placed inside the callback, to make sure that they are loaded before they are needed.
Do not use this callback in place of a body onload if you need one, since you can never be sure which will occur first.
>main.js
```
mod.prepare({
    "utils": "modules/utils.js",
    "calc":  "modules/calculus.js"
});
mod.loadPrepared(function() {
    //...
});
IMPORTANT: if the modules have already been loaded when the callback is set, the callback will fire immediately, so do not worry about setting it too late. Your code will still run!
```
### Retrieve each module that you would like to use inside the callback
There is no need to get the modules that you won't be using in this file.
>main.js
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

## Creating a module
### Each module is a seperate .js file
Do not manually place the script tags in your HTML. recycle.js takes care of loading the modules for you.

### Export your module by setting mod.exports to the desired value
Place your code inside a closure so as not to pollute the global scope, while providing a private interface for your module.
Consider returning an object, with various methods and properties for the user to interact with.
>modules/utils.js
```
mod.exports = (function() {
    var privateValue = "hunter2"; //Variables and functions inside the closure are private, and will not be exported unless returned.
    return { //Variables and functions specifically returned from the closure are public.
        captializeSentence: function(str) {
            //...
        },
        changePrivate: function(new) {
            privateValue = new; //Private values from a closure can be accessed and modified by public functions.
        },
        publicValue = "*******",
        //...
    }
})();
```
## Advanced capabilities (WIP)
### Advanced module preperation (WIP)
`mod.prepare` returns a reference to mod, allowing for chaining from `mod.prepare`.
>main.js
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
You can even group sets of related module preperations.
>main.js
```
mod.prepare({ //Algorithms
    "search": "modules/searching.js",
    "sort":   "modules/sorting.js"
})
.prepare({ //Utilities
    "formats": "modules/stringutils.js"
});
.prepare({ //Math
    "calc": "modules/calculus.js",
    "trig": "modules/trigfuncs.js"
})
.loadPrepared(function() {
    //...
});
```
If you prefer, you can import one module at a time. (Possible remove this functionality?)(WIP)
>main.js
```
mod.prepare(path, identifier); //Note that in this form, the path comes first.
```
###Preparing and using modules without quotes in identifiers:
You can leave out the quotes when creating identifiers for modules, and getting the modules from those identifiers.
recycle.js will reserve the identifiers as global variables, so that JavaScript does not generate a ReferenceError.
```
mod.prepare({
    BANK:     "modules/banking.js",
    ACCOUNT:  "modules/bankaccount.js"
    EMPLOYEE: "modules/worker.js",
})
.loadPrepared(function() {
    var Bank = mod.get(BANK);
    var Acc = mod.get(ACCOUNT);
    var Emp = mod.get(EMPLOYEE);
});
```
Caveat: This polutes the global namespace with reserved identifiers. Make sure that you do not try to use a global variable that already exists, for example, `alert` (recycle.js will throw in error instead of hijacking the identifier). To be safe, it is good practice to use all caps for these identifiers, to keep them seperate.

### Modules can use other modules! (WIP)
Even circular dependencies are ok.
Consider the following example, with two modules. One represents a bank, and the other is a helper module which manages bank savings accounts.
>main.js
```
mod.prepare({
    BANK: "modules/banking.js",
    ACCOUNT_MANAGER: "modules/accounts.js"
})
.loadPrepared(function() {
    var Bank = mod.get(BANK);
    var savingsAccount = Bank.setupAccount("Jones");
    console.log(savingsAccount.customerName + ", " + savingsAccount.bankName);
});
```
The main file grabs the `BANK` module and tells it to create a new account.
To do this, the Bank must itself get the new account object from the `ACCOUNT_MANAGER` module.
Notice how the `Accounts` variable is instantiated immediately, but Bank only attempts to get `ACCOUNT_MANAGER` inside the loadPrepared callback. This is to ensure that the module is ready.
>banking.js
```
mod.exports = (function() {
    var Bank = {};
    
    var Accounts;
    mod.loadPrepared(function() {
        Accounts = mod.get(ACCOUNT_MANAGER);
    });
    
    Bank.bankName = "United Bank of Iceland";
    Bank.setupAccount = function(name) {
        return Accounts.createAccount(name);
    };

    Bank.changeName = function(newName) {
        Bank.bankName = newName;
    };
    
    return Bank;
})();
```
To finish creating the account, the `ACCOUNT_MANAGER` module needs to ask for the name of the Bank.
To do this, it instantiates the `Bank` variable, and then gets the `BANK` module inside the loadPrepared callback. This is a circular dependancy, because `BANK` uses `ACCOUNT_MANAGER`, and `ACCOUNT_MANAGER` uses `BANK`.
In recycle.js, circular dependancies are legal, and very useful!
>accounts.js
```
mod.exports = (function() {
    var Accounts = {};
    
    var Bank;
    var bankName;
    mod.loadPrepared(function() {
        Bank = mod.get(BANK);
        bankName = Bank.bankName; //This line can be an issue in more complex code, see below
    });
    
    Accounts.createAccount = function(name) {
        var savingsAccount = {};
        savingsAccount.customerName = name;
        savingsAccount.bankName = bankName;
        return savingsAccount;
    };
    
    return Accounts;
})();
```
Because the functions `setupAccount` and `createAccount` are called by `main.js` inside a `loadPrepared` callback, they themselves are not placed inside such a callback in their own module files. Those functions will have access to all module dependancies by the time they run. This is because the module's `loadPrepared` callbacks happen before the loadPrepared callback in `main.js`.
Howerver, you have no control over which module's `loadPrepared` callback will happen first. In general, this is no problem. The account will be created successfully no matter the order that the two callbacks happen in.
However, keep in mind that if modules initialize themselves in the `loadPrepared` callback based on the values of other modules which do the same thing, you could run into problems.
The remedy is simple. Provide initialization functions for the private interfaces of modules whose initialzation relies on other modules, so that you can choose the order to execute them in.
In this case, we should grab the bank's name inside `initialize`, which will be called from `main.js` before the `ACOUNT_MANAGER` module is used:
>accounts.js
```
mod.exports = (function() {
    var Accounts = {};
    
    var Bank;
    var bankName;
    mod.loadPrepared(function() {
        Bank = mod.get(BANK);
    });

    *Accounts.initialize = function() {
        bankName = Bank.bankName;
    }*
    
    Accounts.createAccount = function(name) {
        var savingsAccount = {};
        savingsAccount.customerName = name;
        savingsAccount.bankName = bankName;
        return savingsAccount;
    };
    
    return Accounts;
})();
```
Actually, in our case, we can simply have the `createAccount` function dynamically grab the bankName when needed, and eliminate the `initialize` function altogether. This has the bonus feature that if the Bank's name is changed later, all new accounts will be created using the new name:
>accounts.js
```
mod.exports = (function() {
    var Accounts = {};
    
    var Bank;
    var bankName;
    mod.loadPrepared(function() {
        Bank = mod.get(BANK);
    });
    
    Accounts.createAccount = function(name) {
        var savingsAccount = {};
        savingsAccount.customerName = name;
        savingsAccount.bankName = Bank.bankName;
        return savingsAccount;
    };
    
    return Accounts;
})();
```

TODO: Modules are cloned. Internal changes after load are irrelevant
