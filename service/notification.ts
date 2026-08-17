import { supabase } from "@/lib/supabase";

export async function createNotification(notification) {
    try {
        const { data, error } = await supabase.from('notifications')
            .insert(notification).select().single();

        if (error) {
            console.log('notification error ', error);
            return { success: false, msg: 'something went wrong' };
        }
        return { success: true, data };

    } catch (error) {
        console.log('notification error ', error);
        return { success: false, msg: 'something went wrong' };
    }

};

export async function fetchNotifications(receiverId: string | string[]) {
    try {
        const { data, error } = await supabase.from('notifications')
            .select('*, senderId(id, name, image)')
            .eq('receiverId', receiverId).order('created_at', { ascending: false});

        if (error) {
            console.log('fetch notifications error ', error);
            return { success: false, msg: 'could not fetch notifications' };
        }
        else {
            return { success: true, data };

        }

    } catch (error) {
        console.log('fetch notifications error ', error);
        return { success: false, msg: 'could not fetch notifications' };
    }

};