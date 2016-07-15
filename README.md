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

| Feature | Facebook | Tumblr | Twitter | Instagram | Vine |
| --- | --- | --- | --- | --- | --- |
| API loading | Supported  | Supported | Supported | Supported | Supported |
| User logins | Supported  |  |  |  |  |  |
| Permissions | Supported  |  |  |  |  |  |
| Login Status |   |  |  |  |  |  |
| User Tokens |   |  |  |  |  |  |
| User Posts |   |  |  |  |  |  |
| User Profiles |   |  |  |  |  |  |

## Usage

In order to use this package, you must be using a compiler to utilize the latest ES6 javascript syntax.
I recommend installing [babel](https://babeljs.io/) (or similiar) and `import`ing the [source](/src) files directly.
Or you can be old-school and use the files in the [dist](/dist) folder. :)

## API

### constructor([options])

You can pass a standardized set of options to each API:

| Parameter | Type | Description | Default | Required?
|--------|--------|--------|--------|--------|
| appId | String | The application ID supplied by the network |  | Yes |
| apiVersion | Number | The api version to use | Latest API version  | No |
| apiKey | String | The application key used to access the network's API |  | No |
| apiSecret | String | The application secret used to access the network's API |  | No |

Certain networks allow additional `options` outside of the ones we support. You can also pass these as `options` also. 
Please see the documentation of the network to find out which addition `options` properties you can to pass.

```javascript
import {Facebook} from 'social-api-js';
let fb = new Facebook({appId: 'MyAP33IYEK3y'});
```

### load()

This method allows you to lazily load the api of any social network. It will inject and load any scripts that are required
to use the API. It also returns a promise that is the API object of the network.

The following example uses Facebook, but you can also follow this same pattern for each of the other
network interfaces (Twitter, Tumblr, Instagram, Vine, etc);

```javascript
import {Facebook} from 'social-api-js';
let fb = new Facebook({appId: 'MyAP33IYEK3y'});
fb.load().then(function (FB) {
    // API loaded! Now, do something with the FB object
    console.log(FB);
});
```

### login([options])

Use this method to log a user into any social network to retrieve the user's access token.
You will need this token to make API calls.

#### Options

| Parameter | Type | Description | Default | Required?
|--------|--------|--------|--------|--------|
| permissions | Array | The permissions to request from the user when logging in | [] | No |


#### Permissions

Passing a array of pre-determined permissions to the `login()` method will map to the appropriate permissions
to the specific social network you've requested. Here's an example using the Facebook social network.

```javascript
// request permissions to create posts for the user, read the user's posts, and read their connection's profiles.
var permissions = ['createPosts', 'readPosts', 'readFriendProfiles'];
Facebook.login({
    permissions: permissions
}).then(() => {
    // user has logged in allowing the specified permissions
});
```

Generally permissions follow the [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) methodology
when manipulating persistent data. The following are all permissions currently available which applies to all social networks available in this package.

| Permission | Description |
|--------|--------|
| `createPost` | Create posts on behalf of the user. |
| `readPosts` | Read the user's posts. |
| `updatePosts` | Update the user's posts (if social network allows it). |
| `deletePosts` | Remove a user's posts (if social network allows it). |
| `readProfile` | Read a user's profile information. |
| `readFriendProfiles` | Read profiles of the user's friends. |

#### Response

The `login()` method will return a promise that will resolve with an object with the following properties 
when the user has completed the login flow.

| Property | Type | Description
|--------|--------|--------|
| accessToken | String | The user token |
| accessTokenSecret | String | The user token secret |
| userId | String | The id of the user |
| expiresAt | Date | The date (and time) the user's token will expire |

```javascript
Facebook.login().then((data) => {
    // user has logged in allowing the specified permissions
    console.log(data.accessToken, 'The user token');
    console.log(data.accessTokenSecret, 'The user token secret');
    console.log(data.userId, 'The id of the user');
    console.log(data.expiresAt, 'When token expires');
});
```

#### Login Caveats

1. Facebook requires you to call `login()` after a user interaction, like a click on a button for instance. If you
attempt to call `login()` without a user interaction, most browsers will block it.
1. Twitter, most of the time, will require you to go into your application settings for your app and
enable the *"Allow this application to be used to Sign in with Twitter?"* option.


## Contributing

All pull requests are welcome!

## Development

To run tests:

```
npm test
```
