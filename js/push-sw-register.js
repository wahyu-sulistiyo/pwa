if ("serviceWorker" in navigator) {
      registerServiceWoker();
      while(!navigator.serviceWorker.ready)
         requestPermission();
} else {
    console.log("Service Woker belum didukung browser ini");
}

function registerServiceWoker() {
    return navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
            console.log("Registrasi Service Worker berhasil.");
            return registration;
        })
        .catch(err => {
            console.error("Registrasi Service Worker gagal", err);
        });
}


function requestPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(result => {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diizinkan.");
                return;
            }
            else if (result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan izin.");
                return;
            }  
             
            if (("PushManager") in window) {
                navigator.serviceWorker.getRegistration().then(registration => {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array("BO4PM569V23Zn45V74LBNSbaHH66ovx4zqr7HktDWXmSUUFFMPKSG8kQvHCiWoTFgMy0cfw2vVtertxId6Uea-o")
                    }).then(subscribe => {
                        console.log("[requestPermission] Berhasil melakukan subscribe");
                        console.log("[Endpoint]: ", subscribe.endpoint);
                        console.log("[p256dh key]: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("p256dh")))));
                        console.log("[Auth key]: ", btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey("auth")))));
                    }).catch(e => {
                        console.error("[requestPermission] Tidak dapat melakukan subscribe", e.message);
                    })
                })
            }
        });
    }
}