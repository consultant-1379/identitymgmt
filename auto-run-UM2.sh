#!/bin/bash
pwd
cd UserManagement-ui_2_0/
#
if [[ $1 == "build" ]]
then
	cd usermgmtprofile/
	cdt2 package unlink usermgmtlib
        cdt2 package unlink identitymgmtlib
	cdt2 package install
	cdt2 package link ../usermgmtlib/
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/

	#
	cd ../usermgmtchangepass/
	cdt2 package unlink usermgmtlib
        cdt2 package unlink identitymgmtlib
	cdt2 package install
	cdt2 package link ../usermgmtlib/
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/

	#
	cd ../userprofilechangepass/
	cdt2 package unlink usermgmtlib
        cdt2 package unlink identitymgmtlib
	cdt2 package install
	cdt2 package link ../usermgmtlib/
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/

	#
	cd ../userprofile/
	cdt2 package unlink usermgmtlib
        cdt2 package unlink identitymgmtlib
	cdt2 package install
	cdt2 package link ../usermgmtlib/
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/

	#
	cd ../usersgroupedit/
	cdt2 package unlink usermgmtlib
        cdt2 package unlink identitymgmtlib
	cdt2 package install
	cdt2 package link ../usermgmtlib/
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/

	#
	cd ../usermgmtlib
        cdt2 package unlink identitymgmtlib
	cdt2 package install
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/
	#
	cd ../usermanagement/
	cdt2 package unlink usermgmtlib
        cdt2 package unlink identitymgmtlib
        cdt2 package unlink usermgmtprofile
        cdt2 package unlink usermgmtchangepass
        cdt2 package unlink userprofilechangepass
        cdt2 package unlink userprofile
        cdt2 package unlink usersgroupedit
        cdt2 package unlink UserProfileMenu
	cdt2 package install
	cdt2 package link ../usermgmtlib/
	cdt2 package link ../../IdentityManagementLibrary-ui/identitymgmtlib/
	cdt2 package link ../usermgmtprofile/
	cdt2 package link ../usermgmtchangepass/
	cdt2 package link ../userprofilechangepass/
	cdt2 package link ../userprofile/
	cdt2 package link ../usersgroupedit/
	cdt2 package link ../../../user-profile-menu/user-profile-menu-ui/

else
	cd $1/
fi
#
case $3 in
'local')
    if [ $2 ]
    then
        cdt2 serve -m ../localServer.js -p $2
    else
        cdt2 serve -m ../localServer.js
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
