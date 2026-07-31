export function getUserImageSrc(imagePath: string | null | undefined) {
    if(imagePath) {
        return {uri: imagePath};
    }
    return require('../assets/images/defaultUser.png')
}