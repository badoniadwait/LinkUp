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
};

export async function fetchPosts(limit = 10) {
    try {
        const { data, error } = await supabase.from('posts')
            .select('*, user: users (id, name, image), postLikes (*)')
            .order('created_at', { ascending: false }).limit(limit);

        if (error) {
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

};


export async function createPostLike(postLike) {
    try {
        const { data, error } = await supabase.from('postLikes')
            .insert(postLike).select().single();

        if (error) {
            console.log('post like error ', error);
            return { success: false, msg: 'could not like post' };
        }
        return { success: true, data };


    } catch (error) {
        console.log('post like error ', error);
        return { success: false, msg: 'could not like post' };
    }

};

export async function removePostLike(postId: string, userId: string | undefined) {
    try {
        const { error } = await supabase.from('postLikes')
            .delete().eq('userId', userId).eq('postId', postId)

        if (error) {
            console.log('post unlike error ', error);
            return { success: false, msg: 'could not unlike post' };
        }
        return {
            success: true,
        };

    } catch (error) {
        console.log('post unlike error ', error);
        return { success: false, msg: 'could not unlike post' };
    }

};