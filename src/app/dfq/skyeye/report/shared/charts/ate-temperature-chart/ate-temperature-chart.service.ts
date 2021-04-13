import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AteTemperatureChartService {

  constructor() { }

  getATETemperature(site, line, type, plant, daterange, size) {
    const queryClause = `{
      "size": 0,
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
                "stationtype": "${type}"
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
      },
      "aggs": {
        "fixIdGroup": {
          "terms": {
            "field": "stationid.raw"
          },
          "aggs": {
            "TopHits": {
              "top_hits": {
                ${size},
                "sort": {
                  "executiontime": {
                    "order": "desc"
                  }
                }
              }
            }
          }
        }
      }
    }`;
    return queryClause;
  }
}
