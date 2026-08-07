import Icon from '@/assets/icons';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
import { getSupabaseFileUrl } from '@/service/imageService';
import { Image } from 'expo-image';
import { Router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RenderHTML } from 'react-native-render-html';
import { Avatar } from './Avatar';
import { User } from './types/Users';



const textStyles = {
    color: theme.colors.dark,
    fontSize: hp(1.75),
}
const tagStyles = {
    div: textStyles,
    p: textStyles,
    ol: textStyles,
    h1: {
        color: theme.colors.dark
    },
    h4: {
        color: theme.colors.dark
    },
}

const PostCard = ({ item, currentUser, router, hasShadow = true }: {
    item: any;
    currentUser: User | null;
    router: Router;
    hasShadow?: boolean;
}) => {


    let liked = false;
    let likes = [];

    const videoSource =
        item?.file && item?.file?.includes('postVideos')
            ? getSupabaseFileUrl(item.file)
            : null;
    const player = useVideoPlayer(videoSource, (player) => {
        player.loop = true;
    });

    const shadowStyles = {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    }

    const createdAt = moment(item?.created_at).format('MMM D')

    function onPostDetails() {
        throw new Error('Function not implemented.');
    }

    return (
        <View style={[styles.container, hasShadow && shadowStyles]}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Avatar
                        size={hp(4.5)}
                        uri={item?.user?.image}
                        rounded={theme.radius.md}
                    />
                    <View style={{ gap: 2 }}>
                        <Text style={styles.username}>{item?.user?.name}</Text>
                        <Text style={styles.postTime}>{createdAt}</Text>
                    </View>

                </View>

                <TouchableOpacity onPress={onPostDetails}>
                    <Icon name='threeDotsHorizontal' size={hp(3.5)} strokeWidth={3} color={theme.colors.text}></Icon>
                </TouchableOpacity>

            </View>

            <View style={styles.content}>
                <View style={styles.postBody}>
                    {
                        item?.body && (<RenderHTML contentWidth={wp(100)} source={{ html: item?.body }}
                            tagsStyles={tagStyles}
                        />)
                    }
                </View>

                {
                    item?.file && item?.file?.includes('postImages') && (
                        <Image source={getSupabaseFileUrl(item?.file)} transition={100} style={styles.postMedia}
                            contentFit='cover' />
                    )
                }
                {item?.file &&
                    item.file.includes('postVideos') &&
                    videoSource && (
                        <VideoView
                            style={[
                                styles.postMedia,
                                {
                                    height: hp(30),
                                },
                            ]}
                            player={player}
                            fullscreenOptions={
                                { enable: true }
                            }
                            allowsPictureInPicture
                            nativeControls
                        />
                    )}

            </View>

            <View style={styles.footer} >
                <View style={styles.footerButton}>
                    <TouchableOpacity >
                        <Icon name='heart' fill={liked ? theme.colors.rose : 'transparent'} color={liked ? theme.colors.rose : theme.colors.textLight} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{likes?.length}</Text>
                </View>
            </View>

            <View style={styles.footer} >
                <View style={styles.footerButton}>
                    <TouchableOpacity >
                        <Icon name='comment' color={theme.colors.textLight} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.count}>
                        0
                    </Text>
                </View>
            </View>

            <View style={styles.footer} >
                <View style={styles.footerButton}>
                    <TouchableOpacity >
                        <Icon name='share' color={theme.colors.textLight} size={24} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: theme.radius.xxl,
        padding: wp(4),
        marginBottom: hp(2),
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },

    username: {
        color: theme.colors.text,
        fontSize: hp(1.8),
        fontWeight: '600',
    },

    postTime: {
        color: theme.colors.textLight,
        fontSize: hp(1.5),
    },

    content: {
        marginTop: hp(1.5),
    },

    postBody: {
        marginBottom: hp(1),
    },

    postMedia: {
        width: '100%',
        height: hp(35),
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
    },
});