import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormMaintainComponent } from './form-maintain/form-maintain.component';
import { SignMaintainComponent } from './sign-maintain/sign-maintain.component';
import { ProductTypeMappingComponent } from './product-type-mapping/product-type-mapping.component';

const routes: Routes = [
  { path: 'form-maintain', component: FormMaintainComponent },
  { path: 'sign-maintain', component: SignMaintainComponent },
  { path: 'productType-mapping', component: ProductTypeMappingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasedataRoutingModule { }
