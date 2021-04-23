let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    const updatedDB = event.target.result;
    console.log(updatedDB);
    updatedDB.createObjectStore("pending", { autoIncrement: true })
}

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        updateDatabase();
    }
}

request.onerror = function (event) {
    console.log("ERROR: " + event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const pendingStore = transaction.objectStore("pending");
    pendingStore.add(record);
}

function updateDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const pendingStore = transaction.objectStore("pending");

    const getAll = pendingStore.getAll();


    //write a promise witha  a fetch and then

}

window.addEventListener("online", updateDatabase());