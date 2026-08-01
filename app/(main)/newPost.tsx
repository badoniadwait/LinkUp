import Icon from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import Button from '@/components/Button'
import { Header } from '@/components/Header'
import RichTextEditor from '@/components/RichTextEditor'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { hp } from '@/helpers/common'
import { getSupabaseFileUrl } from '@/service/imageService'
import { createUpdatePost } from '@/service/postService'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { VideoView, useVideoPlayer } from 'expo-video'
import React, { useRef, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RichEditor } from 'react-native-pell-rich-editor'

const NewPost = () => {

  const { user } = useAuth();
  const bodyRef = useRef('');
  const editorRef = useRef<RichEditor | null>(null); const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset | string | null>(null);
  async function onPick(
    isImage: boolean
  ) {
    const mediaConfig = isImage
      ? {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
        quality: 0.6,
      }
      : {
        mediaTypes: ['videos'],
        allowsEditing: true,
      };

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }
  const isLocalFile = (file) => {
    if (!file) return null;
    if (typeof file == 'object') return true;
    return false;
  }

  function getFileType(file) {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }


    if (file.includes('postImages')) {
      return 'image';
    }
    return 'video';
  }

  function getFileUri(file) {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  }


  const videoUri =
    file && getFileType(file) === 'video'
      ? getFileUri(file) ?? ''
      : '';

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
  });



  async function onSubmit() {

    if (!bodyRef.current && !file) {
      Alert.alert('Post', 'please choose an image or add the post body!');
      return;
    }

    let data = {
      file, body: bodyRef.current, userId: user?.id,
    }

    setLoading(true);

    let res = await createUpdatePost(data);
    setLoading(false);

    if (res.success) {
      setFile(null);
      bodyRef.current = '';
      editorRef.current?.setContentHTML('');
      router.back();
    }
    else {
      Alert.alert('Post', 'Failed to upload');
    }

  }

  return (
    <ScreenWrapper bg='white'>
      <View style={styles.container}>
        <Header title='Create Post' />

        <ScrollView contentContainerStyle={{ gap: 20 }}>
          <View style={styles.header}>
            <Avatar uri={user?.image} size={hp(6.5)} rounded={theme.radius.xl} />

            <View style={{ gap: 3 }}>
              <Text style={styles.username}>
                {
                  user && user.name
                }
              </Text>

              <Text style={styles.publicText}>
                Public
              </Text>
            </View>

            <View style={
              styles.textEditor
            }>
              <RichTextEditor editorRef={editorRef} onChange={(body) => bodyRef.current = body} />
            </View>

            {file && (
              <View style={styles.file}>
                {getFileType(file) === 'video' ? (
                  <VideoView
                    player={player}
                    style={{ flex: 1 }}
                    nativeControls
                    contentFit="cover"
                  />
                ) : (
                  <Image
                    source={{ uri: getFileUri(file)! }}
                    style={{ flex: 1 }}
                    contentFit="cover"
                  />
                )}

                <Pressable
                  style={styles.closeIcon}
                  onPress={() => {
                    player.pause();
                    setFile(null);
                  }}
                >
                  <Icon name="delete" size={20} color="white" />
                </Pressable>
              </View>
            )}

          </View>

          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your Post</Text>
            <View style={styles.mediaIcon}>

              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name='image' size={30} color={theme.colors.dark} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name='video' size={30} color={theme.colors.dark} />
              </TouchableOpacity>

            </View>

          </View>

        </ScrollView>

        <Button buttonStyle={{
          height: hp(6.2)
        }}
          title='Post'
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />

      </View>
    </ScreenWrapper>
  )

}

export default NewPost;

const styles = StyleSheet.create({
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous',
  }
})