
type User = {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  password: string;
  authType: string;
  userType: string;
  available: Boolean;
  subscription: string;
  verified: Boolean;
  bio: string;
  username: string;
  specialization: string;
  phoneNumber: string;
  website: string;
};

type Design = {
  _id: string;
  designer: User;
  preview: string;
  views: Number;
  saves: Number;
  designUri: string;
  description: string;
  designSubscription: string;
  designFile: string;
  designFileRef: string;
  designImages: [string];
  createdAt: string;
  tags: [string];
  category: string;
  title: string;
  previewImageRef: string;
  designImagesRef: [string];
};

type ArtPiece = {
  _id: string;
  title: string;
  description: string;
  artist: User;
  artPreview: string;
  previewImageRef: string;
  artImagesRef: [string];
  artImages: [string];
  category: string;
  dimensions: string;
  price: Float;
  artState: string;
  auctionStartPrice: Float;
  auctionStartDate: string;
  auctionEndDate: string;
  highestBid: Float;
  artSold: boolean;
};

type MultipleImageUpload = {
  references: any;
  images: any;
};

type SingleFileUpload = {
  reference: any;
  file: any;
};

type DesignComment = {
  _id: string;
  comment: string;
  commentedBy: User;
  commentedAt: string
  designId: string
};

type CommentReply = {
  _id: string
  reply:string
  commentId: string
  repliedBy: User
  repliedAt: string
}

type Wallet = {
  _id: string;
  user: string;
  balance: Float;
  auctionBidsPlacedAmount: Float;
}

type Address = {
    _id: string;
    user: string;
    city: string;
    street: string;
    postalCode: string;
    houseNumber: string;
    telephone: string;
}

type UserNotification = {
  _id: string;
  user: string;
  notificationType: string;
  summary: string;
  artWorks: [string];
}
