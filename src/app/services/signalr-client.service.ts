import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { LocalService } from './local.service';
import { LocalConstant } from '../constants/local-constant';
import {
  ChatMessage,
  ChatOnlineUser,
  ChatSearchedUser,
  ChatUser,
} from '../models/chat.model';
import { HttpService } from './http.service';
import { BaseResonse } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class SignalrClientService {
  connection: signalR.HubConnection;
  messenger = new Subject<ChatMessage>();
  chatHistory = new Subject<ChatMessage[]>();
  searchUsers = new Subject<ChatSearchedUser>();
  users = new Subject<ChatUser>();
  onlineUsers = new Subject<ChatOnlineUser[]>();
  seenMsgs = new Subject<number[]>();
  currentUserId: string;
  currentUserRole: string;
  recieverId: string;
  currentUserEmail: string;
  emitCurrentUserId = new Subject<string>();
  deletedMsgId = new Subject<number>();
  editedMsg = new Subject<ChatMessage>();
  areNotificationsGlobal = true;
  userName: string = 'superadmin@gmail.com';

  constructor(private localService: LocalService, private http: HttpService) {}

  private async getCurrentUser(): Promise<void> {
    const userData = await this.localService.getLocalData(
      LocalConstant.USER_DATA
    );
    const userPayload = JSON.parse(atob(userData.access_token.split('.')[1]));
    if (userPayload.current_role)
      this.currentUserRole = userPayload.current_role;
  }

  async openConnection(senderId?: string, recieverId?: string): Promise<void> {
    await this.getCurrentUser();
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/chat?username=${this.userName}`)
      .withAutomaticReconnect()
      .build();

    await this.connection.start().then(async () => {
      // this.connection.invoke(
      //   'SetConnectionId',
      //   this.connection.connectionId,
      //   this.currentUserId
      // );
      if (senderId && recieverId) {
        await this.addContactToChat(senderId, recieverId);
        await this.getChatHistory(this.currentUserId, this.recieverId);
      }
      this.connection.invoke(
        'GetContactList',
        this.currentUserId,
        this.currentUserRole
      );
      if (this.recieverId) {
        this.getChatHistory(this.currentUserId, this.recieverId);
      }
    });
    // add handler

    this.chatMessageHandler();
  }

  chatMessageHandler(): void {
    this.connection.invoke(
      'SetConnectionId',
      this.connection.connectionId,
      this.currentUserId
    );
    this.connection.on('ReceiveMessage', (response) => {
      this.messenger.next(response.data);
    });

    this.connection.on('ReceiveUsers', (res) => {
      this.searchUsers.next(res);
    });

    this.connection.on('ReceiveContactList', (res) => {
      this.users.next(res);
    });

    this.connection.on('ReceiveContactAdded', (res) => {
      this.getContactList(res);
    });

    this.connection.on('ReceiveChatHistory', (res) => {
      this.chatHistory.next(res.data);
    });

    this.connection.on('OnlineUsers', (user) => {
      this.onlineUsers.next(user);
    });
    this.connection.on('ReceiveMarkMessageAsRead', (res) => {
      this.seenMsgs.next(res.data);
    });
    this.connection.on('ReceiveDeleteMessage', (res) => {
      this.deletedMsgId.next(res.data.id);
    });
    this.connection.on('ReceiveEditMessage', (res) => {
      this.editedMsg.next(res.data);
    });

    this.connection.onreconnected(() => {
      this.connection.invoke(
        'GetContactList',
        this.currentUserId,
        this.currentUserRole
      );
      if (this.recieverId) {
        this.getChatHistory(this.currentUserId, this.recieverId);
      }
      this.chatMessageHandler();
    });
  }

  getUsersByEmail(email: string): Promise<any> {
    return this.connection.invoke('GetUserByEmail', email);
  }

  getContactList(userId: string): Promise<any> {
    return this.connection.invoke(
      'GetContactList',
      userId,
      this.currentUserRole
    );
  }

  addContactToChat(currentUserId: string, recieverId: string): Promise<any> {
    return this.connection.invoke(
      'AddContact',
      currentUserId,
      recieverId,
      this.currentUserRole
    );
  }

  getChatHistory(currentUserId: string, recieverId: string): Promise<any> {
    // this.connection.invoke(
    //   'SetConnectionId',
    //   this.connection.connectionId,
    //   this.currentUserId
    // );
    return this.connection.invoke(
      'GetChatHistory',
      currentUserId,
      recieverId,
      this.currentUserRole
    );
  }

  revokeConnection(currentUserId: string): Promise<any> {
    return this.connection.invoke('SetDisconnectedId', currentUserId);
  }

  markMessagesAsRead(
    messageIds: number[],
    senderId: string,
    recieverId: string
  ): Promise<any> {
    return this.connection.invoke(
      'MarkMessagesAsRead',
      messageIds,
      senderId,
      recieverId
    );
  }

  sendMessage(
    message: string,
    senderId: string,
    recieverId: string
  ): Promise<any> {
    return this.connection.invoke(
      'SendMessage',
      senderId,
      recieverId,
      message,
      this.currentUserRole
    );
  }

  sendMessageWithFile(
    senderId: string,
    recieverId: string,
    message: string,
    fileData: any,
    fileName: string,
    messageType: string
  ): Promise<any> {
    return this.connection.invoke(
      'SendMessageWithImage',
      senderId,
      recieverId,
      message,
      this.currentUserRole,
      fileData,
      fileName,
      messageType
    );
  }

  deleteMessage(
    senderId: string,
    recieverId: string,
    messageId?: number
  ): Promise<any> {
    return this.connection.invoke(
      'DeleteMessage',
      messageId,
      senderId,
      recieverId
    );
  }

  editMessage(
    senderId: string,
    message: string,
    recieverId: string,
    messageId?: number
  ): Promise<any> {
    return this.connection.invoke(
      'EditMessage',
      messageId,
      message,
      senderId,
      recieverId
    );
  }

  async getBase64Image(imgUrl: string): Promise<BaseResonse> {
    return this.http.get(`/api/Profile/get-image-base64?imagePath=${imgUrl}`);
  }
}
