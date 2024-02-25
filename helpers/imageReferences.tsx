//  `images/${refId}/user_${userId}`
export const getProfileImageReference = (userId: string, refId:string) => {
    return `images/profile_image_${refId}/user_${userId}`;
}

export const getDesignPreviewImageReference = (userId: string, refId:string) => {
    return `images/design_preview_${refId}/user_${userId}`;
}

export const getDesignMultipleImagesReference = (userId: string, refId:string) => {
    return `images/user_${userId}/design_image_${refId}`;
}
