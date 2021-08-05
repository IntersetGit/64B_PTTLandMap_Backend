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
    // console.log('_res :>> ', _res);
    return _res
}

/** 
// --------- General
givenName คือ First name
initials คือ Initials
sn คือ Last name
displayName คือ Display Name //ไม่จำเป็น
description คือ Description
physicalDeliveryOfficeName คือ Office
telephoneNumber คือ Telephone number
mail คือ E-mail
wWWHomePage คือ Web page

// --------- Address
streetAddress คือ Street
postOfficeBox คือ P.O. Box //ไม่จำเป็น
l คือ City //ไม่จำเป็น
st คือ State/province //ไม่จำเป็น
postalCode คือ Zip/Postal Code //ไม่จำเป็น
co คือ Country.region //ไม่จำเป็น

// --------- Orgarization
title คือ Job Title
department คือ Department
company คือ Company
*/


const ConnectLdap = async ({ username, password }) => {
    const myPromise = new Promise((resolve, reject) => {
        const { host, url, search } = connect[config.NODE_ENV]

        // LDAP Connection Settings
        const userPrincipalName = `${username}@${host}`; // Username

        // Create client and bind to AD
        const client = ldap.createClient({ url });

        client.bind(userPrincipalName, password, err => { });

        client.search(search, {
            scope: "sub",
            filter: `(userPrincipalName=${userPrincipalName})`
        }, (err, res) => {

            res.on('searchEntry', (entry) => {
                console.log(entry.object.name);
                resolve(entry.object);
                return entry.object
            });

            res.on('end', result => {
                // console.log("result ======================>" , result);
                const _err = { message: "ไม่พบชื่อผู้ใช้" }
                reject(_err)
                return _err
            });

            res.on('error', err => {
                // console.error('error: ' + err.message);
                const _err = { message: "รหัสผ่านไม่ถูกต้อง" }
                reject(_err)
                return _err
            });

           

        });
    });
    return await myPromise
}