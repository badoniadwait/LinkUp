import Icon from '@/assets/icons';
import { CommentItem } from '@/components/CommentItem';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import PostCard from '@/components/PostCard';
import { Comment } from '@/components/types/Comment';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { hp } from '@/helpers/common';
import { supabase } from '@/lib/supabase';
import { createComment, fetchPostDetails, removeComment } from '@/service/postService';
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
    if(payload.new) {
      let newComment = {...payload.new};
      let res = await getUserdata(newComment.userId);
      newComment.user = res.success ? res?.data : {};
      setPost((prev) => {
        return {
          ...prev,
          comments:[newComment, ...prev.comments]
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
    let commentChannel = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `postId=eq.${postId}`
        },
        handleNewComment
      )
      .subscribe();

    getPostDetails(postId);

    return () => { supabase.removeChannel(commentChannel); }
  }, []);

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
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} >
        <PostCard item={{ ...post, comments: [{ count: post?.comments?.length }] }}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
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

          <View style={{ marginVertical: 15, gap: 17 }}>
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
                <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
                  Be first to comment on this post!
                </Text>
              )
            }

          </View>

        </View>

      </ScrollView>
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({})