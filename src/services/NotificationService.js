import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

class NotificationService {
    static async registerForPushNotificationsAsync() {
        if (Platform.OS === 'web') return;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return false;
        }
        return true;
    }

    static async scheduleDailyReminder(hour = 20, minute = 0) {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Time to Read Quran",
                    body: "Keep up your streak! Read your daily pages.",
                },
                trigger: {
                    hour: hour,
                    minute: minute,
                    repeats: true,
                },
            });
            return true;
        } catch (error) {
            console.log("Error scheduling notification:", error);
            return false;
        }
    }

    static async cancelAll() {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
        } catch (error) {
            console.log("Error cancelling notifications:", error);
        }
    }
}

export default NotificationService;
