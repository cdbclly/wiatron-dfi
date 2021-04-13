import { Component, OnInit,Input } from '@angular/core';
import { LineDataServiceService } from '@service/skyeye/line-data-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { NzModalService } from 'ng-zorro-antd';
import { ExcelToolService } from '@service/skyeye/excel-tool.service';
import { DatePipe } from '@angular/common';
import { SpecOffsetManagementService } from './spec-offset-management.service';
// import { NgxEchartsModule } from 'ngx-echarts';
import { EChartOption } from 'echarts';
import * as echarts from 'echarts';
import {fromEvent} from 'rxjs'
import { EsDataServiceService } from '@service/skyeye/es-data-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-spec-offset-management',
  templateUrl: './spec-offset-management.component.html',
  styleUrls: ['./spec-offset-management.component.scss']
})
export class SpecOffsetManagementComponent implements OnInit {
  showloading:boolean = true;
  chartOption3: EChartOption = {};
  cur_site;
  cur_plant;
  cur_upn;
  cur_tdname;
  cur_mdname;
  tdnameGroup=[];
  mdnameGroup=[];
  cur_Upperlimit;
  cur_Lowerlimit
  UpperlimitGroup=[];
  LowerlimitGroup=[];
  myChartGroup=[];
  myChartGroup1=[];
  upnArr=[];
  buglistdata = [];
  cur_item;
  itemGroup=[];
  cpkrowdata = [];
  nglogdata = [];
  debuglistdata = [];
  dateRangeFrom;
  dateRangeTo;
  project = [];
  projectGroup = [];
  plantGroup = [];
  addPlantGroup = [];
  // addPlantGroup = [];
  siteGroup = [];
  addSiteGroup = [];
  kpiInfos = [];
  ckpiInfos;
  querydata;
  querydebugdata
  cur_model = [];
  cur_stage = [];
  queryButton = true;
  editMap = new Map<string, boolean>();
  modelGroup = [];
  editItem = {};
  isVisible_spec = false;
  isVisible_speclist = false;
  isVisible_materials = false;
  isVisible_nglog = false;
  cpkrowdatavisible = false;
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
  stGroup = [];
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
  cpkdebuglistwidth=['20px', '50px', '50px', '60px', '60px', '30px'];
  CPKRawdatawidth = ['30px', '80px', '50px', '60px', '60px', '100px', '90px', '90px', '70px', '80px', '80px', '60px'];
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
  @Input() cur_stationtype;
  datadetail1 =[];
  datadetail2 =[];
  datadetail;

  datadetail1_debug =[];
  datadetail2_debug =[];
  datadetail_debug;

  initdata;
  constructor(
    private dataService: LineDataServiceService,
    // private message: NzMessageService,
    private esService: EsDataServiceService,
    private _service: SpecOffsetManagementService,
    // private modalService: NzModalService,
    private excelService: ExcelToolService,
    private datePipe: DatePipe
  )  {

  }

  ngOnInit() {
    const role_arr = JSON.parse(localStorage.getItem('$DFI$UserAuth'));
    // this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping')).filter(res => res['Site'] === localStorage.getItem('DFC_Site').toUpperCase());
    this.siteInfos = JSON.parse(localStorage.getItem('Skyeye_plantMapping'));
    this.addSiteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.siteGroup = this.dataService.groupBy(this.siteInfos, 'Site');
    this.role = role_arr['SkyeyeTestItemMaintain'];
    console.log(this.role['update']);
    this.queryButton = true;
    document.getElementById("downfirstrow").setAttribute("style","visibility:hidden");
    document.getElementById("firstrow").setAttribute("style","visibility:hidden");

    fromEvent(window,"resize").subscribe((event:any) =>{
      
      if(location.pathname.indexOf("SpecOffsetManagement")!==-1)
      {
        if(this.queryButton===false&&this.querydata)
        {
            console.log("浏览器的宽：", event.target.innerWidth);
            this.getESDatas('CPK_Offset',"up");
        }
        if(this.datadetail_debug&&this.datadetail_debug.length&&this.datadetail_debug.length>0)
        {
          this.getESDatas('CPK_Offset',"down");
        }
      }
    })
  }

