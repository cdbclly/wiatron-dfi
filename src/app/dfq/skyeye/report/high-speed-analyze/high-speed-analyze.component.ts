import { Component, OnInit } from '@angular/core';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'app-high-speed-analyze',
  templateUrl: './high-speed-analyze.component.html',
  styleUrls: ['./high-speed-analyze.component.scss']
})
export class HighSpeedAnalyzeComponent implements OnInit {
  cur_plant;
  cur_site;
  project = 'high-speed';
  cur_date;
  dataA = {};
  dataB = {};
  objectKeys = Object.keys;
  objectValue = Object.values;
  THwidth = [];
  totoalWidth;
  datefrom;
  dateto;
  datefrom1 = undefined;
  dateto1 = undefined;
  lineAdata;
  repeatCol;
  dataALine = [];
  dataAhead = [];
  dataAContent = [];
  dataBLine = [];
  dataBhead = [];
  dataBContent = [];
  lineABackGround = [];
  lineBBackGround = [];
  isVisible = false;
  footer = null;
  cancelOK = false;
  echart;
  originArrA;
  originArrB;
  queryButton = true;
  dateInputFrom;
  dateInputTo;
  secondeUItData = [];
  timer;
  constructor(
    private esService: EsDataServiceService,
    private message: NzMessageService,
    private datePipe: DatePipe,
    private readonly matomoTracker: MatomoTracker,
    private readonly matomoInjector: MatomoInjector
  ) {
    this.matomoInjector.init('https://matomo.wistron.com/', 24);
  }

  ngOnInit() {
    this.matomoTracker.trackPageView('highSpeedPage');

    this.cur_date = new Date().getTime();
    this.getData(this.cur_date);

    this.timer = setInterval(async () => {
      this.repeat();
    }, 1000);
  }

  // 获取当前时间的整点时间
  numberToDate(number: any) {
    const date = new Date(number);
    const YY = date.getFullYear() + '-';
    const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    const ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return new Date(YY + MM + DD + ' ' + hh + 0 + 0).getTime();
  }

  // 根据对象数组的多个属性去重
  removeDuplicate(arr) {
    // const tempArr = [];
    const cache = [];
    for (const item of arr) {
      // 检查缓存中是否已经存在
      if (cache.find(c => c['line'] === item['line'] && c['evt_pid'] === item['evt_pid'] && c['stage'] === item['stage'])) {
        continue;
      }
      // 不存在就说明以前没遇到过，把它记录下来
      cache.push(item);
    }
    // 记录结果就是过滤后的结果
    return cache;
  }

