import React, {Fragment} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import * as actions from "./../../../01_actions/01_index";

class RouteLocationManager extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.props.loadUser();
        }
    }

    render() {
        return <Fragment></Fragment>;
    }
}

export default withRouter(connect(null, actions)(RouteLocationManager))