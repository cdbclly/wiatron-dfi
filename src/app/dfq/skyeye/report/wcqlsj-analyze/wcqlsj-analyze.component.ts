import { Component, OnInit, Input } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { NzModalService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { DatePipe } from '@angular/common';
import { WcqlsjAnalyzeService } from './wcqlsj-analyze.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartOption } from 'echarts';
import * as echarts from 'echarts';
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';

@Component({
  selector: 'app-wcqlsj-analyze',
  templateUrl: './wcqlsj-analyze.component.html',
  styleUrls: ['./wcqlsj-analyze.component.scss']
})

export class WcqlsjAnalyzeComponent implements OnInit {
  showloading:boolean = true;
  chartOption3: EChartOption = {};
  cur_site;
  cur_plant;
  cur_stance;
  isVisible1 = false;
  isVisible2 = false;
  isVisible3 = false;
  isVisible4 = false;
  myChartGroup=[];
  myChartforcpk;
  myChartforspc1;
  myChartforspc2;
  myChartforcpkfbt;
  cur_stationline;
  cur_item;
  cur_index;
  cpkrawdata;
  cur_monitorpro;
  itemGroup=[];
  cpkrawdata11=[];
  monitorproGroup=[];
  stanceGroup=[];
  dateRangeFrom;
  dateRangeTo;
  project = [];
  projectGroup = [];
  plantGroup = [];
  addPlantGroup = [];
  // addPlantGroup = [];
  querydata;
  queryCPKdata;
  siteGroup = [];
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
  spcrowdata = [];
  testresultdata = [];
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
  THwidth = ['70px', '50px', '70px', '70px', '100px', '90px', '90px', '60px', '60px', '60px', '80px', '60px'];
  THwidth1 = ['40px', '30px', '30px', '40px'];
  logInfos;  // 日志信息
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
  constructor(
    private dataService: LineDataServiceService,
    private message: NzMessageService,
    private esService: EsDataServiceService,
    private _service: WcqlsjAnalyzeService,
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
    document.getElementById("lineChartcpk").setAttribute("style","visibility:hidden");
  }

   // 选中下拉框的数据调用
   async getOptions(type) {
    if (type === 'plant') {
      this.modelGroup = [];
      this.filterData();
      this.cur_plant = [];
      this.cur_stationline = [];
      this.cur_stationtype = [];
      this.cur_tdname = [];
      this.cur_stance = [];
      this.cur_monitorpro = [];
      this.cur_model = [];
      this.queryButton = true;
    }
    if (type === 'project') {
      this.modelGroup = [];
      this.filterData();
      this.cur_stationline = [];
      this.cur_stationtype = [];
      this.cur_tdname = [];
      this.cur_stance = [];
      this.cur_monitorpro = [];
      this.cur_model = [];
      if (this.cur_plant === null) {
        this.queryButton = true;
      }
      else{
        // this.getESDatas('CPK_Offset');
      }
    }

    if (type === 'model') {
      this.filterData();
      this.cur_model = [];
      console.log(this.kpiInfos);
    }
    if (type === 'query') {
      this.filterData();
    }
    if (type === 'stationline') {
      this.filterData();
      this.cur_stationtype = [];
      this.cur_tdname = [];
      this.cur_stance = [];
      this.cur_monitorpro = [];
      this.cur_model = [];
    }
    if (type === 'stationtype') {
      this.filterData();
      this.cur_tdname = [];
      this.cur_stance = [];
      this.cur_monitorpro = [];
      this.cur_model = [];
    }
    if (type === 'mdname') {
      this.filterData();
    }
    if (type === 'tdname') {
      this.filterData();
      this.cur_stance = [];
      this.cur_monitorpro = [];
      this.cur_model = [];
    }
    if (type === 'monitorpro') {
      this.filterData();
      this.cur_model = [];
    }
    if (type === 'stance') {
      this.filterData();
      this.cur_monitorpro = [];
      this.cur_model = [];
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
    this.kpiInfos = await this.dataService.getwcqlsjmaintainApi(this.cur_plant);
    if (this.cur_plant) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_plant.indexOf(res['plantId']) !== -1);
    }
    if (this.cur_model.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_model.indexOf(res['model']) !== -1);
    }
    if (this.project.length > 0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.project.indexOf(res['name']) !== -1);
    }
    // console.log('----------------------------------------------\n');
    // console.log('site = ' + this.cur_site);
    // console.log('plant = ' + this.cur_plant);
    if (this.cur_site && this.cur_plant && this.cur_site.length>0&&
        this.cur_site !== null && this.cur_plant !== null &&this.cur_plant.length>0&&
        this.cur_model!==null && this.cur_model&&this.cur_model.length>0&&
        this.cur_stationline&&this.cur_stationline !== null&&this.cur_stationline.length>0&&
        this.cur_stationtype&&this.cur_stationtype!==null&&this.cur_stationtype.length>0&&
        this.cur_tdname&&this.cur_tdname!==null&&this.cur_tdname.length>0&&
        this.cur_stance&&this.cur_stance!==null&&this.cur_stance.length>0&&
        this.cur_monitorpro&&this.cur_monitorpro!==null&&this.cur_monitorpro.length>0
      )
    {
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
      this.kpiInfos = await this.dataService.getwcqlsjmaintainApi(this.cur_plant); // 獲取WKS的KPI
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
      this.getESDatas('init');
      // this.getESDatas1('init');
    }
  }

