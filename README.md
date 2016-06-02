[![Build Status](https://travis-ci.org/mkay581/social-api.svg?branch=master)](https://travis-ci.org/mkay581/social-api)
[![npm version](https://badge.fury.io/js/social-api-js.svg)](https://badge.fury.io/js/social-api-js)
[![Bower version](https://badge.fury.io/bo/social-api.svg)](https://badge.fury.io/bo/social-api)

# Social API

A library that provides a standard JS interface to dynamically load (or lazy load) all social network APIs (good for
sites that integrate multiple social network APIs together).

Supports the following APIs:

* Facebook
* Tumblr
* Twitter
* Instagram
* Vine


## Feature Roadmap

Each API will have a standard way of achieving the following with simple javascript methods. The goal is for each network
interface to follow a hard standard--having the same response format, method signature, and error handling.
Here are the features that either have been completed or will be in the next few weeks.

- [x] API loading
- [x] User logins
- [ ] Login Status checking
- [x] Permissions (partial)
- [ ] User Tokens
- [ ] User Posts
- [ ] User Profiles


## Usage

In order to use this package, you must be using a compiler to utilize the latest ES6 javascript syntax.
I recommend installing [babel](https://babeljs.io/) (or similiar) and `import`ing the [source](/src) files directly.
Or you can be old-school and use the files in the [dist](/dist) folder. :)

### Facebook

```javascript
let options = {
  appId: 'MyAP33IYEK3y'
};
Facebook.load(options).then(function (FB) {
    // API loaded! Now, do something with the FB object
    console.log(FB);
});
```

### Twitter

```javascript
Twitter.load().then(function (twttr) {
    // API loaded! Now, do something with the twitter object
    console.log(twttr);
});
```

### Tumblr

```javascript
let options = {
  api_key: 'vtoiBQGHzJfvtNaFXK7T5DJdIM8ozpjPPzcF9z6EUxZDSELGxd',
 'base-hostname': 'janey-smith.tumblr.com'
};
Tumblr.load(options).then(function () {
    // API loaded!
});
```

### Instagram

```javascript
Instagram.load().then(function (instgrm) {
    // API loaded! Do something with `instgrm` object here

});
```

### Vine

```javascript
let el = document.getElementsByTagName('div')[0];
Vine.load().then(function () {
    // API loaded! Show an embed
    el.innerHTML = '<iframe class="vine-embed" src="https://vine.co/v/sf90dfs/embed/simple" width="600" height="600" frameborder="0"></iframe>';
});
```
