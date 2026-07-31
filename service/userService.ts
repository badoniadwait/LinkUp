import { User } from "@/components/types/Users";
import { supabase } from "@/lib/supabase";

export async function getUserdata(userId: string) {
    try {
        const { data, error } = await supabase.from("users").select().eq('id', userId).single();
        if (error) {
            return {success:false, msg: error.message};
        }
        return {success:true, data};
    } catch (error) {
        console.log(error);
    }
}

export async function updateUser(userId: string, data: User) {
    try {
        const { error } = await supabase.from("users").update(data).eq('id', userId);
        if (error) {
            return {success:false, msg: error.message};
        }
        return {success:true, data};
    } catch (error) {
        console.log(error);
    }
}