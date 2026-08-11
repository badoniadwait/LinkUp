import Icon from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import Loading from '@/components/Loading'
import PostCard from '@/components/PostCard'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { hp, wp } from '@/helpers/common'
import { supabase } from '@/lib/supabase'
import { fetchPosts } from '@/service/postService'
import { getUserdata } from '@/service/userService'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

let limit = 0;
const Home = () => {

  const router = useRouter();

  const { user, setAuth } = useAuth();

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);


  const getPosts = async () => {

    if (!hasMore) return null;
    limit = limit + 4;


    const res = await fetchPosts(limit);

    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  }



  async function handlePostEvent(payload) {
    if (payload.eventType == 'INSERT' && payload?.new?.id) {
      let newPost = { ...payload.new };

      let res = await getUserdata(newPost.userId);

      newPost.user = res.success ? res.data : {};

      setPosts((prev) => [newPost, ...prev]);
    }
  }

  async function handleCommentEvent(payload) {
    // COMMENT CREATED
    if (payload.eventType === 'INSERT') {
      const postId = payload.new?.postId;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (String(post.id) !== String(postId)) {
            return post;
          }

          const currentCount = post?.comments?.[0]?.count || 0;

          return {
            ...post,
            comments: [
              {
                count: currentCount + 1,
              },
            ],
          };
        })
      );
    }

    // COMMENT DELETED
    if (payload.eventType === 'DELETE') {
      const postId = payload.old?.postId;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (String(post.id) !== String(postId)) {
            return post;
          }

          const currentCount = post?.comments?.[0]?.count || 0;

          return {
            ...post,
            comments: [
              {
                count: Math.max(0, currentCount - 1),
              },
            ],
          };
        })
      );
    }
  }



  async function handleLikeEvent(payload) {

    if (payload.eventType === 'INSERT') {
      const postId = payload.new?.postId;
      const newLike = payload.new;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (String(post.id) !== String(postId)) {
            return post;
          }

          return {
            ...post,
            postLikes: [
              ...(post.postLikes || []),
              newLike,
            ],
          };
        })
      );
    }

    if (payload.eventType === 'DELETE') {
      const postId = payload.old?.postId;
      const deletedLikeId = payload.old?.id;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (String(post.id) !== String(postId)) {
            return post;
          }

          return {
            ...post,
            postLikes: (post.postLikes || []).filter(
              (like) => like.id !== deletedLikeId
            ),
          };
        })
      );
    }
  }

  async function handleNotificationEvent(payload) {
    if (payload.eventType === 'INSERT') {

      // Only handle notifications for the logged-in user
      if (String(payload.new?.receiverId) !== String(user?.id)) {
        return;
      }
    }
  }

  useEffect(() => {
    let postChannel = null;
    let notificationChannel = null;

    const setupRealtime = async () => {
      const existingChannels = supabase.getChannels();

      for (const channel of existingChannels) {
        if (
          channel.topic === 'realtime:posts' ||
          channel.topic === 'realtime:notifications'
        ) {
          await supabase.removeChannel(channel);
        }
      }



      postChannel = supabase
        .channel('posts')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'posts',
          },
          handlePostEvent
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'comments',
          },
          handleCommentEvent
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'comments',
          },
          handleCommentEvent
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'postLikes',
          },
          handleLikeEvent
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'postLikes',
          },
          handleLikeEvent
        )
        .subscribe();


      notificationChannel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `receiverId=eq.${user?.id}`,
          },
          handleNotificationEvent
        )
        .subscribe();

      await getPosts();
    };

    if (user?.id) {
      setupRealtime();
    }

    return () => {
      if (postChannel) {
        supabase.removeChannel(postChannel);
        postChannel = null;
      }

      if (notificationChannel) {
        supabase.removeChannel(notificationChannel);
        notificationChannel = null;
      }
    };
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      const refreshPosts = async () => {
        const res = await fetchPosts(limit);

        if (res.success) {
          setPosts(res.data);
        }
      };

      refreshPosts();
    }, [])
  );

  // async function onLogout() {
  //   setAuth(null);
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     Alert.alert('Sign out', 'Error signing out')
  //   }
  // }

  return (
    <ScreenWrapper bg='white'>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>LinkUp</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push('/(main)/notifications')}><Icon name='heart' size={hp(3.2)} strokeWidth={2} color={theme.colors.text} /></Pressable>
            <Pressable onPress={() => router.push('/(main)/newPost')}><Icon name='plus' size={hp(3.2)} strokeWidth={2} color={theme.colors.text} /></Pressable>
            <Pressable onPress={() => router.push('/(main)/profile')}><Avatar uri={user?.image} size={hp(4.3)} rounded={theme.radius.sm} style={{ borderWidth: 2 }} /></Pressable>

          </View>
        </View>
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={
            ({ item }) => <PostCard
              item={item}
              currentUser={user}
              router={router}
            />
          }

          onEndReached={() => {
            getPosts();
          }}

          onEndReachedThreshold={0}



          ListFooterComponent={
            hasMore ? (
              <View style={{
                marginVertical: posts.length == 0 ? 200 : 30
              }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: 30, }}>
                <Text style={styles.noPosts}>
                  no more posts
                </Text>
              </View>
            )
          }
        />
      </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(0.5),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.gray,
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textDark,
    letterSpacing: 0.5,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  listStyle: {
    paddingTop: hp(1.8),
    paddingBottom: hp(1),
  },
  noPosts: {
    textAlign: 'center',
    fontSize: hp(1.8),
    color: theme.colors.gray,
    fontWeight: theme.fonts.medium,
    marginTop: hp(1),
  },
});