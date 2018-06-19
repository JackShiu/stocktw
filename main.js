// const request = require("request");
const rp = require('request-promise');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fs = require('fs-extra')
var program = require('commander');
var delay = require('await-delay');

let DBG =false;

async function queryService(url,cb){
    const opts = {
        uri: url,
        "User-Agent":'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.90 Safari/537.37',
		encoding: null
    };
	try {
		let body = await rp(opts);
		body = iconv.decode(body, 'big5');
		return cb(cheerio.load(body));
	}catch(e) {
		console.log("Query ERR",e.statusCode,url);
		// return new Promise.reject(e)
		throw Error("query websit error")
	}
}

const parseValue =(value) => {
	if(value === 'N/A' || value === '' ) return -1;
	return parseFloat(value.split(',').join(''));
}

/* =====Web1 Page 1==== */ 
function extractBasicInfo($){
	let H_PER=[];
	let L_PER=[];
	let currentStartStockValue; //Current start Stock Value
	let currentStockValue; //Current Stock Value
	let currentPERValue; // Current PER Value
	let stockName; //stock name
	let ProductType;
	$(".t01 td").each((i,e) =>{
		var value = $(e).text();
		// console.log(i,value)
		switch(value){
			case "開盤價":
				currentStartStockValue = parseValue($(e).next().text());
				if(DBG) console.log("開盤價:",currentStartStockValue);
			break;
			case "收盤價":
				currentStockValue = parseValue($(e).next().text());
				if(DBG) console.log("收盤價:",currentStockValue);
			break;
			case "本益比":
				currentPERValue = parseValue($(e).next().text());
				if(DBG) console.log("本益比:",currentPERValue);
			break;
			case "最高本益比":
				 $(e).parent().children('td').each((index,node) => {
				 	if(index != 0 && index< 6 ) //first is string  and extract six year value
				 		H_PER.push(parseValue($(node).text()));
				 });
				 if(DBG) console.log("最高本益比:",H_PER);
			break;
			case "最低本益比":
				 $(e).parent().children('td').each((index,node) => {
				 	if(index != 0 && index< 6 ) //first is string and extract six year value
				 		L_PER.push(parseValue($(node).text()));
				 });
				 if(DBG) console.log("最低本益比:",L_PER);
			break;
			case "營收比重":
			ProductType = ($(e).next().text());
				if(DBG) console.log("營收比重:",ProductType);
			break;
			default:
				 //第一個是股票資訊，擷取股票名稱
				 if(i == 0){
					stockName =e.children[0].data.split(/[\s,\t,\n]+/).join("").slice(0,-4);
					if(DBG) console.log(stockName)
					if (stockName === undefined || stockName === ""){
						if (DBG) console.log($("option").eq(0).text());
						stockName = $("option").eq(0).text();
					}
				 }
			break;
		}
	});
	return ({
		currentStartStockValue,
		currentStockValue,
		currentPERValue,
		H_PER,
		L_PER,
		stockName,
		ProductType
	});
}

/* =====Web1 Page 2==== */ 
function extractRevenueMonthly($){
	let profitMonthYoY =[];
	$("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i,e)=>{
		var value = $(e).children('td').eq(4).text();
		if(i < 6) //only exact the six latest value
			profitMonthYoY.push(parseValue(value));
			// console.log(i,parseValue(value));
	});
	if(DBG) console.log("年增率(%):",profitMonthYoY);
	return ({profitMonthYoY});
}


/* =====Web1 Page 3==== */ 
function extractPerformance_M($){
	let OperatingRevenueMonth =[];
	let NetProfit = [];
	let Capital;
	$("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i,e)=>{
		var value = $(e).children('td').eq(2).text();
		var tempProfitRatio = $(e).children('td').eq(4).text();
		if(i < 4) //only exact the four latest value
			OperatingRevenueMonth.push(parseValue(value));
		if(i < 4)
			NetProfit.push(parseValue(tempProfitRatio));
			// console.log(i,parseValue(value));
		if(i<1)
			Capital = parseValue($(e).children('td').eq(1).text());
	});
	if(DBG) console.log("(過去)營業收入(元/季):",OperatingRevenueMonth);
	if(DBG) console.log("(過去)稅後淨利(元/季):",NetProfit);
	if(DBG) console.log("股本:",Capital);
	return ({
		OperatingRevenueMonth,
		NetProfit,
		Capital
	});
}