  // 整理的数据格式
  needData(array, length) {
    const tempArray = [];
    array.forEach(element => {
      const tempLineDic = {}; // 存放 line 对应的数据
      // const tempStageDic = {}; // 存放 stageA/B 对应的数据
      const tempMDic = {}; // 存放 M 对应的数据
      // const tempArr = [];
      // 先造好需要格式的空数据 然后把数据塞进去
      if (tempArray.length === 0) {
        for (let index = 1; index < length + 1; index++) {
          const lastStr = element.evt_pid.charAt(element.evt_pid.length - 1);
          const tempStageDic = {}; // 存放 stageA/B 对应的数据
          // tslint:disable-next-line: radix
          if (index === parseInt(lastStr)) {
            if (element.stage === 'A') {
              tempStageDic['StageA'] = element.vacuumValue;
              tempStageDic['StageB'] = 'N/A';
            } else {
              tempStageDic['StageA'] = 'N/A';
              tempStageDic['StageB'] = element.vacuumValue;
            }
          } else {
            tempStageDic['StageA'] = 'N/A';
            tempStageDic['StageB'] = 'N/A';
          }
          tempMDic['M-' + index] = tempStageDic;
        }
        // tempArr.push(tempMDic);
        tempLineDic[element.line] = tempMDic;
        tempArray.push(tempLineDic);
      } else {
        // 检查 tempArray 是否包含 element.line，如果包含就塞到对应的数组中
        const keyArrs = [];
        for (const i of tempArray) {
          // tslint:disable-next-line: forin
          for (const k in i) {
            keyArrs.push(k);
          }
        }
        if (keyArrs.indexOf(element.line) > -1) {
          // const lastNumber = element.evt_pid.charAt(element.evt_pid.length - 1);
          /* 当线已经存在tempArray数组里面，将对应的element.stage存入对应stage中
          */
          const index = keyArrs.indexOf(element.line);
          // 取得当前的线数据
          const lineData = tempArray[index][element.line];
          // 取得对应的M-x
          const M_data = lineData[element.evt_pid];
          if (element.stage === 'A') {
            M_data['StageA'] = element.vacuumValue;
          } else {
            M_data['StageB'] = element.vacuumValue;
          }
        } else {
          for (let index = 1; index < length + 1; index++) {
            const lastStr = element.evt_pid.charAt(element.evt_pid.length - 1);
            const tempStageDic = {}; // 存放 stageA/B 对应的数据
            // tslint:disable-next-line: radix
            if (index === parseInt(lastStr)) {
              if (element.stage === 'A') {
                tempStageDic['StageA'] = element.vacuumValue;
                tempStageDic['StageB'] = 'N/A';
              } else {
                tempStageDic['StageA'] = 'N/A';
                tempStageDic['StageB'] = element.vacuumValue;
              }
            } else {
              tempStageDic['StageA'] = 'N/A';
              tempStageDic['StageB'] = 'N/A';
            }
            tempMDic['M-' + index] = tempStageDic;
          }
          // tempArr.push(tempMDic);
          tempLineDic[element.line] = tempMDic;
          tempArray.push(tempLineDic);
        }
      }
    });
    return tempArray;
  }


  // 整理出哪些M-x 和 stage 需要删除；将要被删除的数据状态标记为false; 如果M-x 对应的M-x['StageA],M-x['StageB] 均为false 则M-x整列删除
  statusFalseDelete(surfaceData) { // surfaceData为整理后的面数据
    // 获取面的所有的线
    const surfaceDataLine = [];
    for (let a = 0; a < surfaceData.length; a++) {
      surfaceDataLine.push(this.objectKeys(surfaceData[a]).join(','));
    }
    // 面对应的所有的M-x的值:['M-1', 'M-2',...]
    const M_xArr = this.objectKeys(surfaceData[0][surfaceDataLine[0]]);
    const surfaceStatus = [];
    M_xArr.forEach(element => {
      const tempDic = {};
      tempDic[element] = { 'StageA': false, 'StageB': false }; // fales 代表没有值，该列stage能删
      surfaceStatus.push(tempDic);
    });
    for (let b = 0; b < surfaceDataLine.length; b++) { // 遍历每条线的M-x中的stage是否有数据
      for (let c = 0; c < M_xArr.length; c++) {
        // 只有数组中对应的每个M-x中的stage数据存在则记为true，然后存与状态数组中对应的key做与运算，即：true || false = true
        if (surfaceData[b][surfaceDataLine[b]][M_xArr[c]]['StageA'] !== 'N/A') {
          if (surfaceStatus[c][M_xArr[c]]['StageA'] !== true) {
            surfaceStatus[c][M_xArr[c]]['StageA'] = true;
          }
        }
        if (surfaceData[b][surfaceDataLine[b]][M_xArr[c]]['StageB'] !== 'N/A') {
          if (surfaceStatus[c][M_xArr[c]]['StageB'] !== true) {
            surfaceStatus[c][M_xArr[c]]['StageB'] = true;
          }
        }
      }
    }
    return surfaceStatus;
  }


