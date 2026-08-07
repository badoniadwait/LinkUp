import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from './imageService';

export async function createUpdatePost(post: {
    file: string | ImagePicker.ImagePickerAsset | null | undefined;
    body: string;
    userId: string | undefined;
}) {
    try {
        if (post.file && typeof post.file == 'object') {
            let isImage = post.file.type == 'image';
            let folderName = isImage ? 'postImages' : 'postVideos';

            let fileResult = await uploadFile({ fileUri: post.file.uri, folderName, isImage });

            if (fileResult.success) post.file = fileResult.data;
            else {
                return fileResult;
            }
        }

        const { data, error } = await supabase.from('posts').upsert(post).select().single();
        if (error) {
            console.log('create post error ', error);
            return { success: false, msg: 'could not create post' };
        }
        return { success: true, data: data };
    } catch (error) {
        console.log('create post error ', error);
        return { success: false, msg: 'could not create post' };
    }
}

export async function fetchPosts(limit = 10) {
    try {
    const {data, error} = await supabase.from('posts')
    .select('*, user: users (id, name, image)')
    .order('created_at', {ascending: false}).limit(limit);

    if(error) {
        console.log('fetch post error ', error);
        return { success: false, msg: 'could not fetch post' };
    }
    else {
        return { success: true, data };

    }

    } catch (error) {
        console.log('fetch post error ', error);
        return { success: false, msg: 'could not fetch post' };
    }

}