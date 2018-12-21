[![Build Status](https://travis-ci.org/mkay581/social-api-import.svg?branch=master)](https://travis-ci.org/mkay581/social-api-import)
[![npm version](https://badge.fury.io/js/social-api-import.svg)](https://badge.fury.io/js/social-api-import)

# Social API

This library allows you to asynchronous load multiple social media client API's easy is a standardize way and prevents
 boilerplate code necessary to load each API's script. Each network's API can be loaded using the same methods and 
 response objects that follow similar schema.

Supports the following APIs:

* Facebook
* Tumblr
* Twitter
* Instagram
* Vine

## API

### constructor([options])

You can pass a standardized set of options to each API:

| Parameter | Type | Description | Default | Required?
|--------|--------|--------|--------|--------|
| appId | String | The application ID supplied by the network |  | Yes |
| version | String | The api version to use |   | Yes |
| apiKey | String | The application key used to access the network's API |  | No |
| apiSecret | String | The application secret used to access the network's API |  | No |

Certain networks allow additional `options` outside of the ones we support. You can also pass these as `options` also. 
Please see the documentation of the network to find out which addition `options` properties you can to pass.

```javascript
import {Facebook} from 'social-api-import';
const fb = new Facebook({appId: 'MyAP33IYEK3y'});
```

### load()

This method allows you to lazily load the api of any social network. It will inject and load any scripts that are required
to use the API. It also returns a promise that is the API object of the network.

The following example uses Facebook, but you can also follow this same pattern for each of the other
network interfaces (Twitter, Tumblr, Instagram, Vine, etc). Here is an example using Facebook and Twitter.

```javascript
import {Facebook, Twitter} from 'social-api-import';
const fb = new Facebook({
    appId: 'MyAP33IYEK3y', 
    version: 'v3.2' // use the 3.2 version of Facebook's Graph API
});
fb.load().then((FB) => {
    // API loaded! Now, login
    FB.login();
});

const twitter = new Twitter();
twitter.load().then((twttr) => {
    twttr.widgets.load() // load widgets
})
```

## Development

To run tests:

```
npm test
```