  // 将整理后的面数据根据要删除的状态数组删除数据全为N/A的列
  surfaceDeleteNA(surfaceData, surfaceStatus) {
    // 获取面的所有的线
    const surfaceDataLine = [];
    for (let a = 0; a < surfaceData.length; a++) {
      surfaceDataLine.push(this.objectKeys(surfaceData[a]).join(','));
    }
    // 面对应的所有的M-x的值:['M-1', 'M-2',...]
    const M_xArr = this.objectKeys(surfaceData[0][surfaceDataLine[0]]);
    const surfaceDataLength = surfaceData.length;
    const surfaceStatusLength = surfaceStatus.length;


    // 遍历surfaceData 的线
    for (let a = 0; a < surfaceDataLength; a++) {
      // 遍历surfaceStatus取出M-x对应的状态，根据状态删除数据
      for (let b = 0; b < surfaceStatusLength; b++) {
        if (!surfaceStatus[b][M_xArr[b]].StageA && !surfaceStatus[b][M_xArr[b]].StageB) {
          // 对应的M-x里面的StageA和StageB 都不存在,则删除整个M-x对应的列数据
          delete surfaceData[a][surfaceDataLine[a]][M_xArr[b]];
        } else { // 对应的M-x里面的StageA和StageB 存在一个,则删除M-x对应的stage为false的列数据
          if (!surfaceStatus[b][M_xArr[b]].StageA) {
            delete surfaceData[a][surfaceDataLine[a]][M_xArr[b]].StageA;
          }
          if (!surfaceStatus[b][M_xArr[b]].StageB) {
            delete surfaceData[a][surfaceDataLine[a]][M_xArr[b]].StageB;
          }
        }
      }
    }
    // return surfaceData;
  }

  // 将列为空的数据整理成展示列表的数据格式
  showData(surfaceData) {
    const dataDic = {};
    const headArr = [];
    // 获取面的所有的线['AS5A','AS6A',...]
    const surfaceDataLine = [];
    for (let a = 0; a < surfaceData.length; a++) {
      surfaceDataLine.push(this.objectKeys(surfaceData[a]).join(','));
    }
    // 面对应的所有的M-x的值:['M-1', 'M-2',...]
    const M_xArr = this.objectKeys(surfaceData[0][surfaceDataLine[0]]);
    // 获取所有的M-x和Stage
    const data0 = surfaceData[0][surfaceDataLine[0]];
    // 记录对应的M-x是否需要合并，2为合并列
    const colSpanArr = [];
    // 存入所有的Stage
    const colStageArr = [];

    for (let a = 0; a < M_xArr.length; a++) {
      // hasStageA/hasStageB 记录当前的M-x 是否有对应的StageA/StageB
      let hasStageA = false;
      let hasStageB = false;
      // 检查每个M-x是否有对应的StageA,StageB
      const data_M = data0[M_xArr[a]];
      if (data_M.hasOwnProperty('StageA')) {
        colStageArr.push('StageA');
        hasStageA = true;
      }
      if (data_M.hasOwnProperty('StageB')) {
        colStageArr.push('StageB');
        hasStageB = true;
      }
      if (hasStageA && hasStageB) {
        colSpanArr.push('2');
      } else {
        colSpanArr.push('1');
      }

    }
    this.totoalWidth = (100 * colStageArr.length) + 'px';
    headArr.push(M_xArr);
    headArr.push(colSpanArr);
    headArr.push(colStageArr);
    // 表头数据
    dataDic['head'] = headArr;
    // 整理表内容
    // 存入内容的到数组
    const tempArray = [];
    // 存入当前的数据来自哪个stage和M-x
    const tempArrayM_x = [];
    for (let b = 0; b < surfaceDataLine.length; b++) {
      // 存入每条线对应的数据
      const tempArr = [];
      // tempArrM_x 记录每条数据对应的是哪个M_x
      const tempArrM_x = [];
      /**
       * 原本打算将每行线也放入dataDic['data'],但是UI要求根据数值改变面对应的列背景颜色，不好处理，故单独拿出来。
       *  tempArr.push(surfaceDataLine[b]);
       */
      // ["M-1", "M-2", "M-3", "M-4", "M-5", "M-6", "M-7"]
      for (let c = 0; c < M_xArr.length; c++) {
        const data_M_x = surfaceData[b][surfaceDataLine[b]][M_xArr[c]];
        if (data_M_x.hasOwnProperty('StageA')) {
          tempArr.push(data_M_x.StageA);
          tempArrM_x.push('A' + M_xArr[c]);
        }
        if (data_M_x.hasOwnProperty('StageB')) {
          tempArr.push(data_M_x.StageB);
          tempArrM_x.push('B' + M_xArr[c]);
        }
      }
      tempArray.push(tempArr);
      tempArrayM_x.push(tempArrM_x);
    }
    // 表头数据
    dataDic['data'] = tempArray;
    dataDic['stage_M'] = tempArrayM_x;
    return dataDic;
  }


