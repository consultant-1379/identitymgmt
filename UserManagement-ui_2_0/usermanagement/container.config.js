define({
    "defaultApp": "usermanagement",
    "name": "Ericsson Network Manager",
    "properties": {
            "help": {
                "helpCenter": true
             },
             "helpbutton": {
                "helpCenter": true
             }
    },
    "components": [
        {
            "path": "helpbutton"
        },
        {
            "path": "navigation"
        },
        {
            "path": "flyout"
        },
        {
            "path": "contextmenu"
        }
    ],
    webpush: {
        urls: {
            "id": "/rest/sse/id",
            "stream": "/rest/sse/stream",
            "subscriptions": "/rest/sse/subscriptions"
        },
    heartbeat: {
            enable: true,
            url: '/web-push/rest/oss/push/heartbeatInterval'
        }
    }
});
