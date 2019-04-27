import React, {Fragment} from 'react'
import {Field} from 'redux-form'
import renderField from './renderField'

const renderError = ({meta: {touched, error}}) =>
    touched && error ? <span>{error}</span> : false

const WizardFormSecondPage = props => {
    return (
        <Fragment>
            <Field name="email" type="email" component={renderField} label="Email"/>
            <div>
                <label>Sex</label>
                <div>
                    <label>
                        <Field
                            name="sex"
                            component="input"
                            type="radio"
                            value="male"
                        />{' '}
                        Male
                    </label>
                    <label>
                        <Field
                            name="sex"
                            component="input"
                            type="radio"
                            value="female"
                        />{' '}
                        Female
                    </label>
                    <Field name="sex" component={renderError}/>
                </div>
            </div>
        </Fragment>
    )
}

export default WizardFormSecondPage