/* =====Web1 Page4==== */
function extractPerformance_Y($){
	let YearEarningLastY ;
	let EPSYear = [];
	$("#oMainTable tr").not("#oScrollHead").not("#oScrollMenu").each((i,e)=>{
		var value = $(e).children('td').eq(2).text();
		var tempEPS = $(e).children('td').eq(7).text();
		if(i < 1)
			YearEarningLastY = parseValue(value);
		if(i < 2)
			EPSYear.push(parseValue(tempEPS));
			// console.log(i,parseInt(value));
	});
	if(DBG) console.log("營業收入:",YearEarningLastY);
	if(DBG) console.log("(去年)稅後每股盈餘(EPS)(元):",EPSYear);
	return { 
		YearEarningLastY,
		EPSYear
	}
}

/* =====Web2 Page1==== */
function extractTWStockList($){
	let data =[];
	$("table tr ").not("tr[align='center']").each((i,e) =>{
		let cur = $(e).children('td').not("td [colspan='7']").eq(0).text().split(/[\s,]+/);
		// console.log(i,cur)
		//只抓 "股票" 而已
		if(cur[1]==="上市認購(售)權證") return false;

		if(parseValue(cur[0])!==-1){
			// console.log(i,cur[0]);
			data.push(parseValue(cur[0]));
		}
	});
	return data
}

let getStockData =async(stockID)=>{
	const BasicInfoWeb = `http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_${stockID}.djhtm`;
	const RevenueWeb_M = `http://jsjustweb.jihsun.com.tw/z/zc/zch/zch_${stockID}.djhtm`;
	const PerformanceWeb_S = `http://jsjustweb.jihsun.com.tw/z/zc/zcd_${stockID}.djhtm`;
	const PerformanceWeb_Y = `http://jsjustweb.jihsun.com.tw/z/zc/zcdj_${stockID}.djhtm`;
	
	//Await Sequentially
	let web1 = await queryService(BasicInfoWeb, extractBasicInfo);
	let web2 = await queryService(RevenueWeb_M,extractRevenueMonthly);
	let web3 = await queryService(PerformanceWeb_S,extractPerformance_M);
	let web4 = await queryService(PerformanceWeb_Y,extractPerformance_Y);
	
	let data = {
		stockID,
		BasicInfoWeb,
		RevenueWeb_M,
		PerformanceWeb_S,
		PerformanceWeb_Y,
		...web1,
		...web2,
		...web3,
		...web4
		}
	//console.log(data)
	return data;
}

/* 獲取所有上市股票ID
   擷取一次後會存進檔案，以月的方式區分，每個月會重新刷新一次
*/
let getTWStockList = async() => {
	/* 本國上市證券國際證券辨識號碼 的網址 */
	const url ="http://isin.twse.com.tw/isin/C_public.jsp?strMode=2";
	let date = new Date()
	let dateNow = `${date.getFullYear()}-${date.getMonth() + 1}`;

	let val = readJASON("src/data/list.jason");
	let dateStore = val ===null ? -1 : val.date ;
	if(val === null || dateStore != dateNow ){
		let allStock = await queryService(url, extractTWStockList);
		writeJASON("src/data/list.jason",{date:dateNow,data:allStock})
		return allStock
	}
	return val.data
}


