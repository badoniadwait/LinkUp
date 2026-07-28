import Icon from '@/assets/icons'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Login', 'please fill all the fields');
      return;
    }


    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const {error} = await supabase.auth.signInWithPassword({
      email,password
    });

    setLoading(false);

    console.log(error);
    if(error) {
      Alert.alert('Login', error.message);
    }

  }

  return (
    <ScreenWrapper bg='white'>
      <View style={styles.container}>
        <BackButton onPress={() => router.back()} />

        <View>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>

        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text, fontWeight: theme.fonts.bold }}>Login to continue</Text>
          <Input icon={<Icon name='mail' size={26} strokeWidth={1.6} />}
            placeholder={'Enter your email'}
            onChangeText={value => emailRef.current = value} />
          <Input icon={<Icon name='lock' size={26} strokeWidth={1.6} />}
            placeholder={'Enter your password'}
            secureTextEntry
            onChangeText={value => passwordRef.current = value} />
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
          <Button title={'Login'} loading={loading} onPress={() => onSubmit()}></Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Do not have an account? </Text>
          <Pressable onPress={() => router.push('/signup')}>
            <Text style={[styles.footerText, { color: theme.colors.primaryDark }]}>Sign up</Text>
          </Pressable>
        </View>

      </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    gap: hp(4),
  },

  welcomeText: {
    fontSize: hp(4.5),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textDark,
    lineHeight: hp(5.5),
  },

  form: {
    gap: hp(2.5),
  },

  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});