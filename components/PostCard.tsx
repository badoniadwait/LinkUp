import Icon from '@/assets/icons';
import { theme } from '@/constants/theme';
import { hp, stripHTMLTags, wp } from '@/helpers/common';
import { downloadFile, getSupabaseFileUrl } from '@/service/imageService';
import { createPostLike, removePostLike } from '@/service/postService';
import { Image } from 'expo-image';
import { Router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useVideoPlayer, VideoView } from 'expo-video';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RenderHTML } from 'react-native-render-html';
import { Avatar } from './Avatar';
import Loading from './Loading';
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

const PostCard = ({ item, currentUser, router, hasShadow = true, showMoreIcon = true }: {
    item: any;
    currentUser: User | null;
    router: Router;
    hasShadow?: boolean;
    showMoreIcon?: boolean;
}) => {

    const [loading, setLoading] = useState(false);
    async function onShare() {
        try {
            setLoading(true);

            const message = stripHTMLTags(item?.body);

            // Text-only post
            if (!item?.file) {
                await Share.share({
                    message,
                });
                return;
            }

            const fileUrl = getSupabaseFileUrl(item.file)?.uri;

            if (!fileUrl) {
                await Share.share({
                    message,
                });
                return;
            }

            const localUri = await downloadFile(fileUrl);

            if (!localUri) {
                Alert.alert('Share', 'Could not download the file.');
                return;
            }

            const canShare = await Sharing.isAvailableAsync();

            if (!canShare) {
                Alert.alert('Share', 'File sharing is not available.');
                return;
            }

            const isImage = item.file.includes('postImages');

            await Sharing.shareAsync(localUri, {
                mimeType: isImage ? 'image/png' : 'video/mp4',
                dialogTitle: 'Share post',
            });

        } catch (error) {
            console.log('share error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function onLike() {

        if (liked) {
            let updateLikes = likes.filter((like) => like.userId != currentUser?.id)

            setLikes([...updateLikes])
            let res = await removePostLike(item?.id, currentUser?.id);

            if (!res?.success) {
                Alert.alert('Post', 'something went wrong!');
            }
        }
        else {
            let data = {
                userId: currentUser?.id,
                postId: item?.id,
            }

            setLikes([...likes, data])
            let res = await createPostLike(data);

            if (!res?.success) {
                Alert.alert('Post', 'something went wrong!');
            }
        }


    }

    const [likes, setLikes] = useState([]);

    useEffect(() => {
        setLikes(item?.postLikes);
    }, [])

    let liked = likes.filter((like) => like.userId == currentUser?.id)[0] ? true : false;

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

    function openPostDetails() {
        if (!showMoreIcon) return null;
        router.push({ pathname: '/postDetails', params: { postId: item?.id } })
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

                {
                    showMoreIcon && (
                        <TouchableOpacity onPress={openPostDetails}>
                            <Icon name='threeDotsHorizontal' size={hp(3.5)} strokeWidth={3} color={theme.colors.text}></Icon>
                        </TouchableOpacity>
                    )
                }

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
                    <TouchableOpacity onPress={onLike}>
                        <Icon name='heart' fill={liked ? theme.colors.rose : 'transparent'} color={liked ? theme.colors.rose : theme.colors.textLight} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{likes?.length}</Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={openPostDetails} >
                        <Icon name='comment' color={theme.colors.textLight} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.count}>
                        {item?.comments[0]?.count}
                    </Text>
                </View>
                <View style={styles.footerButton}>

                    {
                        loading ? (
                            <Loading size='small' />
                        ) : (
                            <TouchableOpacity onPress={onShare}>
                                <Icon name='share' color={theme.colors.textLight} size={24} />
                            </TouchableOpacity>
                        )
                    }

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
        borderWidth: 1,
        borderColor: theme.colors.gray,
        borderCurve: 'continuous',
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.8),
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
        color: theme.colors.textDark,
        fontSize: hp(1.9),
        fontWeight: theme.fonts.semibold,
    },

    postTime: {
        color: theme.colors.textLight,
        fontSize: hp(1.4),
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
        borderCurve: 'continuous',
        overflow: 'hidden',
        backgroundColor: theme.colors.gray,
        marginBottom: hp(0.5),
    },

    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(1),
        borderTopWidth: 0.5,
        borderTopColor: theme.colors.gray,
    },

    footerButton: {
        marginTop: 9,
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },

    count: {
        fontSize: hp(1.7),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.semibold,
    },
});