/* ===== Calculate ==== */
let calculate =(data) => {
	//存取資料
	const {
		stockID,
		BasicInfoWeb,
		RevenueWeb_M,
		PerformanceWeb_S,
		PerformanceWeb_Y,
		currentStartStockValue,
		currentStockValue,
		currentPERValue,
		H_PER,
		L_PER,
		stockName,
		ProductType,
		profitMonthYoY,
		OperatingRevenueMonth,
		NetProfit,
		Capital,
		YearEarningLastY,
		EPSYear
	} = data;

	//calculate value
	let predictProfitMonthYoY = -1;
	let PredictedEarning = -1;
	let PredictProfitRatio =-1;
	let PredictEPS = -1;
	let PredictPE =[];

	let isValidCompluted = false;
	let displayString = [];
	let RiskEarningRatio = -1;

	const log = (val,hide) => {
		displayString.push(val+"\n");
		if(!hide)
			console.log(val);
	}

	if(DBG) console.log(`=======開始計算========`)
	if(!DBG) log(`=======[${stockID}]========`,DBG)
	log(`股票：${stockName}`);
	log(`營收比重：${ProductType}`);
	log(`基本資料網站: ${BasicInfoWeb}`);
	log(`收盤價: ${currentStockValue}`);

	/*最高本益比
	  最低本益比
	  預估本益比區間*/
	let isValidOfPEAverage =true
	const getPEAverage = (data, limit) => {
		let firstValue = -1; 
		let MaxPE ;
		let MinPE ;
		let PEList =[];
		let threshold = 2;

		//要有六比資料才開始計算，雖然這個因該不會跑到
		// if(data.length <5) {
		// 	isValidOfPEAverage=false;
		// 	return -1;
		// }

		data.map( (val,i) => {
			// console.log(i,val)	
			//有負值，就不繼續計算
			if(val < 0 || !isValidOfPEAverage ) {
				isValidOfPEAverage = false;
				return false;
			}

			if(firstValue == -1){
				firstValue = MaxPE = MinPE = val;
				PEList.push(val)
			} else {
				switch(limit){
					case "MAX": //最大值要找最小邊界
						if(val < (MinPE*threshold) && val > (MinPE/threshold)){
							PEList.push(val);
							if(val < MinPE)
							MinPE = val
						}
					break;
					case "MIN"://最小值要找最大邊界
						if(val < (MaxPE*threshold) && val > (MaxPE/threshold)){
							PEList.push(val);
							if(val > MaxPE)
							MaxPE = val
						}
					break;
				}
			}
		});
		// console.log(MaxPE, MinPE, PEList);

		//如果已經無效，就沒有在繼續計算下去的意義
		if(!isValidOfPEAverage) return -1;

		//計算基本平均數
		const avgPE = PEList.reduce((acc, val)=>{return acc+val})/PEList.length;
		// console.log("基本平均數",avgPE.toFixed(2));

		//計算標準差
		const sumDiff = PEList.reduce((acc, val) => {
			return acc + Math.pow(val - avgPE, 2);
		});
		const delta = Math.pow(sumDiff/PEList.length, 0.5);
		// console.log("標準差", delta.toFixed(2),sumDiff.toFixed(2));

		//挑選兩倍標準差內的數值
		const newList = PEList.filter(val => {
			return (val <= avgPE + 2*delta)
			&& (val >= avgPE - 2*delta)
		});
		// console.log("兩倍標準差內的數值",newList);
		
		//計算常態分佈平均值
		return newList.reduce((acc, val) =>acc+val)/newList.length
	}

	const AvgMaxPE = getPEAverage(H_PER,"MAX");
	const AvgMinPE = getPEAverage(L_PER,"MIN");
	if(isValidOfPEAverage){
		// console.log(AvgMaxPE,AvgMinPE);
		//平均值要跟最新得數值比大小，都取最小值
		PredictPE = [Math.min(AvgMaxPE, H_PER[0])
					,Math.min(AvgMinPE,L_PER[0])];
		log(`預估本益比: ${PredictPE[0].toFixed(2)}~${PredictPE[1].toFixed(2)}`);
	} else {
		log(`預估本益比(失敗): [${H_PER}] [${L_PER}] `);
	}

	/*預估營收年增率
	  條件：
		1.近6個月營收年增率不能有負值
		2."最新的月營收年增率"與這"六個月的平均"，取出最小值當作預估營收年增率
	*/
	let isValidOfpredictProfitMonthYoY =true
	let sumOFprofitMonthYoY = profitMonthYoY.reduce((acc,cur)=>{
		if(cur < 0 ) isValidOfpredictProfitMonthYoY = false;
		return acc + cur
	});
	if(isValidOfpredictProfitMonthYoY){
		let averageOFprofitMonthYoY = (sumOFprofitMonthYoY/6);
		if(DBG) console.log("平均營收年增率: "+averageOFprofitMonthYoY.toFixed(2));
		if(DBG) console.log("最新收年增率: "+profitMonthYoY[0].toFixed(2));
		predictProfitMonthYoY = profitMonthYoY[0] < averageOFprofitMonthYoY ? profitMonthYoY[0] : averageOFprofitMonthYoY;
		log("預估營收年增率: "+predictProfitMonthYoY.toFixed( 2 ) );
	}else {
		log("預估營收年增率(有負值,空值): (近六個月年營收)"+profitMonthYoY );
	}
	
	/*預估營收
	  算法： 去年營收*(1+預估營收年增率/100 )
	*/
	if(isValidOfpredictProfitMonthYoY) {
		PredictedEarning = (YearEarningLastY * (1 + predictProfitMonthYoY/100 ));
		log("預估營收: "+ PredictedEarning.toFixed( 2 ) );
	} else {
		log(`無法預估營收: LastYearEarning ${YearEarningLastY}`);
	}
	
	/*預估稅後淨利率
	  算法: 過去4個月(稅後淨利/營業收入)的平均
	*/
	let isValidOfPredictProfitRatio =true
	let sumOFProfitRatio = NetProfit.reduce((acc,cur,i)=> {
		let OR_M = OperatingRevenueMonth[i];
		if(cur < 0 || OR_M < 0) isValidOfPredictProfitRatio = false;
		// console.log(acc,cur,OR_M,cur/OR_M,i);
		return acc + cur/OR_M;
	},0)
	if(isValidOfPredictProfitRatio){
		PredictProfitRatio = (sumOFProfitRatio/4);
		log("預估稅後淨利率: "+ PredictProfitRatio.toFixed( 4 ) );
	} else {
		log(`預估稅後淨利率無法預測: sumOFProfitRatio ${sumOFProfitRatio.toFixed(2)} `);
	}
	
	if(isValidOfPEAverage
		&& isValidOfpredictProfitMonthYoY 
		&& isValidOfPredictProfitRatio
		&& Capital
	){
		/*預估EPS
		算法: (預測營收 * 預測年營收成長率 * 100)
				(過去的營收×預估的營收年增率×預估稅後淨後率)÷股本×10
		*/
		PredictEPS = (PredictedEarning * PredictProfitRatio *100 /Capital *10).toFixed(3)
		log("預估EPS:" + PredictEPS);
	
		/*預估股價高低落點*/
		let PredictHighestPrice = PredictEPS*PredictPE[0];
		let PredictLowestPrice = PredictEPS*PredictPE[1];
		log(`預估股價高低落點: ${PredictHighestPrice.toFixed(2)}~${PredictLowestPrice.toFixed(2)} ,(當前:${currentStockValue})`);

		/*預估報酬率*/
		let PredictEarningRatio = (PredictHighestPrice - currentStockValue)/currentStockValue;
		log(`預估報酬率: ${PredictEarningRatio.toFixed(2)}`);

		/*預估風險*/
		let PredictLossRatio = (currentStockValue - PredictLowestPrice)/currentStockValue;
		log(`預估風險: ${PredictLossRatio.toFixed(2)}`);

		/*風險報酬倍數*/
		RiskEarningRatio = Math.abs(PredictEarningRatio/PredictLossRatio)
		log(`風險報酬倍數: ${RiskEarningRatio.toFixed(2)}`);

		/*計算過去兩年EPS的年增率
		  算法： 去年/前年 -1
		*/
		let EPSYoY = EPSYear[0]/EPSYear[1]-1

		/*計算PEG
		  算法： 本益比 / EPS年增率
		  概念：EPS=稅後淨利除以股本乘以10，納入了股本因素
			   畢竟股本如果膨脹會有稀釋效果，用EPS成長率更能代表公司的獲利成長情況。
		  判斷：台股PEG能降到0.4以下才稱得上具有股價低估的投資價值
		*/
		let PEG = (currentStockValue / PredictEPS) / EPSYoY /100;
		log(`PEG : ${PEG.toFixed(2)}`);

		isValidCompluted =true;
	}else {
		/*數值不正確，無法進行計算*/
		log("(有)數值不正確，無法進行計算 !!!");
	}
	log("\n");
	return {valid:isValidCompluted,
		data:displayString,
		riskEarningRatio:RiskEarningRatio
	};
}

