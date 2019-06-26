import React, {Fragment, useState, useEffect, memo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {withRouter} from "react-router-dom";
import * as actions from "./../../../01_actions/01_index";


const RouteLocationManager = (props) => {
    const [path, setPath] = useState(props.location.pathname);
    const dispatch = useDispatch();
    useEffect(() => {
        const current_path_root = props.location.pathname.split('/').slice(1, 3);
        const last_path_root = path.split('/').slice(1, 3);
        if (!_.isEqual(current_path_root, last_path_root)) {
            setPath(props.location.pathname);
            dispatch(actions.loadUser());
        }
    }, [props.location.pathname]);
    return <Fragment></Fragment>
};
export default withRouter(memo(RouteLocationManager))