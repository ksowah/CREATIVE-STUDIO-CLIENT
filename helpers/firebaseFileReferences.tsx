//  `images/${refId}/user_${userId}`
export const getProfileImageReference = (userId: string, refId:string) => {
    return `images/profile_image_${refId}/user_${userId}`;
}

export const getDesignPreviewImageReference = (userId: string, refId:string) => {
    return `images/designs/preview_${refId}/user_${userId}`;
}

export const getArtPreviewImageReference = (userId: string, refId:string) => {
    return `images/arts/preview_${refId}/user_${userId}`;
}

export const getDesignMultipleImagesReference = (userId: string, refId:string) => {
    return `images/designs/user_${userId}/image_${refId}`;
}

export const getArtMultipleImagesReference = (userId: string, refId:string) => {
    return `images/arts/user_${userId}/image_${refId}`;
}

export const getDesignFileReference = (userId: string, refId:string, fileName:string, fileExtension:string) => {
    return `file/design/user_${userId}/${fileName}_${refId}.${fileExtension}`;
}
