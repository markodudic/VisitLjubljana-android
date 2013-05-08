<?php
$link        = mysql_connect('localhost', 'avtosola', 'avtosola');
$db_selected = mysql_select_db('avtosola', $link);

$sql         = "SET NAMES utf8";
$result      = mysql_query($sql);

$sql   = "SELECT id FROM verzija";
$res   = mysql_query($sql);
$ver   = mysql_result($res, 0);

echo json_encode($ver);