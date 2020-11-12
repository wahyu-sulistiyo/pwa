var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BO4PM569V23Zn45V74LBNSbaHH66ovx4zqr7HktDWXmSUUFFMPKSG8kQvHCiWoTFgMy0cfw2vVtertxId6Uea-o",
    "privateKey": "sOvdDDrCYRvwTf1C3D8G3H5moMBtJJRtW_2rDOm5Vpg"
};

webPush.setVapidDetails(
    "mailto:w4hyu5@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

var pushSubscription = {
    "endpoint": " https://fcm.googleapis.com/fcm/send/caHOSxovRSk:APA91bH7zDuGdhmfxbibtR9SXlq4Y8nZuFy4aSVmWhlHTea022m1CmkdqELy44R6J6HFGxxZ4DyNIJ8m4aZUlBznsRbAY6iAA6BH77SygCOKFGPahzOJJQofGSOBl887tFinllJIHKqa",
    "keys": {
        "p256dh": "BJNHA/MifzjfmW9/zpWy/wBH2REi28kVSmUOQW2t/82KRHSJcHymf5PrmRiDdhnRW1MqMri+LHJjYeorOOYjtLw=",
        "auth": "hBPSel5grgdUyXqIXSRppA=="
    }
};

var payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

var options = {
    gcmAPIKey: "815398615954",
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);