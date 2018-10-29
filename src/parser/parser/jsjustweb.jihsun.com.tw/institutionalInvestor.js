const { parseValue } = require("../util/util.js");

/* =====Web1 Page ==== */
//http://jsjustweb.jihsun.com.tw/z/zc/zcw/zcw1_1477.djhtm

module.exports.extractInstitutionalInvestor = ($, option) => {
    const { DBG } = option || false;

    let a_D_TIME = [];
    let a_D_FIR = []; //外資權重
    let a_D_IIR = []; //三大法人權重
    let s_D_NBNS = null; //當日買賣超
    $(".t01 tr").not("#oScrollHead").not("#oScrollMenu").each((i, e) => {
        let line1 = $(e).children('td').eq(0).text();
        switch (line1) {
            case "合計買賣超":
                s_D_NBNS = $(e).children('td').eq(4).text();
                if (DBG) console.log("合計買賣超", s_D_NBNS);
                break;
            default:
                let [Y, M, D] = line1.split('/')
                a_D_TIME.push(`${M}/${D}`);
                a_D_FIR.push(parseValue($(e).children('td').eq(9).text()))
                a_D_IIR.push(parseValue($(e).children('td').eq(10).text()))
                if(DBG) console.log(line1, parseValue($(e).children('td').eq(9).text()), parseValue($(e).children('td').eq(10).text()) );
                break;
        }
    });
    // console.log(s_D_NBNS);
    // console.log(a_D_TIME);
    // console.log(a_D_FIR);
    // console.log(a_D_IIR);
    return { a_D_TIME, a_D_FIR, a_D_IIR, s_D_NBNS };
}