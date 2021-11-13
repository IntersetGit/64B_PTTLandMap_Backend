const cron = require('node-cron');
const path = require("path");
const fs = require('fs');

cron.schedule("00 15 * * *", () => {
    console.log("Hello 15.00");
});

cron.schedule("58 14 * * *", () => {
    console.log("Hello 14.58");
});

cron.schedule(`*/30 * * *  * `, () => {
    console.log("ลบไฟล์ ทุก 30 นาที");
    const _path = `${path.resolve()}/public/shapfile`
    fs.rmdirSync(_path, { recursive: true });
})

