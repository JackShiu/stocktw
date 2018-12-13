const { parseValue } = require("../util/util.js");

/* =====Web1 Page ==== */
//http://jsjustweb.jihsun.com.tw/z/zc/zco/zco_2368_6.djhtm

module.exports.extractmainForceRate = ($, option) => {
    let { DBG } = option || false;
    // DBG = true
    let s_D_TIME = "";
    let s_D_mainForce_Buy_sum = 0; //合計買超張數
    let s_D_mainForce_Sell_sum = 0; //合計賣超張數
    // let s_D_NBNS = null; //當日買賣超
    $("#oScrollFoot td").each((i, e) => {
        var tag = $(e).text();
        switch (tag) {
            case "合計買超張數":
                s_D_mainForce_Buy_sum = parseValue($(e).next().text());
                if (DBG) console.log("合計買超張數", s_D_mainForce_Buy_sum);
                break;
            case "合計賣超張數":
                s_D_mainForce_Sell_sum = parseValue($(e).next().text());
                if (DBG) console.log("合計買超張數", s_D_mainForce_Sell_sum);
                break;
        }
    });
    //get Time
    let timeString = $(".t11").text().split('：')[2];
    let [Y, M, D] = timeString.split('/');
    s_D_TIME = `${M}/${D}`;
    //買賣超量
    let s_D_mainForce_Diff_volume = s_D_mainForce_Buy_sum - s_D_mainForce_Sell_sum;

    return { s_D_TIME, s_D_mainForce_Diff_volume };
}

