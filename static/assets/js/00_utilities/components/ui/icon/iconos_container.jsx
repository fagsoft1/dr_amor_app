import {IconButtonContainer, FlatIconModal} from './iconos_base';
import React from 'react';
import PropTypes from "prop-types";

export const IconButtonContainerAdd = (props) => {
    const {onClick} = props;
    return (
        <IconButtonContainer iconClassName={'far fa-plus'} onClick={onClick} {...props}/>
    )
};
IconButtonContainerAdd.propTypes = {
    onClick: PropTypes.func
};

export const ContainerNuevoButton = (props) => {
    const {onClick} = props;
    return (
        <FlatIconModal onClick={onClick} primary={true} text='Nuevo' {...props}/>
    )
};
ContainerNuevoButton.propTypes = {
    onClick: PropTypes.func
};

export const ContainerIrButton = (props) => {
    const {onClick, text} = props;
    return (
        <FlatIconModal onClick={onClick} primary={true} text={text} {...props}/>
    )
};


ContainerIrButton.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string
};