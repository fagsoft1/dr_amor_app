import React, {Component} from 'react';
import DropdownList from 'react-widgets/lib/DropdownList';
import Button from '@material-ui/core/Button';

class HabitacionSelectModeloServicio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_tercero: null,
            categoria_fraccion_tiempo_id: null,
        }
    }

    render() {
        const {
            categorias_fracciones_tiempo_list,
            terceros_presentes,
            onSelectModelo,
            onSubmit
        } = this.props;
        const {id_tercero, categoria_fraccion_tiempo_id} = this.state;
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
                        this.setState({id_tercero: e.id, categoria_fraccion_tiempo_id: null})
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
                            this.setState({categoria_fraccion_tiempo_id: e.id})
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
                        onClick={() => onSubmit(this.state)}
                    >
                        Adicionar
                    </Button>
                }

            </div>
        )
    }
}

export default HabitacionSelectModeloServicio;