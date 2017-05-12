<?php

require_once('twitter_proxy.php');

// Twitter OAuth Config options
$oauth_access_token = '830812112373039105-pbf3QFyMHg7mV6HW1sxecoWP2pv1Imq'; //'your-token-here';
$oauth_access_token_secret = '9sHK4w5rc728RCK7y52U7IvW7snAklEdgBTaWTduhyR52'; //'your-token-secret';
$consumer_key = 'oz2aDcOqKpgSEM56NxCKUpYWa'; //'your-api-key';
$consumer_secret = 'L8H4HkZjh6vycXT0CxYd7wsK51KgCCcU9Lby8JAWdUrE98KQEa'; //'your-api-secret';
$user_id = '180507527';
$screen_name = 'edinburgh';
$count = 1;

$q = 'city';
$geocode = '55.94583-3.2018410mi';

$twitter_url = 'search/tweets.json'; //'statuses/user_timeline.json';
$twitter_url .= '?q='. $q;
// $twitter_url .= '?geocode'. $geocode;
// $twitter_url .= '?user_id=' . $user_id;
// $twitter_url .= '&screen_name=' . $screen_name;
$twitter_url .= '&count=' . $count;

// Create a Twitter Proxy object from our twitter_proxy.php class
$twitter_proxy = new TwitterProxy(
    $oauth_access_token,         // 'Access token' on https://apps.twitter.com
    $oauth_access_token_secret,  // 'Access token secret' on https://apps.twitter.com
    $consumer_key,               // 'API key' on https://apps.twitter.com
    $consumer_secret,            // 'API secret' on https://apps.twitter.com
    $q,							 // 'q' -> the query keywords
    // $geocode,					 // 'geo'-> geolocation
    // $user_id,                    // User id (http://gettwitterid.com/)
    // $screen_name,                // Twitter handle
    $count                       // The number of tweets to pull out
);

// Invoke the get method to retrieve results via a cURL request
$tweets = $twitter_proxy->get($twitter_url);

echo $tweets;

?>