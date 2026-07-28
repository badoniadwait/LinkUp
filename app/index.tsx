import Loading from '@/components/Loading';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function Index() {

    const router = useRouter();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Loading />
        </View>
    )
}