const fs = require("fs-extra");

/* 檔案操作 */
module.exports.saveData = saveData = (file, data, type) => {
    fs.ensureFile(file, function (err) {
        switch (type) {
            case "APPEN":
                // console.log(file, data, type);
                fs.appendFileSync(file, data, (err) => console.log(`寫檔失敗: ${err}`));
                break;
            case "OVERRIDE":
            default:
                // console.log(file, data, type);
                fs.outputFileSync(file, data, (err) => console.log(`寫檔失敗: ${err}`));
                break;
        }
    })
}

module.exports.writeJASON = (file, data) => {
    fs.ensureFile(file, function (err) {
        fs.outputJsonSync(file, data);
    })
}
module.exports.readJASON = (file) => {
    return fs.readJsonSync(file, { throws: false });
}

module.exports.storeStockInfo = (fileName, data, save = false, override = false) => {
    if (save) {
        fileName = `out/${fileName}`;
        console.log(`(已存檔)-${override === true ? "覆寫" : "附加"} (${fileName})`);
        let conjString = data.reduce((cal, val) => cal + val);
        // console.log(conjString)
        saveData(fileName, conjString, override === true ? "OVERRIDE" : "APPEN");
    } else {
        console.log("(不存檔)")
    }
};
