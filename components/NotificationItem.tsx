import { theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import { Router } from 'expo-router';
import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from './Avatar';
import { Notification } from './types/Notification';

const NotificationItem = ({ item, router }: {
    item: Notification;
    router: Router
}) => {

    function handleClick() {
        const { postId, commentId } = JSON.parse(item.data)

        const actualCommentId =
            typeof commentId === 'object'
                ? commentId?.data?.id
                : commentId



        router.push({
            pathname: '/postDetails',
            params: {
                postId: String(postId),
                commentId: String(actualCommentId),
            },
        })
    }

    const createdAt = moment(item.created_at).format('MMM D')

    return (
        <TouchableOpacity style={styles.container} onPress={handleClick}>
            <Avatar uri={item.senderId.image} size={hp(5)} />
            <View style={styles.nameTitle}>
                <Text style={styles.text}>
                    {
                        item.senderId.name
                    }
                </Text>
                <Text style={[styles.text, { color: theme.colors.textDark }]}>
                    {
                        item.title
                    }
                </Text>
            </View>
            <Text style={[styles.text, { color: theme.colors.textLight }]}>

                {
                    createdAt
                }
            </Text>
        </TouchableOpacity>
    )
}

export default NotificationItem

const styles = StyleSheet.create({})