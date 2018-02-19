import React from 'react';
import {upper, lower} from "../../../common";
import {Field} from 'redux-form';
import PropTypes from "prop-types";
import {
    TextField,
    Checkbox
} from 'redux-form-material-ui'
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

import momentLocaliser from 'react-widgets-moment';
import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);

export const MyTextFieldSimple = (props) => {
    let normalize = null;
    if (props.case === 'U') {
        normalize = upper
    } else if (props.case === 'L') {
        normalize = lower
    }
    return (
        <div className={props.className}>
            <Field
                {...props}
                fullWidth={true}
                name={props.name}
                component={TextField}
                hintText={props.nombre}
                autoComplete="off"
                floatingLabelText={props.nombre}
                normalize={normalize}
            />
        </div>
    )
};
MyTextFieldSimple.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string
};


export const MyCheckboxSimple = (props) => {
    const {onClick} = props;
    return (
        <div className={props.className}>
            <Field
                onClick={() => {
                    if (onClick) {
                        onClick()
                    }
                }}
                {...props}
                name={props.name}
                component={Checkbox}
                label={props.nombre}
                normalize={v => !!v}
            />
        </div>
    )
};
MyCheckboxSimple.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string
};

const renderDateTimePicker = ({input: {onChange, value}, showTime}) => {
    const now = moment();
    return (
        <div>
            <DateTimePicker
                onChange={onChange}
                format="YYYY-MM-DD"
                time={false}
                max={new Date()}
                value={!value ? null : new Date(value)}
            />
        </div>
    )
};

export const MyDateTimePickerField = (props) => {
    return (
        <div className={props.className}>
            <label>{props.nombre}</label>
            <Field
                name={props.name}
                type="date"
                fullWidth={true}
                label={props.nombre}
                component={renderDateTimePicker}
            />
        </div>
    )
};

MyDateTimePickerField.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    nombre: PropTypes.string
};