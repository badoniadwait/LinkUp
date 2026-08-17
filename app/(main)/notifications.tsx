import { Header } from '@/components/Header';
import NotificationItem from '@/components/NotificationItem';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Notification } from '@/components/types/Notification';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { hp, wp } from '@/helpers/common';
import { fetchNotifications } from '@/service/notification';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Notifications = () => {

  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { user } = useAuth();

  const getNotifictons = async () => {
    let res = await fetchNotifications(user?.id);
    if (res.success) {
      setNotifications(res.data);
    }
  }
  useEffect(() => {
    getNotifictons()
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title='Notifications' />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
          {notifications.map((item) => (
            <NotificationItem
              item={item}
              key={item?.id}
              router={router}
            />
          )
          )}

          {
            notifications.length == 0 && (
              <Text style={styles.noData}>
                no Notifications yet.
              </Text>
            )

          }
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default Notifications

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: wp(5),
    paddingTop: hp(0.5),
  },
  listStyle: {
    flexGrow: 1,
    paddingTop: hp(2),
    paddingBottom: hp(4),
    gap: hp(1.2),
  },
  noData: {
    marginTop: hp(12),
    paddingHorizontal: wp(8),
    textAlign: 'center',
    fontSize: hp(1.9),
    lineHeight: hp(2.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
})
