<?php
$users = [
    [ "user" => "sophie"   , "pass" => "cookie" ],
    [ "user" => "root"     , "pass" => "root" ],
];

function check_user($userArg, $passArg)
{
  global $users;
  foreach ($users as $u) {
    if (( $u['user'] == $userArg) && ($u['pass'] == $passArg)){
      return True;
    }
  }
  return False;
}

?>
