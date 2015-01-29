require(['src/facebook'], function (Facebook) {
    var feedEl = document.getElementsByClassName('module-social-feed-fb')[0],
        options = {
            apiConfig: {appId: '1608140682749244'}
        };
    Facebook.load(options, function () {
        feedEl.innerHTML = '<div class="fb-post" data-href="https://www.facebook.com/FacebookDevelopers/posts/10151471074398553" data-width="500"></div>';
    });

});