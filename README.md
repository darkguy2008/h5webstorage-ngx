# h5webstorage-ngx

This is a library I forked from https://github.com/SirDarquan/h5webstorage to make it work on the latest Angular versions. For some reason, when I forked and built it as-is, the differences between the old Angular compiler it was using and the newest one as of date (v11) made it crash when looking for an "id" property to be returned when calling the modules from the `imports` section inside the main ngModule.

Plus, I also wanted to fix a couple bugs. Most notably, one of the bugs I wanted to fix was that when setting a variable as undefined (to delete/erase it) it wasn't removing it from the Local Storage, so I patched that as well. Now, when you set one of the variables denoted with @StorageProperty as undefined, they'll be cleared from the storage.

This is the first library I fork and publish, so sorry there's no testing (I dislike TDD) or other similar stuff. Hey, it works and it has a custom patch, that's enough for me. Don't expect much maintenance, but the original library didn't have much anyways, so up to you.

Original README.md files below:

---

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.6.

## Code scaffolding

Run `ng generate component component-name --project h5webstorage-ngx` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project h5webstorage-ngx`.
> Note: Don't forget to add `--project h5webstorage-ngx` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build h5webstorage-ngx` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build h5webstorage-ngx`, go to the dist folder `cd dist/h5webstorage-ngx` and run `npm publish`.

## Running unit tests

Run `ng test h5webstorage-ngx` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

---

# Original h5webstorage's README.md below

# h5webstorage [![npm version][]][nvl] [![Build Status][]][bsl] [![Test Coverage][]][tcl] [![Code Climate][]][ccl] 
#### Html5 WebStorage API for Angular2
[![Sauce Test Status](https://saucelabs.com/browser-matrix/SirDarquan.svg)](https://saucelabs.com/u/SirDarquan)
- [Use](#use)
- [Overview](#overview)
  - [LocalStorage](#localstorage) (service)
  - [SessionStorage](#sessionstorage) (service)
  - [@StorageProperty](#storageproperty) (decorator)
  - [ConfigureStorage](#configurestorage) (function)
  
## Use
1. Download the library:

  `npm install h5webstorage --save`	
2.  Import the module and the providers into your top level module:

  ```typescript
	import {WebStorageModule} from "h5webstorage";
  ```
3. Register the module:

  ```typescript
	@NgModule({
		...
		imports:[WebStorageModule.forRoot()],
	})
  ```
4. Inject the service into your class and use:

  ```typescript
	import {LocalStorage, StorageProperty} from 'h5webstorage';
	@Component({})
	class MyComponent{
		@StorageProperty() public SomeValue: string = null;	//This will expose a specific value in localStorage as property of this class
		constructor(private localStorage: LocalStorage){
			...	
		}
	}
  ```
		
## Overview
The [angular2-localStorage][] project is what inspired this project with
its use of a decorator to access the values in the storage area. 
Unfortunately, the implementation was difficult to test do to the use of
hard references to static classes. The intention of this project was to 
determine if a higly testable version of webstorage access was possible.

There is an example application that shows the various ways to use the 
webstorage APIs but overall the classes were designed to work just like
the native storage objects. In fact, the `BaseStorage` object implements
the Storage interface to give it nearly one-to-one compatibility. The 
LocalStorage/SessionStorage objects were meant to be used as you would the native
localStorage/sessionStorage objects. Here's a quick example:
```typescript
	constructor(private localStorage: LocalStorage){
		this.localStorage["firstKey"] = "This value will appear in storage";
		this.localStorage.setItem("secondKey", "This will also");
		var retrieved = this.localStorage["storedKey"]; //if there is a value in storage it would be retrieved
		console.log(retrieved); 	
	}
```
There is one minor exception: Native storage objects can use a number index
while the wrappers can't. I've never actually seen them used this way so I
can't imagine it's a widely used feature and I'm OK with that missing piece.

Finally, the storage objects are bound both ways, so if a change occurs in
storage, the WebStorage objects receives the change and the application is
immediately updated.
 

### LocalStorage
The `LocalStorage` object is the service that uses the [localStorage][] object
as its backing. To keep the library testable, the native localStorage object
is injected. Normally this would mean importing two items from the library
and placing them both in the providers array which you can do if you 
want to but to simplify this common scenario, the `LOCAL_STORAGE_PORVIDER`
was created which does this job for you.

### SessionStorage
The `SessionStorage` object is just like the `LocalStorage` object except
for using the native [sessionStorage][] object for backing. There is also a
`SESSION_STORAGE_PROVIDER` to simplify registration.

### @StorageProperty
`StorageProperty` is a decorator used to simplifiy access to the stored values.
It accepts an object with the following properties:
- __storageKey {string}__: an alternate name for the key in storage
- __storage {'Local'|'Session'}__: a string that determines which backing to associate the field with.
	Local is the default
- __readOnly {boolean}__: specifies if the property allows writes. Default is false;

**Note**: In order to use the `@StorageProperty` decorator, you **MUST**
inject the storage service and make it a field of the class. Here an 
example showing the scenario this library was best designed for: creating a 
strongly typed representation of your storage.
```typescript
	import {LocalStorage} from 'h5webstorage';
	@Injectable()
	class MyStorageService{
		@StorageProperty() public SomeValue: string = null;	//This will expose a specific value in localStorage as a property of this class
		@StorageProperty({ storageKey: 'storageName', storage: 'Session'}) public FriendlyName: string = null;	//This will expose the 'storageName' value in sessionStorage as the 'FriendlyName' property
		@StorageProperty({readOnly: true}) public Manager: string; // Since it is readonly and initialization value isn't necessary
		constructor(private localStorage: LocalStorage, sessionStorage: SessionStorage){	//notice LocalStorage and SessionStorage is injected even though they aren't used directly
			...	
		}
	}