/* 檔案操作 */
const saveData = (file, data, type) => {
	fs.ensureFile(file, function (err) { 
		switch(type){
			case "APPEN" :
				// console.log(file, data, type);
				fs.appendFileSync(file,data,(err)=>console.log(`寫檔失敗: ${err}`));
			break;
			case "OVERRIDE" :
			default:
				// console.log(file, data, type);
				fs.outputFileSync(file,data, (err)=>console.log(`寫檔失敗: ${err}`));
			break;
		}
	})
}

const storeStockInfo = (data, save=false, override=false)=>{
	if(save){
		console.log("(已存檔)-"+( override ===true ? "覆寫":"附加"));
		let conjString = data.reduce((cal,val)=> cal+val);
		// console.log(conjString)
		saveData("out/parse.txt",conjString,override ===true ? "OVERRIDE":"APPEN");
	} else {
		console.log("(不存檔)")
	}
};

const writeJASON = (file, data) => {
	fs.ensureFile(file, function (err) { 
		fs.outputJsonSync(file, data);
	})
}
const readJASON = (file) => {
	return fs.readJsonSync(file, { throws: false });
}

/*評估方式一： 計算單一類股*/
let evaluate = async(stockID, options) =>{
	if(DBG) console.log(`=====開始抓取網路資料:${stockID}====`)
	/*獲取server資料*/
	const data = await getStockData(stockID);
	/*計算單股各個數值*/
	return calculate(data, options);
}

