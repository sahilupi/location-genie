import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import {
  ChatMessage,
  ChatOnlineUser,
  ChatSearchedUser,
  ChatUser,
} from '../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class AdminSignalrClientService {
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
  areNotificationsGlobal = true;
  userName: string = 'superadmin@gmail.com';
  deletedMsgId = new Subject<number>();
  editedMsg = new Subject<ChatMessage>();

  constructor() {}

  async openConnection(senderId?: string, recieverId?: string): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/chat?username=${this.userName}`)
      .withAutomaticReconnect()
      .build();

    await this.connection.start().then(async () => {
      if (senderId && recieverId) {
        await this.adminAddContact(senderId, recieverId);
        await this.adminGetChatHistory(this.currentUserId, this.recieverId);
      }
      this.connection.invoke('AdminGetContactList', this.currentUserId);
      if (this.recieverId) {
        this.adminGetChatHistory(this.currentUserId, this.recieverId);
      }
    });
    // add handler

    this.chatMessageHandler();
  }

  chatMessageHandler(): void {
    this.connection.invoke(
      'AdminSetConnectionId',
      this.connection.connectionId,
      this.currentUserId
    );
    this.connection.on('AdminReceiveMessage', (response) => {
      this.messenger.next(response.data);
    });

    this.connection.on('AdminReceiveUsers', (res) => {
      this.searchUsers.next(res);
    });

    this.connection.on('AdminReceiveContactList', (res) => {
      this.users.next(res);
    });

    this.connection.on('AdminReceiveContactAdded', (res: string) => {
      this.adminGetContactList(res);
    });

    this.connection.on(
      'AdminReceiveChatHistory',
      (res: { data: ChatMessage[] }) => {
        this.chatHistory.next(res.data);
      }
    );

    this.connection.on('AdminOnlineUsers', (user: ChatOnlineUser[]) => {
      this.onlineUsers.next(user);
    });
    this.connection.on(
      'AdminReceiveMarkMessageAsRead',
      (res: { data: number[] }) => {
        this.seenMsgs.next(res.data);
      }
    );

    this.connection.on('AdminReceiveDeleteMessage', (res) => {
      this.deletedMsgId.next(res.data.id);
    });
    this.connection.on('AdminReceiveEditMessage', (res) => {
      this.editedMsg.next(res.data);
    });

    this.connection.onreconnected(() => {
      this.connection.invoke('AdminGetContactList', this.currentUserId);
      if (this.recieverId) {
        this.adminGetChatHistory(this.currentUserId, this.recieverId);
      }
      this.chatMessageHandler();
    });
  }

  getUsersByEmail(email: string): Promise<any> {
    return this.connection.invoke('AdminGetUserByEmail', email);
  }

  adminGetContactList(userId: string): Promise<any> {
    return this.connection.invoke('AdminGetContactList', userId);
  }

  adminAddContact(currentUserId: string, recieverId: string): Promise<any> {
    return this.connection.invoke('AdminAddContact', currentUserId, recieverId);
  }

  adminGetChatHistory(currentUserId: string, recieverId: string): Promise<any> {
    // this.connection.invoke(
    //   'SetConnectionId',
    //   this.connection.connectionId,
    //   this.currentUserId
    // );
    return this.connection.invoke(
      'AdminGetChatHistory',
      currentUserId,
      recieverId
    );
  }

  revokeConnection(currentUserId: string): Promise<any> {
    return this.connection.invoke('AdminSetDisconnectedId', currentUserId);
  }

  adminMarkMessagesAsRead(
    messageIds: number[],
    senderId: string,
    recieverId: string
  ): Promise<any> {
    return this.connection.invoke(
      'AdminMarkMessagesAsRead',
      messageIds,
      senderId,
      recieverId
    );
  }

  adminSendMessage(
    message: string,
    senderId: string,
    recieverId: string
  ): Promise<any> {
    return this.connection.invoke(
      'AdminSendMessage',
      senderId,
      recieverId,
      message
    );
  }

  adminSendMessageWithImage(
    senderId: string,
    recieverId: string,
    message: string,
    fileData: string,
    fileName: string,
    messageType: string
  ): Promise<any> {
    return this.connection.invoke(
      'AdminSendMessageWithImage',
      senderId,
      recieverId,
      message,
      fileData,
      fileName,
      messageType
    );
  }

  adminDeleteMessage(
    senderId: string,
    recieverId: string,
    messageId?: number
  ): Promise<any> {
    return this.connection.invoke(
      'AdminDeleteMessage',
      messageId,
      senderId,
      recieverId
    );
  }

  adminEditMessage(
    senderId: string,
    message: string,
    recieverId: string,
    messageId?: number
  ): Promise<any> {
    return this.connection.invoke(
      'AdminEditMessage',
      messageId,
      message,
      senderId,
      recieverId
    );
  }
}
