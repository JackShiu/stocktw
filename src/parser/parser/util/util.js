const rp = require("request-promise");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

/*
queryService
return cherrio structure with html data type
*/
module.exports.queryService = async (url, cb, option) => {
    const opts = {
        uri: url,
        timeout: 10000,
        method: 'get',
        "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.90 Safari/537.37',
        encoding: null
    };
    try {
        let body = await rp(opts);
        body = iconv.decode(body, 'big5');
        return cb(cheerio.load(body), option);
    } catch (e) {
        console.log("Query ERR", e.statusCode, url);
        // return new Promise.reject(e)
        throw Error(`query websit error: ${e.statusCode} ${url}\nERR: ${e}`)
    }
}


module.exports.parseValue = (value) => {
    if (value === 'N/A' || value === '') return -1;
    return parseFloat(value.split(',').join(''));
};

