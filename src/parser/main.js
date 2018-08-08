var program = require('commander');

const { getStockIDList } = require("./parser/isin.twse.com.tw/main");
const {  evaluate } = require("./analysis/main");

let DBG =false;

(async function main(){
	let func ;
	let stockID;
	program
		// .allowUnknownOption()
		.usage('<stockID,all> [options]')
		.option('-s, --save', '運算完後進行存檔')
		// .option('-o, --save-override', '存檔方式使用"覆寫"')
		// .option('-p, --save-append', '存檔方式使用"附加"(default)')
		// .option('!, --debug', '開啟debug mode')
		.arguments('<cmd> [env]')
		.action(function (cmd) {
			if(Number.isInteger(parseInt(cmd))){
			stockID=cmd;
			}
		})
		.parse(process.argv);
	let options = {
			save:program.save,
			// override:program.saveOverride,
			// append:program.saveAppend,
			DBG:DBG
		};
	if (program.debug) DBG=true;
	// if (options.save) console.log('  - save');

	//判斷有stockID 那是不是有效的股票
	const stockList = await getStockIDList(options);
	if(stockID != undefined && stockList.indexOf(parseInt(stockID))===-1){
		console.log(`沒有輸入的stock [${stockID}]`);
		return -1;
	}

	//呼叫評估函數
	evaluate(stockID,options);

})();
