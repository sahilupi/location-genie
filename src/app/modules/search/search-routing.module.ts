import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchLocationsComponent } from './search-locations/search-locations.component';

const routes: Routes = [
  {
    path: '',
    component: SearchLocationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
