import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LastStepComponent } from './last-step/last-step.component';
import { ListSpaceWrapperComponent } from './list-space-wrapper/list-space-wrapper.component';
import { authGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ListSpaceWrapperComponent,
    children: [
      {
        path: ':listingId/step-1',
        loadChildren: () =>
          import('./step-one/step-one.module').then((m) => m.StepOneModule),
        canActivate: [authGuard],
      },
      {
        path: 'list-new',
        loadChildren: () =>
          import('./step-one/step-one.module').then((m) => m.StepOneModule),
      },
      {
        path: ':listingId/step-2',
        loadChildren: () =>
          import('./step-two/step-two.module').then((m) => m.StepTwoModule),
        canActivate: [authGuard],
      },
      {
        path: ':listingId/step-3',
        loadChildren: () =>
          import('./step-three/step-three.module').then(
            (m) => m.StepThreeModule
          ),
        canActivate: [authGuard],
      },
      {
        path: ':listingId',
        component: LastStepComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListSpaceRoutingModule {}
