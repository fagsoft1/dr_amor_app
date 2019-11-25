import React, {Fragment} from 'react';
import {upper, lower} from "../../../common";
import {Field} from 'redux-form';
import PropTypes from "prop-types";
import clsx from 'clsx';

import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from 'react-select';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Combobox from 'react-widgets/lib/Combobox';
import DropdownList from 'react-widgets/lib/DropdownList';

import momentLocaliser from 'react-widgets-moment';
import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
}));


const renderInputFileField = (field) => {
    return (
        <Fragment>
            <input
                {...field.input}
                type="file"
                accept={field.accept}
                value={undefined}
            />
            {field.meta.touched && field.meta.error &&
            <span className='form-field-error'>{field.meta.error}</span>}
        </Fragment>
    )
};

export const MyFileFieldInput = (props) => {
    return (
        <div className={props.className}>
            <Field
                {...props}
                component={renderInputFileField}
            />
        </div>
    )
};


const renderTextField = ({input, label, meta: {touched, error, warning}, ...custom}) => {
    const classes = useStyles();
    let new_custom = custom;
    if (touched && error) {
        new_custom = {...custom, helperText: error}
    }
    new_custom = {...new_custom, className: clsx(classes.textField, new_custom.className)};
    return (
        <TextField
            label={label}
            margin="normal"
            error={error && touched}
            {...input}
            {...new_custom}
        />
    )
};
export const MyTextFieldSimple = (props) => {
    let normalize = null;
    if (props.case === 'U') {
        normalize = upper
    } else if (props.case === 'L') {
        normalize = lower
    }
    return (
        <Field
            fullWidth={true}
            label={props.label}
            name={props.name}
            helperText={props.helperText}
            {...props}
            component={renderTextField}
            autoComplete="off"
            normalize={normalize}
        />
    )
};
MyTextFieldSimple.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string
};

const renderDropdownList = ({input, data, valueField, textField, placeholder, onSelect}) => {
    return (
        <DropdownList {...input}
                      data={data}
                      placeholder={placeholder}
                      valueField={valueField}
                      textField={textField}
                      onChange={(e) => input.onChange(e[valueField])}
                      onSelect={onSelect}
        />
    )
};


export const MyDropdownList = (props) => {
    const {busy = false, textField = 'name', valuesField = 'id', className, placeholder = '', label = null, label_space_xs = 0} = props;
    return (
        <div className={`${className} ${label ? 'mt-2' : 'mt-4'}`}>
            <Grid component="label" container alignItems="center" spacing={2}>
                {label_space_xs > 0 && label && <Grid item xs={label_space_xs}>
                    {label}
                </Grid>}
                <Grid item xs={label ? 12 - label_space_xs : 12}>
                    <Field
                        {...props}
                        component={renderDropdownList}
                        valueField={valuesField}
                        textField={textField}
                        busy={busy}
                        placeholder={placeholder}
                        dropUp
                    />
                </Grid>
            </Grid>
        </div>
    )
};

MyDropdownList.propTypes = {
    label_space_xs: PropTypes.number,
    label: PropTypes.string,
    busy: PropTypes.bool,
    textField: PropTypes.string,
    name: PropTypes.string,
    valuesField: PropTypes.string,
    placeholder: PropTypes.string
};

const renderCombobox = ({input, data, valueField, textField, placeholder, onSelect = null, readOnly, meta: {touched, error, warning}, filter}) => {
    return (
        <Fragment>
            <Combobox {...input}
                      data={data}
                      filter={filter}
                      placeholder={placeholder}
                      valueField={valueField}
                      textField={textField}
                      readOnly={readOnly}
                      onChange={e => {
                          input.onChange(typeof (e) === 'string' ? e : e[valueField])
                      }}
                      onSelect={onSelect}
                      onBlur={() => input.onBlur()}
            />
            {touched && ((error && <span className='form-field-error'>{error}</span>) || (warning &&
                <span>{warning}</span>))}
        </Fragment>
    )
};


export const MyCombobox = (props) => {
    const {
        busy = false,
        textField = 'name',
        valuesField = 'id',
        autoFocus = false,
        onSelect,
        className,
        placeholder = '',
        label = null,
        label_space_xs = 0,
        readOnly = false
    } = props;
    return (
        <div className={`${className} ${label ? 'mt-2' : 'mt-4'}`}>
            <Grid component="label" container alignItems="center" spacing={2}>
                {label && <Grid item xs={label_space_xs}>
                    {label}
                </Grid>}
                <Grid item xs={label ? 12 - label_space_xs : 12}>
                    <Field
                        {...props}
                        readOnly={readOnly}
                        component={renderCombobox}
                        valueField={valuesField}
                        textField={textField}
                        autoFocus={autoFocus}
                        onChange={v => v[valuesField]}
                        onSelect={onSelect}
                        busy={busy}
                        placeholder={placeholder}
                    />
                </Grid>
            </Grid>
        </div>
    )
};


MyCombobox.propTypes = {
    label_space_xs: PropTypes.number,
    label: PropTypes.string,
    className: PropTypes.string,
    busy: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    textField: PropTypes.string,
    name: PropTypes.string,
    valuesField: PropTypes.string,
    placeholder: PropTypes.string,
    data: PropTypes.any,
};

