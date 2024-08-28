define(function() {
    'use strict';

    return [
        { "application":"Node Security", "resource":"oam", "action":"read"},

        { "application":"Node Security", "resource":"oam", "action":"execute"},

        { "application":"Node Security", "resource":"oam", "action":"delete"},

        { "application":"Network Health Monitor", "resource":"nhm", "action":"read"},

        { "application":"Network Health Monitor", "resource":"nhm", "action":"execute"},

        { "application":"Network Health Monitor", "resource":"nhm", "action":"update"},

        { "application":"Network Health Monitor", "resource":"nhm", "action":"create"},

        { "application":"Network Health Monitor", "resource":"nhm", "action":"query"},

        { "application":"Network Health Monitor", "resource":"nhm", "action":"delete"},

        { "application":"TopologyBrowser", "resource":"persistentservice", "action":"read"},

        { "application":"Single Logon Service", "resource":"sls-credentialmanagement", "action":"delete"},

        { "application":"PM Initiation and Collection", "resource":"subscription", "action":"create"},

        { "application":"PM Initiation and Collection", "resource":"subscription", "action":"update"},

        { "application":"PM Initiation and Collection", "resource":"subscription", "action":"delete"},

        { "application":"PM Initiation and Collection", "resource":"subscription", "action":"read"},

        { "application":"PM Initiation and Collection", "resource":"subscription", "action":"execute"},

        { "application":"Security-PKI", "resource":"entity_mgmt", "action":"create"},

        { "application":"Security-PKI", "resource":"entity_mgmt", "action":"update"},

        { "application":"Security-PKI", "resource":"entity_mgmt", "action":"delete"},

        { "application":"TND-Discovery", "resource":"NodeDiscovery", "action":"create"},

        { "application":"TND-Discovery", "resource":"NodeDiscovery", "action":"update"},

        { "application":"TND-Discovery", "resource":"NodeDiscovery", "action":"delete"},

        { "application":"TND-Discovery", "resource":"NodeDiscovery", "action":"read"},

        { "application":"TND-Discovery", "resource":"NodeDiscovery", "action":"execute"},

        { "application":"Auto Provisioning", "resource":"ap", "action":"read"},

        { "application":"Auto Provisioning", "resource":"ap", "action":"execute"},

        { "application":"Security-PKI", "resource":"read_entityCerts", "action":"read"},

        { "application":"Security-PKI", "resource":"extCA_mgmt", "action":"create"},

        { "application":"Security-PKI", "resource":"extCA_mgmt", "action":"update"},

        { "application":"Security-PKI", "resource":"extCA_mgmt", "action":"delete"},

        { "application":"FM", "resource":"open_alarms", "action":"execute"},

        { "application":"FM", "resource":"open_alarms", "action":"update"},

        { "application":"FM", "resource":"open_alarms", "action":"query"},

        { "application":"Security-PKI", "resource":"caEntity-cert-mgmt", "action":"create"},

        { "application":"Security-PKI", "resource":"caEntity-cert-mgmt", "action":"update"},

        { "application":"NetworkExplorer", "resource":"topologySearchService", "action":"read"},

        { "application":"Service Definition", "resource":"service_definition", "action":"create"},

        { "application":"Service Definition", "resource":"service_definition", "action":"read"},

        { "application":"Service Definition", "resource":"service_definition", "action":"update"},

        { "application":"Service Definition", "resource":"service_definition", "action":"delete"},

        { "application":"Service Definition", "resource":"service_definition", "action":"execute"},

        { "application":"Node Security", "resource":"credentials", "action":"create"},

        { "application":"Node Security", "resource":"credentials", "action":"update"},

        { "application":"Security-PKI", "resource":"read_profiles", "action":"read"},

        { "application":"Security-PKI", "resource":"read_entities", "action":"read"},

        { "application":"NetworkExplorer", "resource":"modelInformationService", "action":"read"},

        { "application":"FM", "resource":"alarms_search", "action":"query"},

        { "application":"Node Security", "resource":"sshkey", "action":"create"},

        { "application":"Node Security", "resource":"sshkey", "action":"update"},

        { "application":"Service Manager", "resource":"service_manager", "action":"create"},

        { "application":"Service Manager", "resource":"service_manager", "action":"read"},

        { "application":"Service Manager", "resource":"service_manager", "action":"update"},

        { "application":"Service Manager", "resource":"service_manager", "action":"delete"},

        { "application":"Service Manager", "resource":"service_manager", "action":"execute"},

        { "application":"FM", "resource":"fm_services", "action":"read"},

        { "application":"FM", "resource":"fm_services", "action":"query"},

        { "application":"FM", "resource":"fm_services", "action":"update"},

        { "application":"FM", "resource":"fm_services", "action":"execute"},

        { "application":"Security-PKI", "resource":"read_caEntities", "action":"read"},

        { "application":"CM-CLI", "resource":"cm_editor", "action":"read"},

        { "application":"CM-CLI", "resource":"cm_editor", "action":"create"},

        { "application":"CM-CLI", "resource":"cm_editor", "action":"execute"},

        { "application":"CM-CLI", "resource":"cm_editor", "action":"update"},

        { "application":"CM-CLI", "resource":"cm_editor", "action":"delete"},

        { "application":"CREDM-CLI", "resource":"credm", "action":"read"},

        { "application":"CREDM-CLI", "resource":"credm", "action":"execute"},

        { "application":"Security-PKI", "resource":"update_algorithms", "action":"update"},

        { "application":"FM", "resource":"alarm_export", "action":"query"},

        { "application":"Node CLI", "resource":"nodecli_usertype_view", "action":"execute"},

        { "application":"Security-PKI", "resource":"read_extCA", "action":"read"},

        { "application":"Node Version Support", "resource":"node_version_support", "action":"read"},

        { "application":"Node Version Support", "resource":"node_version_support", "action":"execute"},

        { "application":"Node Version Support", "resource":"node_version_support", "action":"delete"},

        { "application":"CM", "resource":"cm_bulk_rest_nbi", "action":"read"},

        { "application":"CM", "resource":"cm_bulk_rest_nbi", "action":"create"},

        { "application":"Node Security", "resource":"snmpv3", "action":"create"},

        { "application":"Node Security", "resource":"snmpv3", "action":"update"},

        { "application":"FM", "resource":"nodes", "action":"execute"},

        { "application":"FM", "resource":"nodes", "action":"query"},

        { "application":"FM", "resource":"nodes", "action":"update"},

        { "application":"NetworkExplorer", "resource":"topologyCollectionsService", "action":"create"},

        { "application":"NetworkExplorer", "resource":"topologyCollectionsService", "action":"delete"},

        { "application":"NetworkExplorer", "resource":"topologyCollectionsService", "action":"read"},

        { "application":"Security-PKI", "resource":"caEntity_mgmt", "action":"create"},

        { "application":"Security-PKI", "resource":"caEntity_mgmt", "action":"update"},

        { "application":"Security-PKI", "resource":"caEntity_mgmt", "action":"delete"},

        { "application":"Template Manager", "resource":"template_manager", "action":"create"},

        { "application":"Template Manager", "resource":"template_manager", "action":"read"},

        { "application":"Template Manager", "resource":"template_manager", "action":"update"},

        { "application":"Template Manager", "resource":"template_manager", "action":"delete"},

        { "application":"Template Manager", "resource":"template_manager", "action":"execute"},

        { "application":"FM", "resource":"alarm_overview", "action":"query"},

        { "application":"FMX", "resource":"fmxModuleManagement", "action":"execute"},

        { "application":"FMX", "resource":"fmxModuleManagement", "action":"create"},

        { "application":"FMX", "resource":"fmxModuleManagement", "action":"delete"},

        { "application":"FMX", "resource":"fmxModuleManagement", "action":"update"},

        { "application":"FMX", "resource":"fmxModuleManagement", "action":"read"},

        { "application":"FMX", "resource":"fmxModuleManagement", "action":"query"},

        { "application":"Security-PKI", "resource":"entity-cert-mgmt", "action":"create"},

        { "application":"Security-PKI", "resource":"entity-cert-mgmt", "action":"update"},

        { "application":"Security-PKI", "resource":"profile_mgmt", "action":"create"},

        { "application":"Security-PKI", "resource":"profile_mgmt", "action":"update"},

        { "application":"Security-PKI", "resource":"profile_mgmt", "action":"delete"},

        { "application":"FM", "resource":"alarm_policies", "action":"create"},

        { "application":"FM", "resource":"alarm_policies", "action":"query"},

        { "application":"FM", "resource":"alarm_policies", "action":"update"},

        { "application":"FM", "resource":"alarm_policies", "action":"delete"},

        { "application":"Security-PKI", "resource":"read_caCerts", "action":"read"},

        { "application":"Security-PKI", "resource":"read_algorithms", "action":"read"},

        { "application":"SHM", "resource":"cppinventorysynch_service", "action":"create"},

        { "application":"SHM", "resource":"cppinventorysynch_service", "action":"execute"},

        { "application":"SHM", "resource":"cppinventorysynch_service", "action":"delete"},

        { "application":"SHM", "resource":"cppinventorysynch_service", "action":"update"},

        { "application":"TopologyBrowser", "resource":"rootAssociations", "action":"read"},

        { "application":"Node Security", "resource":"ipsec", "action":"read"},

        { "application":"Node Security", "resource":"ipsec", "action":"execute"},

        { "application":"Node Security", "resource":"ipsec", "action":"delete"},

        { "application":"Node CLI", "resource":"nodecli_usertype_admin", "action":"execute"},

        { "application":"Node Security", "resource":"ldap", "action":"create"},

        { "application":"Node Security", "resource":"ldap", "action":"update"},

        { "application":"Node CLI", "resource":"nodecli_usertype_control", "action":"execute"},

        { "application":"NetworkExplorer", "resource":"searchExecutor", "action":"read"},

        { "application":"CM Events NBI", "resource":"cm-events-nbi", "action":"read"},

        { "application":"CM Events NBI", "resource":"cm-events-nbi", "action":"create"},

        { "application":"CM Events NBI", "resource":"cm-events-nbi", "action":"delete"},

        { "application":"CM", "resource":"cm_config_rest_nbi", "action":"read"},

        { "application":"CM", "resource":"cm_config_rest_nbi", "action":"create"},

        { "application":"CM", "resource":"cm_config_rest_nbi", "action":"update"},

        { "application":"CM", "resource":"cm_config_rest_nbi", "action":"execute"},

        { "application":"CM", "resource":"cm_config_rest_nbi", "action":"delete"}
    ];
});