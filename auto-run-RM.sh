#!/bin/bash
pwd
cd RoleManagement-ui/
#
if [[ $1 == "build" ]]
then
	cd rolemgmtlib/
	cdt2 package unlink identitymgmtlib
	cdt2 package install
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/
	
	cd ../userrole
	cdt2 package unlink rolemgmtlib
	cdt2 package unlink identitymgmtlib
	cdt2 package install
	cdt2 package link ../rolemgmtlib
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/

	cd ../compare
	cdt2 package unlink rolemgmtlib
	cdt2 package unlink identitymgmtlib
	cdt2 package install
	cdt2 package link ../rolemgmtlib
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/

	cd ../rolemanagement
	cdt2 package unlink identitymgmtlib
	cdt2 package unlink rolemgmtlib
	cdt2 package unlink userrole
	cdt2 package unlink compare
	cdt2 package unlink UserProfileMenu
	cdt2 package install
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/
	cdt2 package link ../userrole
	cdt2 package link ../rolemgmtlib
	cdt2 package link ../compare
	cdt2 package link ../../../user-profile-menu/user-profile-menu-ui/

else
	cd $1
fi
#
case $3 in
'newserver')
    if [ $2 ]
    then
        cdt2 serve -m ../newserver.js -p $2
    else
        cdt2 serve -m ../newserver.js
    fi
;;
'server')
    if [ $2 ]
    then
        cdt2 serve -m ../server.js -p $2
    else
        cdt2 serve -m ../server.js
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
