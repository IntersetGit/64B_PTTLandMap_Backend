const cron = require('node-cron');

cron.schedule("00 15 * * *", () => {
    console.log("Hello 15.00");
});

cron.schedule("58 14 * * *", () => {
    console.log("Hello 14.58");
});

