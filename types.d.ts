
type User = {
    _id: string
    fullName: string
    email: string
    avatar: string
    password: string
    authType: string
    userType: string
    available: Boolean
    subscription: string
    verified: Boolean
    bio: string
    username: string
    specialization: string
    phoneNumber: string
    website: string
}

type Design = {
    _id: string
    designer: User
    preview: string
    views: Number
    saves: Number
    description: string
    designSubscription: string
    designFile: string
    designFileRef: string
    designImages: [string]
    createdAt: string
    tags: [string]
    category: string
    title: string
    previewImageRef: string
    designImagesRef: [string]
}

type ArtPiece = {
  _id: string
    title: string
    description: string
    artist: User
    artPreview: string
    previewImageRef: string
    artImagesRef: [string]
    artImages: [string]
    category: string
    dimensions: string
    price: Float
    artState: string
    auctionStartPrice: Float
    auctionStartDate: string
    auctionEndDate: string
}


type MultipleImageUpload = {
    references: any;
    images: any;
  }

type SingleFileUpload = {
    reference: any;
    file: any;
  }