```
The `@StorageProperty` decorator syncs the stored value automatically and will even be updated is the value in storage is changed by 
another source (like through DevTools or the same app in a different tab). That type of change will also cause a change detection to
occur, so if the property is bound to a template, the updated value will be visible immediately. You can also do calculations on it in
the ngOnChanges method.
Be aware that in essence, the property __IS__ the value in storage. So if the value is an object and properties are referenced in code, 
deleting the stored value is like setting a variable to null and exceptions can occur.

### ConfigureStorage
The `ConfigureStorage` function creates a provider which allows you to 
inject configuration options for the storage object(s) to be used. 
One thing to remember is that the ConfigureStorage provider will only 
inject into new instances of LocalStorage/SessionStorage. So if you inject 
`LocalStorage` into the root component and only provide `ConfigureStorage`
in a sub-component, it will never be used. But inversely, if the Root
component contains the `ConfigureStorage` provider, then all sub-components
that inject `LocalStorage`/`SessionStorage` will have the options configured.
Here's an example of `ConfigureStorage` being used:
```typescript
import {ConfigureStorage} from "h5webstorage";
@Component({
	providers:[ConfigureStorage({ prefix: "myPrefix-" })]	
})
class myClass{}
```

#### - prefix
The storage key prefix has some handy uses. With the angular2
injector hierarchy, the root component can inject a LocalStorage object
that can 'see' all the available keys. Then a sub-component can inject
another LocalStorage object that can only see keys that start with a
specific prefix. This technique is used in the example app included to
allow use to have multiple to do lists.

#### - serializeOnException
The h5webstorage library expects to control the localStorage and sessionStorage 
objects completely and idealy, that meansany values ever stored was done so by 
the library. In reality, that's not always the case. There may be values from a
previous implementation before h5webstorage began to be used and the format of
those values may not be compatible. By default, the library resets those values
to null to start clean but that may not always be the desireable result.
This property aims to help ease these types of transitions. For example, if 
your previous implementation generally used string and integer values, the
integers will load without a problem using the default transformer but if the
strings don't have quotes around them they will not load. All that is actually
needed at this point is to have that value serialized and it can then be used as-is.

This property can be used in conjunction with a custom transformer to load data 
exactly the way you want. But with more power comes more responibility, so be
cautious.  

### Providers
This library was designed with great configurability in mind but that normally 
comes at the price of simplicity. Fortunately, [angular2][]'s injector system
allows us to make some shortcuts.

#### LOCAL_STORAGE_OBJECT and SESSION_STORAGE_OBJECT
These are the tokens used to inject the `localStorage` and `sessionStorage` native objects into
the `LocalStorage` and `SessionStorage` objects respectivly. Using this, it is possible to have 
`LocalStorage` and `SessionStorage` store its data in other places like for a cookie fallback.

#### SERDES_OBJECT
This is the SERializer/DESerializer object used to transform the values between storage and memory. By
default, this is the [JSON][] object in the browser but can be replaced by pretty much anything. There
are two (2) methods that must be implemented: stringify and parse. This can be used to have a transparent
encryption layer for the stored values or whatever.   

## Testing
Testability was the reason this library was built in the first place. Not only is testing the library
itself easy because of its modularity, testing an application that uses the library is just as simple.
Here's an example using Jasmine:
```typescript
describe("My test suite", ()=>{

	beforeEach(()=>{
		TestBed.configureTestingModule({
			providers:[
				{provide: LOCAL_STORAGE_OBJECT, useValue: {"myVariable": "something"}},
				LocalStorage,
				MyClass
			]
		})
	})
	it("should set myVariable", inject([MyClass, LocalStorage],(sut: MyClass, ls: LocalStorage)=>{
		expect(ls["myVariable"]).toBe('something');
		sut.doSomething();
		expect(ls["myVariable"]).toBe('something else');
	}); 
});
``` 
With the example above, you can verify that the logic of the class places the correct value in storage
or performs the correct actions based on what it finds in storage.

## Angular-CLI, AOT and Universal
With the tooling update, h5webstorage is fully angular-cli compliant and can be used in AOT scenarions,
unlike the previous iterations. In theory, h5webstorage can also be used in Angular Universal scenarios
as well but until there is a confirmed case of someone needing to do this, it'll remain a theory. 


[angular2-localStorage]: https://github.com/marcj/angular2-localStorage
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[sessionStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
[Test Coverage]: https://codeclimate.com/github/SirDarquan/h5webstorage/badges/coverage.svg
[tcl]: https://codeclimate.com/github/SirDarquan/h5webstorage/coverage
[Build Status]: https://travis-ci.org/SirDarquan/h5webstorage.svg?branch=master
[bsl]: https://travis-ci.org/SirDarquan/h5webstorage
[Code Climate]: https://codeclimate.com/github/SirDarquan/h5webstorage/badges/gpa.svg
[ccl]: https://codeclimate.com/github/SirDarquan/h5webstorage
[angular2]: https://angular.io
[angular universal]: https://universal.angular.io/
[JSON]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
[nvl]: https://www.npmjs.com/package/h5webstorage
[npm version]: https://badge.fury.io/js/h5webstorage.svg