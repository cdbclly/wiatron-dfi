import { Directive, Input, TemplateRef, ViewContainerRef, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDfiPermissionShow]'
})
export class DfiPermissionDirective {
  @Input('appDfiPermissionShow')
  set appPermission(actionType) {
    if (actionType === 'show') { // 创建模板对应的内嵌视图
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (actionType === 'invisible') {
      this.viewContainer.clear();
    }
  }

  constructor(private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
    // this.user$ = this.authService
    //   .subscribe(res => {
    //     if (actionType === 'show') { // 创建模板对应的内嵌视图
    //       this.viewContainer.createEmbeddedView(this.templateRef);
    //     } else if (actionType === 'disable') {
    //       this.renderer.setAttribute(this.elementRef.nativeElement,
    //         'disabled', 'true');
    //     } else if (actionType === 'invisible') {
    //       this.viewContainer.clear();
    //     }
    //   });
  }

  // ngOnInit() {

  // }

  // ngOnDestroy() {
  //   this.user$.unsubscribe();
  // }

}
