require([
    '../src/facebook',
    '../src/twitter',
    '../src/instagram',
    '../src/tumblr'
], function (
    Facebook,
    Twitter,
    Instagram,
    Tumblr
) {

    // load facebook
    var fbFeedEl = document.getElementsByClassName('module-social-feed-fb')[0],
        options = {
            apiConfig: {appId: '1608140682749244'}
        };
    Facebook.load(options, function () {
        fbFeedEl.innerHTML = '<div class="fb-post" data-href="https://www.facebook.com/FacebookDevelopers/posts/10151471074398553" data-width="500"></div>';
    });

    // load twitter
    var twFeedEl = document.getElementsByClassName('module-social-feed-twitter')[0];
    Twitter.load(null, function () {
        twFeedEl.innerHTML = '<a class="twitter-timeline" href="https://twitter.com/twitter" data-widget-id="561242832242241537">Tweets by @twitter</a>Tweets by @twitterdev</a>';
    });

    // load instagram
    var instaFeedEl = document.getElementsByClassName('module-social-feed-instagram')[0];
    Instagram.load(null, function () {
        instaFeedEl.innerHTML = '<blockquote class="instagram-media" data-instgrm-version="4" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://instagram.com/p/rJ0Y4kRkWY/" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_top">A photo posted by Jane Smith (@janejanejanesmith)</a> on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2014-08-01T11:07:55+00:00">Aug 1, 2014 at 4:07am PDT</time></p></div></blockquote>Tweets by @twitter</a>Tweets by @twitterdev</a>';
    });

    // load Tumblr
    var tumblrFeedEl = document.getElementsByClassName('module-social-feed-tumblr')[0];
    var tumblrApiOptions = {
        apiConfig: {
            api_key: 'vtoiBQGHzJfvtNaFXK7T5DJdIM8ozpjPPzcF9z6EUxZDSELGxd',
            'base-hostname': 'janey-smith.tumblr.com'
        }
    };
    Tumblr.load(tumblrApiOptions, function () {
        Tumblr.getPostsEmbed('http://api.tumblr.com/v2/blog/janey-smith.tumblr.com/posts',
            function (html) {
            tumblrFeedEl.innerHTML = html;
        });
    });

});