import Icon from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { hp, wp } from '@/helpers/common'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const Home = () => {

  const router = useRouter();

  const { user, setAuth } = useAuth();

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
})