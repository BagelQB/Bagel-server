// Service to store data and sync it to a remote firebase realtime database.
let dataService = {};

const adminCreds = require("../bagel_credentials/firebase_creds.json");

let admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(adminCreds),
    databaseURL: "https://bagelqb-default-rtdb.firebaseio.com/"
});

let remote = admin.database(); // Remote instance of the database
let db = {}; // Local instance of the database.

remote.ref("/").on("value", function(snapshot) {
    // This hook makes the db update to the remote database to allow manual editing.
    db = snapshot.val();
});

/**
 * Function to get the secure database object.
 * @returns {Object} - The database json object
 */
dataService.getDB = () => {
    return db;
}

/**
 * Function to add an entry to a path with a given name
 * @param {String} path - The path to add the entry to.
 * @param {String} entryName - The name to give to the entry.
 * @param {Object} entry - The entry to add.
 * @returns {Promise} - Promise that represents the completion of the entry addition.
 */
dataService.addEntryWithName = (path, entryName, entry) => {
    return remote.ref(path).update({[entryName]: entry});
}

/**
 * Function to add an entry to a path with a randomly generated ID.
 * @param {String} path - The path to add the entry to.
 * @param {Object} entry - The entry to add.
 * @returns {Promise} - Promise that represents the completion of the entry addition.
 */
dataService.addEntry = (path, entry) => {
    return remote.ref(path).push(entry);
}

/**
 * Function to edit an entry on a path.
 * @param {String} path - The path to the entry to edit.
 * @param {Object} newEntry - The updated entry (This can be just an object that represents what values should be updated)
 * @returns {Promise} - Promise that represents the completion of the entry edit.
 */
dataService.editEntry = (path, newEntry) => {
    return remote.ref(path).update(newEntry);
}

/**
 * Function to remove an entry given a path.
 * @param {String} path - The path to the entry to remove.
 * @returns {Promise} - Promise that represents the completion of the entry delete operation.
 */
dataService.removeEntry = (path) => {
    return remote.ref(path).set(null);
}


module.exports = dataService;