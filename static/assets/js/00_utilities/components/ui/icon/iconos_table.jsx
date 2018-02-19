import React from 'react';
import PropTypes from "prop-types";
import {IconButtonTable} from './iconos_base';

export const IconButtonTableEdit = (props) => {
    const {onClick} = props;
    return (
        <IconButtonTable onClick={onClick} iconClassName='far fa-edit' {...props}>
        </IconButtonTable>
    )
};
IconButtonTableEdit.propTypes = {
    onClick: PropTypes.func
};

export const IconButtonTableSee = (props) => {
    const {onClick} = props;
    return (
        <IconButtonTable onClick={onClick} iconClassName='far fa-eye' {...props}/>
    )
};
IconButtonTableSee.propTypes = {
    onClick: PropTypes.func
};

export const IconButtonTableDelete = (props) => {
    const {onClick} = props;
    return (
        <IconButtonTable onClick={onClick} iconClassName='far fa-trash' {...props}/>
    )
};
IconButtonTableDelete.propTypes = {
    onClick: PropTypes.func
};