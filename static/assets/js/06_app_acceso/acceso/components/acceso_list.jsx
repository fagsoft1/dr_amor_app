import React, {Component} from 'react'
import ValidarPermisos from "../../../00_utilities/permisos/validar_permisos";
import CreateForm from './forms/acceso_form';
import CategoriaModelo from '../components/catetgoria_modelo';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            item_seleccionado: null,
            modal_open: false,
            tipo_registro: null,
        });
        this.onSubmit = this.onSubmit.bind(this);
    }

    renderCategoria(categoria) {
        return (
            <CategoriaModelo key={categoria.categoria} categoria={categoria}/>
        )
    }

    onSubmit(item) {
        const {tipo_registro} = this.state;
        let metodo = null;
        if (tipo_registro === 'Registro Entrada') {
            metodo = this.props.registrarIngresoTercero;
        } else if (tipo_registro === 'Registro Salida') {
            metodo = this.props.registrarSalidaTercero;
        }
        const callback = () => {
            this.props.fetchTercerosPresentes({
                callback: () => this.setState({
                    modal_open: false,
                    tipo_registro: null
                })
            });
        };
        metodo(item.id_tercero, item.pin, {callback})
    }

    render() {
        const {
            object_list,
            permisos_object,
            modelosxcategoria,
            colaboradores_presentes
        } = this.props;
        const {
            modal_open,
            tipo_registro
        } = this.state;
        return (
            <ValidarPermisos can_see={permisos_object.list} nombre='Modelos Presentes'>
                <Button
                    color='primary'
                    className='ml-3'
                    onClick={() => {
                        this.setState({modal_open: true, tipo_registro: 'Registro Entrada'});
                        this.props.fetchTercerosAusentes();
                    }}
                >
                    Registrar Entrada
                </Button>
                <Button
                    color='primary'
                    className='ml-3'
                    onClick={() => {
                        this.setState({modal_open: true, tipo_registro: 'Registro Salida'});
                        this.props.fetchTercerosPresentes();
                    }}
                >
                    Registrar Salida
                </Button>
                {
                    modal_open &&
                    <CreateForm
                        tipo_registro={tipo_registro}
                        list={object_list}
                        {...this.props}
                        modal_open={modal_open}
                        onCancel={() => {
                            this.setState({modal_open: false, tipo_registro: null});
                        }}
                        onSubmit={this.onSubmit}
                        setSelectItem={this.setSelectItem}
                    />
                }
                {modelosxcategoria.map(categoria => {
                    return this.renderCategoria(categoria)
                })}
                <div className="col-12">
                    <Typography variant="h4" gutterBottom color="primary">
                        Colaboradores
                    </Typography>
                    <div className="row">
                        {_.map(colaboradores_presentes, colaborador => {
                            return <div key={colaborador.id} className="col-12 col-md-4 col-xl-3">
                                {colaborador.full_name_proxy}
                            </div>
                        })}
                    </div>
                </div>
            </ValidarPermisos>
        )
    }
}

export default List;