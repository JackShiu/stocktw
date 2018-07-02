var program = require('commander');
var delay = require('await-delay');

const { getStockData} = require("./src/parser/jsjustweb.jihsun.com.tw/main");
const { saveData, storeStockInfo} = require("./src/fs/fs");
const { getTWStockList } = require("./src/parser/isin.twse.com.tw/main");
const { evaluate, calculateAll} = require("./src/analysis/main");

let DBG =false;

(async function main(){
	let func ;
	let stockID;
	program
		// .allowUnknownOption()
		.usage('<stockID,all> [options]')
		.option('-s, --save', '運算完後進行存檔')
		.option('-o, --save-override', '存檔方式使用"覆寫"')
		.option('-p, --save-append', '存檔方式使用"附加"(default)')
		.option('-a, --save-availableOnly', '(all才有用)只存有完整算完的資料(default)')
		.option('-l, --save-allData', '(all才有用)存檔所有抓取到資料(包含沒完整)')
		.option('-c, --count <value>', '(all才有用)遍歷抓取有效資料的上限(default:10)')
		.option('-b, --traveling-begin <value>', '(all才有用)設定遍歷起始點')
		//.option('-f, --final-sort <value>', '(all才有用)遍歷完後排序的條件')
		.option('!, --debug', '開啟debug mode')
		.arguments('<cmd> [env]')
		.action(function (cmd) {
			if(Number.isInteger(parseInt(cmd))){
			stockID=cmd;
			func = evaluate;
			} else if (cmd.toUpperCase() =="ALL"){
			func = calculateAll;
			}
		})
		.parse(process.argv);
	let options = {
			save:program.save,
			override:program.saveOverride,
			append:program.saveAppend,
			maxCount:program.count ||10,
			availableOnly:program.saveAvailableOnly||true,
			allData:program.saveAllData,
			travelingBeginIndex: undefined, // program.travelingBegin
			DBG:DBG
		};
	if (program.debug) DBG=true;
	// if (options.save) console.log('  - save');
	// if (options.override) console.log('  - override');
	// if (options.append) console.log('  - append');
	//if (options.travelingBegin) console.log('  - travelingBegin'+options.travelingBegin);

	if(func === undefined) return -1;
	
	//判斷有stockID 那是不是有效的股票
	const stockList = await getTWStockList();
	if(stockID != undefined && stockList.indexOf(parseInt(stockID))===-1){
		console.log(`沒有輸入的stock [${stockID}]`);
		return -1;
	}
	
	//判斷travelingBegin那是不是有效的股票，不是就從最近的股票開始

	if(program.travelingBegin != undefined){
		let tempVal = program.travelingBegin;
		let tempIndex = stockList.indexOf(parseInt(tempVal));
		if(parseInt(tempVal) > 0 && tempIndex ===-1){
			let closest = stockList.reduce( (prev, curr) => {
				return (Math.abs(curr - tempVal) < Math.abs(prev - tempVal) ? curr : prev);
			});
			console.log(`最靠近的股票是(${closest})`);
			tempIndex = stockList.indexOf(parseInt(closest));
		} else {
			console.log(`遍歷起點是(${tempVal})`);
		}
		options.travelingBeginIndex = tempIndex;
	}
	
	//呼叫評估函數
	let storeData = await func(stockID,options);
	let date = new Date()
	let timeformat = (val) => ('0'+val).substr(-2); //自動補零
	let dateNow = `${date.getFullYear()}-${timeformat(date.getMonth() + 1)}-${timeformat(date.getDate())}`;
	let fileName = `${dateNow}-all.txt`
	if(stockID != undefined)
		fileName = `${dateNow}-${stockID}.txt`;
		
	// console.log(options, storeData)
	if((options.save || options.override|| options.append)
		&&storeData.data !== undefined && storeData.data.length >0){
			storeStockInfo(fileName,storeData.data,options.save,options.override)
	} else {
		console.log("(不存檔)")
	}

})();
