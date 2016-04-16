<?php

//We use already made Twitter OAuth library
//https://github.com/mynetx/codebird-php
require_once ('codebird.php');
require_once ('../.credentials/twitter.php');
header('Content-type: application/json');
//Twitter OAuth Settings, enter your settings here:


//Get authenticated
Codebird::setConsumerKey($CONSUMER_KEY, $CONSUMER_SECRET);
$cb = Codebird::getInstance();
$cb->setToken($ACCESS_TOKEN, $ACCESS_TOKEN_SECRET);


//retrieve posts
if(isset($_POST['q']))
  $q = $_POST['q'];
else {
  $q = '#sbudoit OR #sbutlt';
}

if(isset($_POST['count']))
  $count = $_POST['count'];
else {
  $count = 100;
}

if(isset($_POST['api']))
  $api = $_POST['api'];
else
  $api = "search_tweets";

if(isset($_POST['sinceid']))
  $sinceid = $_POST['sinceid'];
else {
  $sinceid = 720825277157236699;
}
//https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
//https://dev.twitter.com/docs/api/1.1/get/search/tweets
$params = array(
	'screen_name' => $q,
	'q' => $q,
  'since_id' => $sinceid,
  'count' => 90
);

//Make the REST call
$data = (array) $cb->$api($params);

//Output result in JSON, getting it ready for jQuery to process
echo json_encode($data);

?>
