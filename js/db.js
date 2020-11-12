function cekDatabase(idb) {
    var dbPromised = idb.open("Bundesliga", 1, upgradeDb => {    
            var teamsObjectStore = upgradeDb.createObjectStore("dbNameTeam", {
                keypath: "id"
            });
            
            teamsObjectStore.createIndex("team_name", "name", {
                unique: false
            });
    });

    return dbPromised;
}

function addToFavorite(data) {
    var dataPrimaryKey;
    
    dataPrimaryKey = data.id;        
    cekDatabase(idb)
        .then(db => {
            var tx = db.transaction("dbNameTeam", "readwrite");
            var store = tx.objectStore("dbNameTeam");
            
            store.put(data, dataPrimaryKey);

            return tx.complete;
        })
        .then(() => {
            M.toast({
                html: "Berhasil ditambahkan ke favorite",
            });
        });
}

function removeFromFavorites(ID) {
    console.log(ID);
    cekDatabase(idb)
        .then(db => {
            var tx = db.transaction("dbNameTeam", "readwrite");
            var store = tx.objectStore("dbNameTeam");

            store.delete(ID);

            return tx.complete;
        })
        .then(() => {
            M.toast({
                html: "Berhasil dihapus dari favorite",
            });
        });

    location.reload();
}

function getAllFavorites() {
    return new Promise((resolve, reject) => {
        cekDatabase(idb)
            .then(db => {
                var tx = db.transaction("dbNameTeam", "readonly");
                var store = tx.objectStore("dbNameTeam");
                
                return store.getAll();
            })
            .then(data => {
                resolve(data);
            });
    });
}

function getById(ID) {
    return new Promise((resolve, reject) => {
        cekDatabase(idb)
            .then(db => {
                var tx = db.transaction("dbNameTeam", "readonly");
                var store = tx.objectStore("dbNameTeam");

                return store.get(ID);
            })
            .then(data => {
                resolve(data);
            });
    });
}