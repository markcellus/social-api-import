[![Build Status](https://travis-ci.org/mkay581/social-api.svg?branch=master)](https://travis-ci.org/mkay581/social-api)
[![npm version](https://badge.fury.io/js/social-api-js.svg)](https://badge.fury.io/js/social-api-js)
[![Bower version](https://badge.fury.io/bo/social-api.svg)](https://badge.fury.io/bo/social-api)

# Social API

Using one social network API is easy. But using multiple ones throughout your app, is not only is tedious, but very frustrating
due to each API being soooo different from one another. The response objects, the methods, the parameters, everything.

This library aims to make things easier for you by giving you a common interface for each social network API. Each
network's API can be accessed using the same method names and response objects that follow the same schema.

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
- [x] User logins (Facebook only)
- [x] Permissions (Facebook only)
- [ ] Login Status
- [ ] User Tokens
- [ ] User Posts
- [ ] User Profiles


## Usage

In order to use this package, you must be using a compiler to utilize the latest ES6 javascript syntax.
I recommend installing [babel](https://babeljs.io/) (or similiar) and `import`ing the [source](/src) files directly.
Or you can be old-school and use the files in the [dist](/dist) folder. :)

## Methods

### load([options])

This method allows you to lazily load the api of the social network, using the supplied object of `options`.
It also returns a promise that is the API object of the network. The following example uses Facebook, but you can also follow
this same pattern for each of the other network interfaces (Twitter, Tumblr, Instagram, Vine, etc);

```javascript
import {Facebook} from 'social-api-js';
Facebook.load({appId: 'MyAP33IYEK3y'}).then(function (FB) {
    // API loaded! Now, do something with the FB object
    console.log(FB);
});
```

When using the `load()` call, certain networks require different set of `options`. Please see the documentation of
the network to find out which `options` properties you need to pass.

