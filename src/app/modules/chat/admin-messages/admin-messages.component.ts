import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalConstant } from 'src/app/constants/local-constant';
import {
  ChatMessage,
  ChatOnlineUser,
  ChatSearchedUser,
  ChatUser,
} from 'src/app/models/chat.model';
import { LocalService } from 'src/app/services/local.service';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { AdminSignalrClientService } from 'src/app/services/admin-signalr-client.service';
import { SignalrClientService } from 'src/app/services/signalr-client.service';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.scss'],
})
export class AdminMessagesComponent implements OnInit, OnDestroy {
  @ViewChild('chatListContainer') list?: ElementRef<HTMLDivElement>;
  @ViewChild('chatMsg') chatMsg: ElementRef<HTMLInputElement>;
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLInputElement>;
  subscription: Subscription;
  chatForm: FormGroup;
  searchedUsersList: ChatSearchedUser[] = [];
  usersList: ChatUser[] = [];
  chatMessages: ChatMessage[] = [];
  onlineUsers: string[] = [];
  currentUserId: string;
  currentUserEmail: string;
  recieverId: string;
  search: string;
  unreadMsgIds: number[] = [];
  avatar = 'assets/images/dummy/dummy-user.jpg';
  currentUserImg: string = 'assets/images/dummy/dummy-user.jpg';
  recieverImg: string = 'assets/images/dummy/dummy-user.jpg';
  recieverName: string = 'assets/images/dummy/dummy-user.jpg';
  isInitiatingUsers = true;
  isLoading = false;
  today = new Date().getDate();
  imageUrl: string = '';
  docUrl: string = '';
  imagefile: File;
  myfilename = '';
  images: string[] = [];
  showChatList = true;
  isEditing = false;
  editingMsgId: number;
  editingMsg: string;
  index: number;
  fileType: string;
  showEmojiPicker = false;
  menuBtnClick = false;
  @HostListener('window:click', ['$event'])
  windowClick() {
    if (!this.menuBtnClick) {
      this.showEmojiPicker = false;
    } else {
      this.menuBtnClick = false;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  async beforeunloadHandler() {
    if (this._signalrClientService.connection) {
      await this._signalrClientService.revokeConnection(this.currentUserId);
      return false;
    }
    return false;
  }

  constructor(
    public dialog: MatDialog,
    private _adminSignalrClientService: AdminSignalrClientService,
    private _signalrClientService: SignalrClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbar: SnackBarService,
    private personalInfoService: PersonalInfoService,
    private localService: LocalService,
    private spinner: SpinnerService,
    private cdRef: ChangeDetectorRef
  ) {
    try {
      this.router.navigate(['/messages/admin'], {
        queryParams: {
          s: null,
          r: null,
        },
        queryParamsHandling: 'merge',
      });
      this.subscription = new Subscription();

      //subscribing chat message and online user details
      this.subscription.add(
        this._adminSignalrClientService.messenger.subscribe(
          async (res: ChatMessage) => {
            if (this.currentUserId === res.senderId) {
              this.chatMessages.push(res);
            }
            if (res) {
              const sender = this.usersList.find(
                (user) => user.userId === res.senderId
              );
              if (sender && this.currentUserId !== res.senderId)
                sender.lastMessage = res;

              if (
                this.recieverId === res.senderId &&
                this.currentUserId === res.recieverId
              ) {
                await this._adminSignalrClientService.adminMarkMessagesAsRead(
                  [Number(res.id)],
                  this.currentUserId,
                  this.recieverId
                );
                if (sender) sender.lastMessage.isUnread = false;
              }
              const senderID = res.senderId;
              if (
                !this.usersList.some((user) => user.userId === senderID) &&
                this.currentUserId !== res.senderId
              ) {
                await this.addContactToChat(this.currentUserId, senderID);
                await this.initFunctions();
                this.snackbar.info(LocalConstant.MESSAGE_RECIEVED);
              }
              if (
                res.senderId === this.recieverId &&
                res.recieverId === this.currentUserId
              ) {
                this.chatMessages.push(res);
              }
              if (
                (this.currentUserId !== res.recieverId ||
                  this.recieverId !== res.senderId) &&
                this.currentUserId !== res.senderId
              ) {
                const user = this.usersList.find(
                  (user) => user.userId === res.senderId
                );
                this.snackbar.info(
                  `${LocalConstant.MESSAGE_RECIEVED} from ${
                    user?.firstName ? user?.firstName : user?.email
                  } ${user?.lastName ? user?.lastName : ''}`
                );
              }
            }
            this.usersList.sort(
              (a, b) =>
                new Date(b.lastMessage?.createdDate).getTime() -
                new Date(a.lastMessage?.createdDate).getTime()
            );
            setTimeout(() => {
              this.scrollToBottom();
            }, 100);
            this.cdRef.detectChanges();
          }
        )
      );
      this.subscription.add(
        this._adminSignalrClientService.onlineUsers.subscribe(
          // @ts-ignore
          (res: ChatOnlineUser[]) => {
            this.onlineUsers = res.map((data) => data.key);
          }
        )
      );
      this.subscription.add(
        this._adminSignalrClientService.seenMsgs.subscribe(
          // @ts-ignore
          async (msgId: number[]) => {
            if (Number(msgId.at(-1)) && this.chatMessages.at(-1)) {
              // @ts-ignore
              this.chatMessages.at(-1).isUnread = false;
            }
          }
        )
      );
      this.subscription.add(
        this._adminSignalrClientService.searchUsers.subscribe(
          // @ts-ignore
          (res: { data: ChatSearchedUser }) => {
            if (res.data) {
              if (this.usersList.some((user) => user.userId === res.data.id)) {
                this.snackbar.info('This user is alreay in your chat list');
              }
              if (
                !this.searchedUsersList.some(
                  (obj) =>
                    obj['userName'].toLowerCase() ===
                    res.data.userName.toLowerCase()
                ) &&
                !this.usersList.some((user) => user.userId === res.data.id)
              )
                this.searchedUsersList.push(res.data);
            }
          }
        )
      );

      this.subscription.add(
        this._adminSignalrClientService.users.subscribe(
          // @ts-ignore
          async (res: { data: ChatUser[] }) => {
            if (res.data && res.data.length > 0) {
              // this.usersList.push(...res.data);
              // if (res.data.length > this.usersList.length)
              const uniqueArray = this.removeDuplicates(res.data, 'userId');
              this.usersList = uniqueArray;
              // this.usersList = this.usersList.reverse();
              this.usersList.sort(
                (a, b) =>
                  new Date(b.lastMessage?.createdDate).getTime() -
                  new Date(a.lastMessage?.createdDate).getTime()
              );
              if (this.isInitiatingUsers) {
                const queryParams = this.activatedRoute.snapshot.queryParams;
                if (queryParams && queryParams['r'] && queryParams['s']) {
                  this.recieverId = queryParams['r'];
                  this._adminSignalrClientService.recieverId = this.recieverId;
                  const recieverUser = this.usersList.find(
                    (user) => user.userId === this.recieverId
                  );
                  if (recieverUser) {
                    this.recieverName = recieverUser.firstName
                      ? recieverUser.firstName + ' ' + recieverUser.lastName
                      : recieverUser.email;
                    this.recieverImg = recieverUser.profilePicture
                      ? recieverUser.profilePicture
                      : this.avatar;
                  }
                  await this.getChatHistory(
                    this.currentUserId,
                    this.recieverId
                  );
                } else {
                  this.recieverId = this.usersList[0].userId;
                  const recieverUser = this.usersList.find(
                    (user) => user.userId === this.recieverId
                  );
                  if (recieverUser) {
                    this.recieverName = recieverUser.firstName
                      ? recieverUser.firstName + ' ' + recieverUser.lastName
                      : recieverUser.email;
                    this.recieverImg = recieverUser.profilePicture
                      ? recieverUser.profilePicture
                      : this.avatar;
                  }
                  this._adminSignalrClientService.recieverId = this.recieverId;

                  await this.getChatHistory(
                    this.currentUserId,
                    this.recieverId
                  );
                }
              }

              this.isInitiatingUsers = false;
            }
            if (!this.usersList || this.usersList.length <= 0) {
              this.router.navigate(['/messages/admin'], {
                queryParams: {
                  s: null,
                  r: null,
                },
                queryParamsHandling: 'merge',
              });
            }
          }
        )
      );
      this.subscription.add(
        this._adminSignalrClientService.chatHistory.subscribe(
          // @ts-ignore
          async (res: ChatMessage[]) => {
            if (res && res.length > 0) {
              this.chatMessages = res;
              const unreadMsgs = this.chatMessages.filter(
                (msg) => msg.isUnread && msg.senderId !== this.currentUserId
              );
              this.unreadMsgIds = unreadMsgs.map((msg) => Number(msg.id));
              if (this.unreadMsgIds.length > 0) {
                await this._adminSignalrClientService.adminMarkMessagesAsRead(
                  this.unreadMsgIds,
                  this.recieverId,
                  this.currentUserId
                );
              }
            } else {
              this.chatMessages = [];
            }
          }
        )
      );
      this.subscription.add(
        this._adminSignalrClientService.deletedMsgId.subscribe((id: number) => {
          if (this.chatMessages && this.chatMessages.length) {
            this.chatMessages = this.chatMessages.filter(
              (chat) => chat.id !== id
            );
            if (this.index === this.chatMessages.length) {
              const foundUser = this.usersList.find(
                (user) => user.userId === this.recieverId
              );
              if (foundUser && this.chatMessages.at(-1)) {
                // @ts-ignore
                foundUser.lastMessage = this.chatMessages.at(-1);
              }
            }
          }
        })
      );
      this.subscription.add(
        this._adminSignalrClientService.editedMsg.subscribe(
          (messageData: ChatMessage) => {
            if (this.chatMessages && this.chatMessages.length) {
              const sender = this.usersList.find(
                (user) => user.userId === messageData.recieverId
              );
              const reciever = this.usersList.find(
                (user) =>
                  user.userId === messageData.senderId &&
                  this.currentUserId !== messageData.senderId
              );

              const foundMsgIdx = this.chatMessages.findIndex(
                (chat) => chat.id === messageData.id
              );
              // updating last message for sender and reciever
              if (
                sender &&
                foundMsgIdx >= 0 &&
                foundMsgIdx === this.chatMessages.length - 1
              )
                sender.lastMessage = messageData;
              if (
                reciever &&
                foundMsgIdx >= 0 &&
                foundMsgIdx === this.chatMessages.length - 1
              )
                reciever.lastMessage = messageData;
              if (foundMsgIdx >= 0) {
                this.chatMessages[foundMsgIdx].message = messageData.message;
              }
            }
          }
        )
      );
    } catch (error) {}
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.spinner.show();
    try {
      const isShowChatList = localStorage.getItem('chat-toggle');
      if (isShowChatList && isShowChatList === 'true') {
        this.showChatList = true;
      } else if (isShowChatList && isShowChatList === 'false') {
        this.showChatList = false;
      }
      await this.initFunctions();
    } catch (error) {
      this.isLoading = false;
      this.spinner.hide();
    } finally {
      this.isLoading = false;
      this.spinner.hide();
    }
  }

  private async initFunctions(): Promise<void> {
    this._adminSignalrClientService.areNotificationsGlobal = false;
    await this.getCurrentUser();
    await this.connectHub('superadmin@gmail.com');
    await this.buildForm();
    await this.getPersonalDetails();
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams && queryParams['r'] && queryParams['s']) {
      this.recieverId = queryParams['r'];
      this._adminSignalrClientService.recieverId = this.recieverId;
    }
  }

  private async getPersonalDetails() {
    const response = await this.personalInfoService.personalInfoGetApi(
      this.currentUserEmail
    );
    if (
      response &&
      response.success &&
      response.data &&
      response.data.profilePic
    ) {
      if (response.data.profilePic.includes('https')) {
        // for facebook image url
        this.currentUserImg = response.data.profilePic;
      }
      if (!response.data.profilePic.includes('https')) {
        // for Image upload url
        this.currentUserImg = response.data.profilePic;
      }
    }
  }

  async connectHub(userName: string): Promise<void> {
    this._adminSignalrClientService.userName = userName;
    await this._adminSignalrClientService.openConnection();
  }

  private async buildForm(): Promise<void> {
    this.chatForm = new FormGroup({
      chatMessage: new FormControl('', [Validators.required]),
    });
  }

  get c() {
    return this.chatForm.controls;
  }

  private async getCurrentUser(): Promise<void> {
    const userData = await this.localService.getLocalData(
      LocalConstant.USER_DATA
    );
    const userPayload = JSON.parse(atob(userData.access_token.split('.')[1]));
    this.currentUserId = userPayload.sub;
    this._adminSignalrClientService.emitCurrentUserId.next(this.currentUserId);
    this.currentUserEmail = userPayload.email;
    this._adminSignalrClientService.currentUserId = this.currentUserId;
    this._adminSignalrClientService.currentUserEmail = this.currentUserEmail;
  }

  async getUsersByEmail(event: Event): Promise<void> {
    const email = (event.target as HTMLInputElement).value;
    await this._adminSignalrClientService.getUsersByEmail(email);
  }

  async addContactToChat(
    currentUserId: string,
    recieverId: string
  ): Promise<void> {
    await this._adminSignalrClientService.adminAddContact(
      currentUserId,
      recieverId
    );
    this.recieverId = recieverId;
    await this._adminSignalrClientService.adminGetContactList(currentUserId);
    await this.getChatHistory(currentUserId, recieverId);
    this.searchedUsersList = [];
    this.chatMessages = [];
    this.search = '';
  }

  async getChatHistory(
    currentUserId: string,
    recieverId: string,
    user?: ChatUser
  ): Promise<void> {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        s: this.currentUserId,
        r: this.recieverId,
      },
      queryParamsHandling: 'merge',
    });
    if (recieverId === this.recieverId && !this.isInitiatingUsers) return;
    this.recieverId = recieverId;
    if (user) {
      this.recieverName = user.firstName
        ? user.firstName + ' ' + user.lastName
        : user.email;
      this.recieverImg = user.profilePicture
        ? user.profilePicture
        : this.avatar;
    }
    await this._adminSignalrClientService.adminGetChatHistory(
      currentUserId,
      recieverId
    );
    const unreadMsgs = this.chatMessages.filter(
      (msg) => msg.isUnread && msg.senderId !== this.currentUserId
    );
    const foundUser = this.usersList.find(
      (user) => user.userId === this.recieverId
    );
    if (foundUser)
      if (foundUser.lastMessage) foundUser.lastMessage.isUnread = false;
    this.unreadMsgIds = unreadMsgs.map((msg) => Number(msg.id));
    if (this.unreadMsgIds.length > 0) {
      await this._adminSignalrClientService.adminMarkMessagesAsRead(
        this.unreadMsgIds,
        this.recieverId,
        this.currentUserId
      );
    }

    this.chatForm.setValue({
      chatMessage: '',
    });

    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
    this.showEmojiPicker = false;
  }

  removeDuplicates(array: ChatUser[], key: string): ChatUser[] {
    const seen = {};
    return array.filter((item: ChatUser) => {
      //@ts-ignore
      const value = item[key];
      if (seen.hasOwnProperty(value)) {
        return false;
      } else {
        //@ts-ignore
        seen[value] = true;
        return true;
      }
    });
  }

  async onSendMessage(): Promise<void> {
    if (!this.chatForm.valid) return;
    if (!this.isEditing) {
      this._adminSignalrClientService
        .adminSendMessage(
          this.chatForm.value.chatMessage,
          this.currentUserId,
          this.recieverId
        )
        .then(() => {
          //
          this.scrollToBottom();
          this.showEmojiPicker = false;
        })
        .catch((err) => {
          console.log('error ==>', err);
        });
      if (this.currentUserId !== this.recieverId) {
        const message = {
          message: this.chatForm.value.chatMessage,
          currentUserId: this.currentUserId,
          recieverId: this.recieverId,
          senderId: this.currentUserId,
          isUnread: true,
          isSent: true,
          createdDate: new Date().toISOString(),
          messageType: 'text',
        };
        const reciever = this.usersList.find(
          (user) => user.userId === this.recieverId
        );
        if (reciever) reciever.lastMessage = message;
        // this.chatMessages.push(message);
        this.chatForm.setValue({
          chatMessage: '',
        });
        await this._adminSignalrClientService.adminMarkMessagesAsRead(
          [],
          this.recieverId,
          this.currentUserId
        );
        this.usersList.sort(
          (a, b) =>
            new Date(b.lastMessage?.createdDate).getTime() -
            new Date(a.lastMessage?.createdDate).getTime()
        );
      }
    }
    if (this.isEditing) {
      this._adminSignalrClientService
        .adminEditMessage(
          this.currentUserId,
          this.chatForm.value.chatMessage,
          this.recieverId,
          Number(this.editingMsgId)
        )
        .then(() => {
          if (this.currentUserId !== this.recieverId) {
            // this.chatMessages.push(message);
            this.chatForm.setValue({
              chatMessage: '',
            });
          }
          this.isEditing = false;
          this.showEmojiPicker = false;
          // this.scrollToBottom();
        })
        .catch((err) => {
          console.log('error ==>', err);
        });
    }
    this.cancelMsgEditing();
    this.showEmojiPicker = false;
  }

  onSendMessagesWithFile(): void {
    if (
      (!this.imageUrl || this.imageUrl.trim() === '') &&
      (!this.docUrl || this.docUrl.trim() === '')
    )
      return;

    this._adminSignalrClientService.adminSendMessageWithImage(
      this.currentUserId,
      this.recieverId,
      '',
      this.fileType === 'img' ? this.imageUrl : this.docUrl,
      this.myfilename,
      this.fileType
    );
    this.imageUrl = '';
    this.docUrl = '';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);
  }

  scrollToBottom(): void {
    const maxScroll = this.list?.nativeElement.scrollHeight;
    this.list?.nativeElement.scrollTo({ top: maxScroll, behavior: 'auto' });
  }

  getDate(date: string): number {
    return new Date(date).getDate();
  }

  getDateMonth(date: string): string {
    const foundDate = new Date(date).getDate();
    const foundMonth = new Date(date).getMonth();
    const foundYear = new Date(date).getFullYear();
    return `${foundDate}-${foundMonth}-${foundYear}`;
  }

  fileChangeEvent(fileInput: Event): void {
    const fileInputTarget = fileInput.target as HTMLInputElement;
    if (fileInputTarget.files && fileInputTarget.files[0]) {
      this.imagefile = fileInputTarget.files[0];
      const nameSplit = this.imagefile.name.split('.');
      const fileType = nameSplit.at(-1);
      if (fileType) {
        this.fileType = fileType;
      }
      if (
        fileType &&
        (fileType.toLowerCase() == 'png' ||
          fileType.toLowerCase() == 'jpg' ||
          fileType.toLowerCase() == 'jpeg' ||
          fileType.toLowerCase() == 'jfif' ||
          fileType.toLowerCase() == 'webp')
      ) {
        this.fileType = 'img';
        const fileSizeInMB = this.imagefile.size / (1024 * 1024);
        const maxFileSizeInMB = 5.1;
        const minFileSizeInMB = 0.001;

        if (fileSizeInMB >= maxFileSizeInMB || fileSizeInMB < minFileSizeInMB) {
          // Display an error message or handle the oversized file as per your requirement
          this.snackbar.error('Maximum Image size can be 5 MB');
          return;
        }
      }
      this.myfilename = '';
      Array.from(fileInputTarget.files).forEach((file: any) => {
        this.myfilename += file.name + '';
      });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.fileType === 'img') {
          const image = new Image();
          image.src = e.target.result;
          image.onload = () => {
            this.imageUrl = e.target.result;
            this.chatForm.patchValue({
              chatMessage: '',
            });
            this.cancelMsgEditing();
          };
        } else {
          this.docUrl = e.target.result;
          if (this.docUrl.includes('video')) {
            const fileSizeInMB = this.imagefile.size / (1024 * 1024);
            const maxFileSizeInMB = 20.1;
            const minFileSizeInMB = 0.001;

            if (
              fileSizeInMB >= maxFileSizeInMB ||
              fileSizeInMB < minFileSizeInMB
            ) {
              this.snackbar.error('Maximum video size can be 20 MB');
              this.docUrl = '';
              this.fileUpload.nativeElement.value = '';
              return;
            }
          }
          if (!this.docUrl.includes('video')) {
            const fileSizeInMB = this.imagefile.size / (1024 * 1024);
            const maxFileSizeInMB = 10.1;
            const minFileSizeInMB = 0.001;

            if (
              fileSizeInMB >= maxFileSizeInMB ||
              fileSizeInMB < minFileSizeInMB
            ) {
              this.snackbar.error('Maximum document size can be 10 MB');
              this.docUrl = '';
              this.fileUpload.nativeElement.value = '';
              return;
            }
          }
        }
      };
      reader.readAsDataURL(fileInputTarget.files[0]);
    } else {
      this.myfilename = 'Select File';
    }
  }

  async onToggleChat(): Promise<void> {
    this.showChatList = !this.showChatList;
    localStorage.setItem('chat-toggle', String(this.showChatList));
  }

  async downloadImage(img: string, fileFlag?: boolean): Promise<void> {
    const response = await this._signalrClientService.getBase64Image(img);
    if (response && response.data) {
      const base64Image = 'data:image/jpg;base64,' + response.data;
      const link = document.createElement('a');
      document.body.appendChild(link); // for Firefox
      link.setAttribute('href', base64Image);
      link.setAttribute('download', img);
      link.click();
      document.body.removeChild(link);
      if (fileFlag) {
        this.snackbar.success(SuccessConstant.DOC_DOWNLOAD);
      } else {
        this.snackbar.success(SuccessConstant.IMAGE_DOWNLOAD);
      }
    }
  }

  downloadDocument(url: string): void {
    // Implement the logic to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.snackbar.success(SuccessConstant.DOC_DOWNLOAD);
  }

  imagePreview(
    previewLink: string,
    downloadLink: string,
    fileFlag?: boolean,
    messageType?: string
  ): void {
    this.dialog.open(ImagePreviewComponent, {
      data: {
        previewLink,
        downloadLink,
        fileFlag: fileFlag,
        messageType: messageType,
      },
      width: '800px',
    });
  }

  onEditMessage(message: string, messagedId?: number): void {
    this.editingMsg = message;
    this.editingMsgId = Number(messagedId);
    this.chatForm.patchValue({
      chatMessage: message,
    });
    this.chatMsg.nativeElement.focus();
    this.isEditing = true;
    this.cdRef.detectChanges();
  }

  async onDeleteMessage(
    senderId: string,
    recieverId: string,
    index: number,
    messagedId?: number
  ): Promise<void> {
    this.index = index;
    await this._adminSignalrClientService.adminDeleteMessage(
      senderId,
      recieverId,
      messagedId
    );
  }

  cancelMsgEditing(): void {
    this.isEditing = false;
    this.editingMsgId = 0;
    this.editingMsg = '';
    this.chatForm.patchValue({
      chatMessage: '',
    });
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: EmojiEvent): void {
    this.chatForm.patchValue({
      chatMessage: this.chatForm.value.chatMessage + event.emoji.native,
    });
  }

  preventCloseOnClick(): void {
    this.menuBtnClick = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this._adminSignalrClientService.areNotificationsGlobal = true;
    // await this._adminSignalrClientService.revokeConnection(this.currentUserId);
  }
}
