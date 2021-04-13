import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpUrlEncodingCodec } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

  constructor(private http: HttpClient) { }

  url = localStorage.getItem('dmcUrl');
  // picFunURL = localStorage.getItem('dmcUrl') ;
  urlEncode: HttpUrlEncodingCodec = new HttpUrlEncodingCodec();
  // header = new

  getDefaultPICFun() {
    const query = {
      'where': {
        'and': [
          {'picName': {
            'neq': null
          }},
          {'picDepartment': {
            'neq': null
          }}
        ]
      },
      'order': 'warningTime DESC'
    };
    // let url = this.url + '/api/DmcPiclists?filter=' + JSON.stringify(query);
    let url = this.url + '/api/DmcIssues?filter=' + JSON.stringify(query);
    this.urlEncode.encodeKey('utf-8');
    url = this.urlEncode.encodeValue(url);
    return this.http.get(url, {headers: new HttpHeaders().set('Accept', 'application/json')}).toPromise();
  }

  getPICDetail(pic, datefrom, dateto) {
    const query = {
      'where': {
        'and': [
          {'pic': pic},
          {'and': [
            {'warningTime': {'gte': datefrom}},
            {'warningTime': {'lte': dateto}}
          ]}
        ]
      },
      'order': 'warningTime DESC'
    };
    let url = this.url + '/api/DmcIssues?filter=' + JSON.stringify(query);
    console.log(JSON.stringify(query));
    this.urlEncode.encodeKey('utf-8');
    url = this.urlEncode.encodeValue(url);
    return this.http.get(url, {headers: new HttpHeaders().set('Accept', 'application/json')}).toPromise();
  }

  getTotalIssue(datefrom, dateto) {
    const query = {
      'where': {
        'and': [
          {'picName': {
            'neq': null
          }},
          {'picDepartment': {
            'neq': null
          }},
          {'and': [
            {'warningTime': {'gte': datefrom}},
            {'warningTime': {'lte': dateto}}
          ]}
        ]
      },
      'order': 'warningTime DESC'
    };
    let url = this.url + '/api/DmcIssues?filter=' + JSON.stringify(query);
    console.log(url);
    this.urlEncode.encodeKey('utf-8');
    url = this.urlEncode.encodeValue(url);
    return this.http.get(url, {headers: new HttpHeaders().set('Accept', 'application/json')}).toPromise();
  }

  getStatusCode(site, plant, line, stage) {
    const query = {
      'where': {
        or: [{
          'and': [
            {'evtvalue2': line},
            {'plant': plant},
            {'System': site},
            {'evtvalue4': stage},
            {'toDMC': 1},
            {'alertType': 0},
            {'eventId': {
              'inq': ['QMCPK001', 'QMTIME001', 'QMFAIL001', 'QMRETRY001', 'QMATE001', 'QMYR001', 'QMCPK003', 'QMRR001', 'QMLIBAR001']
            }}
          ]
        },
        {
          'and': [
            {'evtvalue2': line},
            {'plant': plant},
            {'System': site},
            {'evtvalue5': stage},
            {'toDMC': 1},
            {'alertType': 0},
            {'eventId': {
              'inq': ['QMCPK001', 'QMTIME001', 'QMFAIL001', 'QMRETRY001', 'QMATE001', 'QMYR001', 'QMCPK003', 'QMRR001', 'QMLIBAR001']
            }}
          ]
        }]
      },
      'order': 'STime DESC'
    };
    let url = this.url + '/api/DmcEvents?filter=' + JSON.stringify(query);
    console.log(url);
    this.urlEncode.encodeKey('utf-8');
    url = this.urlEncode.encodeValue(url);
    return this.http.get(url, {headers: new HttpHeaders().set('Accept', 'application/json')}).toPromise();
  }

  public groupBy(data, key) {
    return data.reduce(function(total, current) {
    (total[current[key]] = total[current[key]] || []).push(current);
    return total;
    }, {});
    }
}
