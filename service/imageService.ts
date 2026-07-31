import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { File } from 'expo-file-system';

export function getUserImageSrc(imagePath: string | null | undefined) {
    if (imagePath) {
        return getSupabaseFileUrl(imagePath);
    }
    return require('../assets/images/defaultUser.png')
}

export async function uploadFile(
    {
        fileUri, folderName, isImage = true
    }: {
        folderName: string;
        fileUri: string;
        isImage?: boolean;
    }

) {
    try {
        let fileName = getFilePath(folderName, isImage);
        const file = new File(fileUri);

        const fileBase64 = await file.base64();

        const imageData = decode(fileBase64);

        const { data, error } = await supabase.storage.from('uploads').upload(fileName, imageData, {
            cacheControl: '3600',
            upsert: false,
            contentType: isImage ? 'image/*' : 'video/*'
        });

        if (error) {
            console.log('file upload error: ', error);
            return { success: false, msg: "Failed to upload" };
        }
        return { success: true, data: data.path };

    } catch (error) {
        console.log('file upload error: ', error);
        return { success: false, msg: "Failed to upload" };
    }
}

function getFilePath(folderName: string, isImage: boolean) {
    return `/${folderName}/${new Date().getTime()}${isImage ? '.png' : '.mp4'}`;
}

function getSupabaseFileUrl(filePath: string | null) {
    if (filePath) {
        return { uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}` };
    }
    return null;
}