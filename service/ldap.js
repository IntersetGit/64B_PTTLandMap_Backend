const config = require("../config");
const ldap = require('ldapjs');

const connect = {
    development: {
        host: config.LDAP_HOST_DEV,
        url: config.LDAP_URL_DEV,
        search: config.LDAP_SEARCH_DEV,
    },
    test: {
        host: config.LDAP_HOST_TEST,
        url: config.LDAP_URL_TEST,
        search: config.LDAP_SEARCH_TEST,
    },
    production: {
        host: config.LDAP_HOST_PROD,
        url: config.LDAP_URL_PROD,
        search: config.LDAP_SEARCH_PROD,
    },
}


exports.ldap = async ({ username, password }) => {
    const _res = await ConnectLdap({ username, password })
    console.log('_res :>> ', _res);
    return _res
}


const ConnectLdap = async ({ username, password }) => {
    const { host, url, search } = connect[config.NODE_ENV]

    // LDAP Connection Settings
    const userPrincipalName = `${username}@${host}`; // Username

    // Create client and bind to AD
    const client = ldap.createClient({ url });

    client.bind(userPrincipalName, password, err => { });

    const __res = await client.search(search, {
        scope: "sub",
        filter: `(userPrincipalName=${userPrincipalName})`
    }, async (err, res) => {

        await res.on('searchEntry', (entry) => {
            console.log(entry.object.name);
            return entry.object
        });

        await res.on('error', err => {
            console.error('error: ' + err.message);
            return err
        });

    });

    return __res;

}