  async showmaterials() {
    let date_range;
    let size;

    size = `"size": 5000`;
    // this.cur_site='WSH';
    // this.cur_plant='F232';
    {
      let esURL;
      this.buglistdata=[];
      if(this.cur_upn&&this.cur_stationtype)
      {
        esURL = this.esService.getUrl('CPK_Offset_Supplementary'+ '/');
        const querys = this.esService.getCPKOffsetSupplementary(this.cur_upn,this.cur_stationtype,size);
        console.log('查询的条件\n', esURL,querys);
        const data = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
        console.log(' data  查询到的数据 data ===== \n',data);
        this.buglistdata=[];
        for (let i = 0; i < data['hits']['hits'].length; i++)
        {
          var rowdata = [];
          rowdata["PN"]=data['hits']['hits'][i]._source.pn;
          rowdata["Stage"]=this.cur_stationtype;
          rowdata["Symptom"]=data['hits']['hits'][i]._source.issuedesc;
          rowdata["SymptomDescription"]=data['hits']['hits'][i]._source.issuedesc;
          rowdata["DefectRate"]=data['hits']['hits'][i]._source.defectqty;
          rowdata["Analysis"]=data['hits']['hits'][i]._source.remark;
          rowdata["RootCause"]=data['hits']['hits'][i]._source.rootcause;
          rowdata["Solution"]=data['hits']['hits'][i]._source.correctiveaction;
          rowdata["Status"]=data['hits']['hits'][i]._source.status;
          this.buglistdata[i]=rowdata;
        }
      }
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

  downloadCpkrowdata(data, title) {
    if (data) {
      const downloadDatas = data.map (res => {
        return {
          'NO.': res['no'],
          '機種': res['model'],
          '線別': res['stationline'],
          '站別': res['stationtype'],
          '治具编号': res['item'],
          '机台序列号': res['unitserialnumber'],
          '测试开始时间': this.formatDate(res['startdate']),
          '测试结束时间': this.formatDate(res['stopdate']),
          '测试值': res['mdresult'],
          '测试SPEC上限': res['mdupperlimit'],
          '测试SPEC下限': res['mdlowerlimit']
        };
      });

      const colWidth = [];
      Object.keys(data[0]).forEach(element => {
        colWidth.push({wpx: 60});
        colWidth.push({wpx: 80});
        colWidth.push({wpx: 60});
        colWidth.push({wpx: 60});
        colWidth.push({wpx: 80});
        colWidth.push({wpx: 230});
        colWidth.push({wpx: 130});
        colWidth.push({wpx: 130});
        colWidth.push({wpx: 70});
        colWidth.push({wpx: 100});
        colWidth.push({wpx: 100});
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), title, colWidth, headerBgColor);
    }
  }

  downloadNglog(data, title) {
    if (data) {
      const downloadDatas = data.map (res => {
        return {
          'SN': res['sn'],
          '总测试项目': res['tdname'],
          '子测试项目': res['mdname'],
          'Stage': res['stage'],
          'Spec(Upperlimit)': res['Upperlimit'],
          'Spec(Lowlimit)': res['Lowerlimit'],
          '实际值': res['mdresult'],
          '治具编号': res['item'],
          '测试开始时间': this.formatDate(res['startdate']),
          '测试结束时间': this.formatDate(res['stopdate'])
        };
      });

      const colWidth = [];
      Object.keys(data[0]).forEach(element => {
        colWidth.push({wpx: 250});
        colWidth.push({wpx: 230});
        colWidth.push({wpx: 120});
        colWidth.push({wpx: 60});
        colWidth.push({wpx: 100});
        colWidth.push({wpx: 100});
        colWidth.push({wpx: 60});
        colWidth.push({wpx: 60});
        colWidth.push({wpx: 130});
        colWidth.push({wpx: 130});
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), title, colWidth, headerBgColor);
    }
  }

  downloadbuglist(data, title) {
    if (data) {
      const downloadDatas = data.map (res => {
        return {
          'PN': res['PN'],
          'Stage': res['Stage'],
          'Symptom': res['Symptom'],
          'Symptom Description': res['SymptomDescription'],
          'Defectqty': res['DefectRate'],
          'Analysis': res['Analysis'],
          'Root Cause': res['RootCause'],
          'Solution': res['Solution'],
          'Status': res['Status']
        };
      });

      const colWidth = [];
      Object.keys(data[0]).forEach(element => {
        colWidth.push({wpx: 120});
        colWidth.push({wpx: 90});
        colWidth.push({wpx: 120});
        colWidth.push({wpx: 120});
        colWidth.push({wpx: 80});
        colWidth.push({wpx: 120});
        colWidth.push({wpx: 300});
        colWidth.push({wpx: 80});
        colWidth.push({wpx: 80});
      });
      const headerBgColor = '53868B';
      this.excelService.exportAsExcelFileStyle(JSON.parse(JSON.stringify(downloadDatas)), title, colWidth, headerBgColor);
    }
  }

  async queryclick()
  {
    this.mdnameGroup=[];
    this.tdnameGroup=[];
    this.cur_tdname=[];
    this.cur_mdname=[];
    this.UpperlimitGroup=[];
    this.LowerlimitGroup=[];
    this.cur_Upperlimit=[];
    this.cur_Lowerlimit=[];
    this.getESDatas('CPK_Offset',"up");
  }

  async titleclick(target)
  {
    if(target)
    {
      var i=target.getAttribute("i");
      var j=target.getAttribute("j");
      var source=this.datadetail[i][j];
      this.cpkrowdatavisible=true;
      this.cpkrowdata=[];
      var data=this.querydata;
      for(let m=0;m<source.rawdata_detail.length;m++)
      {
        var rowdata = [];
        rowdata["no"]=m+1;//
        rowdata["model"]=data['hits']['hits'][i]._source.modelname;
        rowdata["stationline"]=source.rawdata_detail[m].stationline;
        rowdata["stationtype"]=data['hits']['hits'][i]._source.stationtype;
        rowdata["item"]=source.rawdata_detail[m].stationid;
        rowdata["unitserialnumber"]=source.rawdata_detail[m].unitserialnumber;
        rowdata["startdate"]=source.rawdata_detail[m].startdate;
        rowdata["stopdate"]=source.rawdata_detail[m].stopdate;
        rowdata["mdresult"]=source.rawdata_detail[m].mdresult;
        rowdata["mdupperlimit"]=source.mdupperlimit;
        rowdata["mdlowerlimit"]=source.mdlowerlimit;
        this.cpkrowdata[m]=rowdata;
      }
    }
  }

  async queryclick1()
  {
    this.getESDatas('CPK_Offset',"down");
  }

  async filterData() {
    this.kpiInfos = await this.dataService.getRecipientApi(this.cur_plant);
    if (this.cur_plant) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_plant.indexOf(res['plantId']) !== -1);
    }
    if (this.cur_model&&this.cur_model.length>0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.cur_model.indexOf(res['model']) !== -1);
    }
    if (this.project&&this.project.length>0) {
      this.kpiInfos = this.kpiInfos.filter(res => this.project.indexOf(res['name']) !== -1);
    }

