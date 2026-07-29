export function getUserImageSrc(imagePath: string | null) {
    if(imagePath) {
        return {uri: imagePath};
    }
    return require('../assets/images/defaultUser.png')
}