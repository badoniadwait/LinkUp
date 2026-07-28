import Icon from '@/assets/icons';
import { theme } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

const BackButton = ({ size = 26, onPress }: { size?: number, onPress: () => void }) => {
    return (
        <Pressable onPress={onPress} style={styles.buttonStyle}>
            <Icon name='arrowLeft' strokeWidth={2.5} size={size} color={theme.colors.text} />
        </Pressable>
    )
};

export default BackButton

const styles = StyleSheet.create({
    buttonStyle: {
        alignSelf: 'flex-start',
        padding: 3,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0,0.07)'
    },
})