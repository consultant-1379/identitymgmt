#!/bin/bash
pwd
cd TargetManagement-ui/
#
if [[ $1 == "build" ]]
then
    cd targetmgmtlib/
    cdt2 package unlink identitymgmtlib
    cdt2 package install clientsdk scopingpanel
    cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/

	cd ../targetgroup/
	cdt2 package install clientsdk scopingpanel
	cdt2 package unlink identitymgmtlib
    cdt2 package unlink targetmgmtlib
	cdt2 package link ../targetmgmtlib/
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/

	cd ../targetmanagement/
	cdt2 package unlink identitymgmtlib
    cdt2 package unlink targetgroup
    cdt2 package unlink targetmgmtlib
	cdt2 package install clientsdk scopingpanel
    cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/
    cdt2 package link ../targetgroup
    cdt2 package link ../targetmgmtlib

else
	cd $1/
fi

case $3 in
'newserver')
	if [ $2 ]
	then
		cdt2 serve -m ../newserver.js -p $2
	else
		cdt2 serve -m ../newserver.js
	fi
;;
'v5')
	if [ $2 ]
	then
		cdt2 serve -m ../proxyServerSocksV5.js -p $2
	else
		cdt2 serve -m ../proxyServerSocksV5.js
	fi
;;
*)
	if [ $2 ]
	then
		cdt2 serve -m ../proxyServer.js -p $2
	else
		cdt2 serve -m ../proxyServer.js
	fi
;;
esac
