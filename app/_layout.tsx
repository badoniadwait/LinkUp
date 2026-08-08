import type { User } from "@/components/types/Users";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getUserdata } from '@/service/userService';
import { User as AuthUser } from "@supabase/supabase-js";
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';


const _layout = () => {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    )
}

const MainLayout = () => {

    const { setUserData, setAuth } = useAuth();
    const router = useRouter();

    const [users, setUsers] = useState<User[] | null>([]);
    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setAuth(session?.user);
                updateUserData(session?.user);
                router.replace('/(main)/home')
            }
            else {
                setAuth(null);
                router.replace('/welcome')
            }
        })
    }, [])


    async function updateUserData(user: AuthUser) {
        let res = await getUserdata(user?.id);
        if (res?.success)
            setUserData(res.data);
    }

    return (
        <>
            <StatusBar style="dark" />
            <Stack
                screenOptions={
                    { headerShown: false }
                }>
                <Stack.Screen
                    name="(main)/postDetails"
                    options={{
                        presentation: 'modal'
                    }}
                />
            </Stack>
        </>
    )
}

export default _layout;
