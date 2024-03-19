export interface Project {
  id: number;
  imageUrl?: string;
  title: string;
  startDate: string;
  endDate: string;
  privacy?: string;
  ownerId?: string;
  ownerName?: string;
  checked?: boolean;
  ownerEmail?: string;
  imagePath?: string;
  imageFullPath?: string;
  isPublic: boolean;
  description: string;
  listingIds: any[];
}

export interface InviteEmail {
  projectId: number;
  email: string[];
  isInvite: boolean;
  link: string;
}

export interface PrivacyStatus {
  projectId: number;
  isPublic: boolean;
}

export interface ProjectLocation {
  locationTitle: string;
  locationImage: string;
  pricingPerHour: number;
  listingId: number;
  projectListingId: number;
  city: string;
  state: string;
  country: string;
  priceCurrency: string;
  likesCount: number;
  status: number;
  isProjectLiked: boolean;
  isProjectDisliked: boolean;
  likeCount: number;
  dislikeCount: number;
  likeTeamMembers: LikeDislikeComment[];
  dislikeTeamMembers: LikeDislikeComment[];
  commentsCount: number;
  commentsTeamMembers: LikeDislikeComment[];
  comments: ProjectComment[];
  currency: Currency;
}

export interface LikeDislikeComment {
  id: number;
  isOwner: boolean;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  userStatus: number;
  comment: string;
  showMore: boolean;
}

export interface ProjectComment {
  owner: string;
  email: string;
  commentDateTime: string;
  comment: string;
}

export interface ProjectTeam {
  isOwner: boolean;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  userStatus: number;
  id: number;
}

export interface Currency {
  id: number,
  currencyName: string,
  currencyCode: string,
  currencySymbol: string,
  isDeleted: boolean,
  createdDate: string,
}