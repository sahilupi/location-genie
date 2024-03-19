import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';
import { AdminMessagesComponent } from './admin-messages/admin-messages.component';

const routes: Routes = [
  {
    path: '',
    component: ChatLayoutComponent,
    children: [
      {
        path: '',
        component: MessagesComponent,
      },
      {
        path: 'admin',
        component: AdminMessagesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
