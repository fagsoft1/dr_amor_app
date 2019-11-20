import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography/index';

import {
    MyCombobox,
    MyRadioButtonGroup,
    MyDateTimePickerField,
    MyTextFieldSimple
} from '../../../../00_utilities/components/ui/forms/fields';

const DatosCedulaForm = () => {
    return (
        <Fragment>
            <div className="col-12">
                <Typography variant="h4" gutterBottom color="primary">
                    Información Personal
                </Typography>
            </div>

            <MyTextFieldSimple
                className='col-12 col-md-6 col-xl-3'
                nombre='Nombre'
                name='nombre'
                case='U'
            />

            <MyTextFieldSimple
                className='col-12 col-md-6 col-xl-3'
                nombre='Segundo Nombre'
                name='nombre_segundo'
                case='U'
            />

            <MyTextFieldSimple
                className='col-12 col-md-6 col-xl-3'
                nombre='Apellido'
                name='apellido'
                case='U'
            />

            <MyTextFieldSimple
                className='col-12 col-md-6 col-xl-3'
                nombre='Segundo Apellido'
                name='apellido_segundo'
                case='U'
            />
            <MyCombobox
                label_space_xs={4}
                label='Tipo de documento'
                className="col-12 col-md-6 col-xl-3"
                name="tipo_documento"
                placeholder='Seleccionar Tipo de documento...'
                data={[
                    {id: "CC", nombre: "Cédula Ciudadania"},
                    {id: "CE", nombre: "Cédula Extrangería"},
                    {id: "PS", nombre: "Pasaporte"},
                    {id: "TI", nombre: "Tarjeta de Identidad"},
                ]}
                textField='nombre'
                valuesField='id'
                filter='contains'
            />
            <MyTextFieldSimple
                className='col-12 col-md-6 col-xl-3'
                nombre='Nro. Identificación'
                name='nro_identificacion'
            />

            <MyCombobox
                className="col-12 col-md-6 col-xl-3"
                label_space_xs={4}
                label='Grupo Sanguineo'
                name="grupo_sanguineo"
                data={[
                    {id: "NI", nombre: "Indefinido"},
                    {id: "APOSITIVO", nombre: "A Positivo"},
                    {id: "OPOSITIVO", nombre: "O Positivo"},
                    {id: "ONEGATIVO", nombre: "O Negativo"},
                    {id: "ANEGATIVO", nombre: "A Negativo"},
                ]}
                textField='nombre'
                valuesField='id'
                placeholder='Grupo Sanguineo...'
                filter='contains'
            />
            <div className="col-12">
                <div className="row">
                    <MyDateTimePickerField
                        className="col-12 col-md-6"
                        nombre='Fecha de Nacimiento'
                        name='fecha_nacimiento'
                        show_edad={true}
                    />
                    <MyRadioButtonGroup
                        className="col-12 col-md-6"
                        nombre='Genero'
                        name='genero'
                        required={true}
                        options={[
                            {value: "M", label: "Masculino"},
                            {value: "F", label: "Femenino"}
                        ]}
                    />
                </div>
            </div>
        </Fragment>
    )
};

export default DatosCedulaForm;
