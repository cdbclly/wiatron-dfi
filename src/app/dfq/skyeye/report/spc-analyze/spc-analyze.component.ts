import { Component, OnInit,Input } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { NzModalService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { DatePipe } from '@angular/common';
import { SpcAnalyzeService } from './spc-analyze.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartOption } from 'echarts';
import * as echarts from 'echarts';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';

@Component({
  selector: 'app-spc-analyze',
  templateUrl: './spc-analyze.component.html',
  styleUrls: ['./spc-analyze.component.scss']
})
export class SpcAnalyzeComponent implements OnInit {
  showloading:boolean = true;
  chartOption3: EChartOption = {};
  isVisible1 = false;
  isVisible1_1 = false;
  footer1 = null;
  footer1_1 = null;
  cancelOK1 = false;
  cancelOK1_1 = false;
  isVisible2 = false;
  isVisible2_2 = false;
  footer2 = null;
  footer2_2 = null;
  cancelOK2 = false;
  cancelOK2_2 = false;
  cur_site;
  cur_plant;
  cur_stationline;
  cur_machinemodel;
  cur_item;
  querydata;
  itemGroup=[];
  dateRangeFrom;
  dateRangeTo;
  project = [];
  projectGroup = [];
  plantGroup = [];
  addPlantGroup = [];
  // addPlantGroup = [];
  siteGroup = [];
  mcGroup = [];
  addSiteGroup = [];
  kpiInfos = [];
  ckpiInfos;
  cur_model = [];
  cur_stage = [];
  queryButton = true;
  editMap = new Map<string, boolean>();
  modelGroup = [];
  editItem = {};
  isVisible_spec = false;
  isVisible_speclist = false;
  isVisible_materials = false;
  disableedit = false;
  nzScroll: {} = { x: '1210px' };
  showSample: Boolean = false;
  cur_project: string;
  model: string | null;
  add_plant: string | null;
  stageCode: string | null;
  setting1: string | null; setting2: string | null;
  upperCpk: number | null; lowerCpk: number | null;
  pcs: number | null; // 取样数量
  upn: string | null; // 架构
  maintain_list = [];
  maintain_list1 = ['Plant', 'Model Name', 'Stage Code', '預警SPEC(Upper Limit)', '預警SPEC(Lower Limit)'];
  maintain_list2 = ['Plant', 'Model Name', 'Stage Code', 'Test item name', 'Sub test item name', 'Upper Limit', 'Lower Limit', 'pcs'];
  addModelStageInfos;
  modelFlteredOptions = []; // 新增项目时，model 的autocompelete暂存项目
  stageFlteredOptions = [];
  addModelGroup = [];
  addStageGroup = [];
  mdGroup = [];
  tdGroup = [];
  stGroup = [];
  slGroup = [];
  add_site;
  objectKeys = Object.keys;
  objectValue = Object.values;
  role;
  tmp_arr;
  siteInfos;
  curEditRow; // 當前正在編輯的一筆資料
  curPage; // 當前的頁數
  curPagelog; // log的当前页面
  // upload
  uploadFileName: string;
  inputdata = [];
  newDatas; // 文件上传的资料（已去除重复的）
  showProgress = true; // 是否显示进度条
  progressBar = 0; // 上传进度条的数值
  proStatus = 'active'; // 进度条的状态
  THwidth = ['80px', '50px', '50px', '100px', '100px', '100px', '80px', '80px', '70px', '70px', '80px', '60px'];
  THwidth1 = ['40px', '30px', '30px', '40px', '40px', '30px'];
  logInfos;  // 日志信息
  spcrowdata = [];
  footer = null;
  echartnode=null;
  datavaluenode=null;
  zong_project;
  zi_project;
  zong_project1;
  zi_project1;
  zong_project2;
  zi_project2;
  @Input() cur_bt;
  @Input() cur_st;
  @Input() cur_mdname;
  @Input() cur_tdname;
  @Input() cur_stationtype;
  xxdata =[];
  xydata =[];

  rxdata =[];
  rydata =[];

  datadetail =[];
  initdata;
  constructor(
    private dataService: LineDataServiceService,
    private message: NzMessageService,
    private esService: EsDataServiceService,
    private _service: SpcAnalyzeService,
    private modalService: NzModalService,
    private excelService: ExcelToolService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    const role_arr = JSON.parse(localStorage.getItem('$DFI$UserAuth'));
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping'));
    this.addSiteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.role = role_arr['SkyeyeTestItemMaintain'];
    console.log(this.role['update']);
    this.queryButton = true;
    document.getElementById("lineChart").setAttribute("style","visibility:hidden");
  }

     // 选中下拉框的数据调用
     async getOptions(type) {
      if (type === 'plant') {//site
        this.modelGroup = [];
        this.filterData();
        this.cur_plant = [];
        this.cur_stationline = [];
        this.cur_model = [];
        this.cur_stationtype = [];
        this.cur_machinemodel= [];
        this.cur_tdname = [];
        this.cur_mdname = [];
        // this.dateRangeFrom = undefined;
        // this.dateRangeTo = undefined;
        this.queryButton = true;
      }
      if (type === 'project') {//plant
        this.modelGroup = [];
        this.cur_stationline = [];
        this.cur_model = [];
        this.cur_stationtype = [];
        this.cur_machinemodel= [];
        this.cur_tdname = [];
        this.cur_mdname = [];
        // this.dateRangeFrom = undefined;
        // this.dateRangeTo = undefined;
        if (this.cur_plant) {
          this.getESDatas("init");
        }
        else this.initdata=[];
        this.filterData();
      }
  
      if (type === 'model') {
        this.filterData();
        this.cur_stationtype = [];
        this.cur_machinemodel= [];
        this.cur_tdname = [];
        this.cur_mdname = [];
      }
      if (type === 'query') {
        this.filterData();
        console.log(this.kpiInfos);
      }
      if (type === 'stationline') {
        this.filterData();
        this.cur_model = [];
        this.cur_stationtype = [];
        this.cur_machinemodel= [];
        this.cur_tdname = [];
        this.cur_mdname = [];
        // this.dateRangeFrom = undefined;
        // this.dateRangeTo = undefined;

      }
      if (type === 'stationtype') {
        this.filterData();
        this.cur_machinemodel= [];
        this.cur_tdname = [];
        this.cur_mdname = [];
      }
      if (type === 'mdname') {
        this.filterData();
      }
      if (type === 'tdname') {
        this.filterData();
        this.cur_mdname = [];
      }
      if (type === 'datefrom') {
        this.filterData();
      }
      if (type === 'dateto') {
        this.filterData();
      }
      if (type === 'machinemodel') {
        this.filterData();
        this.cur_tdname = [];
        this.cur_mdname = [];
      }
      if (type === 'addSite') {
        this.addPlantGroup = this.siteInfos.filter(res => res['Site'] === this.add_site).map(res => {
          return res['Plant'];
        });
      }
      if (type === 'addPlant') {
          this._service.getAddModelStage(this.add_plant).subscribe(res => {
          this.addModelStageInfos = res;
          this.addModelGroup = this.addModelStageInfos.map(item => item['modelId']);
          this.addModelGroup = Array.from(new Set(this.addModelGroup));
          this.modelFlteredOptions = Object.values(this.addModelGroup);
          // this.stageFlteredOptions = [];
        });
      }
      if (type === 'addModel') {
        console.log(this.model);
        this.addStageGroup = this.addModelStageInfos.map(item => item['stageId']);
        this.addStageGroup = Array.from(new Set(this.addStageGroup));
        this.stageFlteredOptions = Object.values(this.addStageGroup);
      }
    }

    async filterData() {
      this.kpiInfos = await this.dataService.getRecipientApi(this.cur_plant);
      if (this.cur_plant) {
        this.kpiInfos = this.kpiInfos.filter(res => this.cur_plant.indexOf(res['plantId']) !== -1);
      }
      if (this.cur_model.length > 0) {
        this.kpiInfos = this.kpiInfos.filter(res => this.cur_model.indexOf(res['model']) !== -1);
      }
      if (this.project.length > 0) {
        this.kpiInfos = this.kpiInfos.filter(res => this.project.indexOf(res['name']) !== -1);
      }
      if(this.initdata&&this.initdata!==null)
      {
        this.mdGroup = [];
        this.tdGroup = [];
        this.stGroup = [];
        this.slGroup = [];
        this.modelGroup = [];
        this.mcGroup = [];
        for (let i = 0; i < this.initdata['hits']['hits'].length; i++) {
          this.slGroup.push(this.initdata['hits']['hits'][i]._source.stationline);
          if(this.cur_stationline&&this.cur_stationline===this.initdata['hits']['hits'][i]._source.stationline)
          {
            this.modelGroup.push(this.initdata['hits']['hits'][i]._source.modelname);
            if(this.cur_model&&this.cur_model===this.initdata['hits']['hits'][i]._source.modelname)
            {
              this.stGroup.push(this.initdata['hits']['hits'][i]._source.stationtype);
              if(this.cur_stationtype&&this.cur_stationtype===this.initdata['hits']['hits'][i]._source.stationtype)
              {
                if(this.initdata['hits']['hits'][i]._source.machinemodel)
                  this.mcGroup.push(this.initdata['hits']['hits'][i]._source.machinemodel);
                if(this.cur_machinemodel&&this.cur_machinemodel===this.initdata['hits']['hits'][i]._source.machinemodel)
                {
                  this.tdGroup.push(this.initdata['hits']['hits'][i]._source.tdname);
                  if(this.cur_tdname&&this.cur_tdname===this.initdata['hits']['hits'][i]._source.tdname)
                    this.mdGroup.push(this.initdata['hits']['hits'][i]._source.mdname);
                }
              }
            }
          }
        }
        this.mdGroup = Array.from(new Set(this.mdGroup));
        this.tdGroup = Array.from(new Set(this.tdGroup));
        this.stGroup = Array.from(new Set(this.stGroup));
        this.slGroup = Array.from(new Set(this.slGroup));
        this.modelGroup = Array.from(new Set(this.modelGroup));
        this.mcGroup = Array.from(new Set(this.mcGroup));
      }
      
      if (
        this.cur_site!==null && this.cur_site&&this.cur_site.length>0&&
        this.cur_plant!==null && this.cur_plant&&this.cur_plant.length>0&&
        this.cur_model!==null && this.cur_model&&this.cur_model.length>0&&
        this.cur_stationtype&&this.cur_stationtype!==null&&this.cur_stationtype.length>0&&
        this.cur_stationline&&this.cur_stationline !== null&&this.cur_stationline.length>0&&
        this.cur_mdname&&this.cur_mdname!==null&&this.cur_mdname.length>0&&
        this.cur_tdname&&this.cur_tdname!==null&&this.cur_tdname.length>0&&
        this.dateRangeFrom&&this.dateRangeTo&&
        this.dateRangeFrom!==null&&this.dateRangeTo!==null&&
        this.cur_machinemodel&&this.cur_machinemodel!==null&&this.cur_machinemodel.length>0
        ) {
        this.queryButton = false;
      }
      else this.queryButton = true;
    }
  
    // 点击到输入框时调用
    async getOptList(type) {
      if (type === 'model') 
      {
        // this.getESDatas('init');
        // console.log(this.kpiInfos);
      }
      if (type === 'plant') {
        // 獲取資料
        this.kpiInfos = await this.dataService.getRecipientApi(this.cur_plant); // 獲取WKS的KPI
        this.tmp_arr = this.cur_plant;
        this.cur_plant = '';
        await this.filterData();
        this.cur_plant = this.tmp_arr;
        this.plantGroup = this.siteInfos.filter(res => res['Site'] === this.cur_site).map(res => {
          return res['Plant'];
        });
        console.log(this.kpiInfos);
      }
  
      if (type === 'upn') {
        await this.filterData();
      }
    }
    
  async queryclick()
  {
    this.getESDatas('SPC_Monitor');
  }

    async getESDatas(type) {

      let date_range;
      let size;
  
      date_range = `"range": {
        "stopdate": {
          "lte": "now"
        }
      }`;
      size = `"size": 5000`;
      // this.cur_site='WSH';
      // this.cur_plant='F232';
      if(type==='init')
      {
        let esURL;
        esURL = this.esService.getUrl('SPC_Monitor'+ '/');
        if(this.cur_site&&this.cur_site!==null&&this.cur_plant&&this.cur_plant!==null)
        {
          const querys = this.esService.getqueryClause(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(),size);
          console.log('查询的条件\n', esURL,querys);
          this.initdata = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
          // this.initEsData = data;
          console.log(' CPKOffset  查询到的数据 data ===== \n',this.initdata);
        }
      }
      if (type === 'SPC_Monitor') {
        let esURL;
        esURL = this.esService.getUrl('SPC_Monitor'+ '/');
        if(this.cur_site&&this.cur_site!==null&&this.cur_plant&&this.cur_plant!==null)
        {
          // const querys = this.esService.getCPKOffsetOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase());

          const querys = this.esService.getCPKOffsetOp2(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(),this.cur_model,this.cur_stationline,this.cur_stationtype,this.cur_mdname,this.cur_tdname,this.cur_machinemodel);
          console.log('查询的条件\n', esURL,querys);
          // debugger
          this.querydata = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
          // this.initEsData = data;
          console.log(' CPKOffset  查询到的数据 data ===== \n',this.querydata);
          if(this.querydata['hits']['hits'].length>0)
          {
            for (let i = 0; i < this.querydata['hits']['hits'].length; i++) {
              // this.mdGroup.push(data['hits']['hits'][i]._source.stationtype);
              // this.slGroup.push(data['hits']['hits'][i]._source.stationline);
              this.xxdata[i]=i+1;
              this.rxdata[i]=i+1;
              if (this.querydata['hits']['hits'][i]._source){
                this.xydata[i]=this.querydata['hits']['hits'][i]._source.xbar;
                this.rydata[i]=this.querydata['hits']['hits'][i]._source.range;
              }
              // const detail2=data['hits']['hits'][i]._source.detail2;
              // console.log(' detail2 ===== \n',detail2.length);
              if (this.querydata['hits']['hits'][i]._source.detail) {
                for(let j=0;j< this.querydata['hits']['hits'][i]._source.detail.length;j++)
                {
                    this.datadetail[j] = this.querydata['hits']['hits'][i]._source.detail[j];
                }
              }
            }
            this.queryup();
          }
          else
            document.getElementById("lineChart").setAttribute("style","visibility:hidden");
          
        }
      }
    }
    
    async initCharts(linechartstr:string,xdata,ydata) 
    {  
      const ec = echarts as any;
      let title="";
      let project="壓合壓力(Kg)";
      if(this.cur_mdname==="Pressure")
        project="壓合壓力(Kg)";
      else if(this.cur_mdname==="Temperature")
        project="熱壓溫度(℃)";
      else if(this.cur_mdname==="Vacuum")
        project="真空負壓值(Kpa)";
      else if(this.cur_mdname==="Leakagepressure")
        project="機台測漏值(Pa)";
      var linechart=document.getElementById(linechartstr);
      if(linechartstr==="lineChart1")
        title="一："+project+" 均值(X图)";
      else
        title="二："+project+" 极差(R图)";

      var instance=this;
      console.log('ydata ===== \n',ydata);
      // return;
      var myChart1 = ec.init(linechart);
      
      // var colors = ['#466fba', '#d14a61', '#675bba'];
      var option = 
      {
        backgroundColor: '#ffffff',
        title : 
        {
            text: title,
            subtext: ''
        },
        tooltip : 
        {
            trigger: 'axis'
        },
        legend: 
        {
            data:['数值']
        },
        toolbox: 
        {
            show : true,
            feature : 
            {
                mark : {show: true},
    //            dataView : {show: true, readOnly: false},     //数据视图按钮
                magicType : {show: false, type: ['line', 'bar']},
    //            restore : {show: true},       //图表右上角刷新按钮
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : 
        [
            {
                type : 'category',
                boundaryGap : true,
                data: xdata
            }
        ],
        yAxis : 
        [
            {
                type : 'value',
                axisLabel : 
                {
                    formatter: '{value}'
                }
            }
        ],
        series : 
        [
            {
                // name:'数值',
                type:'line',
                data:ydata,
                smooth:true,
                symbolSize: 15,
                itemStyle: {
                  normal: {
                    color: "#e02533",//折线点的颜色
                    lineStyle: {
                    color: "#466fba"//折线的颜色
                   },
                   label : {show: true}
                 }
              }

            }
        ]
      };
      myChart1.setOption(option);
      myChart1.on('click', function (params) 
      {
        console.log('查询的条件\n', params);
        var index=params.dataIndex;
        
        instance.showmaterialsModal(index);       
      });
      
    }

    handleOk1(): void {
      this.isVisible1 = false;
    }
  
    handleOk1_1(): void {
      this.isVisible1_1 = false;
    }
  
    handleCancel2(): void {
      this.isVisible2 = false;
    }
  
    handleCancel2_2(): void {
      this.isVisible2_2 = false;
    }
    handleOk2(): void {
      this.isVisible2 = false;
    }
  
    handleOk2_2(): void {
      this.isVisible2_2 = false;
    }
  
    handleCancel1(): void {
      this.isVisible1 = false;
    }
  
    handleCancel1_1(): void {
      this.isVisible1_1 = false;
    }
  
    async queryup() {
      // debugger
      var linechart=document.getElementById("lineChart");
      if(this.xxdata.length>0||this.rxdata.length>0)
      {
        linechart.setAttribute("style","width:100%;height:600px;background-color: #e6e6e6;margin-top: 10px;margin-left:0px;visibility:visible");
        this.initCharts("lineChart1",this.xxdata,this.xydata);
        this.initCharts("lineChart2",this.rxdata,this.rydata);
      }
      else 
        linechart.setAttribute("style","visibility:hidden");
    }

    handleOkmaterialsModal() {
      this.isVisible_materials=false;
    }
    
    CancelmaterialsModal(): void {
      this.isVisible_materials = false;
    }

    showmaterialsModal(index): void{
      // this.showmaterials();
      this.isVisible1 = true;
      this.spcrowdata=[];
      for(let i=0;i<this.querydata['hits']['hits'][index]._source.detail.length;i++)
      {
        var rowdata = [];
        rowdata["modelname"]=this.querydata['hits']['hits'][index]._source.modelname;
        rowdata["stationline"]=this.querydata['hits']['hits'][index]._source.stationline;
        rowdata["stationtype"]=this.querydata['hits']['hits'][index]._source.stationtype;
        rowdata["mdname"]=this.querydata['hits']['hits'][index]._source.mdname;
        rowdata["tdname"]=this.querydata['hits']['hits'][index]._source.tdname;
        rowdata["mdupperlimit"]=this.querydata['hits']['hits'][index]._source.detail[i].mdupperlimit;
        rowdata["mdlowerlimit"]=this.querydata['hits']['hits'][index]._source.detail[i].mdlowerlimit;
        rowdata["mdresult"]=this.querydata['hits']['hits'][index]._source.detail[i].mdresult;
        rowdata["unitserialnumber"]=this.querydata['hits']['hits'][index]._source.detail[i].unitserialnumber;
        rowdata["startdate"]=this.querydata['hits']['hits'][index]._source.detail[i].startdate;
        rowdata["stopdate"]=this.querydata['hits']['hits'][index]._source.detail[i].stopdate;
        this.spcrowdata[i]=rowdata;
      }
    }

    formatDate (data) {
      var date = new Date(data)
      var Y = date.getFullYear() + '/'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return Y + M + D + h + m + s
    }

    downloadTotal(data, title) {
      if (data) {
        const downloadDatas = data.map (res => {
          return {
            '機種': res['modelname'],
            '線別': res['stationline'],
            '站別': res['stationtype'],
            '机台序列号': res['unitserialnumber'],
            '总项目': res['tdname'],
            '子项目': res['mdname'],
            '开始测试时间': this.formatDate(res['startdate']),
            '结束测试时间': this.formatDate(res['stopdate']),
            '测试值': res['mdresult'],
            '测试值上限': res['mdupperlimit'],
            '测试值下限': res['mdlowerlimit']
          };
        });
        const colWidth = [];
        Object.keys(data[0]).forEach(element => {
          colWidth.push({wpx: 100});
          colWidth.push({wpx: 80});
          colWidth.push({wpx: 80});
          colWidth.push({wpx: 120});
          colWidth.push({wpx: 100});
          colWidth.push({wpx: 100});
          colWidth.push({wpx: 120});
          colWidth.push({wpx: 120});
          colWidth.push({wpx: 100});
          colWidth.push({wpx: 100});
          colWidth.push({wpx: 100});
        });
        const headerBgColor = '53868B';
        // debugger
        this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), title, colWidth, headerBgColor);
      }
    }
}
