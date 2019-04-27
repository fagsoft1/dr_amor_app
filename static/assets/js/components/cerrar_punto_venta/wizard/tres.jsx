import React, {Fragment} from 'react'
import {Field} from 'redux-form'

const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet']

const renderColorSelector = ({input, meta: {touched, error}}) => (
    <div>
        <select {...input}>
            <option value="">Select a color...</option>
            {colors.map(val => (
                <option value={val} key={val}>
                    {val}
                </option>
            ))}
        </select>
        {touched && error && <span>{error}</span>}
    </div>
)

const WizardFormThirdPage = props => {
    return (
        <Fragment>
            <div>
                <label>Favorite Color</label>
                <Field name="favoriteColor" component={renderColorSelector}/>
            </div>
            <div>
                <label htmlFor="employed">Employed</label>
                <div>
                    <Field
                        name="employed"
                        id="employed"
                        component="input"
                        type="checkbox"
                    />
                </div>
            </div>
            <div>
                <label>Notes</label>
                <div>
                    <Field name="notes" component="textarea" placeholder="Notes"/>
                </div>
            </div>
        </Fragment>
    )
}
export default WizardFormThirdPage