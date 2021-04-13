export const environment = {
  isExtUser: false,
  enable: true,
  production: false,
  'DFCAPIURL': 'http://dfiqas.wistron.com:3015',
  'DFQ_API_URL': 'http://dfiqas.wistron.com:13016',
  'NUDD_API_URL': 'http://10.37.36.22:13017',
  'DFI_API_URL': 'http://10.37.36.22:13018',
  'PORTAL_API_URL': 'http://10.37.36.22:3002',
  'PORTAL_LOGIN_API': '/api/users/login',
  'SKYEYE_API_URL': 'http://10.37.36.22:13024',
  'RFI_ES_URL': 'http://10.37.36.106:9200/dfq/model-material-factor',
  'IMQM_API_URL': 'http://10.37.36.22:13029',
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
  'esNode': '10.66.24.101',
  'esPort': '9200',
  'esIndex': 'skyeye',
  'dfcStageShowPlant': [],
  DPM_API_URL: {
    F130: 'http://10.55.13.62:3003',
    F131: 'http://10.55.13.62:3003',
    F132: 'http://10.55.13.62:3003',
    F135: 'http://10.55.13.62:3003',
    F136: 'http://10.55.13.62:3003',
    F138: 'http://10.55.13.62:3003',
    F230: 'http://10.55.13.62:3003',
    F232: 'http://10.55.13.62:3003',
    F721: 'http://10.55.13.62:3003',
    F711: 'http://10.55.13.62:3003',
    F715: 'http://10.55.13.62:3003',
    F601: 'http://10.55.13.62:3003'
  },
  dpmIssueUrl: {
    F130: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F131: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F132: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F135: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F136: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F138: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F230: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F232: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F721: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F711: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F715: {
      PCBA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://qas-dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    }
  }
};
