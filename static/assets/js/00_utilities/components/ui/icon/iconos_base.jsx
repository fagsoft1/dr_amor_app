import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";

export const stylesIconos = {
    smallIcon: {
        fontSize: '14px',
        width: 17,
        height: 17,
        padding: 0,
    },
    button: {
        margin: 0,
        padding: 0,
    },
};

export const IconButtonTable = (props) => {
    const {onClick, iconClassName} = props;
    return (
        <IconButton
            onClick={onClick}
            style={stylesIconos.button}
        >
            <Icon style={stylesIconos.smallIcon} className={iconClassName}/>
        </IconButton>
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
            onClick={onClick}
            style={stylesIconos.button}
        >
            <Icon style={stylesIconos.smallIcon} className={iconClassName}/>
        </IconButton>
    )
};

IconButtonContainer.propTypes = {
    iconClassName: PropTypes.string,
    onClick: PropTypes.func
};


export const FlatIconModal = (props) => {
    const {onClick, text, disabled, className = 'ml-3'} = props;
    return (
        <Button
            className={className}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {text}
        </Button>
    )
};
FlatIconModal.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func
};


