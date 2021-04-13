export const environment = {
  isExtUser: false,
  enable: true,
  production: true,
  'DFCAPIURL': 'http://10.66.28.51:3015',
  'DFQ_API_URL': 'http://dfi.wks.wistron.com.cn/dfq',
  'NUDD_API_URL': 'http://dfi.wks.wistron.com.cn/mrr',
  'DFI_API_URL': 'http://dfi.wks.wistron.com.cn/dfi',
  'SKYEYE_API_URL': 'http://dfi.wks.wistron.com.cn/skyeye',
  'PORTAL_API_URL': 'http://10.66.28.51:3002',
  'PORTAL_LOGIN_API': '/api/users/login',
  'RFI_ES_URL': 'http://10.66.28.41:9200/dfq/model-material-factor',
  'IMQM_API_URL': 'http://dfi.wks.wistron.com.cn/imqm',
  'NUDD_IDBOOK_RECEIVER': {
    'WKS': 'MHQH00.wih.wistron@wistron.com;MHQ200.WKS.Wistron@wistron.com;MHQ100.WKS.Wistron@wistron.com',
    'WCD': 'MHQH00.wih.wistron@wistron.com;MHQ200.WKS.Wistron@wistron.com;MHQ100.WKS.Wistron@wistron.com',
    'WCQ': 'MHQH00.wih.wistron@wistron.com;MHQQ00.WCQ.Wistron@wistron.com',
    'WZS': 'MHQH00.wih.wistron@wistron.com;MHQZ00.WZS.Wistron@wistron.com'
  },
  'npiApi': {
    'WZS': 'http://10.41.20.56/NPIWebService/ExitMeetingService.asmx',
    'WCD': 'http://10.62.20.55/NPI_WebService/ExitMeetingService.asmx',
    'WKS': 'http://qis.wks.wistron.com.cn/NPI_WebService/ExitMeetingService.asmx',
    'WCQ': 'http://10.60.22.45/NPI_ExitMeetingService/ExitMeetingService.asmx'
  },
  'SKYEYE_DASHBOARD_SITE': {
    'WKS': ['F232', 'F230'],
    'WCD': ['F721'],
    'WCQ': ['F711', 'F715'],
  },
  'transferUrl': 'http://webap01.wks.wistron.com.cn:3010/ToSOAP',
  'dmcUrl': 'http://webap01.wks.wistron.com.cn:3010',
  'mqtt_host': {
    'WKS': '10.66.28.51',
    'WCD': '10.62.240.21',
    'WCQ': '10.60.40.91'
  },
  'mqtt_port': 9001,
  'mqtt_topics': {
    'machineInfo': '/cim/t1/famosAlert/',
    'realTimeTemperature': '/cim/t1/SkyI/temperature/'
  },
  'esNode': '10.66.28.41',
  'esPort': '9200',
  'esIndex': 'skyeye',
  'dfcStageShowPlant': [],
  DPM_API_URL: {
    F130: 'http://10.41.241.91:3000',
    F131: 'http://10.41.241.91:3000',
    F132: 'http://10.41.241.91:3009',
    F135: 'http://10.41.241.9:3002',
    F136: 'http://10.41.241.91:3003',
    F138: 'http://10.41.241.91:3009',
    F230: 'http://10.66.28.51:3000',
    F232: 'http://10.66.28.51:3026',
    F721: 'http://10.66.28.51:3011',
    F711: 'http://10.66.28.51:3021',
    F715: 'http://10.66.28.51:3023',
    F601: 'http://dpm-api-service-lb.wih-i40.10.37.66.1.k8sprd-whq.k8s.wistron.com'
  },
  dpmIssueUrl: {
    F130: {
      PCBA: 'http://dpmf130.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf130.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F131: {
      PCBA: 'http://dpmf131.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf131.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F132: {
      PCBA: 'http://dpmf132.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf132.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F135: {
      PCBA: 'http://dpmf135.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf135.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F136: {
      PCBA: 'http://dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf136.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F138: {
      PCBA: 'http://dpmf138.wzs.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf138.wzs.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F230: {
      PCBA: 'http://dpmf230.wks.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf230.wks.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F232: {
      PCBA: 'http://dpmf232.wks.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf232.wks.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F721: {
      PCBA: 'http://dpmf721.wcd.wistron.com.cn/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf721.wcd.wistron.com.cn/pages/kpi-actions/FPYR/FA'
    },
    F711: {
      PCBA: 'http://dpmf711.wcq.wistron.com/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf711.wcq.wistron.com/pages/kpi-actions/FPYR/FA'
    },
    F715: {
      PCBA: 'http://dpmf715.wcq.wistron.com/pages/kpi-actions/FPYR/PCB',
      FA: 'http://dpmf715.wcq.wistron.com/pages/kpi-actions/FPYR/FA'
    }
  }
};
