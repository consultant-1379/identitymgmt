#!/bin/bash

case $1 in
'UserManagement')
    cd UserManagement-ui_2_0

    cd usermanagement/
    cdt2 package install clientsdk
    cd ..

    cd usermgmtchangepass/
    cdt2 package install clientsdk
    cd ..

    cd usermgmtlib/
    cdt2 package install clientsdk
    cd ..

    cd usermgmtprofile/
    cdt2 package install clientsdk
    cd ..

    cd userprofile/
    cdt2 package install clientsdk
    cd ..

    cd userprofilechangepass/
    cdt2 package install clientsdk
    cd ..

    cd usersgroupedit/
    cdt2 package install clientsdk
    cd ..

    cd ../IdentityManagementLibrary-ui/identitymgmtlib/
    cdt2 package install clientsdk
    cd ..

    echo "UPDATE COMPLETED"
;;
'RoleManagement')
    cd RoleManagement-ui

    cd compare/
    cdt2 package install clientsdk
    cd ..

    cd rolemanagement/
    cdt2 package install clientsdk
    cd ..

    cd rolemgmtlib/
    cdt2 package install clientsdk
    cd ..

    cd userrole/
    cdt2 package install clientsdk
    cd ..

    cd ../IdentityManagementLibrary-ui/identitymgmtlib/
    cdt2 package install clientsdk
    cd ..

    echo "UPDATE COMPLETED"
;;
'TargetManagement')
    cd TargetManagement-ui

    cd targetgroup/
    cdt2 package install clientsdk scopingpanel
    cd ..

    cd targetmanagement/
    cdt2 package install clientsdk scopingpanel
    cd ..

    cd targetmgmtlib/
    cdt2 package install clientsdk scopingpanel
    cd ..

    cd ../IdentityManagementLibrary-ui/identitymgmtlib/
    cdt2 package install clientsdk
    cd ..

    echo "UPDATE COMPLETED"
;;
*)
    echo "Invalid option"
;;
esac
read -rsp $'Press any key to continue...\n' -n 1 key