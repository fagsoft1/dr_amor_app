import React from 'react';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from "prop-types";

export const stylesIconos = {
    smallIcon: {
        fontSize: '15px',
        width: 15,
        height: 15,
        padding: 0,
    },
    small: {
        width: 20,
        height: 20,
        padding: 1,
    }
};

export const IconButtonTable = (props) => {
    const {onClick, iconClassName} = props;
    return (
        <IconButton
            style={stylesIconos.small}
            iconStyle={stylesIconos.smallIcon}
            iconClassName={iconClassName}
            onClick={onClick}
            {...props}
        />
    )
};
IconButtonTable.propTypes = {
    iconClassName: PropTypes.string,
    onClick: PropTypes.func
};

export const IconButtonContainer = (props) => {
    const {onClick, iconClassName} = props;
    return (
        <IconButton
            style={stylesIconos.small}
            iconStyle={stylesIconos.smallIcon}
            iconClassName={iconClassName}
            onClick={onClick}
            {...props}
        />
    )
};

IconButtonContainer.propTypes = {
    iconClassName: PropTypes.string,
    onClick: PropTypes.func
};


export const FlatIconModal = (props) => {
    const {onClick, text, primary, disabled} = props;
    return (
        <FlatButton
            label={text}
            primary={primary}
            onClick={onClick}
            disabled={disabled}
            {...props}
        />
    )
};
FlatIconModal.propTypes = {
    text: PropTypes.string,
    primary: PropTypes.bool,
    onClick: PropTypes.func
};