  // 获取所有的线
  getSurfaceLine(surfaceData) {
    const surfaceDataLine = [];
    for (let a = 0; a < surfaceData.length; a++) {
      surfaceDataLine.push(this.objectKeys(surfaceData[a]).join(','));
    }
    return surfaceDataLine;
  }


  // 获取线对应的背景颜色
  getLineBackground (data) {
    const lineBackground = [];
    for (let i = 0; i < data.length; i++) {
      // 去掉为'N/A'的元素
      const arr1 = data[i].filter(item => item !== 'N/A');
      const arr2 = arr1.filter(item => -item <= 85);
      const arr3 = arr1.filter(item => -item >= 87);
      // 如果数组arr1存在 <= 85的数据；线对应的栏位背景为红色
      if (arr2.length > 0) {
        lineBackground.push('colorRed');
      } else if (arr3.length === arr1.length) {
        lineBackground.push('colorGreen');
      } else {
        lineBackground.push('colorYellow');
      }
    }
    return lineBackground;
  }

  showEchart (surface, b,  a, line) {
    this.queryButton = true;
    this.dateto1 = undefined;
    this.datefrom1 = undefined;
    this.secondeUItData = [];
    // 获得  M-x，stage
    let stage_M;
    if (surface === 'A') {
      stage_M = this.dataA['stage_M'][b][a];
    } else {
      stage_M = this.dataB['stage_M'][b][a];
    }
    const M_x = stage_M.substring(stage_M.length - 1);
    const stage = stage_M.substring(0, 1);

    // 从originArrA / originArrB中查询到要筛选的数据条件
    let data;
    if (surface === 'A') {
      data = this.originArrA.filter(item => item.line === line && item.stage === stage && item.evt_pid.substring(item.evt_pid.length - 1) === M_x);
    }
    if (surface === 'B') {
      data = this.originArrB.filter(item => item.line === line && item.stage === stage && item.evt_pid.substring(item.evt_pid.length - 1) === M_x);
    }
    this.secondeUItData = data;
    if (this.secondeUItData.length > 0) {
      this.getEsdataForEchart(this.secondeUItData);
    } else {
      this.isVisible = false;
    }
  }

  closeEchart () {
    this.isVisible = false;
    this.dateto1 = undefined;
    this.datefrom1 = undefined;
    this.dateInputFrom = undefined;
    this.dateInputTo = undefined;
  }

