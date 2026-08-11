import { Header } from '@/components/Header';
import NotificationItem from '@/components/NotificationItem';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Notification } from '@/components/types/Notification';
import { useAuth } from '@/contexts/AuthContext';
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

const styles = StyleSheet.create({})