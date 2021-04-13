export const environment = {
  enable: false, // false: config ,true: environment
  production: false, // build上服务器设定为true
  'DFCAPIURL': 'http://10.37.36.105:3015',
  'DFQ_API_URL': 'http://10.37.36.105:3003',
  'NUDD_API_URL': 'http://10.37.36.105:13017',
  'DFI_API_URL': 'http://10.37.36.105:13018',
  'PORTAL_API_URL': 'http://10.37.36.105:3002',
  'SKYEYE_API_URL': 'http://10.37.36.105:13024',
  'PORTAL_LOGIN_API': '/api/users/login',
  'RFI_ES_URL': 'http://10.37.36.106:9200/dfq/model-material-factor',
  'IMQM_API_URL': 'http://10.37.36.105:13029',
  'NUDD_IDBOOK_RECEIVER': {
    'WKS': '',
    'WCD': '',
    'WCQ': '',
    'WZS': ''
  },
  'npiApi': {
    'WZS': 'http://10.41.16.183:80/NPIWebService/ExitMeetingService.asmx',
    'WCD': 'http://10.62.20.55:8080/NPI_WebService/ExitMeetingService.asmx',
    'WKS': 'http://10.42.23.11/NPI_WebService/ExitMeetingService.asmx',
    'WCQ': 'http://10.60.22.44/NPIWebService/ExitMeetingService.asmx'
  },
  'SKYEYE_DASHBOARD_SITE': {
    'WKS': ['F232', 'F230'],
    'WCD': ['F721'],
    'WCQ': ['F711', 'F715'],
    'WSH': ['F232', 'F230'],
  },
  'transferUrl': 'http://webap01.wks.wistron.com.cn:3010/ToSOAP',
  'dmcUrl': 'http://webap01.wks.wistron.com.cn:3010',
  'mqtt_host': {
    'WKS': '10.42.23.113',
    'WCD': '10.62.240.21',
    'WCQ': '10.60.40.91'
  },
  'mqtt_port': 9001,
  'mqtt_topics': {
    'machineInfo': '/cim/t1/famosAlert/',
    'realTimeTemperature': '/cim/t1/SkyI/temperature/'
  },
  'esNode': '10.42.23.101',
  'esPort': '9200',
  'esIndex': 'skyeye',
  'dfcStageShowPlant': [],
  DPM_API_URL: {
    F130: 'http://10.55.13.61:3000',
    F131: 'http://10.55.13.61:3000',
    F132: 'http://10.55.13.61:3000',
    F135: 'http://10.55.13.61:3000',
    F136: 'http://10.55.13.61:3000',
    F138: 'http://10.55.13.61:3000',
    F230: 'http://10.55.13.61:3000',
    F232: 'http://10.55.13.61:3000',
    F721: 'http://10.55.13.61:3000',
    F711: 'http://10.55.13.61:3000',
    F715: 'http://10.55.13.61:3000',
    F601: 'http://10.55.13.61:3000'
  },
  dpmIssueUrl: {
    F130: {
      PCBA: 'http://dev-dpmf130.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf130.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F131: {
      PCBA: 'http://dev-dpmf131.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf131.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F132: {
      PCBA: 'http://dev-dpmf132.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf132.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F135: {
      PCBA: 'http://dev-dpmf135.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf135.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F136: {
      PCBA: 'http://dev-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F138: {
      PCBA: 'http://dev-dpmf138.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf138.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F230: {
      PCBA: 'http://dev-dpmf230.wks.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf230.wks.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F232: {
      PCBA: 'http://dev-dpmf232.wks.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf232.wks.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F721: {
      PCBA: 'http://dev-dpmf721.wcd.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf721.wcd.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F711: {
      PCBA: 'http://dev-dpmf711.wcq.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf711.wcq.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F715: {
      PCBA: 'http://dev-dpmf715.wcq.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dev-dpmf715.wcq.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    }
  }
};


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
