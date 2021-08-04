
module.exports = (res, data, status = 200) => {
    return res.status(status).json({
        items: data,
        status_code: status,
    });
}