import Icon from '@/assets/icons';
import { Avatar } from '@/components/Avatar';
import { Header } from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import type { User } from "@/components/types/Users";
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { hp, wp } from '@/helpers/common';
import { supabase } from '@/lib/supabase';
import { useRouter, type Router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  return (
    <ScreenWrapper>
      <UserHeader user={user} router={router} handleLogout={handleLogout} />



    </ScreenWrapper>
  )
  async function onLogout() {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Sign out', 'Error signing out')
    }
  }
  async function handleLogout() {
    Alert.alert('Confirm', 'Are you sure you want to logout?', [
      {
        text: "Cancel",
        onPress: () => {
          console.log('canceled')
        },
        style: 'cancel',
      },
      {
        text: "Logout",
        onPress: () => {
          return onLogout();
        },
        style: 'destructive',
      },

    ]);
  }
}


const UserHeader = ({ user, router, handleLogout }:
  {
    user: User;
    router: Router;
    handleLogout: () => void;
  }
) => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
      <Header title='Profile' mb={30} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} >
        <Icon name='logout' color={theme.colors.rose} />
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar uri={user?.image} size={hp(12)} rounded={theme.radius.xxl * 1.6} />
            <Pressable style={styles.editIcon} onPress={() => router.push('/(main)/editProfile')}>
              <Icon name='edit' strokeWidth={2.5} size={20} />
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', gap: 4, }}>
            <Text style={styles.userName}>
              {user && user.name}
            </Text>
            <Text style={styles.infoText}>
              {user && user.address}
            </Text>
          </View>

          <View style={{ gap: 10 }}>

            <View style={styles.info}>
              <Icon name={'mail'} size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>
                {user && user.email}
              </Text>
            </View>

            {user && user.phoneNumber && (
              <View style={styles.info}>
                <Icon name={'call'} size={20} color={theme.colors.textLight} />
                <Text style={styles.infoText}>
                  {user && user.phoneNumber}
                </Text>
              </View>
            )}

            {user && user.bio && (
              <Text style={styles.infoText}>
                {user && user.bio}
              </Text>
            )}


          </View>

        </View>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: wp(32),
    backgroundColor: theme.colors.primary,
    padding: 6,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textDark,
  },
  infoText: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    zIndex: 1,
  },
})