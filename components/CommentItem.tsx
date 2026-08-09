import Icon from '@/assets/icons'
import { theme } from '@/constants/theme'
import moment from 'moment'
import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from './Avatar'
import { Comment } from './types/Comment'

export const CommentItem = ({ item, canDelete = false, onDelete }: { item: Comment, canDelete?: boolean, onDelete?: (comment: Comment) => void }) => {
    const createdAt = moment(item?.created_at).format('MMM D');

    function handleDelete() {
        Alert.alert('Confirm', 'Delete comment?', [
            {
                text: 'No',
                style: 'cancel'
            }, {
                text: 'Yes',
                onPress: () => onDelete?.(item),
                style: 'destructive'
            }
        ])
    }

    return (
        <View style={styles.container}>
            <Avatar uri={item?.user?.image} />
            <View style={styles.content}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.text}>
                            {item?.user?.name}
                        </Text>
                        <Text style={[styles.text, { color: theme.colors.textLight }]}>
                            {createdAt}
                        </Text>
                    </View>
                    {
                        canDelete && (
                            <TouchableOpacity onPress={handleDelete}>
                                <Icon name='delete' size={20} color={theme.colors.rose} />
                            </TouchableOpacity>
                        )
                    }
                </View>
                <Text style={[styles.text, { fontWeight: 'normal' }]}>
                    {item?.text}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})