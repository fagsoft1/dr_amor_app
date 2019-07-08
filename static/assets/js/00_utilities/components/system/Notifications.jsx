import React, {memo} from 'react';
import {useSelector} from 'react-redux';
import Notifications from 'react-notification-system-redux';

const styles = {
    NotificationItem: {
        DefaultStyle: {margin: '10px 5px 2px 1px'},
        error: {
            color: 'red'
        },
        success: {
            color: 'green'
        }
    }
};
const Notification = memo(() => {
    const notifications = useSelector(state => state.notifications);
    return (
        <Notifications
            notifications={notifications}
            style={styles}
        />
    );
});

export default Notification;