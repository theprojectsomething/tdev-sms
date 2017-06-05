<?php

$file = "data.json";
$json = @file_get_contents($file);
$data = json_decode($json ? $json : "[]", true);
$request = @json_decode(@file_get_contents('php://input'));
if(@$request->messageId) {
	$data[] = $request;
	@file_put_contents($file, json_encode($data));
	_die();
}

_die("invalid request");

function _die ($msg=false) {
	$response = [
		"success" => !$msg
	];
	if($msg) {
		$response["error"] = $msg;
		http_response_code(401);
	}
	header('Content-Type: application/json');
	die(json_encode($response));
}