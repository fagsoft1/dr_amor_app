import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyDropdownList} from '../../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';
import InputAdornment from '@material-ui/core/InputAdornment';


class Form extends Component {
    componentDidMount() {
        this.props.fetchFraccionesTiemposAcompanantes();
    }

    componentWillUnmount() {
        this.props.clearFraccionesTiemposAcompanantes();
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onSubmit,
            onCancel,
            handleSubmit,
            modal_open,
            singular_name,
            object,
            fracciones_tiempo_list,
            categorias_fracciones_tiempo_list,
            error,
        } = this.props;
        let fracciones_existentes = _.map(categorias_fracciones_tiempo_list, c => c.fraccion_tiempo);
        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit((v) => {
                    const categoria_fraccion_tiempo = {...v, categoria: object.id};
                    onSubmit(categoria_fraccion_tiempo)
                })}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
                fullScreen={false}
                error={error}
            >
                {
                    initialValues ?
                        <span><strong>Fracción Tiempo: </strong>{initialValues.fraccion_tiempo_nombre}</span> :
                        <MyDropdownList
                            data={_.map(_.omit(fracciones_tiempo_list, fracciones_existentes), f => f)}
                            nombre='Fracción Tiempo'
                            valuesField='id'
                            autoFocus={true}
                            textField='nombre'
                            className="col-12"
                            name='fraccion_tiempo'
                        />
                }
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Valor'
                    name='valor'
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                />
            </MyFormTagModal>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado
    }
}

Form = reduxForm({
    form: "algoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;