/*評估方式二： 計算所以類股*/
var calculateAll = async(stockID,options ) => {
	console.log("計算全部");
	let storeString ={};
	// 抓取所有股票
	let data = await getTWStockList(stockID);
	data = data.slice(options.travelingBeginIndex);

	// 遍例抓取的股票陣列
	/* promise 序列化函數 */
	const promiseSerial = funcs =>
		funcs.reduce((promise, func) =>
		promise.then(result => func().then(Array.prototype.concat.bind(result))),
		Promise.resolve([]));
	/* 定義每個promise處理函數*/
	const funcs = data.map(
		stock =>async () =>  {
			try {
				let value = await evaluate(stock,options);
				/*除非要求存檔全部，不然只存有效資料*/
				if(options.allData|value.valid){
					return Promise.resolve({ data: value.data, riskEarningRatio: value.riskEarningRatio})
				}
				//設定延遲時間
				await delay(parseInt(200*Math.random()))
				//return Promise.resolve({data:false})
			} catch (e){
				console.log(`fail at : ${stock}`);
				saveData("./out/fail.tx", `fail at : ${stock} \n${e}`, "APPEN");
			}
			return Promise.resolve({ data: false, riskEarningRatio:-1})

		})
	/*濾出有效資料，並且排序*/
	let reqData = (await promiseSerial(funcs))
			.filter(val=> val.data !=false)
			.sort((a, b) => b.riskEarningRatio - a.riskEarningRatio);
	/*物件串接*/
	storeString.data = reqData.map(val => val.data).reduce((acc, val)=>acc.concat(val));
	// console.log(storeString.data);
	return storeString
}

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
			travelingBeginIndex: undefined // program.travelingBegin
		};
	if (program.debug) DBG=true;
	// if (options.save) console.log('  - save');
	// if (options.override) console.log('  - override');
	// if (options.append) console.log('  - append');
	//if (options.travelingBegin) console.log('  - travelingBegin'+options.travelingBegin);
	// let timeformat = (val) => ('0'+val).substr(-2); //自動補零

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

	// console.log(options, storeData)
	if((options.save || options.override|| options.append)
		&&storeData.data !== undefined && storeData.data.length >0){
			storeStockInfo(storeData.data,options.save,options.override)
	} else {
		console.log("(不存檔)")
	}

})();
