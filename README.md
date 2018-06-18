# stocktw

# 簡介
本程式是用來爬取股票以及計算基本數值

# 使用方式
## 1. 先安裝 node v8.11.2 以上 <br/>
## 2. 安裝相依檔<br/>
```
npm init 
```

## 3. 查看支援指令
```
node main.js -h
```
```
jp@jp-CP$ node main.js -h

  Usage: main <stockID,all> [options]

  Options:

    -s, --save                運算玩後進行存檔
    -o, --save-override       存檔方式使用"覆寫"
    -p, --save-append         存檔方式使用"附加"(default)
    -a, --save-availableOnly  (all才有用)只存有完整算完的資料(default)
    -l, --save-allData        (all才有用)除存所以抓取資料
    -c, --count <value>       (all才有用)遍例的有效上限(default:10)
    !, --debug                開啟debug mode
    -h, --help                output usage information
```

## 4. 查詢單一股票
```
node main.js [stockID] [options]
```
範例 1:
```
jp@jp-CP$ node main.js 2330
=======[2330]========
股票：台積電(2330)
營收比重：晶圓89.48%、其他10.52% (2017年)
基本資料網站: http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_2330.djhtm
收盤價: 231
預估本益比: 18.20~13.00
預估營收年增率(有負值,空值): (近六個月年營收)11.23,43.95,20.75,-9.5,4.08,15.09
無法預估營收: LastYearEarning 977447
預估稅後淨利率: 0.3465
(有)數值不正確，無法進行計算 !!!


(不存檔)
```

範例 2: 計算完後，將資料以覆寫存入檔案(檔案位置: ./out/parse.txt)
```
jp@jp-CP$ node main.js 2330 -so
=======[2330]========
股票：台積電(2330)
營收比重：晶圓89.48%、其他10.52% (2017年)
基本資料網站: http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_2330.djhtm
收盤價: 231
預估本益比: 18.20~13.00
預估營收年增率(有負值,空值): (近六個月年營收)11.23,43.95,20.75,-9.5,4.08,15.09
無法預估營收: LastYearEarning 977447
預估稅後淨利率: 0.3465
(有)數值不正確，無法進行計算 !!!


(已存檔)-覆寫

```


## 4. 查詢所有股票
  預設搜尋10筆，有完整算玩的資料
```
node main.js all [options]
```
範例 1:
```
jp@jp-CP$ node main.js all
計算全部
=======[1101]========
股票：台泥(1101)
營收比重：水泥及熟料66.26%、酚及酮產品13.29%、電力11.12%、預拌混凝土8.44%、其他類化學品0.88% (2017年)
基本資料網站: http://jsjustweb.jihsun.com.tw/z/zc/zca/zca_1101.djhtm
收盤價: 45.25
預估本益比: 22.40~15.40
預估營收年增率(有負值,空值): (近六個月年營收)37.69,33.25,7.34,-19.33,56.85,16.66
無法預估營收: LastYearEarning 98312
預估稅後淨利率: 0.0960
(有)數值不正確，無法進行計算 !!!

(不存檔)
```
範例 2: 指定2筆完整參數
```
jp@jp-CP$ node main.js all -c 2
```
範例 3: 指定2筆完整參數，並且存到檔案中
```
jp@jp-CP$ node main.js all -c 2 
```



