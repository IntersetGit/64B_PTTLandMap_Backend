const sequelize = require("../config/dbConfig"); //connect db  query string
const messages = require('../messages/index');
const bcrypt = require("bcryptjs");
const jwt_decode = require("jwt-decode");
const CryptoJS = require("crypto-js");
const config = require('../config');
const _path = require('path')
const fs = require('fs')

exports.sequelizeString = async (sql, bind) => {
    const res = await sequelize.query(sql, { bind: bind });
    return res[0].length > 0 ? res[0] : [];
}

exports.sequelizeStringFindOne = async (sql, bind) => {
    const res = await sequelize.query(sql, { bind: bind });
    return res[0].length > 0 ? res[0][0] : null;
}

exports.sequelizeStringLike = async (sql, replacements) => {
    const res = await sequelize.query(sql, {
        replacements: { search_name: `%${replacements.search}%` }
    })
    return res[0].length > 0 ? res[0] : null;
}

/* เข้ารหัส Password */
exports.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
};



/* ตรวจสอบ Password */
exports.checkPassword = async (password, passwordDB) => {
    const isValid = await bcrypt.compare(password, passwordDB);
    return isValid;
};

exports.decodeToken = async (auth) => {
    const authHeader = auth;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        const error = new Error(messages.errorUserNot);
        error.statusCode = 402;
        throw error;
    }
    return jwt_decode(token);
};


exports.getListDateBetween = (date_start, date_end) => {
    const dates = [];
    let startDate = moment(date_start, 'YYYY-MM-DD');

    dates.push({ date: startDate.format('YYYY-MM-DD') });
    while (!startDate.isSame(date_end)) {
        startDate = startDate.add(1, 'days');
        dates.push({ date: startDate.format('YYYY-MM-DD') });
    }
    return dates
}


exports.getAmount = (arr, amm) => {
    arr.forEach(e => {
        const daymoment = moment(e.date, "YYYY-MM").daysInMonth();
        e.amount = Number((amm / daymoment))
    });
    return arr
}


exports.checkImgById = (id, path, type = ".jpg") => {
    let img;
    const projectPath = _path.resolve("./");
    const uploadPath = `${projectPath}/public/uploads/${path}/${id}${type}`;
    if (fs.existsSync(uploadPath))
        img = `${config.SERVICE_HOST}/uploads/${path}/${id}${type}`
    return img
}


exports.checkImgMaintenace = (id, path, type = ".jpg") => {
    let img;
    const projectPath = _path.resolve("./");
    const uploadPath = `${projectPath}/public/uploads/${path}/${id}${type}`;
    if (fs.existsSync(uploadPath))
        img = `/uploads/${path}/${id}${type}`
    return img
}

exports.getDateString = ({ date = new Date(), local = "th", tpye = "initial", format = "DayMonthYear", year_thai = true, type_year = 'full' }) => {
    try {
        if ((local == "th" || local == "en") && (tpye == "initial" || tpye == "full") && (type_year == "initial" || type_year == "full")) {
            const _date = new Date(date)
            const month = {
                full: {
                    th: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
                    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                },
                initial: {
                    th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
                    en: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."],
                },
            }
            const day = _date.getDate()
            const Month = month[tpye][local][_date.getMonth()]

            // const Year = year_thai ? _date.getFullYear() + 543 : _date.getFullYear();
            const Year = moment().add(year_thai ? 543 : 0, 'year').format(type_year == 'initial' ? 'YY' : 'YYYY')
            if (format == "DayMonthYear") return day + ' ' + Month + ' ' + Year
            else if (format == "DayMonth") return day + ' ' + Month
            else if (format == "Day") return day
            else if (format == "Month") return Month
            else if (format == "Year") return Year
            else return null
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}

/* เข้ารหัส */
exports.EncryptCryptoJS = (code) => {
    const secretKey = config.SECRET_KEY_CODE
    const encJson = CryptoJS.AES.encrypt(JSON.stringify(code), secretKey).toString()
    const encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))
    return encData
}

/* ถอดรหัส */
exports.DecryptCryptoJS = (code) => {
    const secretKey = config.SECRET_KEY_CODE
    const decData = CryptoJS.enc.Base64.parse(code).toString(CryptoJS.enc.Utf8)
    const bytes = CryptoJS.AES.decrypt(decData, secretKey).toString(CryptoJS.enc.Utf8)
    return JSON.parse(bytes)
}

exports.stringToSnakeCase = (string) => {
    return (string && string
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('_')
    )

}
