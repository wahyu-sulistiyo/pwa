const API_KEY = " 77b7a33086f24543ace4d8f79fdefaaa";
const BASE_URL = "https://api.football-data.org/v2/";

const LEAGUE_ID = 2002;

const ENDPOINT_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/standings?standingType=TOTAL`;
const ENDPOINT_DETAIL_TEAM = `${BASE_URL}teams/`;
const ENDPOINT_DETAIL_PLAYER = `${BASE_URL}players/`;



function status(response) {
    if (response.status !== 200) {
        console.log("[API.js][status] Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}
function json(response) {
    return response.json();
}

function error(error) {
    console.log("[API.js][error] Error : " + error);
}

function fetchAPI(endpoint) {
    return fetch(endpoint, {
        headers: {
            "X-Auth-Token": API_KEY
        }
    });
}

function getAllStandings() {
    return new Promise((resolve, reject) => {

    if ("caches" in window) {
        caches.match(ENDPOINT_COMPETITION).then(response => {
            if (response) {
                response.json().then(data => {
                    console.log("Competition Data: " + data);
                    getResultStandingsJSON(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_COMPETITION)
    .then(status)
    .then(json)
    .then(data => {
        getResultStandingsJSON(data);
        resolve(data);
    })

     .catch(error);
   });
}



function getTeamDetail(teamID) {
    return new Promise((resolve, reject) => {
        if ("caches" in window) {
            caches.match(ENDPOINT_DETAIL_TEAM + teamID).then(response => {
                if (response) {
                    response.json().then(data => {
                        console.log("Team Data: " + data);
                        getResultTeamInfoJSON(data);
                    })
                }
            })
        }
        fetchAPI(ENDPOINT_DETAIL_TEAM  + teamID)
        .then(status)
        .then(json)
        .then(data => {
            getResultTeamInfoJSON(data);
            resolve(data);
        })
    .catch(error);
    });  
        
}

function getPlayerDetail(playerID) {
    return new Promise((resolve, reject) => {
        if ("caches" in window) {
            caches.match(ENDPOINT_DETAIL_PLAYER + playerID).then(response => {
                if (response) {
                    response.json().then(data => {
                        console.log("Player Data: " + data);
                        getResultPlayerDetailJSON(data);
                    })
                }
            })
        }
        fetchAPI(ENDPOINT_DETAIL_PLAYER + playerID)
        .then(status)
        .then(json)
        .then(data => {
            getResultPlayerDetailJSON(data);
            resolve(data);
        })
    .catch(error);
   });
       
}

function getFavorite() {
          getAllFavorites().then(data => {
          getResultTeamFavoritesJSON(data);
    });
}

function getFavoriteById(ID) {
         getById(ID).then(data => {
            getResultTeamInfoJSON(data);
        });
    
}

function getResultTeamInfoJSON(data) {
    data = JSON.parse(JSON.stringify(data).replace(/^http:\/\//i, 'https://'));

    var tableOverviewHtml = "";
    var tableSquadHtml = "";

    tableOverviewHtml += `
        <tr>
            <td>Nama</td> <td>${data.name}</td>
        </tr>
        <tr>
            <td>Nama Singkat</td> <td>${data.shortName}</td>
        </tr>
        <tr>
            <td>Tahun Berdiri</td> <td>${data.founded}</td>
        </tr>
        <tr>
            <td>Singkatan</td> <td>${data.tla}</td>
        </tr>
        <tr>
            <td>Alamat</td> <td>${data.address}</td>
        </tr>
        <tr>
            <td>Telepon</td> <td>${data.phone}</td>
        </tr>
        <tr>
            <td>Website</td> <td><a href="${data.website}" target="_blank">${data.website}</a></td>
        </tr>
        <tr>
            <td>Email</td> <td><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
            <td>Warna Club</td> <td>${data.clubColors}</td>
        </tr>
        <tr>
            <td>Tempat Kandang</td> <td>${data.venue}</td>
        </tr>
    `;

    let number = 1;
    data.squad.forEach(squad => {
        tableSquadHtml += `
            <tr>
                <td class="center-align">${number}</td>
                <td>${squad.name}</td>
                <td class="center-align">${squad.position}</td>
                <td class="center-align"><a href="./detail_Player.html?id=${squad.id}">Detail</a></td>
            </tr>
        `;
        number++;
    });

    document.getElementById("crestUrl").src = data.crestUrl;
    document.getElementById("nameHeader").innerHTML = data.name;
    document.getElementById("tableOverview").innerHTML = tableOverviewHtml;
    document.getElementById("tableSquad").innerHTML = tableSquadHtml;
}

function getResultTeamFavoritesJSON(data) {
    data = JSON.parse(JSON.stringify(data).replace(/^http:\/\//i, 'https://'));

    var tableTeamFavoriteHtml = "";
    let number = 1;

    tableTeamFavoriteHtml += `
        <table class="striped centered">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Tim</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(team => {
        tableTeamFavoriteHtml += `
            <tr>
                <td>${number}</td>
                <td><a href="./pages/detail_team.html?id=${team.id}&saved=true">${team.name}</a></td>
                <td>
                    <a class="waves-effect waves-light btn-small red" onclick="removeFromFavorites(${team.id}, 'favorite_team')">
                        <i class="large material-icons">Hapus</i>
                    </a>
                </td>
            </tr>
        `;

        number++;
    });

    tableTeamFavoriteHtml += `
            </tbody>
        </table>
    `;

    document.getElementById("favorite-item").innerHTML = tableTeamFavoriteHtml;
}

