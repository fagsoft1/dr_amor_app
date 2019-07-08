import React, {memo, useState} from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import Button from '@material-ui/core/Button';

const HabitacionModalDetailSelectAcompanante = memo(props => {
    const {
        categorias_fracciones_tiempo_list,
        terceros_presentes,
        onSelectModelo,
        onSubmit
    } = props;
    const [id_tercero, setTerceroId] = useState(null);
    const [categoria_fraccion_tiempo_id, setCategoriaFraccionTiempoId] = useState(null);
    return (
        <div className='row'>
            <DropdownList
                data={_.map(terceros_presentes, c => c)}
                placeholder='Acompañante'
                textField='full_name_proxy'
                className="col-12 col-md-4"
                valuesField='id'
                onSelect={(e) => {
                    onSelectModelo(e.categoria_modelo);
                    setTerceroId(e.id);
                    setCategoriaFraccionTiempoId(null);
                }}
            />
            {
                _.size(categorias_fracciones_tiempo_list) > 0 &&
                id_tercero &&
                <DropdownList
                    data={_.map(categorias_fracciones_tiempo_list, c => c)}
                    name='fraccion_tiempo'
                    nombre='Tiempo'
                    className="col-12 col-md-4"
                    textField='fraccion_tiempo_nombre'
                    valuesField='id'
                    onSelect={(e) => {
                        setCategoriaFraccionTiempoId(e.id);
                    }}
                />
            }
            {
                categoria_fraccion_tiempo_id &&
                id_tercero &&
                <Button
                    color="primary"
                    variant="contained"
                    className='ml-3'
                    onClick={() => onSubmit({id_tercero, categoria_fraccion_tiempo_id})}
                >
                    Adicionar
                </Button>
            }

        </div>
    )
});
export default HabitacionModalDetailSelectAcompanante;