import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FpyrApi, LINEApi, LINE, Fpyr } from '@service/dpm_sdk/sdk';
import { CommonService } from '@service/dpm_sdk/common.service';
import { PlantApi } from '@service/dfi-sdk';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'mp-model-fpyr-list',
  templateUrl: './model-fpyr-list.component.html',
  styleUrls: ['./model-fpyr-list.component.scss']
})
export class ModelFpyrListComponent implements OnInit {
  form: FormGroup;
  plants;
  mfgTypes = ['PCBA', 'FA'];
  models;
  status = ['all', 'miss-target', 'meet-target', 'no-target'];
  date;
  isVisible = false;
  options = [];
  viewOptions = [];
  isLoading: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private fpyrService: FpyrApi,
    private dpmService: CommonService,
    private lineService: LINEApi,
    private plantService: PlantApi
  ) { }

  ngOnInit() {
    // init form
    this.form = this.formBuilder.group({
      plant: [null, [Validators.required]],
      mfgType: [null, [Validators.required]],
      model: [null],
      status: [null],
      rangePicker: []
    });
    // get plant list
    this.plantService.find().subscribe(plants => this.plants = plants);
    // receive router params
    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.date = params['date'].split(',');
      }
      // set form values
      this.form.get('plant').setValue(params['plant']);
      this.form.get('mfgType').setValue(params['mfgType']);
      this.form.get('model').setValue(params['model']);
      this.form.get('status').setValue(params['status']);
      if (params['startDate'] && params['endDate']) {
        this.form.get('rangePicker').setValue([params['startDate'], params['endDate']]);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.form.valid) {
      this.query();
    }
  }

  query(): void {
    this.isLoading = true;
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    let dateFilter;
    if (this.form.value.rangePicker && this.form.value.rangePicker.length === 2) {
      const compareDay = moment(this.form.value.rangePicker[0]).diff(moment(this.form.value.rangePicker[1]), 'day');
      if (compareDay > 7) {
        this.isVisible = true;
        return;
      } else {
        dateFilter = { between: [moment(this.form.value.rangePicker[0]).format('YYYY-MM-DD'), moment(this.form.value.rangePicker[1]).format('YYYY-MM-DD')] };
      }
    } else if (this.date) {
      dateFilter = { inq: this.date };
    } else { }
    // set dpm api url by plant
    this.dpmService.setBaseUrl(this.form.value.plant);
    // get model fpyr
    const filter = {
      where: {
        plant: this.form.value.plant,
        mfgType: this.form.value.mfgType,
        trnDate: dateFilter
      },
      group: ['model']
    };
    const fpyr$ = this.fpyrService.find<Fpyr>(filter);
    // get target
    const line$ = this.lineService.findOne<LINE>({
      where: {
        plant: this.form.value.plant,
        mfgtype: this.form.value.mfgType === 'PCBA' ? 'PCB' : 'FA',
        line: '*'
      },
      include: {
        relation: 'targets',
        scope: {
          where: {
            kpiid: this.form.value.mfgType === 'PCBA' ? 'KPI0013' : 'KPI0014',
            yearmonth: moment().format('YYYYMM')
          },
          fields: ['id', 'plantid', 'kpiid', 'lineid', 'type', 'yearmonth', 'target']
        }
      }
    });
    // join
    forkJoin(fpyr$, line$).subscribe(([fpyr, line]) => {
      let target: number;
      if (line && line.targets.length === 0) {
        target = undefined;
      } else {
        target = Number((line.targets[0].target * 100).toFixed(2));
      }

      this.options = [];
      this.models = fpyr.map(data => data['model']).sort();
      fpyr.forEach((data: any) => {
        data.fpyr = Number((data.fpyr * 100).toFixed(2));
        data.target = target;
        data.result = [];
        data.subtext = (data.fpyr ? data.fpyr + '%' : 'N/A') + '\n' + '─────' + '\n' + (data.target ? data.target + '%' : 'N/A');
        if (data.fpyr > data.target) {
          data.status = 'meet-target';
          data.result.push({
            value: data.fpyr,
            itemStyle: {
              color: 'green'
            }
          });
        } else if (data.target > data.fpyr && data.fpyr >= 95) {
          data.status = 'miss-target';
          data.result.push({
            value: data.fpyr,
            itemStyle: {
              color: 'yellow'
            }
          });
          data.result.push({
            value: (data.target - data.fpyr).toFixed(2),
            itemStyle: {
              color: 'white'
            }
          });
        } else if (data.target > data.fpyr && data.fpyr < 95) {
          data.status = 'miss-target';
          data.result.push({
            value: data.fpyr,
            itemStyle: {
              color: 'red'
            }
          });
          data.result.push({
            value: (data.target - data.fpyr).toFixed(2),
            itemStyle: {
              color: 'white'
            }
          });
        } else {
          data.status = 'no-target';
          data.result.push({
            value: data.fpyr,
            itemStyle: {
              color: 'grey'
            }
          });
        }

        this.options.push(this.getOption(data));
      });
      // filter
      this.filter(this.form.value.model, this.form.value.status);
      this.isLoading = false;
    }, error => {
      console.log('error', error);
    });
  }

  filter(model: string, status: string): void {
    this.viewOptions = this.options
      .filter(option => model ? option.model === model : true)
      .filter(option => status === 'all' || status === null ? true : option.status === status);
  }

  onClickChartEvent(param) {
    let params = {
      plant: this.form.value.plant,
      mfgType: this.form.value.mfgType,
      model: param.title.text,
    };
    if (this.form.value.rangePicker && this.form.value.rangePicker.length === 2) {
      params['startDate'] = moment(this.form.value.rangePicker[0]).format('YYYY-MM-DD');
      params['endDate'] = moment(this.form.value.rangePicker[1]).format('YYYY-MM-DD');
    } else if (this.date && this.date.length > 0) {
      params['scheduleDates'] = this.date.join(',');
    } else { }
    this.router.navigate(['/dashboard/dfq/mp/yr-tracking'], { queryParams: params });
  }

  getOption(data): {} {
    return {
      model: data.model,
      status: data.status,
      backgroundColor: '#E5E5E5',
      title: {
        text: data.model,
        x: 'center',
        textStyle: {
          color: 'black'
        }
      },
      tooltip: {
        formatter: '{c}%'
      },
      series: {
        type: 'pie',
        center: ['50%', '58%'],
        radius: ['50%', '70%'],
        label: {
          show: true,
          position: 'center',
          formatter: data.subtext,
          fontWeight: 'bold',
          fontSize: 18,
          color: 'black'
        },
        data: data.result
      }
    };
  }

  disabledDate(current) {
    return current.getTime() + 24 * 60 * 60 * 1000 > Date.now();
  }

  handleCancel() {
    this.isVisible = false;
  }
}
