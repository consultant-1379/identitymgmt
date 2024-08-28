#!/bin/bash

case $1 in
'UserManagement')
    cd UserManagement-ui_2_0
    cdt2 build --packages ../IdentityManagementLibrary-ui/identitymgmtlib,usermgmtlib,usermanagement,usermgmtprofile,usermgmtchangepass,userprofile,userprofilechangepass,usersgroupedit --use-external-phantomjs
;;
'RoleManagement')
    cd RoleManagement-ui
    cdt2 build --packages ../IdentityManagementLibrary-ui/identitymgmtlib,rolemgmtlib,rolemanagement,userrole,compare --use-external-phantomjs
;;
'TargetManagement')
    cd TargetManagement-ui
    cdt2 build --packages ../IdentityManagementLibrary-ui/identitymgmtlib,targetmgmtlib,targetmanagement,targetgroup --use-external-phantomjs
;;
*)
    echo "Invalid option"
;;
esac
read -rsp $'Press any key to continue...\n' -n 1 key