  getEsdataForEchart (queryData) {
    let esURL;
    // esURL = this.esService.getHighSpeedUrl('mtvacp_wcd_20*/ByMax/');
    esURL = this.esService.getUrl('high_speed_machine' + '/');
    let date_range;
    let size;
    const value1 = -60;
    const value2 = -100;

    if (this.datefrom1 !== undefined && this.dateto1 !== undefined) {
      date_range = `{"range": {
        "evt_dt": {
          "lte": ${this.dateto1},
          "gte": ${this.datefrom1}
        }
      }
    },
      {"range": {
        "vacuumValue": {
          "lte": ${value1},
          "gte": ${value2}
        }
      }
    }`;
      size = `"size": 5000`;
    } else {
      date_range = `{"range": {
        "evt_dt": {
          "lte": ${queryData[0].evt_dt}
        }
      }
    },
      {"range": {
        "vacuumValue": {
          "lte": ${value1},
          "gte": ${value2}
        }
      }
    }`;
      size = `"size": 24`;
    }

    let querys;
    querys = this.esService.getHighSpeedEcharts(queryData[0].M_x, queryData[0].line, queryData[0].stage, date_range, size);
    console.log('---------------------------------------------- \n', esURL, querys);
    querys = JSON.parse(querys);

    this.esService.postData(esURL, querys).subscribe(data => {
      console.log('高速机 echart  查询到的数据\n', data['hits']['hits']);
      const seriesData = [];
      const xData = [];
      this.echart = '';
        if (data['hits']['hits'].length > 4000) {
          this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
          return;
        }
        for (let i = data['hits']['hits'].length - 1; i > -1; i--) {
          const tempArr = [];
          const value = data['hits']['hits'][i]._source.vacuumValue;
          const time =  this.datePipe.transform(data['hits']['hits'][i]._source.insertdt, 'yyyy/MM/dd HH:mm:ss');
          tempArr.push(time);
          tempArr.push(-value);
          seriesData.push(tempArr);
          xData.push(time);
        }

        const title = queryData[0].line + '線 ' +  queryData[0].M_x + ' ' + queryData[0].line.charAt(queryData[0].line.length - 1) + '面 Stage' +  queryData[0].stage + '真空泵負壓值By hour趨勢圖';
        this.createEchart(seriesData, xData, title);
    });
  }


  getOptionDate(result: Date, type) {
    if (type === 'dateTo') {
      this.dateto1 = result ? result.getTime() : undefined;
    }
    if (type === 'dateFrom') {
      this.datefrom1 = result ? result.getTime() : undefined;
    }

    if (this.dateto1 >= this.datefrom1 && this.datefrom1 && this.dateto1) {
      this.queryButton = false;
    }
  }

  query() {
    if (this.dateto1 >= this.datefrom1 && this.datefrom1 && this.dateto1) {
      this.getEsdataForEchart(this.secondeUItData);
    }
  }


