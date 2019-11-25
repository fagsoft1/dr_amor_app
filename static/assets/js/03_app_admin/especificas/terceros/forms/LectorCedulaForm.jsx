import React, {Fragment, useState, memo} from 'react';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import moment from 'moment-timezone';
import momentLocaliser from 'react-widgets-moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome/index';

moment.tz.setDefault("America/Bogota");
momentLocaliser(moment);

let LectorCedulaForm = memo((props) => {
    const {children, setSelectItem} = props;
    const [con_codigo_barras, setConCodigoBarras] = useState(false);

    const validarLector = (e) => {
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
    };

    return (
        <Fragment>
            <div className="col-12 mt-2">
                <FontAwesomeIcon
                    className='puntero'
                    icon={['far', 'barcode']}
                    size='2x'
                    onClick={() => setConCodigoBarras(!con_codigo_barras)}
                />
            </div>
            {
                con_codigo_barras ?
                    <MyTextFieldSimple
                        className='col-12'
                        name="lector_barras"
                        label='Lector Cédula'
                        floatinglabeltext="Escaner aquí"
                        onBlur={(e) => {
                            validarLector(e);
                            setConCodigoBarras(false);
                        }}
                    /> : <Fragment>{children}</Fragment>
            }
        </Fragment>
    )
});
export default LectorCedulaForm;
