module.exports = function(app) {

    var roles = [];
    var URL = "/idm/rolemanagement/roles";
    for (var i=0; i<100; i++) {
        roles.push(generateRandomRole(i));
    }


    app.get(URL, function(req, res) {
        if (req.query.type === 'com'){
            var comRoles = [];
            roles.forEach(function(role){
                if (role.type === 'com'){
                    comRoles.push(role);
                }
            });
            res.send(comRoles);
        }else{
            res.send(roles);
        }
    });

    app.get(URL+"/:id", function(req, res) {
        for (var i = 0; i < roles.length; i++) {
            if (roles[i].id == req.params.id) {
                console.log("Sending role " + i);
                console.log(JSON.stringify(roles[i]));
                res.send(roles[i]);
                return;
            }
        }
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.status(404).send('{"error":"Role with id: '+req.params.id+' was not found"}');
    });

    app.post(URL, function(req, res) {
        var role = req.body;
        console.log("Adding role...");
        console.log(JSON.stringify(role));
        role.id = new Date().getTime();
        roles.push(role);
        res.send(role);
    });

    app.put(URL+"/:id", function(req, res) {
        var role = req.body;
        console.log("Updating role " + req.params.id);
        console.log(JSON.stringify(role));
        for (var i = 0; i < roles.length; i++) {
            if (roles[i].id == req.params.id) {
                roles[i] = role;
                roles[i].id = parseInt(req.params.id);
                res.send(role);
                return;
            }
        }
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.send('{"error":"Role with id: '+req.params.id+' was not found"}');
    });

    app.delete(URL+"/:id", function(req, res) {
        var id = req.params.id;
        console.log("Deleting role " + id);
        for (var i = 0; i < roles.length; i++) {
            if (roles[i].id == id) {
                var role = roles[i];
                roles.splice(i, 1);
                res.send(role);
                return;
            }
        }
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.send('{"error":"Role with id: '+req.params.id+' was not found"}');
    });

    console.log("Started REST API");
}

function generateRandomRole(id) {
    //name & description
    var name = '';
    var description = '';
    switch(Math.floor(Math.random() * 3)){
        case 0:
            name = 'Administrator';
            description = 'This is administrator role.';
            break;
        case 1:
            name = 'Operator';
            description = 'This is operator role.';
            break;
        case 2:
            name = 'ENM_operator';
            description = 'This is ENM operator role.';
            break;
        default:
            name = '[ERROR]';
            break;
    }

    //type
    var type = '';
    switch(Math.floor(Math.random() * 3)){

        case 0:
            type = 'com';
            break;
        case 1:
            type = 'comalias';
            break;
        case 2:
            type = 'custom';
            break;
        default:
            type = '[ERROR]';
            break;
    }

    //status
    var status = '';
    switch(Math.floor(Math.random() * 3)){
        case 0:
            status = 'enabled';
            break;
        case 1:
            status = 'disabled';
            break;
        case 2:
            status = 'disabledAssignment';
            break;
        default:
            status = '[ERROR]';
            break;
    }

    return {
        'id':id,
        'name':name,
        'description':description,
        'type':type,
        'status':status,
        'roles': []
    }
}
