<?php

//We use already made Twitter OAuth library
//https://github.com/mynetx/codebird-php
require_once ('codebird.php');
header('Content-type: application/json');
//Twitter OAuth Settings, enter your settings here:
$CONSUMER_KEY = 'fzAevCJLFtc3mzdBVS0ZDBsCp';
$CONSUMER_SECRET = 'zcV6kTPLKjzV1iIZdk5ll9oWzXJdAcbvCKnbyBJIedkSmiaYoE';
$ACCESS_TOKEN = '2573485375-6TlYoQE22ZK4cbbqUstsNbViDnllRJyHMSEmPCH';
$ACCESS_TOKEN_SECRET = '5yrjaOZqb9zJHWVTnDJgYSJlYTp6PlfLB9DT4qI3V30Gc';

//Get authenticated
Codebird::setConsumerKey($CONSUMER_KEY, $CONSUMER_SECRET);
$cb = Codebird::getInstance();
$cb->setToken($ACCESS_TOKEN, $ACCESS_TOKEN_SECRET);


//retrieve posts
if(isset($_POST['q']))
  $q = $_POST['q'];
else {
  $q = '#sbudoit';
}

if(isset($_POST['count']))
  $count = $_POST['count'];
else {
  $count = 21;
}

if(isset($_POST['api']))
  $api = $_POST['api'];
else
  $api = "search_tweets";

//https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
//https://dev.twitter.com/docs/api/1.1/get/search/tweets
$params = array(
	'screen_name' => $q,
	'q' => $q,
	'count' => $count
);

//Make the REST call
$data = (array) $cb->$api($params);

//Output result in JSON, getting it ready for jQuery to process
echo json_encode($data);

?>
