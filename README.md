[![Build Status](https://travis-ci.org/mkay581/social-api.svg?branch=master)](https://travis-ci.org/mkay581/social-api)

# Social API

A library that provides a standard JS interface to dynamically load (or lazy load) all social network APIs (good for
sites that integrate multiple social network APIs together).

Supports the following APIs:

* Facebook
* Tumblr
* Twitter
* Instagram
* Vine


## Usage

In order to use this package, you must be using a compiler to utilize the latest ES6 javascript syntax.
I recommend installing [babel](https://babeljs.io/) (or similiar) and `import`ing the [source](/src) files directly.

### Facebook

```javascript
import {Facebook} from 'social-api';
let options = {
  apiConfig: {appId: 'MyAP33IYEK3y'}
};
Facebook.load(options, function (FB) {
    // API loaded! Now, do something with the FB object
    console.log(FB);
});
```

### Twitter

```javascript
import {Twitter} from 'social-api';
Twitter.load({}, function (twttr) {
    // API loaded! Now, do something with the twitter object
    console.log(twttr);
});
```

### Tumblr

```javascript
import {Tumblr} from 'social-api';
let options = {
  apiConfig: {
     api_key: 'vtoiBQGHzJfvtNaFXK7T5DJdIM8ozpjPPzcF9z6EUxZDSELGxd',
     'base-hostname': 'janey-smith.tumblr.com'
 }
};
Tumblr.load(options, function () {
    // API loaded!
});
```

### Instagram

```javascript
import {Instagram} from 'social-api';
Instagram.load({}, function () {
    // API loaded!
});
```

### Vine

```javascript
import {Vine} from 'social-api';
let el = document.getElementsByTagName('div')[0];
Vine.load({}, function () {
    // API loaded! Show an embed
    el.innerHTML = '<iframe class="vine-embed" src="https://vine.co/v/sf90dfs/embed/simple" width="600" height="600" frameborder="0"></iframe>';
});
```
