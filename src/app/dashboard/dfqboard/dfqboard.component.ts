import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Subscription, } from 'rxjs';
@Component({
  selector: 'app-dfqboard',
  templateUrl: './dfqboard.component.html',
  styleUrls: ['./dfqboard.component.scss']
})
export class DfqboardComponent implements OnInit, AfterViewInit {
  @Input() floorLinkFlag;
  bgChartOptionsDFQC4 = [];
  bgChartOptionsDFQC5 = [];
  bgChartOptionsRfi = [];
  businessGroup: string;
  subscript: Subscription;
  siteMap: Map<string, Map<string, {}>>;
  plantMap: Map<string, Map<string, {}>>;
  lineGroup: Map<string, {}>;
  lineData;
  isLoading = true;
  isSkyeyeChart = false;
  skyeyeItemsParams = [];
  mpByPlant = [];
  mpPlants = [];
  mpTitleTexts = [];
  mpLines = [];
  mpTopValue = [];
  bgChartOptionsOnGoing = [];
  skyeyeOptionsOnGoing = [];
  skyeyeOptionsSite = []; // father
  skyeyeOptionsPlant = []; // child
  url: string;
  site: string;
  plant: string;
  C4s: {}[];
  C5s: {}[];
  echartSummaryrfi = [];
  echartSummarycx = [];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.businessGroup = this.route.snapshot.paramMap.get('bg');
    // Skyeye
    const mqttHost = JSON.parse(localStorage.getItem('mqtt_host'));
    const siteInfos = JSON.parse(localStorage.getItem('skyeye_site'));
    for (const site in siteInfos) {
      if (siteInfos.hasOwnProperty(site)) {
        const plants = siteInfos[site];
        plants.forEach(plant => {
          this.skyeyeItemsParams.push({ site: site.toUpperCase(), plant: plant.toUpperCase(), mqttHost: mqttHost[site] });
        });
      }
    }
    this.isLoading = false;
  }

  ngAfterViewInit() { }

  setEchartSummarycx(event) {
    this.echartSummarycx = event;

  }
  setEchartSummaryrfi(event) {
    this.echartSummaryrfi = event;
  }
}
