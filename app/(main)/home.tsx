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
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

let limit = 0;
const Home = () => {

  const router = useRouter();

  const { user, setAuth } = useAuth();

  const [posts, setPosts] = useState([]);


  const getPosts = async () => {
    limit = limit + 10;

    console.log('fetching posts: ', limit);

    const res = await fetchPosts(limit);

    if (res.success) {
      setPosts(res.data);
    }
  }

  async function handlePostEvent(payload) {
    if (payload.eventType == 'INSERT' && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserdata(newPost.usserId);
      newPost.user = res.success ? res.data : {};
      setPosts((prev) => [newPost, ...prev]);
    }
  }

  useEffect(() => {

    let postChannel = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostEvent)
      .subscribe();

    getPosts();

    return () => {
      supabase.removeChannel(postChannel);
    }
  }, []);

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
          ListFooterComponent={
            (
              <View style={{
                marginVertical: posts.length == 0 ? 200 : 30
              }}>
                <Loading />
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
    paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textDark,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingTop: 20,
  }
})