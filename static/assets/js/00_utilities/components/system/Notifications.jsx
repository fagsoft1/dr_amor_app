import React from 'react';
import {connect} from 'react-redux';
import Notifications from 'react-notification-system-redux';

class Notification extends React.Component {

    render() {
        const {notifications} = this.props;
        const style = {
            NotificationItem: { // Override the notification item
                DefaultStyle: { // Applied to every notification, regardless of the notification level
                    margin: '10px 5px 2px 1px'
                },

                error: {
                    color: 'red'
                },

                success: {
                    color: 'green'
                }
            }
        };

        return (
            <Notifications
                notifications={notifications}
                style={style}
            />
        );
    }
}

const mapStateToProps = (state) => ({notifications: state.notifications});

export default connect(mapStateToProps, null)(Notification);