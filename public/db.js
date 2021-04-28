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
    getAll.onsuccess = function () {
        // If there are items in the store, we need to bulk add them when we are back online
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
                    // If our returned response is not empty
                    if (res.length !== 0) {
                        // Open another transaction to BudgetStore with the ability to read and write
                        transaction = db.transaction(['pending'], 'readwrite');

                        // Assign the current store to a variable
                        const currentStore = transaction.objectStore('pending');

                        // Clear existing entries because our bulk add was successful
                        currentStore.clear();
                        console.log('Clearing store 🧹');
                    }
                });
        }
    };
}


window.addEventListener("online", updateDatabase());