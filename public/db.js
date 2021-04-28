const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;


let db;

const request = indexedDB.open("budget", 1);
console.log(request)

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
    console.log(db)
    const transaction = db.transaction(["pending"], "readwrite");
    const pendingStore = transaction.objectStore("pending");
    const getAll = pendingStore.getAll();



    getAll.onsuccess = function () {

        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then(() => {

                    // if (res.length !== 0) {

                    transaction = db.transaction(['pending'], 'readwrite');


                    const currentStore = transaction.objectStore('pending');


                    currentStore.clear();
                    console.log('Clearing store 🧹');
                    // }
                });
        }
    };
}


window.addEventListener("online", updateDatabase);