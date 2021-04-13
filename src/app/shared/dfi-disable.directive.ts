import { Directive, Input, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[appDfiDisable]'
})
export class DfiDisableDirective {

  @Input('appDfiDisable')
  isDisable: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer) {
    if (this.isDisable = 'disable') {
      this.renderer.setElementProperty(this.elementRef.nativeElement,
        'disabled', 'true');
    }
  }

}
