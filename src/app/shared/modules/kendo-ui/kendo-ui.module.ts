import { NgModule } from '@angular/core';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import { LabelModule } from '@progress/kendo-angular-label';

@NgModule({
  imports: [DateInputsModule, IntlModule, ButtonsModule, LabelModule],
  exports: [DateInputsModule, IntlModule, ButtonsModule, LabelModule],
})
export class KendoModule {}
