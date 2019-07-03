import React, {Fragment, memo, useState} from 'react';
import Checkbox from '@material-ui/core/Checkbox/index';

const PermisoActivoTablaItem = memo(props => {
    const [cambiar_nombre, setCambiarNombre] = useState(false);
    const [nombre_permiso, setNombrePermiso] = useState('');
    const {item, item: {name, codename, activo, nombre}, updatePermiso, can_change} = props;
    return (
        <tr>
            <td>{name}</td>
            <td>{codename}</td>
            {
                can_change &&
                <Fragment>
                    <td>
                        <Checkbox
                            style={{margin: 0, padding: 0}}
                            color='primary'
                            checked={activo}
                            onClick={() => {
                                updatePermiso({...item, activo: !activo});
                                setCambiarNombre(false);
                            }}
                        />
                    </td>
                    <td onClick={() => {
                        if (activo) {
                            setCambiarNombre(true);
                            setNombrePermiso(nombre);
                        }
                    }}
                        className={activo ? 'puntero' : ''}
                    >
                        {
                            cambiar_nombre ?
                                <input
                                    type="text" value={nombre_permiso ? nombre_permiso : ''}
                                    onChange={(e) => setNombrePermiso(e.target.value)}
                                    onBlur={() => {
                                        setCambiarNombre(false);
                                        updatePermiso({...item, nombre: nombre_permiso.toUpperCase()})
                                    }}
                                /> :
                                nombre
                        }
                    </td>
                </Fragment>
            }
        </tr>
    )
});

export default PermisoActivoTablaItem;