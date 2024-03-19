import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MessagesComponent } from './messages/messages.component';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';
import { AdminMessagesComponent } from './admin-messages/admin-messages.component';

@NgModule({
  declarations: [
    MessagesComponent,
    ImagePreviewComponent,
    ChatLayoutComponent,
    AdminMessagesComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    PickerModule,
  ],
})
export class ChatModule {}