function getResultStandingsJSON(data) {
    var tableStandingsHtml = "";

    data.standings.forEach(standing => {
        var tableDataStanding = "";

        standing.table.forEach(dataTeam => {
            dataTeam = JSON.parse(JSON.stringify(dataTeam).replace(/^http:\/\//i, 'https://'));  
            
            tableDataStanding += `
                <tr>
                    <td class="center-align">${dataTeam.position}</td>
                    <td>
                        <a href="./pages/detail_team.html?id=${dataTeam.team.id}">
                            <p style="display: flex; align-items: center;">
                                <img class="materialboxed" style="float:left; margin-right:20px" width="50" height="50" src="${dataTeam.team.crestUrl}">
                                ${dataTeam.team.name}
                            </p>
                        </a>
                    </td>
                    <td class="center-align">${dataTeam.playedGames}</td>
                    <td class="center-align">${dataTeam.won}</td>
                    <td class="center-align">${dataTeam.draw}</td>
                    <td class="center-align">${dataTeam.lost}</td>
                    <td class="center-align">${dataTeam.points}</td>
                    <td class="center-align">${dataTeam.goalsFor}</td>
                    <td class="center-align">${dataTeam.goalsAgainst}</td>
                    <td class="center-align">${dataTeam.goalDifference}</td>
                </tr>
            `;
        })

        tableStandingsHtml += `
            <div class="card">
                <div class="card-content">
                    <table class="responsive-table striped centered">
                        <thead>
                            <tr>
                                <th class="left-align">Posisi</th>
                                <th class="left-align">Tim</th>
                                <th class="left-align">Main</th>
                                <th class="left-align">Menang</th>
                                <th class="left-align">Seri</th>
                                <th class="left-align">Kalah</th>
                                <th class="left-align">Poin</th>
                                <th class="left-align">Gol Masuk</th>
                                <th class="left-align">Gol Kebobolan</th>
                                <th class="left-align">Selisih Gol</th>
                            </tr>
                        </thead>

                        <tbody>
                            ` + tableDataStanding + `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    });

    document.getElementById("klasemen").innerHTML = tableStandingsHtml;
}

function getResultPlayerDetailJSON(data) {
    var tablePlayerDetailHtml = "";

    tablePlayerDetailHtml += `
        <table class="striped">
            <thead></thead>
            <tbody>
                <tr>
                    <td>Nama</td> <td>${data.name}</td>
                </tr>
                <tr>
                    <td>Nama Pertama</td> <td>${data.firstName}</td>
                </tr>
                <tr>
                    <td>Nama Terakhir</td> <td>${data.lastName}</td>
                </tr>
                <tr>
                    <td>Tempat Lahir</td> <td>${data.countryOfBirth}</td>
                </tr>
                <tr>
                    <td>Tanggal Lahir</td> <td>${data.dateOfBirth}</td>
                </tr>
                <tr>
                    <td>Warga Negara</td> <td>${data.nationality}</td>
                </tr>
                <tr>
                    <td>Posisi</td> <td>${data.position}</td>
                </tr>
                <tr>
                    <td>Nomor Kaos</td> <td>${data.shirtNumber}</td>
                </tr>
            </tbody>
        </table>
    `;
    document.getElementById("tablePlayerDetail").innerHTML = tablePlayerDetailHtml;
}

function back() {
    window.history.back();
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}