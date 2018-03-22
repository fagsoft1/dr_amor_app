import React, {Component, Fragment} from 'react';
import {MyTextFieldSimple} from '../fields';
import moment from 'moment-timezone';
import momentLocaliser from 'react-widgets-moment';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);

class LectorCedulaForm extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            con_codigo_barras: false,
            lector_cedula: null
        })
    }

    validarLector(e) {
        const {setSelectItem} = this.props;
        const lectorSinEspacio = e.target.value.replace(/ /g, '').toUpperCase();
        const lectorSinPuntos = lectorSinEspacio.replace(/\./g, '');
        const arrayOfStrings = lectorSinPuntos.split(",");
        if (arrayOfStrings.length === 10) {
            const fechaNacimiento = moment(arrayOfStrings[6], "YYYYMMDD", "es").tz('America/Bogota');
            const cedula = {
                nro_identificacion: arrayOfStrings[0],
                nombre: arrayOfStrings[3],
                nombre_segundo: arrayOfStrings[4],
                apellido: arrayOfStrings[1],
                apellido_segundo: arrayOfStrings[2],
                genero: arrayOfStrings[5],
                fecha_nacimiento: fechaNacimiento,
                grupo_sanguineo: arrayOfStrings[7],
                tipo_documento: "CC"
            };
            setSelectItem(cedula);

        }
    }

    render() {
        const {con_codigo_barras} = this.state;
        return (
            <Fragment>
                <div className="col-12 mt-2">
                    <i className="fa fa-barcode fa-2x" onClick={() => {
                        this.setState(prevState => ({
                            con_codigo_barras: !prevState.con_codigo_barras
                        }));
                    }}>
                    </i>
                </div>
                {
                    con_codigo_barras ?
                        <MyTextFieldSimple
                            className='col-12'
                            name="lector_barras"
                            nombre='Lector Cédula'
                            floatingLabelText="Escaner aquí"
                            onBlur={(e) => {
                                this.validarLector(e);
                                this.setState({
                                    con_codigo_barras: false
                                });
                            }}
                        /> : <Fragment>{this.props.children}</Fragment>
                }
            </Fragment>
        )
    }
}

export default LectorCedulaForm;
