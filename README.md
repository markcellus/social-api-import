# Social API

A library that allows a common JS interface to load all social network APIs dynamically. It offers the ability to
 lazy load APIs and provides a common interface (good for sites that integrate multiple social network APIs together).
 Can be used with any dependency management system including [RequireJS](http://requirejs.org/),
 [CommonJS](http://wiki.commonjs.org/wiki/CommonJS), [Browserify](http://browserify.org/), etc.

Supports the following APIs:

* Facebook
* Tumblr
* Twitter
* Instagram

With more coming soon.

## Dependencies

Each file in the [dist folder](dist/) can be used with any dependency management system (RequireJS, CommonJS, Browserify, etc).
They also all expose a global variable onto the `window.SocialApi` object in case shims need to be created or if you want to
work with the object directly.

## Usage

### Facebook

```javascript
var options = {
  apiConfig: {appId: 'MyAP33IYEK3y'}
};
Facebook.load(options, function (FB) {
    // API loaded! Now, do something with the FB object
    console.log(FB);
});
```

### Twitter

```javascript
Twitter.load({}, function (FB) {
    // API loaded! Now, do something with the twitter object
    console.log(twttr);
});
```

### Tumblr

```javascript
var options = {
  apiConfig: {
     api_key: 'vtoiBQGHzJfvtNaFXK7T5DJdIM8ozpjPPzcF9z6EUxZDSELGxd',
     'base-hostname': 'janey-smith.tumblr.com'
 }
};
Tumblr.load(options, function (FB) {
    // API loaded!
});
```

### Instagram

```javascript
Instagram.load({}, function (FB) {
    // API loaded!
});
```