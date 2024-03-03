
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
    artImages: [string]
    previewImageRef: string
    artImagesRef: [string]
    category: string
    dimensions: string
    price: number
    artState: string
    auctionStartPrice: number
    auctionStartDate: string
}


type MultipleImageUpload = {
    references: any;
    images: any;
  }

type SingleFileUpload = {
    reference: any;
    file: any;
  }
