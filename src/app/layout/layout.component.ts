import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { YrGenerateService } from 'app/dfq/rfi/yr-generate/yr-generate.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit, OnDestroy {

  constructor(private yrService: YrGenerateService,
    private ref: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit() {
    window.dispatchEvent(new Event('resize'));
    document.body.className = 'skin-blue fixed sidebar-mini sidebar-mini-expand-feature';
    const div = this.ref.nativeElement.querySelector('#scroll');

    // 垂直滚动条显示隐藏
    this.yrService.scrollSub.subscribe(res => {
      if (res === 'lock') {
        this.renderer.setStyle(div, 'overflowY', 'hidden');
      } else {
        this.renderer.setStyle(div, 'overflowY', 'scroll');
      }
    });
  }

  ngOnDestroy(): void {
    document.body.className = '';
  }
}
