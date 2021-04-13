import { Pipe, PipeTransform } from '@angular/core';
import { ModelTypeMappingApi } from '@service/dfc_sdk/sdk';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'newmodelMaintainMember'
})
export class NewmodelMaintainPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (args.type) {
      case 'role': {
        if (!args.change) {
          return value;
        } else {
          return value.filter(d => d.Role.toLowerCase().includes(args.change.toLowerCase()));
        }
      }
      case 'member': {
        if (!args.change) {
          return value;
        } else {
          return value.filter(d => d.CName.toLowerCase().includes(args.change.toLowerCase()) ||
            d.EName.toLowerCase().includes(args.change.toLowerCase()) ||
            d.MemberID.toLowerCase().includes(args.change.toLowerCase()));
        }
      }
      default: {
        return value;
      }
    }
  }

}

@Pipe({
  name: 'productTypeBgColor'
})
export class ProductTypeBgColorPipe implements PipeTransform {

  productType = [];


  transform(value: any, args?: any): any {
    if (this.productType.length === 0 && args.length > 0) {
      args.forEach(arg => {
        if (!this.productType.includes(arg.Value)) {
          this.productType.push(arg.Value);
        }
      });
    }

    if (!this.productType.includes(value)) {
      return {'background-color': 'rgb(255, 0, 0)', 'color': '#fff'};
    }
  }
}
