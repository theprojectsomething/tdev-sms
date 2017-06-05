<?php

// load credentials
$credentials = @json_decode(@file_get_contents("credentials.json"));

// credentials not defined
if( !$credentials ) _die("credentials");

// retrieve auth token from request header
$auth_header = @apache_request_headers()["authorization"] ?: "";
$access_token = preg_replace('/^Bearer (.*)$/', "$1", $auth_header);

// auth token not provided
if( !$access_token ) _die(true);

// retrieve user data
$data = google_user_data($access_token);

// email not returned
if(!@$data->email) _die("google");

// email not in list of users
if(!in_array($data->email, is_array(@$credentials->users) ? $credentials->users : [])) _die("email");

// retrieve telstra token
$data->telstra = telstra_token(@$credentials->telstra->key, @$credentials->telstra->secret);

// telstra request failed
if(!$data->telstra) _die("telstra");

// set confirmed token
$data->token = $access_token;

// return all data (success)
_die($data);

function google_user_data ($access_token) {
	$json = @file_get_contents("https://www.googleapis.com/userinfo/v2/me?access_token=${access_token}");
	return json_decode($json ? $json : '{}');
}

function telstra_token ($key, $secret) {
	$response = file_get_contents("https://api.telstra.com/v1/oauth/token", false, stream_context_create(array(
	    "http" => array(
	        "header"  => "Content-type: application/x-www-form-urlencoded\r\n",
	        "method"  => 'POST',
	        "content" => http_build_query([
				"client_id" => $key,
				"client_secret" => $secret,
				"grant_type" => "client_credentials",
				"scope" => "SMS"
			])
	    )
	)));

	return $response === false ? false : json_decode($response);
}


function _die ($data) {
	if(!is_object($data)) {
		http_response_code(401);
		$data = [ "error" => $data, "status" => "not authorised" ];
	}
	header('Content-Type: application/json');
	die(json_encode($data));
}