async queryclick()
{
  if(this.myChartforcpk) this.myChartforcpk.dispose();
  if(this.myChartforspc1) this.myChartforspc1.dispose();
  if(this.myChartforspc2) this.myChartforspc2.dispose();
  await this.getESDatas('WCQ_SPC_Screw_Parameter');
  this.getESDatas('WCQ_CPK_Screw_Parameter');
}

async getESDatas(type) {

    let date_range;
    let size;

    date_range = `"range": {
      "stopdate": {
        "lte": "now"
      }
    }`;
    // size = `"size": 5000`;
    // this.cur_site='WSH';
    // this.cur_plant='F232';
    if(type==='init')
    {
      let esURL;
      let esURL1;
      esURL = this.esService.getUrl('WCQ_SPC_Screw_Parameter'+ '/');
      esURL1 = this.esService.getUrl('WCQ_CPK_Screw_Parameter'+ '/');
      if(this.cur_site&&this.cur_site!==null&&this.cur_plant&&this.cur_plant!==null)
      {
        const querys = this.esService.getCPKOffsetOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase());
        console.log('WCQ_SPC_Screw_Parameter查询的条件\n', esURL,querys);
        let data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
        // this.initEsData = data;
        console.log(' WCQ_SPC_Screw_Parameter  查询到的数据 data ===== \n',data);
        for (let i = 0; i < data['hits']['hits'].length; i++) {
          this.stGroup.push(data['hits']['hits'][i]._source.MachineModel);
          this.stanceGroup.push(data['hits']['hits'][i]._source.stance);
          this.tdGroup.push(data['hits']['hits'][i]._source.MachineSN);
          this.slGroup.push(data['hits']['hits'][i]._source.Line);
          this.monitorproGroup.push(data['hits']['hits'][i]._source.monitorpro);
        }
        data = await this.esService.postData(esURL1, JSON.parse(querys)).toPromise();
        // this.initEsData = data;
        console.log(' WCQ_CPK_Screw_Parameter  查询到的数据 data ===== \n',data);
        for (let i = 0; i < data['hits']['hits'].length; i++) {
          this.modelGroup.push(data['hits']['hits'][i]._source.Model);
        }

        this.stanceGroup = Array.from(new Set(this.stanceGroup));
        this.tdGroup = Array.from(new Set(this.tdGroup));
        this.stGroup = Array.from(new Set(this.stGroup));
        this.slGroup = Array.from(new Set(this.slGroup));
        this.modelGroup = Array.from(new Set(this.modelGroup));
        this.monitorproGroup = Array.from(new Set(this.monitorproGroup));
      }
    }
    if (type === 'WCQ_SPC_Screw_Parameter') {
      let esURL;
      esURL = this.esService.getUrl('WCQ_SPC_Screw_Parameter'+ '/');
      if(this.cur_site&&this.cur_site!==null&&this.cur_plant&&this.cur_plant!==null)
      {
        // const querys = this.esService.getCPKOffsetOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase());
        const querys = this.esService.getWCQlsjSPCqueryClause(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(),this.cur_stationline,this.cur_stationtype,this.cur_tdname,this.cur_monitorpro,this.cur_stance);
        console.log('查询的条件\n', esURL,querys);
        this.querydata = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
        // this.initEsData = data;
        console.log(' WCQ_SPC_Screw_Parameter  查询到的数据 data ===== \n',this.querydata);
        this.xxdata=[];
        this.xydata=[];
        this.rxdata=[];
        this.rydata=[];
        for (let i = 0; i < this.querydata['hits']['hits'].length; i++) {
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
    }
    else if (type === 'WCQ_CPK_Screw_Parameter') {
      let esURL;
      console.log(' WCQ_CPK_Screw_Parameter =====/// \n');
      esURL = this.esService.getUrl('WCQ_CPK_Screw_Parameter'+ '/');
      if(this.cur_site&&this.cur_site!==null&&this.cur_plant&&this.cur_plant!==null)
      {
        // const querys = this.esService.getCPKOffsetOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase());

        const querys = this.esService.getWCQlsjCPKqueryClause(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase(),this.cur_stationline,this.cur_stationtype,this.cur_tdname,this.cur_monitorpro,this.cur_stance,this.cur_model);
        console.log('查询的条件\n', esURL,querys);
        this.queryCPKdata = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
        // this.initEsData = data;
        console.log(' WCQ_CPK_Screw_Parameter  查询到的数据 data ===== \n',this.queryCPKdata);
        this.xxdata=[];
        this.xydata=[];
        for (let i = 0; i < this.queryCPKdata['hits']['hits'].length; i++) {
          if (this.queryCPKdata['hits']['hits'][i]._source){
            this.xxdata[i]=this.formatDate(this.queryCPKdata['hits']['hits'][i]._source.executiontime);
            this.xydata[i]=this.queryCPKdata['hits']['hits'][i]._source.cpk;
          }
        }
        this.querycpk();
      }
    }
  }

  async initCharts(linechartstr:string,xdata,ydata) 
  {  //
    const ec = echarts as any;
    let title="";
    let project="真空負壓值";
    if(this.cur_monitorpro==="Vacuum")
      project="真空負壓值";
    else if(this.cur_monitorpro==="TorsionReal")
      project="扭力值";
    var linechart=document.getElementById(linechartstr);
    if(linechartstr==="lineChart1")
    {
      title="二："+project+" 均值(X图)";
      this.myChartforspc1 = ec.init(linechart);
    }
      
    else
    {
      title="三："+project+" 极差(R图)";
      this.myChartforspc2 = ec.init(linechart);
    }
      

    var instance=this;
    console.log('ydata ===== \n',ydata);
    // return;
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
    if(linechartstr==="lineChart1")
    {
      this.myChartforspc1.setOption(option);
      this.myChartforspc1.on('click', function (params) 
      {
        var index=params.dataIndex;
      
        instance.showSPCRawdataModal(index);       
      });
    }
    else{
      this.myChartforspc2.setOption(option);
      this.myChartforspc2.on('click', function (params) 
      {
        var index=params.dataIndex;
      
        instance.showSPCRawdataModal(index);       
      });
    }
  }

  async initChartsforCPK(linechartstr:string,xdata,ydata) 
  {  
    const ec = echarts as any;
    let title="一：CPK定量型监控：每生产100PCS则计算一次CPK";
    var linechart=document.getElementById(linechartstr);

    var instance=this;
    console.log('ydata ===== \n',ydata);
    // return;
    this.myChartforcpk = ec.init(linechart);
    
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
    this.myChartforcpk.setOption(option);
    this.myChartforcpk.on('click', function (params) 
    {
      console.log('查询的条件\n', params);
      var index=params.dataIndex;
      
      instance.showCPKtestresultdataModal(index);       
    });
  }

  showSPCRawdataModal(index): void{
    // this.showmaterials();
    this.isVisible1 = true;
    this.spcrowdata=[];
    for(let i=0;i<this.querydata['hits']['hits'][index]._source.detail.length;i++)
    {
      var rowdata = [];
      rowdata["modelname"]=this.querydata['hits']['hits'][index]._source.detail[i].Model;
      rowdata["stationline"]=this.querydata['hits']['hits'][index]._source.Line;
      rowdata["stationtype"]=this.querydata['hits']['hits'][index]._source.stationtype;
      rowdata["stance"]=this.querydata['hits']['hits'][index]._source.stance;
      rowdata["monitorpro"]=this.querydata['hits']['hits'][index]._source.monitorpro;
      rowdata["mdupperlimit"]=this.querydata['hits']['hits'][index]._source.detail[i].mdupperlimit;
      rowdata["mdlowerlimit"]=this.querydata['hits']['hits'][index]._source.detail[i].mdlowerlimit;
      rowdata["mdresult"]=this.querydata['hits']['hits'][index]._source.detail[i].mdresult;
      rowdata["unitserialnumber"]=this.queryCPKdata['hits']['hits'][index]._source.detail[i].USN;
      // rowdata["starttime"]=this.querydata['hits']['hits'][index]._source.detail[i].StartTime;
      rowdata["stoptime"]=this.querydata['hits']['hits'][index]._source.detail[i].EndTime;
      this.spcrowdata[i]=rowdata;
    }
  }

  showCPKtestresultdataModal(index): void{
    // this.showmaterials();
    this.isVisible2 = true;
    this.testresultdata=[];
    this.cur_index=index;
    if(this.queryCPKdata['hits']['hits'][index]._source)
    {
      var rowdata = [];
      rowdata["project"]=this.queryCPKdata['hits']['hits'][index]._source.monitorpro;
      rowdata["testresult"]="true";
      rowdata["testnum"]=this.queryCPKdata['hits']['hits'][index]._source.detail.length;
      rowdata["fbt"]="Link";
      this.testresultdata[0]=rowdata;
    }
  }

  showCPKRawdataModal(index): void{
    // this.showmaterials();
    this.isVisible3 = true;
    this.cpkrawdata=[];
    for(let i=0;i<this.queryCPKdata['hits']['hits'][index]._source.detail.length;i++)
    {
      var rowdata = [];
      rowdata["modelname"]=this.queryCPKdata['hits']['hits'][index]._source.Model;
      rowdata["stationline"]=this.queryCPKdata['hits']['hits'][index]._source.Line;
      rowdata["stationid"]=this.queryCPKdata['hits']['hits'][index]._source.MachineSN;
      rowdata["sn"]=this.queryCPKdata['hits']['hits'][index]._source.detail[i].USN;
      rowdata["starttime"]="";
      rowdata["stoptime"]=this.queryCPKdata['hits']['hits'][index]._source.detail[i].EndTime;
      rowdata["mdresult"]=this.queryCPKdata['hits']['hits'][index]._source.detail[i].mdresult;
      rowdata["mdupperlimit"]=this.queryCPKdata['hits']['hits'][index]._source.detail[i].mdupperlimit;
      rowdata["mdlowerlimit"]=this.queryCPKdata['hits']['hits'][index]._source.detail[i].mdlowerlimit;
      this.cpkrawdata[i]=rowdata;
    }
  }

  showCPKfbtModal(index): void{
    // this.showmaterials();
    this.isVisible4 = true;
    var linechart=document.getElementById("lineChartCPKfbt");
    
    this.cpkrawdata11=[];
    var mdresult=[];
    for(let i=0;i<this.queryCPKdata['hits']['hits'][index]._source.detail.length;i++)
    {
      mdresult.push(this.queryCPKdata['hits']['hits'][index]._source.detail[i].mdresult);
      this.cpkrawdata11["mdupperlimit"]=this.queryCPKdata['hits']['hits'][index]._source.detail[i].mdupperlimit;
      this.cpkrawdata11["mdlowerlimit"]=this.queryCPKdata['hits']['hits'][index]._source.detail[i].mdlowerlimit;
    }
    this.cpkrawdata11["mdresult"]=mdresult;
    const that = this;
    setTimeout(() => {that.initChartsCPKfbt(linechart,that.cpkrawdata11);},500);
    // this.initChartsCPKfbt(linechart,cpkrawdata);
  }

  async showfbt()
  {
    var linechart=document.getElementById("lineChartCPKfbt");
    this.initChartsCPKfbt(linechart,this.cpkrawdata11);
  }

  async queryup() {
    var linechart=document.getElementById("lineChart");
    if(this.xxdata.length>0||this.rxdata.length>0)
    {
      linechart.setAttribute("style","width:100%;height:600px;background-color: #e6e6e6;margin-top: 50px;margin-left:0px;visibility:visible");
      this.initCharts("lineChart1",this.xxdata,this.xydata);
      this.initCharts("lineChart2",this.rxdata,this.rydata);
    }
    else 
      linechart.setAttribute("style","visibility:hidden");
  }

  async querycpk() {
    var linechart=document.getElementById("lineChartcpk");
    if(this.xxdata.length>0||this.rxdata.length>0)
    {
      linechart.setAttribute("style","width:100%;height:310px;background-color:#e6e6e6;margin-top: 10px;margin-left:0px;");
      this.initChartsforCPK("lineChart3",this.xxdata,this.xydata);
    }
    else 
      linechart.setAttribute("style","visibility:hidden");
  }

  handleOk1(): void {
    this.isVisible1 = false;
  }

  handleCancel1(): void {
    this.isVisible1 = false;
  }

  handleOk2(): void {
    this.isVisible2 = false;
  }

  handleCancel2(): void {
    this.isVisible2 = false;
  }

  handleOk3(): void {
    this.isVisible3 = false;
  }

  handleCancel3(): void {
    this.isVisible3 = false;
  }

  handleOk4(): void {
    this.isVisible4 = false;
  }

  handleCancel4(): void {
    this.isVisible4 = false;
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
          '机台序列号': res['unitserialnumber'],
          '点位': res['stance'],
          '监控项目': res['monitorpro'],
          '开始测试时间': '',
          '结束测试时间': this.formatDate(res['stoptime']),
          '测试值': res['mdresult'],
          '测试值上限': res['mdupperlimit'],
          '测试值下限': res['mdlowerlimit']
        };
      });
      const colWidth = [];
      Object.keys(data[0]).forEach(element => {
        colWidth.push({wpx: 70});
        colWidth.push({wpx: 50});
        colWidth.push({wpx: 80});
        colWidth.push({wpx: 70});
        colWidth.push({wpx: 100});
        colWidth.push({wpx: 120});
        colWidth.push({wpx: 120});
        colWidth.push({wpx: 60});
        colWidth.push({wpx: 80});
        colWidth.push({wpx: 80});
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), title, colWidth, headerBgColor);
    }
  }

  downcpkrawdata(data, title) {
    if (data) {
      const downloadDatas = data.map (res => {
        return {
          '機種': res['modelname'],
          '線別': res['stationline'],
          '治具编号': res['stationid'],
          '机台序列号': res['sn'],
          '开始测试时间': '',
          '结束测试时间': this.formatDate(res['stoptime']),
          '测试值': res['mdresult'],
          '测试值上限': res['mdupperlimit'],
          '测试值下限': res['mdlowerlimit']
        };
      });
      const colWidth = [];
      Object.keys(data[0]).forEach(element => {
        colWidth.push({wpx: 70});
        colWidth.push({wpx: 50});
        colWidth.push({wpx: 100});
        colWidth.push({wpx: 100});
        colWidth.push({wpx: 100});
        colWidth.push({wpx: 120});
        colWidth.push({wpx: 100});
        colWidth.push({wpx: 80});
        colWidth.push({wpx: 80});
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), title, colWidth, headerBgColor);
    }
  }

  getParam(low, mean, up, top) {
    var res = {};
    res['low'] = low;
    res['mean'] = mean;
    res['up'] = up;
    res['top'] = top;
    return res;
}

