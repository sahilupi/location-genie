import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

const routes: Routes = [
  {
    path: 'reset-password',
    component: ChangePasswordComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./layouts/layouts.module').then((m) => m.LayoutsModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking',
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
