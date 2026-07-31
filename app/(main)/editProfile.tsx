import Icon from '@/assets/icons'
import Button from '@/components/Button'
import { Header } from '@/components/Header'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import type { User } from '@/components/types/Users'
import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { hp } from '@/helpers/common'
import { getUserImageSrc } from '@/service/imageService'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

const EditProfile = () => {

  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(false)

  const imageSource = getUserImageSrc(user?.image);
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title={'Edit Profile'} />

          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable onPress={onPickImage}>
                <Icon name='camera' size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details.
            </Text>


            <Input icon={<Icon name='user' />} placeholder='Enter your name' value={user?.name}
              onChangeText={(value: string | null) => {
                if (!user) return;

                setUser({
                  ...user,
                  name: value,
                });
              }}
            />
            <Input icon={<Icon name='call' />} placeholder='Enter your phone number' value={user?.phoneNumber}
              onChangeText={(value: string | null) => {
                if (!user) return;

                setUser({
                  ...user,
                  phoneNumber: value,
                });
              }}
            />
            <Input icon={<Icon name='location' />} placeholder='Enter your address' value={user?.address}
              onChangeText={(value: string | null) => {
                if (!user) return;

                setUser({
                  ...user,
                  address: value,
                });
              }}
            />
            <Input placeholder='Enter your bio' value={user?.bio}
              multiline={true}
              containerStyle={styles.bio}
              onChangeText={(value: string | null) => {
                if (!user) return;

                setUser({
                  ...user,
                  bio: value,
                });
              }}
            />

            <Button title='update' loading={loading} onPress={onSubmit} />


          </View>

        </ScrollView>

      </View>
    </ScreenWrapper>
  )
  async function onSubmit() {
    let userData =  {...user};

    if(!userData.name || !userData.phoneNumber || !userData.address || !userData.bio) {
      Alert.alert('Profile', 'Please fill all the fields');
    }
  }
  async function onPickImage() {

  }

}

export default EditProfile

const styles = StyleSheet.create({
  avatar: {}
})