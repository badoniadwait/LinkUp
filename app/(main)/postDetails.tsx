import Icon from '@/assets/icons';
import { CommentItem } from '@/components/CommentItem';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PostCard from '@/components/PostCard';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Comment } from '@/components/types/Comment';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { hp, wp } from '@/helpers/common';
import { supabase } from '@/lib/supabase';
import { createComment, fetchPostDetails, removeComment, removePost } from '@/service/postService';
import { getUserdata } from '@/service/userService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PostDetails = () => {

  const { user } = useAuth();

  const router = useRouter();

  const { postId } = useLocalSearchParams();

  const [post, setPost] = useState(null);

  const [startLoading, setStartLoading] = useState(true);

  const [loading, setLoading] = useState(false);

  const inputRef = useRef<string | null>(null);
  const commentRef = useRef<string | null>('');

  async function handleNewComment(payload) {
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserdata(newComment.userId);
      newComment.user = res.success ? res?.data : {};
      setPost((prev) => {
        return {
          ...prev,
          comments: [newComment, ...prev.comments]
        }
      })
    }
  }

  useEffect(() => {
    if (postId) {
      getPostDetails(postId);
    }
  }, [postId]);


  useEffect(() => {
    if (!postId) return;

    const commentChannel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, [postId]);

  async function getPostDetails(id: string | string[]) {
    setStartLoading(true);

    const res = await fetchPostDetails(id);

    setStartLoading(false);

    if (res.success) {
      setPost(res.data);
    }
  }

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    )
  }

  if (!post) {
    return (
      <View style={[styles.center, { justifyContent: 'flex-start', marginTop: 100 }]}>
        <Text style={styles.notFound}>Post not Found!</Text>
      </View>
    )
  }

  async function onNewComment() {
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    }

    setLoading(true);
    const res = await createComment(data);
    setLoading(false);

    if (res.success) {
      inputRef.current?.clear();
      inputRef.current = "";
    }
    else {
      Alert.alert('Comment', res.msg);
    }
  }
  async function onDelete(comment: Comment) {
    let res = await removeComment(comment?.id);

    if (res.success) {
      setPost((prev) => {
        let updatedPost = { ...prev };
        updatedPost.comments = updatedPost.comments.filter((c) => c.id != comment?.id)
        return updatedPost;
      })
    }
    else {
      Alert.alert('Comment', res.msg);
    }
  }

  async function onDeletePost(item) {
    let res = await removePost(post?.id);

    if ((await res).success) {
      router.back();
    }
    else {
      Alert.alert('Post', res.msg)
    }
  }

  async function onEditPost(item) {
    console.log('edit Post')
    router.back();
    router.push({pathname: '/newPost', params: {...item}});
  }

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} >
        <PostCard
          item={{
            ...post,
            comments: [{ count: post?.comments?.length }],
          }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
          onLikeChange={(likes) => {
            setPost((prev) => ({
              ...prev,
              postLikes: likes,
            }));
          }}
          showDelete={true}
          onDelete={onDeletePost}
          onEdit={onEditPost}
        />

        <View style={styles.inputContainer}>
          <Input placeholder="Type comment..."
            inputRef={inputRef}
            onChangeText={(value: string) => commentRef.current = value}
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{ flex: 1, height: hp(6.2), borderRadius: theme.radius.xl }} />

          {
            loading ? (
              <View style={styles.loading}>
                <Loading />
              </View>
            ) : (
              <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                <Icon name='send' color={theme.colors.primaryDark} />
              </TouchableOpacity>
            )
          }

        </View>

        <View style={styles.commentList}>
          {
            post?.comments?.map((comment) => (
              <CommentItem
                key={comment?.id?.toString()}
                item={comment}
                canDelete={user?.id == comment.userId || user?.id == post.userId}
                onDelete={onDelete}
              />
            ))
          }

          {
            post?.comments?.length == 0 && (
              <Text style={styles.noComments}>
                Be first to comment on this post!
              </Text>
            )
          }

        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}

export default PostDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(4),
  },

  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    paddingTop: hp(1.5),
    paddingBottom: hp(1),
    paddingHorizontal: wp(1),
  },

  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendIcon: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
  },

  commentList: {
    marginTop: hp(2),
    marginBottom: hp(2),
    paddingHorizontal: wp(1),
    gap: hp(2),
  },

  noComments: {
    color: theme.colors.text,
    marginTop: hp(1),
    marginLeft: wp(1),
  },
});