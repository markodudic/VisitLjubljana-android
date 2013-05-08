<?php
$link        = mysql_connect('localhost', 'avtosola', 'avtosola');
$db_selected = mysql_select_db('avtosola', $link);

$sql         = "SET NAMES utf8";
$result      = mysql_query($sql);


$sql =  "INSERT INTO prijave (poslovnaenota_id, program_id, ime, priimek, email, telefon) VALUES (
	'".mysql_real_escape_string($_POST['poslovnaenota_id'])."',
	'".mysql_real_escape_string($_POST['program_id'])."',
	'".mysql_real_escape_string($_POST['ime'])."',
	'".mysql_real_escape_string($_POST['priimek'])."',
	'".mysql_real_escape_string($_POST['email'])."',
	'".mysql_real_escape_string($_POST['telefon'])."')";

$res = mysql_query($sql);

//get email
$sql   = "SELECT email FROM poslovneenote WHERE poslovnaenota_id = '".mysql_real_escape_string($_POST['poslovnaenota_id'])."' LIMIT 1";
$res   = mysql_query($sql);
$email = mysql_result($res, 0);

//send mail
$msg = "Prijava ".date('d.m.Y H:i')." \n";
$msg.= "Ime: ".$_POST['ime']."\n";
$msg.= "Priimek: ".$_POST['priimek']."\n";
$msg.= "Email: ".$_POST['email']."\n";
$msg.= "Telefon: ".$_POST['telefon']."\n";

/*
$to      = $email;
$subject = "prijava avtosola mobile app";
$headers = 'From: avtosola@vigred.com' . "\r\n" .
    'Reply-To: avtosola@vigred.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $msg, $headers);
*/

require_once 'lib/swift_required.php';
$transport = Swift_SmtpTransport::newInstance('localhost', 25)->setUsername('aplikacija@plomos.si')->setPassword('Denis12_12');
$mailer = Swift_Mailer::newInstance($transport);

$message = Swift_Message::newInstance('vpis - Vozniški izpit')
  ->setFrom(array('aplikacija@plomos.si' => 'aplikacija plomos'))
  ->setTo(array($email));

$message->setBody($msg);
$mailer->send($message);

$message = Swift_Message::newInstance('vpis - Vozniški izpit')
  ->setFrom(array('aplikacija@plomos.si' => 'aplikacija plomos'))
  ->setTo(array($_POST['email']));

$message2->setBody("Prijava preko aplikacije Vozniški izpit oddana");
$mailer->send($message2);