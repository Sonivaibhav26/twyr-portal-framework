#!/bin/sh

(echo open 127.0.0.1 1337
sleep 2
echo .exit
sleep 1
) | telnet