addParam(arr, target) {
  //是否是等于
  var flag = false;
  var target1 = parseFloat(target);
  //最小
  if (target1 < parseFloat(arr[0])) {
      arr.unshift(target1.toString());
      return arr;
  }

  //最大
  if (target1 > parseFloat(arr[arr.length - 1])) {
      arr.push(target1.toString());
      return arr;
  }

  //中间
  for (var i = 0; i < arr.length; i++) {
      if (parseFloat(arr[i]) > target1) {
          if (arr[i - 1] == target1)
              flag = true;
          break;
      }
  }
  if (flag) {
      return arr;
  } else {
      arr.splice(i, 0, target1.toString());
      return arr;
  }
}

fun (x,u,a){
  return  (1 / Math.sqrt(2 * Math.PI) * a) * Math.exp( -1 * ((x-u) * (x-u)) / (2 * a * a));
}

  async initChartsCPKfbt(element:Element,datadetail) {
    const markLineY = [];

    const ec = echarts as any;
    // var linechart=document.getElementById("lineChart");
    let xx=[];
const yy=[];
    var maxy=0;
    for (var i = 0; i < datadetail.mdresult.length; i++)
    {
      if(datadetail.mdresult[i]>maxy) maxy=datadetail.mdresult[i];
      
      xx.push(datadetail.mdresult[i]+"");

        
    }
    xx = Array.from(new Set(xx));
    
    var datas = [{
        "data": {
            "stdplot": {
                "xaxis": (xx.toString()),
                "yaxis": (xx.toString()),
                "mean": 20+"",
                "lower": datadetail.mdlowerlimit,
                "upper": datadetail.mdupperlimit,
                "stdev": datadetail.mdlowerlimit
            }
        },
        "idx": 1
    }];
    if(this.myChartforcpkfbt)
      this.myChartforcpkfbt.dispose();
    for (var i = 0; i < datas.length; i++)
    {
        this.myChartforcpkfbt = ec.init(element);
        var yArr = [];
        var xArr = [];

        var mean = parseFloat(datas[i].data.stdplot.mean);
        var stdev = parseFloat(datas[i].data.stdplot.stdev);
        var x = datas[i].data.stdplot.xaxis.split(',');
        var y = datas[i].data.stdplot.yaxis.split(',')

        var low = mean - 3 * stdev;
        var up = mean + 3 * stdev;

        x = this.addParam(x, low.toFixed(0).toString());
        x = this.addParam(x, mean.toFixed(0).toString());
        x = this.addParam(x, up.toFixed(0).toString());

        //var top = getTop(y);
        // var top = (1 / Math.sqrt(2 * Math.PI) * stdev);
        // var mar = this.getParam(low.toFixed(0).toString(), mean.toFixed(0).toString(), up.toFixed(0).toString(), top);
        //y.push(parseInt(top))
        //var myParam = [low.toFixed(0).toString(),mean.toFixed(0).toString(),up.toFixed(0).toString()];

        //var mar = {'t':'6920'}

        for (var j = 0; j < x.length; j++) {
            var res = this.fun(x[j], mean, stdev).toFixed(2);
            yArr.push(res);

        }

        markLineY.push([{name: '规格下限' , yAxis: 0, xAxis: 0 , itemStyle: {normal: {color: '#ff9a9a'}}},
        {name: '规格下限:', xAxis: 0 , yAxis: maxy, label: {show: true,textStyle: {fontSize: 12,fontWeight: "bolder"}}, itemStyle: {normal: {color: '#ff9a9a'}}}]);

        markLineY.push([{name: '规格中心' , yAxis: 0, xAxis: x.length/2 , itemStyle: {normal: {color: '#7ac27b'}}},
        {name: '规格中心:', xAxis: x.length/2 , yAxis: maxy, label: {show: true,textStyle: {fontSize: 12,fontWeight: "bolder"}}, itemStyle: {normal: {color: '#7ac27b'}}}]);
    
        markLineY.push([{name: '规格上限' , yAxis: 0, xAxis: x.length-1 , itemStyle: {normal: {color: '#ff9a9a'}}},
        {name: '规格上限:', xAxis: x.length-1 , yAxis: maxy, label: {show: true,textStyle: {fontSize: 12,fontWeight: "bolder"}}, itemStyle: {normal: {color: '#ff9a9a'}}}]);

        // var colors = ['#7CCD7C', '#d14a61', '#675bba'];
        var colors = ['#808080', '#d14a61', '#675bba'];
        var option = {
            color: colors,
            backgroundColor: '#ffffff',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
              left: '15%',
              right: '15%',
              top: '15%',
              bottom: '15%'
            },
            toolbox: {
                feature: {
                    dataView: {
                        show: false,
                        readOnly: false
                    },
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    }
                }
            },

            xAxis: [{
                type: 'category',
                boundaryGap : true,
                axisTick: {
                    alignWithLabel: true
                },
                data: x
            }],
            yAxis: [{
                    type: 'value',
                    name: '',
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisLabel: {
                      formatter: '{value}'
                    },
                    "axisTick":{       //y轴刻度线
                      "show":true
                    },
                    "splitLine": {     //网格线
                      "show": true
                    }
                },
                {
                    type: 'value',
                    name: '',
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                      formatter: '{value}'
                    },
                    "axisTick":{       //y轴刻度线
                      "show":true
                    },
                    "splitLine": {     //网格线
                      "show": true
                    }
                }

            ],
            series: [{
                    name: '原数据频率',
                    type: 'bar',
                    yAxisIndex: 1,
                    smooth:true,
                    data: y,
                    barGap: '-100%',
                    markLine: {
                      silent: true,
                      data: markLineY
                    }
                },
                {
                    name: '正态分布',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    data: yArr,
                    barGap: '-100%'
                },
            ]
        };
        this.myChartforcpkfbt.setOption(option);
    }
}
}
