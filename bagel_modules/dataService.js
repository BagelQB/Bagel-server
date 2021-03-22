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

dataService.getDB = () => {
    return db;
}

dataService.addEntry = (path, entry) => {
    return remote.ref(path).push(entry);
}

dataService.editEntry = (path, newEntry) => {
    return remote.ref(path).update(newEntry);
}

dataService.removeEntry = (path) => {
    return remote.ref(path).set(null);
}


module.exports = dataService;