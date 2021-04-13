import { AfterViewInit, AfterContentInit, OnInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-benefit',
  templateUrl: './benefit.component.html',
  styleUrls: ['./benefit.component.scss']
})
export class BenefitComponent implements OnInit, AfterViewInit {
  @ViewChild('ife') ife: ElementRef; // @ViewChild通过模板变量名获取
  isLoading = true;
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.isLoading = false;
    const iframe = this.ife.nativeElement;
    // this.renderer.listen(iframe, 'onload', (event) => {
    //   console.log(event);
    // });
  }
  // const token = localStorage.getItem('$DFI$token');
  // iframe.contentWindow.postMessage(JSON.stringify(token), 'http://benefitevaluate.wks.wistron.com.cn');
  // console.log(iframe.contentWindow);
}