const renderCheckbox = ({input, label}) => {
    return <FormControlLabel
        control={
            <Checkbox
                checked={input.value === '' ? false : input.value}
                color='primary'
                onChange={(event, value) => input.onChange(value)}
            />
        }
        label={label}
    />
};

export const MyCheckboxSimple = (props) => {
    const {onClick, className = null, label, name} = props;
    return (
        <div className={className}>
            <Field
                onClick={() => {
                    if (onClick) {
                        onClick()
                    }
                }}
                {...props}
                name={props.name}
                component={renderCheckbox}
                label={label ? label : name}
                normalize={v => !!v}
            />
        </div>
    )
};
MyCheckboxSimple.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string
};

const renderDateTimePicker = (
    {
        input: {onChange, value},
        meta: {touched, error},
        readOnly,
        show_edad,
        time = false,
        max = new Date(),
        min = new Date(1900, 0, 1)
    }
) => {
    const now = moment();
    const fechaHoy = moment(now, "YYYY MM DD", "es");
    const fecha_nacimiento = moment(value, "YYYY MM DD", "es").tz('America/Bogota');
    const diferencia = fechaHoy.diff(fecha_nacimiento, "years");
    const edad = `${diferencia} años`;
    return (
        <Fragment>
            <DateTimePicker
                readOnly={readOnly}
                onChange={onChange}
                format={time ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
                time={time}
                max={max}
                min={min}
                //value={!value ? null : new Date(value)}
                value={!value ? null : moment(value).toDate()}
            />{show_edad && edad}
            {touched && (error && <span className='form-field-error'>{error}</span>)}
        </Fragment>
    )
};

export const MyDateTimePickerField = (props) => {
    return (
        <div className={props.className}>
            <label>{props.label}</label>
            <Field
                name={props.name}
                type="date"
                fullWidth={true}
                label={props.label}
                {...props}
                component={renderDateTimePicker}
            />
        </div>
    )
};

MyDateTimePickerField.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string
};

const renderRadioGroup = ({input, label, meta, options, required = false, meta: {touched, error}, ...rest}) => {
    return (
        <FormControl component="fieldset" error={error && touched} required={required}>
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup
                aria-label="gender"
                name={label}
                value={input.value}
                onChange={(event, value) => input.onChange(value)}
            >
                {options.map(o => {
                    return (
                        <FormControlLabel key={o.label} value={o.value} control={<Radio/>} label={o.label}/>
                    )
                })}
            </RadioGroup>
        </FormControl>
    )
}

export const MyRadioButtonGroup = (props) => {
    return (
        <Field
            name={props.name}
            {...props}
            className='col-12'
            fullWidth={true}
            required={props.required}
            component={renderRadioGroup}>
        </Field>
    )
};
MyRadioButtonGroup.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.any
};

const renderSelect = (props) => {
    const {
        input,
        options,
        meta: {touched, error, warning},
        nombre,
        valueKey = 'value',
        labelKey = 'label',
        isDisabled = false,
        valor
    } = props;
    return (
        <Fragment>
            <Select
                value={valor ? valor : null}
                onChange={input.onChange}
                onBlur={() => input.onBlur(input.value)}
                options={options}
                valueKey={valueKey}
                labelKey={labelKey}
                placeholder={nombre}
                isDisabled={isDisabled}
                simpleValue
            />
            {touched && ((error && <span className='form-field-error'>{error}</span>) || (warning &&
                <span>{warning}</span>))}
        </Fragment>
    )
};

export const MySelect = (props) => {
    const {data, name, nombre, onChangeMethod = null, className = 'col-12', value} = props;
    return (
        <div className={className}>
            <Field
                {...props}
                autoComplete={props.autoComplete ? props.autoComplete : props.name}
                onChangeMethod={onChangeMethod}
                nombre={nombre}
                valor={value}
                name={name}
                options={data}
                component={renderSelect}
            />
        </div>
    )
};

const renderSelectAsync = (
    {
        input,
        options,
        meta: {
            touched,
            error,
            warning
        },
        nombre,
        valueKey = "id",
        labelKey = "name",
        loadOptions,
        filterOptions = null
    }) => {
    return (
        <Fragment>
            <Select.Async
                value={input.value}
                onChange={input.onChange}
                onSelectResetsInput={false}
                onBlurResetsInput={false}
                onCloseResetsInput={false}

                valueKey={valueKey}
                labelKey={labelKey}
                loadOptions={loadOptions}
                backspaceRemoves={true}
                filterOptions={filterOptions}

                onBlur={() => input.onBlur(input.value)}
                placeholder={nombre}
                simpleValue
            />
            {touched && ((error && <span className='form-field-error'>{error}</span>) || (warning &&
                <span>{warning}</span>))}
        </Fragment>
    )
};

export const MySelectAsync = (props) => {
    const {name, nombre = null, className = 'col-12'} = props;
    return (
        <div className={className}>
            <Field
                autoComplete={props.autoComplete ? props.autoComplete : props.name}
                nombre={nombre}
                name={name}
                {...props}
                component={renderSelectAsync}
            />
        </div>
    )
};