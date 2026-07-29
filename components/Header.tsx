import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BackButton from './BackButton';

export const Header = ({
    mb = 10, title, showBackButton = true
}: {
    title: string;
    showBackButton?: boolean;
    mb?: number;
}) => {
    const router = useRouter()
    return (
        <View style={[styles.container, { marginBottom: mb }]}>
            {
                showBackButton && (
                    <View style={styles.backButton}>
                        <BackButton onPress={() => router.back()} />
                    </View>
                )
            }
            <Text style={styles.title}>
                {title || ''}
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        gap: 5,
    },
    title: {
        fontSize: hp(2.7),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textDark,
        
    },
    backButton:{
        position: 'absolute',
        left:0
    }
})