  createEchart (seriesData, xData, title) {
    this.echart = {
      title: {
        text: title
      },
       grid: {
        y: 70,
        y2: 90,
        x: 90,
        width: '75%'
      },
      tooltip: {
        backgroundColor: '#FFFFF0',
        textStyle: {
          color: 'black'
        },
        trigger: 'axis',
        formatter: function (params) {
            params = params;
            let value = '';
            for (let i = 0; i < params.length; i++) {
                const currentItemData = params[i].data;
              value = '时间: ' + currentItemData[0] + '<br>' + '真空泵負壓值: ' + -currentItemData[1] + 'KPa';
            }
            return value;
        }
    },
      xAxis: {
        name: 'Hour',
        type: 'category',
        data: xData,
        scale: true,
        axisLabel: {
          'interval': 0,
          rotate: 40
        },
      },
      yAxis: {
        name: 'KPa',
        type: 'value',
        axisLabel: {
            formatter: function(value) {
                return - value;
            }
        }
      },
      series: [{
        type: 'line',
        smooth: true,
        itemStyle: {normal: { color: '#0000CC' }},
        data: seriesData,
        markLine: {
          symbol: 'none',
          silent: true,
          data: [
            { yAxis: 90, label: { show: true, formatter: 'Pre-warning' + '-90' }, itemStyle: {type: 'solid', width: 10, normal: { color: '#FFD700' } } },
            { yAxis: 85, label: { show: true, formatter: 'Alarm' + '-85' }, itemStyle: {type: 'solid', width: 10, normal: { color: 'red' } } }
          ]
        }
      }],
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          inside: false
        }
      ]
    };
    this.isVisible = true;
  }

  repeat() {
    const currentTime = new Date().getTime();
    // 判断整点执行获取数据
    const date = new Date();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    if (minutes === 0 && seconds === 0) {
      this.getData(date.getTime());
    }
  }

  getData(date) {
    this.dateto = this.numberToDate(date);
    this.datefrom = this.dateto - 1000 * 3600;
    let esURL;
    esURL = this.esService.getHighSpeedUrl('mtvacp_wcd_20*/ByMax/');
    let date_range;
    let size;
    date_range = `"range": {
      "evt_dt": {
        "lte": ${this.dateto},
        "gte": ${this.datefrom}
      }
    }`;
    size = `"size": 5000`;
    let querys;
    querys = this.esService.getSpeedHighMachine(date_range, size);
    console.log('---------------------------------------------- \n', esURL, querys);
    querys = JSON.parse(querys);

    this.esService.postData(esURL, querys).subscribe(data => {
      if (data['hits']['hits'].length > 0) {
        console.log('高速机  查询到的数据\n', data);
        if (data['hits']['hits'].length > 4000) {
          this.message.create('success', '查詢範圍過大，請重新選擇查詢日期');
          return;
        }

        const dataOrigin = [];
        // this.dataA = [];
        this.dataB = [];
        for (let i = 0; i < data['hits']['hits'].length; i++) {
          const value = data['hits']['hits'][i]._source.evt_data.vacuumValue;
          const pid = data['hits']['hits'][i]._source.evt_pid;
          if (value >= -100 && value <= -60) {
            const tempDic = {};
            tempDic['line'] = data['hits']['hits'][i]._source.evt_data.line;
            tempDic['stage'] = data['hits']['hits'][i]._source.evt_data.stage;
            tempDic['vacuumValue'] = value;
            tempDic['evt_dt'] = data['hits']['hits'][i]._source.evt_dt;
            tempDic['evt_pid'] = 'M-' + pid.charAt(pid.length - 1);
            tempDic['M_x'] = pid;
            dataOrigin.push(tempDic);
          }
        }
        const removeDuplicateData = this.removeDuplicate(dataOrigin);
        this.originArrA = [];
        // A/B面多少列
        let originArrAM_max = 1;
        let originArrBM_max = 1;
        this.originArrB = [];
        removeDuplicateData.forEach(element => {
          const str = element['line'];
          const lastNumber = element.evt_pid.charAt(element.evt_pid.length - 1);
          // tslint:disable-next-line: radix
          const max = parseInt(lastNumber);
          if (str.charAt(str.length - 1).toString() === 'A') {
            originArrAM_max = originArrAM_max < max ? max : originArrAM_max;
            this.originArrA.push(element);
          } else {
            this.originArrB.push(element);
            originArrBM_max = originArrBM_max < max ? max : originArrBM_max;
          }
        });

        const dataStyleA = this.needData(this.originArrA, originArrAM_max);
        const dataStyleB = this.needData(this.originArrB, originArrBM_max);
        const deleteStatusB = this.statusFalseDelete(dataStyleB);
        const deleteStatusA = this.statusFalseDelete(dataStyleA);

        // 将整理后的面数据根据要删除的状态数组删除数据全为N/A的列
        this.surfaceDeleteNA(dataStyleA, deleteStatusA);
        this.surfaceDeleteNA(dataStyleB, deleteStatusB);

        this.dataALine = this.getSurfaceLine(dataStyleA);
        this.dataA = this.showData(dataStyleA);
        this.dataAhead = this.dataA['head'];
        this.dataAContent = this.dataA['data'];
        this.lineABackGround = this.getLineBackground(this.dataAContent);

        this.dataBLine = this.getSurfaceLine(dataStyleB);
        this.dataB = this.showData(dataStyleB);
        this.dataBhead = this.dataB['head'];
        this.dataBContent = this.dataB['data'];
        this.lineBBackGround = this.getLineBackground(this.dataBContent);
      }
    });
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
