import { BaseES } from './../../dfq/skyeye/model/ES_Base';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EsDataServiceService {

  esBase: BaseES;
  constructor(private http: HttpClient) { }

  getUrl(esType, site?) {
    site = site === undefined ? '' : site;
    this.esBase = JSON.parse(localStorage.getItem('esItem'));
    // console.log(this.esBase);
    // this.esBase.esNode
    // '10.42.23.101'
    return 'http://' + this.esBase.esNode + ':' + this.esBase.esPort + '/' + this.esBase.esIndex + site + '_20*' + '/'
    + esType  + '_search';
  }

  getHighSpeedUrl(esType) {
    this.esBase = JSON.parse(localStorage.getItem('esItem'));
    return 'http://' + this.esBase.esNode + ':' + this.esBase.esPort + '/' +  esType  + '_search';
  }

  ES_DSL_Template(options, filter?, sort?, size?, aggs?) {
    return `{
      "query": {
        "bool": {
          "must":[
            ${options}
          ]
          ${filter}
        }
      }
      ${sort}
      ${size}
      ${aggs}
    }`;
  }

  getCPKSlidingOp(site, plant, date_range, size) {
    const queryClause = `{
      "from": 0,
  ${size},
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "site": "${site}"
          }
        },
        {
          "match": {
            "plant": "${plant}"
          }
        }
      ],
      "filter": {
        ${date_range}
      }
    }
  },
  "sort": {
    "stopdate": {
      "order": "desc"
    }
  }
    }`;
    return queryClause;
  }

  getQueryByCPKSliding(site, line, type, plant, model, upn, item, st, bt, daterange, size) {
    // console.log('查询语句参数 \n', upn)
    // console.log('查询语句参数 ### model \n', model)
    if (model === undefined || model === null) {
      model = 'NA';
    }
    if (model === 'undefined' || model === '') {
      model = 'NA';
    }
    if (upn === 'undefined') {
      upn = 'NA';
    }
    let queryClause;
    // if (model !== undefined && model !== null) {
    if (model !== 'NA' && upn !== 'NA') {
      queryClause = `{
        ${size},
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "site": "${site}"
            }
          },
          {
            "match": {
              "stationline": "${line}"
            }
          },
          {
            "match": {
              "stationtype": "${type}"
            }
          },
          {
            "match": {
              "plant": "${plant}"
            }
          },
          {
            "match_phrase": {
              "modelname": "${model}"
            }
          },
          {
            "match_phrase": {
              "upn": "${upn}"
            }
          },
          {
            "match": {
              "stationid.raw": "${item}"
            }
          },
          {
            "match_phrase": {
              "tdname": "${bt}"
            }
          },
          {
            "match_phrase": {
              "mdname": "${st}"
            }
          }
        ],
        "filter": {
          ${daterange}
        }
      }
    },
    "sort": {
      "stopdate": {
        "order": "desc"
      }
    }
      }`;
    } else if (model === 'NA' && upn !== 'NA') {
      queryClause = `{
        ${size},
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "site": "${site}"
            }
          },
          {
            "match": {
              "stationline": "${line}"
            }
          },
          {
            "match": {
              "stationtype": "${type}"
            }
          },
          {
            "match": {
              "plant": "${plant}"
            }
          },
          {
            "match_phrase": {
              "upn": "${upn}"
            }
          },
          {
            "match": {
              "stationid.raw": "${item}"
            }
          },
          {
            "match_phrase": {
              "tdname": "${bt}"
            }
          },
          {
            "match_phrase": {
              "mdname": "${st}"
            }
          }
        ],
        "filter": {
          ${daterange}
        }
      }
    },
    "sort": {
      "stopdate": {
        "order": "desc"
      }
    }
      }`;
    } else if (model !== 'NA' && upn === 'NA') {
      queryClause = `{
        ${size},
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "site": "${site}"
            }
          },
          {
            "match": {
              "stationline": "${line}"
            }
          },
          {
            "match": {
              "stationtype": "${type}"
            }
          },
          {
            "match": {
              "plant": "${plant}"
            }
          },
          {
            "match_phrase": {
              "modelname": "${model}"
            }
          },
          {
            "match": {
              "stationid.raw": "${item}"
            }
          },
          {
            "match_phrase": {
              "tdname": "${bt}"
            }
          },
          {
            "match_phrase": {
              "mdname": "${st}"
            }
          }
        ],
        "filter": {
          ${daterange}
        }
      }
    },
    "sort": {
      "stopdate": {
        "order": "desc"
      }
    }
      }`;
    } else {
      queryClause = `{
        ${size},
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "site": "${site}"
            }
          },
          {
            "match": {
              "stationline": "${line}"
            }
          },
          {
            "match": {
              "stationtype": "${type}"
            }
          },
          {
            "match": {
              "plant": "${plant}"
            }
          },
          {
            "match": {
              "stationid.raw": "${item}"
            }
          },
          {
            "match_phrase": {
              "tdname": "${bt}"
            }
          },
          {
            "match_phrase": {
              "mdname": "${st}"
            }
          }
        ],
        "filter": {
          ${daterange}
        }
      }
    },
    "sort": {
      "stopdate": {
        "order": "desc"
      }
    }
      }`;
    }
    return queryClause;
  }

  getCPKTumblingOp(site, plant, date_range, size) {
    const queryClause = `{
      ${size},
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "site": "${site}"
          }
        },
        {
          "match": {
            "plant": "${plant}"
          }
        }
      ],
      "filter": {
        ${date_range}
      }
    }
  },
  "sort": {
    "stopdate": {
      "order": "desc"
    }
  }
    }`;
    return queryClause;
  }

  getQueryByCPKTumbling(site, line, type, plant, model, upn, item, bt, st, date_range, size) {
    // console.log('查询语句参数 \n', upn)
    // console.log('查询语句参数 model \n', model)
    if (model === undefined || model === null) {
      model = 'NA';
    }
    if (model === 'undefined' || model === '') {
      model = 'NA';
    }
    if (upn === 'undefined') {
      upn = 'NA';
    }
    let queryClause;
    // if (model !== undefined && model !== null) {
  if (model !== 'NA' && upn !== 'NA') {
    queryClause = `{
      ${size},
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "site": "${site}"
          }
        },
        {
          "match": {
            "stationline": "${line}"
          }
        },
        {
          "match": {
            "stationtype": "${type}"
          }
        },
        {
          "match": {
            "plant": "${plant}"
          }
        },
        {
          "match_phrase": {
            "modelname": "${model}"
          }
        },
        {
          "match_phrase": {
            "upn": "${upn}"
          }
        },
        {
          "match": {
            "stationid.raw": "${item}"
          }
        },
        {
          "match_phrase": {
            "tdname": "${st}"
          }
        },
        {
          "match_phrase": {
            "mdname": "${bt}"
          }
        }
      ],
      "filter": {
        ${date_range}
      }
    }
  },
  "sort": {
    "stopdate": {
      "order": "desc"
    }
  }
    }`;
  } else if (model === 'NA' && upn !== 'NA') {
    queryClause = `{
      ${size},
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "site": "${site}"
          }
        },
        {
          "match": {
            "stationline": "${line}"
          }
        },
        {
          "match": {
            "stationtype": "${type}"
          }
        },
        {
          "match": {
            "plant": "${plant}"
          }
        },
        {
          "match_phrase": {
            "upn": "${upn}"
          }
        },
        {
          "match": {
            "stationid.raw": "${item}"
          }
        },
        {
          "match_phrase": {
            "tdname": "${st}"
          }
        },
        {
          "match_phrase": {
            "mdname": "${bt}"
          }
        }
      ],
      "filter": {
        ${date_range}
      }
    }
  },
  "sort": {
    "stopdate": {
      "order": "desc"
    }
  }
    }`;
  } else if (model !== 'NA' && upn === 'NA') {
    queryClause = `{
      ${size},
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "site": "${site}"
          }
        },
        {
          "match": {
            "stationline": "${line}"
          }
        },
        {
          "match": {
            "stationtype": "${type}"
          }
        },
        {
          "match": {
            "plant": "${plant}"
          }
        },
        {
          "match_phrase": {
            "modelname": "${model}"
          }
        },
        {
          "match": {
            "stationid.raw": "${item}"
          }
        },
        {
          "match_phrase": {
            "tdname": "${st}"
          }
        },
        {
          "match_phrase": {
            "mdname": "${bt}"
          }
        }
      ],
      "filter": {
        ${date_range}
      }
    }
  },
  "sort": {
    "stopdate": {
      "order": "desc"
    }
  }
    }`;
    } else {
      queryClause = `{
        ${size},
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "site": ${site}
            }
          },
          {
            "match": {
              "stationline": ${line}
            }
          },
          {
            "match": {
              "stationtype": ${type}
            }
          },
          {
            "match": {
              "plant": ${plant}
            }
          },
          {
            "match": {
              "stationid.raw": ${item}
            }
          },
          {
            "match_phrase": {
              "tdname": ${bt}
            }
          },
          {
            "match_phrase": {
              "mdname": ${st}
            }
          }
        ],
        "filter": {
          ${date_range}
        }
      }
    },
    "sort": {
      "stopdate": {
        "order": "desc"
      }
    }
      }`;
    }
    return queryClause;
  }

  getDefectLossOp(site, plant, date_range, size) {
    const queryClause = `{
      ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            }
          ],
          "filter": {
            ${date_range}
          }
        }
      },
      "sort": {
        "stopdate": {
          "order": "desc"
        }
      }
    }`;
    return queryClause;
  }

  getATETemperatureOP(site, plant, date_range, size) {
    const queryClause = `{
      ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            }
          ],
          "filter": {
            ${date_range}
          }
        }
      },
      "sort": {
        "executiontime": {
          "order": "desc"
        }
      }
    }`;
    return queryClause;
  }

  getDefectLoss(site, line, type, plant, model, daterange, size) {
    let queryClause;
    queryClause = `{
      ${size},
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "site": "${site}"
          }
        },
        {
          "match": {
            "stationline": "${line}"
          }
        },
        {
          "match": {
            "stationtype": "${type}"
          }
        },
        {
          "match": {
            "plant": "${plant}"
          }
        },
        {
          "match_phrase": {
            "modelname": "${model}"
          }
        }
      ],
      "filter": {
        ${daterange}
      }
    }
  },
  "sort": {
    "stopdate": {
      "order": "desc"
    }
  }
    }`;
    return queryClause;
  }

  getRetryRateOp(site, plant, date_range, size) {
    const queryClause = `{
      ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            }
          ],
          "filter": {
            ${date_range}
          }
        }
      },
      "sort": {
        "stopdate": {
          "order": "desc"
        }
      }
        }`;
        return queryClause;
  }



  getLightBarOp(site, plant, date_range, size) {
    const queryClause = `{
      ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            }
          ],
          "filter": {
            ${date_range}
          }
        }
      },
      "sort": {
        "stopdate": {
          "order": "desc"
        }
      }
        }`;
        return queryClause;
  }

  getCPKOffsetOp(site, plant) {
    const queryClause = `{
      "from":0,
      "size": 5000,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site.raw": "${site}"
              }
            },
            {
              "match": {
                "plant.raw": "${plant}"
              }
            }
          ]
        }
      }
    }`;
    return queryClause;
  }

  getCPKOffsetSupplementary(pn, station,size) {
    const queryClause = `{
      "from":0,
      ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "pn.raw": "${pn}"
              }
            },
            {
              "match": {
                "station.raw": "${station}"
              }
            }
          ]
        }
      }
    }`;
    return queryClause;
  }

  getqueryClause(site, plant,size) {
    const queryClause = `{
      "from":0,
      ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site.raw": "${site}"
              }
            },
            {
              "match": {
                "plant.raw": "${plant}"
              }
            }
          ]
        }
      }
    }`;
    return queryClause;
  }

  getCPKOffsetOp1(site, plant,model,upn,stationtype,from,to) {
    const queryClause = `{
      "from":0,
      "size": 5000,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site.raw": "${site}"
              }
            },
            {
              "match": {
                "plant.raw": "${plant}"
              }
            },
            {
              "match": {
                "modelname.raw": "${model}"
              }
            },
            {
              "match": {
                "upn.raw": "${upn}"
              }
            },
            {
              "match": {
                "stationtype.raw": "${stationtype}"
              }
            }
          ],
          "filter": {
            "range": {
              "executiontime": {
                "from": ${from},
                "to": ${to},
                "include_lower": true,
                "include_upper": true
              }
            }
          }
        }
      }
    }`;
    return queryClause;
  }

  getCPKOffsetDebug(site, plant,model,upn,stationtype) {
    const queryClause = `{
      "from":0,
      "size": 5000,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site.raw": "${site}"
              }
            },
            {
              "match": {
                "plant.raw": "${plant}"
              }
            },
            {
              "match": {
                "modelname.raw": "${model}"
              }
            },
            {
              "match": {
                "upn.raw": "${upn}"
              }
            },
            {
              "match": {
                "stationtype.raw": "${stationtype}"
              }
            }
          ]
        }
      }
    }`;
    return queryClause;
  }

  getWCQlsjSPCqueryClause(site, plant,line,MachineModel,MachineSN,monitorpro,stance) {
    const queryClause = `{
      "from":0,
      "size": 5000,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site.raw": "${site}"
              }
            },
            {
              "match": {
                "plant.raw": "${plant}"
              }
            },
            {
              "match": {
                "Line.raw": "${line}"
              }
            },
            {
              "match": {
                "MachineModel.raw": "${MachineModel}"
              }
            },
            {
              "match": {
                "MachineSN.raw": "${MachineSN}"
              }
            },
            {
              "match": {
                "monitorpro.raw": "${monitorpro}"
              }
            },
            {
              "match": {
                "stance.raw": "${stance}"
              }
            }
          ]
        }
      }
    }`;
    return queryClause;
  }

  getWCQlsjCPKqueryClause(site, plant,line,MachineModel,MachineSN,monitorpro,stance,model) {
    const queryClause = `{
      "from":0,
      "size": 5000,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site.raw": "${site}"
              }
            },
            {
              "match": {
                "plant.raw": "${plant}"
              }
            },
            {
              "match": {
                "Line.raw": "${line}"
              }
            },
            {
              "match": {
                "MachineModel.raw": "${MachineModel}"
              }
            },
            {
              "match": {
                "MachineSN.raw": "${MachineSN}"
              }
            },
            {
              "match": {
                "monitorpro.raw": "${monitorpro}"
              }
            },
            {
              "match": {
                "stance.raw": "${stance}"
              }
            },
            {
              "match": {
                "Model.raw": "${model}"
              }
            }
          ]
        }
      }
    }`;
    return queryClause;
  }

  getCPKOffsetOp2(site, plant,model,stationline,stationtype,mdname,tdname,machinemodel) {
    const queryClause = `{
      "from":0,
      "size": 5000,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site.raw": "${site}"
              }
            },
            {
              "match": {
                "plant.raw": "${plant}"
              }
            },
            {
              "match": {
                "modelname.raw": "${model}"
              }
            },
            {
              "match": {
                "stationline.raw": "${stationline}"
              }
            },
            {
              "match": {
                "stationtype.raw": "${stationtype}"
              }
            },
            {
              "match": {
                "mdname.raw": "${mdname}"
              }
            },
            {
              "match": {
                "tdname.raw": "${tdname}"
              }
            },
            {
              "match": {
                "machinemodel.raw": "${machinemodel}"
              }
            }
          ]
        }
      }
    }`;
    return queryClause;
  }


  getRetryRateQuerys(site, line, type, plant, upn, model, item, daterange, size) {
    let queryClause;
    // item !== undefined && item !== null
    if (item === 'undefined' || item === '') {
      item = 'NA';
    }
    if (item === undefined || item === null) {
      item = 'NA';
    }
    if (upn === 'undefined') {
      upn = 'NA';
    }
    if (item !== 'NA' && upn !== 'NA') {
      queryClause = `{
        ${size},
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "site": "${site}"
                }
              },
              {
                "match": {
                  "stationline": "${line}"
                }
              },
              {
                "match": {
                  "stationtype": "${type}"
                }
              },
              {
                "match": {
                  "plant": "${plant}"
                }
              },
              {
                "match_phrase": {
                  "upn": "${upn}"
                }
              },
              {
                "match_phrase": {
                  "modelname": "${model}"
                }
              },
              {
                "match": {
                  "stationid.raw": "${item}"
                }
              }
            ],
            "filter": {
              ${daterange}
            }
          }
        },
        "sort": {
          "stopdate": {
            "order": "desc"
          }
        }
          }`;
    } else if (item === 'NA' && upn !== 'NA') {
      queryClause = `{
        ${size},
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "site": "${site}"
                }
              },
              {
                "match": {
                  "stationline": "${line}"
                }
              },
              {
                "match": {
                  "stationtype": "${type}"
                }
              },
              {
                "match": {
                  "plant": "${plant}"
                }
              },
              {
                "match_phrase": {
                  "upn": "${upn}"
                }
              },
              {
                "match_phrase": {
                  "modelname": "${model}"
                }
              }
            ],
            "filter": {
              ${daterange}
            }
          }
        },
        "sort": {
          "stopdate": {
            "order": "desc"
          }
        }
          }`;
    }  else if (item !== 'NA' && upn === 'NA') {




       queryClause = `{
        ${size},
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "site": "${site}"
                }
              },
              {
                "match": {
                  "stationline": "${line}"
                }
              },
              {
                "match": {
                  "stationtype": "${type}"
                }
              },
              {
                "match": {
                  "plant": "${plant}"
                }
              },
              {
                "match_phrase": {
                  "stationid.raw": "${item}"
                }
              },
              {
                "match_phrase": {
                  "modelname": "${model}"
                }
              }
            ],
            "filter": {
              ${daterange}
            }
          }
        },
        "sort": {
          "stopdate": {
            "order": "desc"
          }
        }
          }`;
    } else {
      queryClause = `{
        ${size},
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "site": "${site}"
                }
              },
              {
                "match": {
                  "stationline": "${line}"
                }
              },
              {
                "match": {
                  "stationtype": "${type}"
                }
              },
              {
                "match": {
                  "plant": "${plant}"
                }
              },
              {
                "match_phrase": {
                  "modelname": "${model}"
                }
              }
            ],
            "filter": {
              ${daterange}
            }
          }
        },
        "sort": {
          "stopdate": {
            "order": "desc"
          }
        }
          }`;
    }
      return queryClause;
  }

  getTestTimeOp(site, plant, date_range, size) {
    const queryClause = `{
      "size": 500,
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            }
          ],
          "filter": {
            ${date_range}
          }
        }
      },
      "sort": {
        "stopdate": {
          "order": "desc"
        }
      }
}`;
return queryClause;
  }



  getTestTimeQuerys(site, line, type, plant, cur_model, item , upn, daterange, size, extended_bounds) {
    console.log(cur_model);
    let queryClause;




    if (item === 'undefined' || item === '') {
      item = 'NA';
    }
    if (item === undefined || item === null) {
      item = 'NA';
    }
    if (upn === 'undefined') {
      upn = 'NA';
    }



    if (item !== 'NA' && upn !== 'NA') {
      queryClause = `{
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "site": "${site}"
                }
              },
              {
                "match": {
                  "stationline": "${line}"
                }
              },
              {
                "match": {
                  "stationtype": "${type}"
                }
              },
              {
                "match_phrase": {
                  "modelname": "${cur_model}"
                }
              },
              {
                "match": {
                  "plant": "${plant}"
                }
              },
              {
                "match_phrase": {
                  "upn": "${upn}"
                }
              },
              {
                "match": {
                  "stationid.raw": "${item}"
                }
              }
            ],
            "filter": {
              ${daterange}
            }
          }
        },
        "sort": {
          "stopdate": {
            "order": "desc"
          }
        },
        "size": 0,
        "aggs": {
          "sales_over_time": {
            "date_histogram": {
              "field": "stopdate",
              "interval": "30m",
              "min_doc_count": 0,
              ${extended_bounds},
              "time_zone": "+08:00"
            },
            "aggs": {
              "TopHits": {
                "top_hits": {
                  "sort": [
                    {
                      "stopdate": {
                        "order": "desc"
                      }
                    }
                  ],
                  ${size}
                }
              }
            }
          }
    }
  }`;
    } else if (item !== 'NA' && upn === 'NA') {
      queryClause = `{
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "site": "${site}"
                }
              },
              {
                "match": {
                  "stationline": "${line}"
                }
              },
              {
                "match": {
                  "stationtype": "${type}"
                }
              },
              {
                "match_phrase": {
                  "modelname": "${cur_model}"
                }
              },
              {
                "match": {
                  "plant": "${plant}"
                }
              },
              {
                "match": {
                  "stationid.raw": "${item}"
                }
              }
            ],
            "filter": {
              ${daterange}
            }
          }
        },
        "sort": {
          "stopdate": {
            "order": "desc"
          }
        },
        "size": 0,
        "aggs": {
          "sales_over_time": {
            "date_histogram": {
              "field": "stopdate",
              "interval": "30m",
              "min_doc_count": 0,
              ${extended_bounds},
              "time_zone": "+08:00"
            },
            "aggs": {
              "TopHits": {
                "top_hits": {
                  "sort": [
                    {
                      "stopdate": {
                        "order": "desc"
                      }
                    }
                  ],
                  ${size}
                }
              }
            }
          }
    }
  }`;
    } else if (item === 'NA' && upn !== 'NA') {
      queryClause = `{
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "site": "${site}"
                }
              },
              {
                "match": {
                  "stationline": "${line}"
                }
              },
              {
                "match": {
                  "stationtype": "${type}"
                }
              },
              {
                "match_phrase": {
                  "modelname": "${cur_model}"
                }
              },
              {
                "match": {
                  "plant": "${plant}"
                }
              },
              {
                "match_phrase": {
                  "upn": "${upn}"
                }
              }
            ],
            "filter": {
              ${daterange}
            }
          }
        },
        "sort": {
          "stopdate": {
            "order": "desc"
          }
        },
        "size": 0,
        "aggs": {
          "sales_over_time": {
            "date_histogram": {
              "field": "stopdate",
              "interval": "30m",
              "min_doc_count": 0,
              ${extended_bounds},
              "time_zone": "+08:00"
            },
            "aggs": {
              "TopHits": {
                "top_hits": {
                  "sort": [
                    {
                      "stopdate": {
                        "order": "desc"
                      }
                    }
                  ],
                  ${size}
                }
              }
            }
          }
    }
  }`;
    } else {
      queryClause = `{
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "site": "${site}"
                }
              },
              {
                "match": {
                  "stationline": "${line}"
                }
              },
              {
                "match": {
                  "stationtype": "${type}"
                }
              },
              {
                "match_phrase": {
                  "modelname": "${cur_model}"
                }
              },
              {
                "match": {
                  "plant": "${plant}"
                }
              }
            ],
            "filter": {
              "range": {
               ${daterange}
            }
          }
        },
        "sort": {
          "stopdate": {
            "order": "desc"
          }
        },
        "size": 0,
        "aggs": {
          "sales_over_time": {
            "date_histogram": {
              "field": "stopdate",
              "interval": "30m",
              "min_doc_count": 0,
              ${extended_bounds},
              "time_zone": "+08:00"
            },
            "aggs": {
              "TopHits": {
                "top_hits": {
                  "sort": [
                    {
                      "stopdate": {
                        "order": "desc"
                      }
                    }
                  ],
                  ${size}
                }
              }
            }
          }
    }
  }`;
    }
      return queryClause;
  }

  postData(posturl: string, params) {

    const header = new HttpHeaders();

    header.append('Content-Type', 'application/json; charset=UTF-8');

    return this.http.post(
      posturl,
      params,
      { headers: header }
    );
  }

  postData1(posturl: string, params) {

    const header = new HttpHeaders();

    header.append('Content-Type', 'application/json; charset=UTF-8');

    this.http.post(
      posturl,
      params,
      { headers: header }
    );
  }

// assy fixturecpk es查询
  getFAcpkOp(site, plant, date_range, size) {
    const queryClause = `{
      "from": 0,
      ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            }
          ],
          "filter": {
            ${date_range}
          }
        }
      },
      "sort": {
        "executiontime": {
          "order": "desc"
        }
      }
    }`;
    return queryClause;
  }


  // assy fixturecpk es查询
  getYieldRateOp(site, plant, date_range, size) {
    const queryClause = `{
      "from": 0,
      ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            }
          ],
          "filter": {
            ${date_range}
          }
        }
      },
      "sort": {
        "executiontime": {
          "order": "desc"
        }
      }
    }`;
    return queryClause;
  }


  // 良率 折线 echart数据
  getYieldRate(site, line, type, plant, model, machineModel, item, daterange, size) {
    let queryClause;
    if (model !== undefined && model !== null) {
      if (item !== undefined && item !== null && item !== '') {
        queryClause = `{
          ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "line": "${line}"
              }
            },
            {
              "match": {
                "MachineStation": "${type}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            },
            {
              "match_phrase": {
                "Model": "${model}"
              }
            },
            {
              "match": {
                "MachineModel": "${machineModel}"
              }
            },
            {
              "match_phrase": {
                "MachineSN": "${item}"
              }
            }
          ],
          "filter": {
            ${daterange}
          }
        }
      },
      "sort": {
        "executiontime": {
          "order": "desc"
        }
      }
        }`;
      } else {
        queryClause = `{
          ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "line": "${line}"
              }
            },
            {
              "match": {
                "MachineStation": "${type}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            },
            {
              "match_phrase": {
                "Model": "${model}"
              }
            }
          ],
          "filter": {
            ${daterange}
          }
        }
      },
      "sort": {
        "executiontime": {
          "order": "desc"
        }
      }
        }`;
      }
    } else {
      queryClause = `{
        ${size},
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "site": "${site}"
            }
          },
          {
            "match": {
              "line": "${line}"
            }
          },
          {
            "match_phrase": {
              "MachineStation": "${type}"
            }
          },
          {
            "match": {
              "plant": "${plant}"
            }
          }
        ],
        "filter": {
          ${daterange}
        }
      }
    },
    "sort": {
      "executiontime": {
        "order": "desc"
      }
    }
      }`;
    }
    return queryClause;
  }



  // 良率 柱状 echart数据
  getYieldRateColumn(site, line, type, plant, model, machineModel, item, daterange, size) {
    let queryClause;
    if (model !== undefined && model !== null) {
        queryClause = `{
          ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "line": "${line}"
              }
            },
            {
              "match": {
                "MachineStation": "${type}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            },
            {
              "match_phrase": {
                "Model": "${model}"
              }
            },
            {
              "match_phrase": {
                "MachineModel": "${machineModel}"
              }
            },
            {
              "match_phrase": {
                "MachineSN": "${item}"
              }
            }
          ],
          "filter": {
            ${daterange}
          }
        }
      },
      "sort": {
        "executiontime": {
          "order": "desc"
        }
      }
        }`;
    } else {
      queryClause = `{
        ${size},
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "site": "${site}"
            }
          },
          {
            "match": {
              "line": "${line}"
            }
          },
          {
            "match_phrase": {
              "MachineStation": "${type}"
            }
          },
          {
            "match": {
              "plant": "${plant}"
            }
          }
        ],
        "filter": {
          ${daterange}
        }
      }
    },
    "sort": {
      "executiontime": {
        "order": "desc"
      }
    }
      }`;
    }
    return queryClause;
  }




  getFaRetryRateQuerys(site, line, type, plant, model, machineModel, item, daterange, size) {
    let queryClause;
    // console.log(item);
    if (item !== undefined && item !== null) {
      queryClause = `{
        ${size},
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "site": "${site}"
                }
              },
              {
                "match": {
                  "line": "${line}"
                }
              },
              {
                "match": {
                  "MachineStation": "${type}"
                }
              },
              {
                "match": {
                  "plant": "${plant}"
                }
              },
              {
                "match_phrase": {
                  "Model": "${model}"
                }
              },

              {
                "match_phrase": {
                  "MachineModel": "${machineModel}"
                }
              },

              {
                "match": {
                  "MachineSN": "${item}"
                }
              }
            ],
            "filter": {
              ${daterange}
            }
          }
        },
        "sort": {
          "executiontime": {
            "order": "desc"
          }
        }
          }`;
    } else {
      queryClause = `{
        ${size},
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "site": "${site}"
                }
              },
              {
                "match": {
                  "line": "${line}"
                }
              },
              {
                "match": {
                  "MachineStation": "${type}"
                }
              },
              {
                "match": {
                  "plant": "${plant}"
                }
              },
              {
                "match_phrase": {
                  "Model": "${model}"
                }
              },

              {
                "match_phrase": {
                  "MachineModel": "${machineModel}"
                }
              },
            ],
            "filter": {
              ${daterange}
            }
          }
        },
        "sort": {
          "executiontime": {
            "order": "desc"
          }
        }
          }`;
    }
      return queryClause;
  }




  getQueryByFACPKSliding(site, line, type, plant, model, machineModel, item, st, bt, daterange, size) {
    let queryClause;
    if (model !== undefined && model !== null) {
      queryClause = `{
        ${size},
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "site": "${site}"
            }
          },
          {
            "match": {
              "line": "${line}"
            }
          },
          {
            "match": {
              "MachineStation": "${type}"
            }
          },
          {
            "match": {
              "plant": "${plant}"
            }
          },
          {
            "match_phrase": {
              "Model": "${model}"
            }
          },
          {
            "match_phrase": {
              "MachineModel": "${machineModel}"
            }
          },
          {
            "match_phrase": {
              "MachineSN": "${item}"
            }
          },
          {
            "match_phrase": {
              "tdname": "${bt}"
            }
          },
          {
            "match_phrase": {
              "mdname": "${st}"
            }
          }
        ],
        "filter": {
          ${daterange}
        }
      }
    },
    "sort": {
      "executiontime": {
        "order": "desc"
      }
    }
      }`;
    } else {
      queryClause = `{
        ${size},
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "site": "${site}"
            }
          },
          {
            "match": {
              "line": "${line}"
            }
          },
          {
            "match": {
              "MachineStation": "${type}"
            }
          },
          {
            "match": {
              "plant": "${plant}"
            }
          },
          {
            "match": {
              "MachineModel": "${machineModel}"
            }
          },
          {
            "match": {
              "MachineSN": "${item}"
            }
          },
          {
            "match_phrase": {
              "tdname": "${bt}"
            }
          },
          {
            "match_phrase": {
              "mdname": "${st}"
            }
          }
        ],
        "filter": {
          ${daterange}
        }
      }
    },
    "sort": {
      "executiontime": {
        "order": "desc"
      }
    }
      }`;
    }
    return queryClause;
  }



  getQueryByLightBar(site, plant, line, mdname, model, item, daterange, size) {
    // item = '00001","00002';
    let queryClause;
    queryClause = `{
      ${size},
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "site": "${site}"
          }
        },
        {
          "match": {
            "plant": "${plant}"
          }
        },
        {
          "match": {
            "stationline": "${line}"
          }
        },
        {
          "match": {
            "stationtype": "${mdname}"
          }
        },
        {
          "match": {
            "modelname": "${model}"
          }
        },
        {
          "terms": {
            "stationid.raw": ["${item}"]
          }
        }
      ],
      "filter": {
        ${daterange}
      }
    }
  },
  "sort": {
    "insertdt": {
      "order": "desc"
    }
  }
    }`;
    return queryClause;
  }

  // assy fixturecpk es查询
  getPPKRealTimeOp(site, plant, date_range, size) {
    const queryClause = `{
      "from": 0,
      ${size},
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "site": "${site}"
              }
            },
            {
              "match": {
                "plant": "${plant}"
              }
            }
          ],
          "filter": {
            ${date_range}
          }
        }
      },
      "sort": {
        "executiontime": {
          "order": "desc"
        }
      }
    }`;
    return queryClause;
  }

  getQueryByPPKRealTime(site, plant, line, stage, model, daterange, size) {
    let queryClause;
    queryClause = `{
      ${size},
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "site": "${site}"
          }
        },
        {
          "match": {
            "plant": "${plant}"
          }
        },
        {
          "match": {
            "stationline": "${line}"
          }
        },
        {
          "match": {
            "stationtype": "${stage}"
          }
        },
        {
          "match": {
            "modelname": "${model}"
          }
        }
      ],
      "filter": {
        ${daterange}
      }
    }
  },
  "sort": {
    "executiontime": {
      "order": "desc"
    }
  }
    }`;
    return queryClause;
  }


  getQueryBySPC(site, plant, line, stage, model, tdname, mdname, daterange, size) {
    let queryClause;
    queryClause = `{
      ${size},
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "site": "${site}"
          }
        },
        {
          "match": {
            "plant": "${plant}"
          }
        },
        {
          "match": {
            "stationline": "${line}"
          }
        },
        {
          "match": {
            "stationtype": "${stage}"
          }
        },
        {
          "match": {
            "modelname": "${model}"
          }
        },
        {
          "match": {
            "tdname": "${tdname}"
          }
        },
        {
          "terms": {
            "mdname.raw": ["${mdname}"]
          }
        }
      ],
      "filter": {
        ${daterange}
      }
    }
  },
  "sort": {
    "executiontime": {
      "order": "desc"
    }
  }
    }`;
    return queryClause;
  }


  getSpeedHighMachine(daterange, size) {
    let queryClause;
    queryClause = `{
      ${size},
  "query": {
    "bool": {
      "filter": {
        ${daterange}
      }
    }
  },
  "sort": {
    "evt_dt": {
      "order": "desc"
    }
  }
    }`;
    return queryClause;
  }

  getHighSpeedEcharts(evt_pid, line, stage, daterange, size) {
    let queryClause;
    queryClause = `{
      ${size},
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "machineName.raw": "${evt_pid}"
          }
        },
        {
          "match": {
            "line.raw": "${line}"
          }
        },
        {
          "match": {
            "stage.raw": "${stage}"
          }
        }
      ],
      "filter": [${daterange}]
    }
  },
  "sort": {
    "evt_dt": {
      "order": "desc"
    }
  }
    }`;
    return queryClause;
  }
}
