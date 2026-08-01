import Icon from '@/assets/icons'
import Button from '@/components/Button'
import { Header } from '@/components/Header'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import type { User } from '@/components/types/Users'
import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { hp } from '@/helpers/common'
import { getUserImageSrc, uploadFile } from '@/service/imageService'
import { updateUser } from '@/service/userService'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

const EditProfile = () => {

  const router = useRouter();

  const { user: currentUser, setUserData } = useAuth();

  const [user, setUser] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(false)

  const imageSource =
    typeof user?.image === 'object'
      ? { uri: user.image?.uri }
      : getUserImageSrc(user?.image); useEffect(() => {
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
              <Pressable style={styles.editIcon} onPress={onPickImage}>
                <Icon name='camera' size={22} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text, fontWeight: theme.fonts.medium, alignSelf: 'center', paddingTop: 15 }}>
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
    let userData = { ...user };

    if (!userData.name || !userData.phoneNumber || !userData.address || !userData.bio || !userData.image) {
      Alert.alert('Profile', 'Please fill all the fields');
      return;
    }
    setLoading(true);

    if (typeof userData.image == 'object') {
      let imageRes = await uploadFile({
        folderName: 'profiles',
        fileUri: userData.image.uri,
        isImage: true,
      });

      if (imageRes.success) {
        userData.image = imageRes.data;
      }
      else {
        userData.image = null;
      }
    }

    const res = await updateUser(currentUser?.id, userData);
    setLoading(false);
    if (res?.success) {
      setUserData(res?.data);
      router.back();
    }
  }


  async function onPickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] })
    }
  }

}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hp(2),
  },
  form: {
    gap: hp(2.5),
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xxl * 1.6,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  bio: {
    height: hp(15),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: hp(1),
  },
  editIcon: {
    alignSelf: 'center',
    bottom: 0,
    padding: 6,
    marginBottom: 5,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
})