    if(this.initdata&&this.initdata!==null)
    {
      this.stGroup=[];
      this.upnArr=[];
      this.itemGroup=[];
      console.log('this.initdata\n',this.initdata);
      console.log('cur_model\n',this.cur_model);
      for (let i = 0; i < this.initdata['hits']['hits'].length; i++) 
      {
        if(this.cur_model&&this.cur_model===this.initdata['hits']['hits'][i]._source.modelname)
        {
          this.upnArr.push(this.initdata['hits']['hits'][i]._source.upn);
          if(this.cur_upn&&this.cur_upn===this.initdata['hits']['hits'][i]._source.upn)
          {
            this.stGroup.push(this.initdata['hits']['hits'][i]._source.stationtype);
            if (this.initdata['hits']['hits'][i]._source.detail2) {
              for(let j=0;j< this.initdata['hits']['hits'][i]._source.detail2.length;j++)
              {
                  this.itemGroup.push(this.initdata['hits']['hits'][i]._source.detail2[j].stationid);
              }
            }
          }   
        }
      }
      this.stGroup = Array.from(new Set(this.stGroup));
      this.upnArr = Array.from(new Set(this.upnArr));
      this.itemGroup = Array.from(new Set(this.itemGroup));
    }
  }

  async querybtnstatus()
  {
    if (
      this.cur_model!==null && this.cur_model&&this.cur_model.length>0&&
      this.cur_upn&&this.cur_upn !== null&&this.cur_upn.length>0&&
      this.cur_plant&&this.cur_plant !== null&&this.cur_plant.length>0&&
      this.cur_site&&this.cur_site !== null&&this.cur_site.length>0&&
      this.cur_stationtype&&this.cur_stationtype!==null&&this.cur_stationtype.length>0&&
      this.dateRangeFrom&&this.dateRangeFrom!==null&&
      this.dateRangeTo&&this.dateRangeTo!==null) 
    {
      this.queryButton = false;
    }
    else this.queryButton = true;
  }

   // 选中下拉框的数据调用
  async getOptions(type) {
    if (type === 'plant') {
      this.filterData();
      this.cur_plant = [];
      this.cur_model = [];
      this.cur_upn = [];
      this.cur_stationtype = [];
      this.cur_item = [];
      this.queryButton = true;
      this.querybtnstatus();
    }
    if (type === 'project') {
      // debugger
      this.filterData();
      this.cur_model = [];
      this.cur_upn = [];
      this.cur_stationtype = [];
      this.cur_item = [];

      if (this.cur_plant) {
        this.getESDatas("init");
      }
      else this.initdata=[];
      this.querybtnstatus();
      
    }

    if (type === 'model') {
      this.filterData();
      this.cur_model = [];
      console.log(this.kpiInfos);
      this.querybtnstatus();
    }
    if (type === 'query') {
      console.log('getOptions--cur_model\n',this.cur_model);
      this.filterData();
      this.cur_item = [];
      this.cur_stationtype = [];
      this.cur_upn = [];
      this.querybtnstatus();
    }
    if (type === 'upn') {
      this.filterData();
      this.cur_item = [];
      this.cur_stationtype = [];
      this.querybtnstatus();
    }
    if (type === 'stationtype') {
      this.filterData();
      this.cur_item = [];
      this.querybtnstatus();
    }
    if (type === 'datefrom') {
      this.filterData();
      this.querybtnstatus();
    }
    if (type === 'dateto') {
      this.filterData();
      this.querybtnstatus();
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

    if(type==='tdname'||type==='mdname')
    {
      if(this.mdnameGroup.length>0&&this.tdnameGroup.length>0&&
        this.UpperlimitGroup.length>0&&this.LowerlimitGroup.length>0&&
        this.mdnameGroup&&this.tdnameGroup&&this.UpperlimitGroup&&this.LowerlimitGroup)     
      {
        for(let i=0;i<this.tdnameGroup.length;i++)
        {
          if(this.cur_tdname===this.tdnameGroup[i]&&this.cur_mdname===this.mdnameGroup[i])
          {
            this.cur_Upperlimit=this.UpperlimitGroup[i];
            this.cur_Lowerlimit=this.LowerlimitGroup[i];
          }
        }
      }
    }
  }

  // 点击到输入框时调用
  async getOptList(type) {
    if (type === 'model') 
    {
      if (this.cur_site !== null && this.cur_plant !== null && 
        this.cur_site !== undefined && this.cur_plant !== undefined) 
      {
        this.tmp_arr = this.cur_model;
        this.cur_model = [];
        await this.filterData();
        this.cur_model = this.tmp_arr;
        this.modelGroup = this.dataService.groupBy(this.kpiInfos, 'model');
      }

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
      // this.getESDatas('init');
    }
  }

  showspecModal(): void {
    this.isVisible_spec = true;
  }


  handleOkspecModal() {
    this.getESDatas1("SPECDBug");
    this.isVisible_spec=false;
  }

  CancelspecModal(): void {
    this.isVisible_spec = false;
  }

  handleOkspecListModal() {
    this.isVisible_speclist=false;
    this.SpecPush();
  }

  CancelspecListModal(): void {
    this.isVisible_speclist = false;
  }

  showspeclistModal(): void {
    this.isVisible_speclist = true;
  }

  handleOkmaterialsModal() {
    this.isVisible_materials=false;
  }
  
  CancelmaterialsModal(): void {
    this.isVisible_materials = false;
  }

  showmaterialsModal(): void {
    this.isVisible_materials = true;
    this.showmaterials();
  }

  shownglogModal(): void {
    this.isVisible_nglog=true;
    this.nglogdata=[];
    var index=0;
    if(this.querydata&&this.querydata['hits']&&this.querydata['hits']['hits'])
    {
      for(let m=0;m<this.querydata['hits']['hits'].length;m++)
      {
        for(let i=0;i<this.querydata['hits']['hits'][m]._source.nglog.length;i++)
        {
          var rowdata = [];
          rowdata["sn"]=this.querydata['hits']['hits'][m]._source.nglog[i].unitserialnumber;
          rowdata["tdname"]=this.querydata['hits']['hits'][m]._source.nglog[i].tdname;
          rowdata["mdname"]=this.querydata['hits']['hits'][m]._source.nglog[i].mdname;
          rowdata["stage"]=this.querydata['hits']['hits'][m]._source.stationtype;
          rowdata["item"]=this.querydata['hits']['hits'][m]._source.nglog[i].stationid;
          rowdata["Upperlimit"]=this.querydata['hits']['hits'][m]._source.nglog[i].mdupperlimit;
          rowdata["Lowerlimit"]=this.querydata['hits']['hits'][m]._source.nglog[i].mdlowerlimit;
          rowdata["startdate"]=this.querydata['hits']['hits'][m]._source.nglog[i].startdate;
          rowdata["stopdate"]=this.querydata['hits']['hits'][m]._source.nglog[i].stopdate;
          rowdata["mdresult"]=this.querydata['hits']['hits'][m]._source.nglog[i].mdresult;
  
          this.nglogdata[index++]=rowdata;
        }
      }
    }
  }

  showDebuglistModal(): void {
    this.isVisible_speclist=true;
    this.debuglistdata=[];
    var rowdata = [];
    var index=0;
    if(this.cur_tdname&&this.cur_mdname&&this.upperCpk&&this.lowerCpk)
    {
      rowdata["no"]=1;
      rowdata["tdname"]=this.cur_tdname;
      rowdata["mdname"]=this.cur_mdname;
      rowdata["UpperLimit"]=this.upperCpk;
      rowdata["LowerLimit"]=this.lowerCpk;
      rowdata["Action"]="true";
      this.debuglistdata[0]=rowdata;
    }
  }

  handleOknglog() {
    this.isVisible_nglog=false;
  }
  
  Cancelnglog(): void {
    this.isVisible_nglog = false;
  }

  handleOkcpkrowdata() {
    this.cpkrowdatavisible=true;
  }
  
  handleCancelcpkrowdata(): void {
    this.cpkrowdatavisible = false;
  }
  
  async getParameter(queryClause,modelname,stationtype,recipientName,tdname,mdname,mdlowerlimit,mdupperlimit)
  {
    if(queryClause==='')
    {
      queryClause = `[{
        "modelname":"${modelname}",
        "stationtype":"${stationtype}",
        "recipientname":"${recipientName}",
        "tdname":"${tdname}",
        "mdname":"${mdname}",
        "mdlowerlimit":"${mdlowerlimit}",
        "mdupperlimit":"${mdupperlimit}"
      }`;
    }
    else
    {
      queryClause = queryClause+","+ `{
        "modelname":"${modelname}",
        "stationtype":"${stationtype}",
        "recipientname":"${recipientName}",
        "tdname":"${tdname}",
        "mdname":"${mdname}",
        "mdlowerlimit":"${mdlowerlimit}",
        "mdupperlimit":"${mdupperlimit}"
      }`;
    }
    return queryClause;
  }

  async SpecPush()
  {
    let queryClause=''
    if(this.debuglistdata&&this.debuglistdata.length>0)
    {
      const existdata = await this.dataService.getRecipientApiByAllOptions(this.cur_plant, this.cur_model);
      if(existdata)
      {
        for(let i=0;i<existdata.length;i++)
        {
          if(existdata[i]["stageId"]===this.cur_stationtype&&
          existdata[i]["plantName"]===this.cur_site.toLowerCase())
          {
            let recipientname=existdata[i]["recipientName"];
            queryClause= await this.getParameter(queryClause,this.cur_model,this.cur_stationtype,recipientname,this.cur_tdname,this.cur_mdname,this.lowerCpk,this.upperCpk);
            queryClause=queryClause+"]";
            let esURL;
            esURL = 'http://dfi.wks.wistron.com.cn/skyeye/api/SPECPash';
            console.log('URL\n', esURL,queryClause);
            const data = await this.esService.postData(esURL, JSON.parse(queryClause)).toPromise();
            // console.log('data\n', data);
            break;
          }
        }
      }
    }
  }

  async getESDatas1(type) {
    let date_range;
    let size;
    const mdresult = [];
    for(let i=0;i<this.datadetail.length;i++)
    {
      for(let j=0;j<this.datadetail[i].length;j++)
      {
        var tdname=this.datadetail[i][j].tdname;
        var mdname=this.datadetail[i][j].mdname;
        if(tdname&&mdname&&tdname===this.cur_tdname&&mdname===this.cur_mdname)
        {
          for(let m=0;m<this.datadetail[i][j].mdresult.length;m++)
            mdresult.push(this.datadetail[i][j].mdresult[m]);
        }
      }
    }

    date_range = `{
      "site":"${this.cur_site.toLowerCase()}",
      "plant":"${this.cur_plant}",
      "modelname":"${this.cur_model}",
      "upn":"${this.cur_upn}",
      "stationtype":"${this.cur_stationtype}",
      "phase":"C5",
      "executiontime":12348522005871,
      "recipientname":"Murphy_Lee@wistron.com;Albert_Chen@wistron.com",
      "tdname":"${this.cur_tdname}",
      "mdname":"${this.cur_mdname}",
      "mdlowerlimit":${this.lowerCpk},
      "mdupperlimit":${this.upperCpk},
      "mdresult":[${mdresult}]
    }`;

    if (type === 'SPECDBug') {
      let esURL;
      esURL = 'http://dfi.wks.wistron.com.cn/skyeye/api/SPECDBug';
      console.log('SPECDBug\n', esURL,date_range);
      this.esService.postData(esURL, JSON.parse(date_range)).toPromise();
    }
  }

  async getDetail()
  {
    this.datadetail1=[];
    this.datadetail2=[];
    this.datadetail=[];
    for (let i = 0; i < this.querydata['hits']['hits'].length; i++) {
      if(this.cur_item&&this.cur_item!==null&&this.cur_item.length>0)
      {
        // debugger
        if (this.querydata['hits']['hits'][i]._source.detail2) {
          var detail=[];
          for(let j=0;j< this.querydata['hits']['hits'][i]._source.detail2.length;j++)
          {
            if(this.cur_item.indexOf(this.querydata['hits']['hits'][i]._source.detail2[j].stationid)!==-1)
            {
              // debugger
              detail[j] = this.querydata['hits']['hits'][i]._source.detail2[j];
              if(detail[j].mdname)
                this.mdnameGroup.push(detail[j].mdname);
              if(detail[j].tdname)
                this.tdnameGroup.push(detail[j].tdname);
              if(detail[j].mdupperlimit)
                this.UpperlimitGroup.push(detail[j].mdupperlimit);
              if(detail[j].mdlowerlimit)
                this.LowerlimitGroup.push(detail[j].mdlowerlimit);
            }
          }
          this.datadetail2[i]=detail;
          this.mdnameGroup = Array.from(new Set(this.mdnameGroup));
          this.tdnameGroup = Array.from(new Set(this.tdnameGroup));
          this.UpperlimitGroup = Array.from(new Set(this.UpperlimitGroup));
          this.LowerlimitGroup = Array.from(new Set(this.LowerlimitGroup));
        }
        this.datadetail=this.datadetail2;
      }
      else
      {
        if (this.querydata['hits']['hits'][i]._source.detail1){
          var detail=[];
          for(let j=0;j< this.querydata['hits']['hits'][i]._source.detail1.length;j++)
          {
              detail[j] = this.querydata['hits']['hits'][i]._source.detail1[j];
              if(detail[j].mdname)
                this.mdnameGroup.push(detail[j].mdname);
              if(detail[j].tdname)
                this.tdnameGroup.push(detail[j].tdname);
              if(detail[j].mdupperlimit)
                this.UpperlimitGroup.push(detail[j].mdupperlimit);
              if(detail[j].mdlowerlimit)
                this.LowerlimitGroup.push(detail[j].mdlowerlimit);
          }
          this.datadetail1[i]=detail;
          this.mdnameGroup = Array.from(new Set(this.mdnameGroup));
          this.tdnameGroup = Array.from(new Set(this.tdnameGroup));
          this.UpperlimitGroup = Array.from(new Set(this.UpperlimitGroup));
          this.LowerlimitGroup = Array.from(new Set(this.LowerlimitGroup));
        }
        this.datadetail=this.datadetail1;
      }
    }
  }

  async getDEBUGDetail()
  {
    this.datadetail_debug=[];
    let index=0;
    debugger
    for (let i = 0; i < this.querydebugdata['hits']['hits'].length; i++) 
    {
      let detail=[];
      if(
          this.querydebugdata['hits']['hits'][i]._source.tdname===this.cur_tdname&&
          this.querydebugdata['hits']['hits'][i]._source.mdname===this.cur_mdname&&
          this.querydebugdata['hits']['hits'][i]._source.mdlowerlimit===Number(this.lowerCpk).valueOf()&&
          this.querydebugdata['hits']['hits'][i]._source.mdupperlimit===Number(this.upperCpk).valueOf())
      {
        detail[0] = this.querydebugdata['hits']['hits'][i]._source;
        this.datadetail_debug[index++]=detail;
      }
    }
  }

  async getESDatas(type,type1="") {
    if(type==='init')//10.42.28.41
    {
      let esURL;
      esURL = this.esService.getUrl('CPK_Offset'+ '/');
      if(this.cur_site&&this.cur_site!==null&&this.cur_plant&&this.cur_plant!==null)
      {
        const querys = this.esService.getCPKOffsetOp(this.cur_site.toLowerCase(), this.cur_plant.toUpperCase());
        console.log('查询的条件\n', esURL,querys);
        this.initdata = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
        // this.initEsData = data;
        console.log(' this.initdata ===== \n',this.initdata);
      }
    }
    if (type === 'CPK_Offset') {
      if(type1==='up')
      {
        let esURL;
        this.querydata=[];
        esURL = this.esService.getUrl('CPK_Offset'+ '/');
        if(this.cur_site&&this.cur_site!==null&&this.cur_plant&&this.cur_plant!==null)
        {
          var from = new Date(this.dateRangeFrom).getTime();
          var to = new Date(this.dateRangeTo).getTime();
          let querys;
          {
            querys = this.esService.getCPKOffsetOp1(
            this.cur_site.toLowerCase(), 
            this.cur_plant.toUpperCase(),
            this.cur_model,
            this.cur_upn,
            this.cur_stationtype,
            from,to);
          }
          
          console.log('查询的条件\n', esURL,querys);
          this.querydata = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
          // this.initEsData = data;
          console.log(' CPKOffset  查询到的数据 data ===== \n',this.querydata);
          await this.getDetail();
          this.queryup(type1);
        }
      }
      else{
        let esURL;
        this.querydebugdata=[];
        esURL = this.esService.getUrl('CPK_Offset_Management'+ '/');
        if(this.cur_site&&this.cur_site!==null&&this.cur_plant&&this.cur_plant!==null)
        {
          let querys;
          {
            querys = this.esService.getCPKOffsetDebug(
            this.cur_site.toLowerCase(), 
            this.cur_plant.toUpperCase(),
            this.cur_model,
            this.cur_upn,
            this.cur_stationtype);
          }
          console.log('查询的条件\n', esURL,querys);
          this.querydebugdata = await this.esService.postData(esURL, JSON.parse(querys)).toPromise();
          // this.initEsData = data;
          console.log(' CPKOffsetDebug  查询到的数据 data ===== \n',this.querydebugdata);
          await this.getDEBUGDetail();
          this.queryup(type1);
        }
      }
    }
  }

  async queryup(type) {
    var specoffsetrow="specoffsetrow";
    var firstrow="firstrow";
    if(type==="down")
    {
       specoffsetrow="downspecoffsetrow";
       firstrow="downfirstrow";
    }
    this.echartnode=null;
    
    if(type==="up")
    {
      for(let i=0;i<this.myChartGroup.length;i++)
      {
        if(this.myChartGroup[i])
          this.myChartGroup[i].dispose();
      }
      this.myChartGroup=[];
    }
    else{
      for(let i=0;i<this.myChartGroup1.length;i++)
      {
        if(this.myChartGroup1[i])
          this.myChartGroup1[i].dispose();
      }
      this.myChartGroup1=[];
    }

    {
      var totallength=0;
      var finaldatadetail=this.datadetail;
      if(type==='down')
        finaldatadetail=this.datadetail_debug;
      // debugger
      for(let i=0;i<finaldatadetail.length;i++)
      {
        totallength+=finaldatadetail[i].length;
      }
      // if(totallength===0) return;
      this.addrows(totallength,type);

      let index1=0;
      for(let i=0;i<finaldatadetail.length;i++)
      {
        for(let j=0;j<finaldatadetail[i].length;j++)
        {
          let rowindex=index1/3;
          rowindex=Math.floor(rowindex);
          if(rowindex===0)
          {
            if(i===0&&j===0)
              var element=this.getNode(document.getElementById(firstrow),"lineChart");
            else var element=this.getNode(document.getElementById(firstrow),"lineChart"+index1);
          }
          else
          {
            if(index1%3===0&&!(i===0&&j===0))
            {
              var parentid=firstrow+rowindex;
              var element=this.getNode(document.getElementById(parentid),"lineChart");
            }
            else 
            {
              var parentid=firstrow+rowindex;
              var id="lineChart"+(index1%3);
              var element=this.getNode(document.getElementById(parentid),id);
            }
          }
          this.initCharts(element,finaldatadetail[i][j],type);
          index1++;
        }
        
      }
  // ****************************************************************************************************
      this.echartnode=null;
      index1=0;
      for(let i=0;i<finaldatadetail.length;i++)
      {
        for(let j=0;j<finaldatadetail[i].length;j++)
        {
          let rowindex=index1/3;
          rowindex=Math.floor(rowindex);
          if(rowindex===0)
          {
            if(i===0&&j===0)
              var element=this.getNode(document.getElementById(firstrow),"eChart");
            else var element=this.getNode(document.getElementById(firstrow),"eChart"+index1);
          }
          else
          {
            if(index1%3===0&&!(i===0&&j===0))
              var element=this.getNode(document.getElementById(firstrow+rowindex),"eChart");
            else var element=this.getNode(document.getElementById(firstrow+rowindex),"eChart"+(index1%3));
          }
          if(element!==null)
          {
            element.setAttribute("style","visibility:visible;height:300px;border:1px solid #000;");
            if(type==="up")
              this.initChartValue(element,i,j);
            else this.initChartValuedown(element,i,j);
          }
          index1++;
        }
        
      }
      let rowindex=totallength/3-1;
      let index=totallength%3-1;
      if(index>=0&&index<2)
      {
        for(let i=index+1;i<3;i++)
        {
          if(rowindex>0)
          {
            // var parentid="firstrow"+(rowindex);
            var parentid = firstrow+"1";
            if(rowindex===2)
              parentid = firstrow+"2";
            var parent=document.getElementById(parentid);
            var id="eChart"+(i);
            var element=this.getNode(parent,id);
          }
          else 
          {
            var element=this.getNode(document.getElementById(firstrow),"eChart"+(i));
          }
          
          if(element!==null)
            element.setAttribute("style","visibility:hidden");
        }
      } 
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

  async addrows(echartnum,type)
  {
    var specoffsetrow="specoffsetrow";
    var firstrow="firstrow";
    if(type==="down")
    {
       specoffsetrow="downspecoffsetrow";
       firstrow="downfirstrow";
    }
      
    if(echartnum==0)
    {
      var rows=document.getElementsByName(specoffsetrow);
      let rowlength=rows.length;
      for(let i=0;i<rowlength;i++)
      {
        if(i>0)
          document.getElementById(firstrow).parentNode.removeChild(document.getElementById(firstrow+i))
      }
      for(let i=0;i<3;i++)
      {
        if(i>0)
          var element=this.getNode(document.getElementById(firstrow),"eChart"+(i));
        else
          var element=this.getNode(document.getElementById(firstrow),"eChart");
        if(element!==null)
          element.setAttribute("style","visibility:hidden");
      }      
      return;
    }
    else
      document.getElementById(firstrow).setAttribute("style","visibility:visible");
    var rownum=echartnum/3;
    rownum=Math.ceil(rownum);
    var rows=document.getElementsByName(specoffsetrow);

    if(rownum>=rows.length)
    {
      let length=rownum-rows.length;
      for(let i=0;i<length;i++)
      {
        if(type==="up")
          document.getElementById(firstrow).parentNode.insertBefore(document.getElementById(firstrow).cloneNode(true),document.getElementById("toolbar"));
        else
          document.getElementById(firstrow).parentNode.insertBefore(document.getElementById(firstrow).cloneNode(true),document.getElementById(firstrow));
      }
    }
    else
    {
      let rowlength=rows.length;
      let length=rowlength-rownum;
      for(let i=0;i<length;i++)
      {
        let index=rowlength-1-i;
        if(index>0)
          document.getElementById(firstrow).parentNode.removeChild(document.getElementById(firstrow+index))
      }
    }
    this.modifyID(type);
  }

  async modifyID(type)
  {
    var specoffsetrow="specoffsetrow";
    var firstrow="firstrow";
    if(type==="down")
    {
       specoffsetrow="downspecoffsetrow";
       firstrow="downfirstrow";
    }
    var rows=document.getElementsByName(specoffsetrow);
    for (var i = 0; i < rows.length; i++)
    {
      if(i>0)
        rows[i].setAttribute("id",firstrow+i);
    }
  }

  getNode(parent:Element,id:string): Element
  {
    if(parent===null)return null;
    var node1=parent;
    // if(node1.children.length===0)
      if(node1.getAttribute("id")!==null
      &&node1.getAttribute("id")===id)
      {
        this.echartnode=node1;
      }
      else
      {
        for (var i = 0; i < node1.children.length; i++)
        {
            {
              this.getNode(node1.children[i],id);
            }
        }
      }

      return this.echartnode;
  }

  async initChartValue(echart:Element,i,j) {
    var datadetail=this.datadetail[i][j];
    let chineseContrast=datadetail.tdname+" "+datadetail.mdname;

    this.echartnode=null;
    var mdlowerlimit=this.getNode(echart,"mdlowerlimit");
    this.echartnode=null;
    var mean=this.getNode(echart,"mean");
    this.echartnode=null;
    var mdupperlimit=this.getNode(echart,"mdupperlimit");
    this.echartnode=null;
    var mdtarget=this.getNode(echart,"mdtarget");
    this.echartnode=null;
    var count=this.getNode(echart,"count");
    this.echartnode=null;
    var sigma=this.getNode(echart,"sigma");
    this.echartnode=null;
    var pp=this.getNode(echart,"pp");
    this.echartnode=null;
    var ppk=this.getNode(echart,"ppk");
    this.echartnode=null;
    var title=this.getNode(echart,"title");
    mdlowerlimit.innerHTML="&nbsp;&nbsp"+"规格下限"+"&nbsp;&nbsp"+datadetail.mdlowerlimit;
    mean.innerHTML="&nbsp;&nbsp"+"规格中心"+"&nbsp;&nbsp"+datadetail.mean;
    mdupperlimit.innerHTML="&nbsp;&nbsp"+"规格上限"+"&nbsp;&nbsp"+datadetail.mdupperlimit;
    mdtarget.innerHTML="&nbsp;&nbsp"+"样本均值"+"&nbsp;&nbsp"+datadetail.mdtarget;
    count.innerHTML="&nbsp;&nbsp"+"样本数量"+"&nbsp;&nbsp"+datadetail.count;
    sigma.innerHTML="&nbsp;&nbsp"+"标准差"+"&nbsp;&nbsp"+datadetail.sigma;
    pp.innerHTML="&nbsp;&nbsp"+"Pp"+"&nbsp;&nbsp"+datadetail.pp;
    ppk.innerHTML="&nbsp;&nbsp"+"Ppk"+"&nbsp;&nbsp"+datadetail.ppk;
    if(datadetail.stationid)
      title.innerHTML=chineseContrast+" "+datadetail.stationid;
    else title.innerHTML=chineseContrast;
    var instance=this;
    title.setAttribute("i",i+'');
    title.setAttribute("j",j+'');
    {
      title.addEventListener("click", function(event){
        instance.titleclick(event.currentTarget);
      });
    }
  }

  async initChartValuedown(echart:Element,i,j) {
    var datadetail=this.datadetail_debug[i][j];
    let chineseContrast=datadetail.tdname+" "+datadetail.mdname;

    this.echartnode=null;
    var mdlowerlimit=this.getNode(echart,"mdlowerlimit");
    this.echartnode=null;
    var mean=this.getNode(echart,"mean");
    this.echartnode=null;
    var mdupperlimit=this.getNode(echart,"mdupperlimit");
    this.echartnode=null;
    var mdtarget=this.getNode(echart,"mdtarget");
    this.echartnode=null;
    var count=this.getNode(echart,"count");
    this.echartnode=null;
    var sigma=this.getNode(echart,"sigma");
    this.echartnode=null;
    var pp=this.getNode(echart,"pp");
    this.echartnode=null;
    var ppk=this.getNode(echart,"ppk");
    this.echartnode=null;
    var title=this.getNode(echart,"title");
    mdlowerlimit.innerHTML="&nbsp;&nbsp"+"规格下限"+"&nbsp;&nbsp"+datadetail.mdlowerlimit;
    mean.innerHTML="&nbsp;&nbsp"+"规格中心"+"&nbsp;&nbsp"+datadetail.mean;
    mdupperlimit.innerHTML="&nbsp;&nbsp"+"规格上限"+"&nbsp;&nbsp"+datadetail.mdupperlimit;
    mdtarget.innerHTML="&nbsp;&nbsp"+"样本均值"+"&nbsp;&nbsp"+datadetail.mdtarget;
    count.innerHTML="&nbsp;&nbsp"+"样本数量"+"&nbsp;&nbsp"+datadetail.count;
    sigma.innerHTML="&nbsp;&nbsp"+"标准差"+"&nbsp;&nbsp"+datadetail.sigma;
    pp.innerHTML="&nbsp;&nbsp"+"Pp"+"&nbsp;&nbsp"+datadetail.pp;
    ppk.innerHTML="&nbsp;&nbsp"+"Ppk"+"&nbsp;&nbsp"+datadetail.ppk;

    title.innerHTML=chineseContrast;
  }

  async initCharts(element:Element,datadetail,type) {
      const markLineY = [];
  
      const ec = echarts as any;
      // var linechart=document.getElementById("lineChart");

      var maxy=0;
      for (var i = 0; i < datadetail.mdresult.length; i++)
      {
        if(datadetail.mdresult[i]>maxy) maxy=datadetail.mdresult[i];
      }
      // markLineY.push([{name: '规格下限' , yAxis: 0, xAxis: 0 , itemStyle: {normal: {color: '#ff9a9a'}}},
      // {name: '规格下限:', xAxis: 0 , yAxis: maxy, label: {show: true,textStyle: {fontSize: 12,fontWeight: "bolder"}}, itemStyle: {normal: {color: '#ff9a9a'}}}]);

      // markLineY.push([{name: '规格中心' , yAxis: 0, xAxis: datadetail.mdresult.length/2 , itemStyle: {normal: {color: '#7ac27b'}}},
      // {name: '规格中心:', xAxis: datadetail.mdresult.length/2 , yAxis: maxy, label: {show: true,textStyle: {fontSize: 12,fontWeight: "bolder"}}, itemStyle: {normal: {color: '#7ac27b'}}}]);
      
      // markLineY.push([{name: '规格上限' , yAxis: 0, xAxis: datadetail.mdresult.length-1 , itemStyle: {normal: {color: '#ff9a9a'}}},
      // {name: '规格上限:', xAxis: datadetail.mdresult.length-1 , yAxis: maxy, label: {show: true,textStyle: {fontSize: 12,fontWeight: "bolder"}}, itemStyle: {normal: {color: '#ff9a9a'}}}]);

      var datas = [{
          "data": {
              "stdplot": {
                  "xaxis": (datadetail.mdresult.toString()),
                  "yaxis": (datadetail.mdresult.toString()),
                  "mean": datadetail.mean,
                  "lower": datadetail.mdupperlimit,
                  "upper": datadetail.mdupperlimit,
                  "stdev": datadetail.sigma
              }
          },
          "idx": 1
      }];
      for (var i = 0; i < datas.length; i++)
      {
          var myChart = ec.init(element);
          if(type==="up")
            this.myChartGroup.push(myChart);
          else
            this.myChartGroup1.push(myChart);
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
          var top = (1 / Math.sqrt(2 * Math.PI) * stdev);
          var mar = this.getParam(low.toFixed(0).toString(), mean.toFixed(0).toString(), up.toFixed(0).toString(), top);
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
          myChart.setOption(option);
      }
  }

  onInput(value, type) {
    switch (type) {
      case 'model':
        this.modelFlteredOptions = Object.values(this.addModelGroup)
        .filter(option => option.toLowerCase().indexOf(value.toLowerCase()) === 0);
        break;
      case 'stage':
        this.stageFlteredOptions = Object.values(this.addStageGroup)
        .filter(option => option.toLowerCase().indexOf(value.toLowerCase()) === 0);
        break;
    }
  }
}
