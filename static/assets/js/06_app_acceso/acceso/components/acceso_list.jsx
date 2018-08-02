import React, {Component} from 'react'
import {ContainerTextButton} from '../../../00_utilities/components/ui/icon/iconos';
import ValidarPermisos from "../../../00_utilities/permisos/validar_permisos";
import CreateForm from './forms/acceso_form';
import CategoriaModelo from '../components/catetgoria_modelo';

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

    successSubmitCallback(response) {
        const {tipo_registro} = this.state;
        const {result} = response;
        const { notificarAction} = this.props;
        notificarAction(result);

        this.setState({modal_open: false, tipo_registro: null});
    }

    onSubmit(item) {
        const { notificarErrorAjaxAction} = this.props;
        const {tipo_registro} = this.state;
        const success_method = (response) => {
            this.successSubmitCallback(response);
        };

        let metodo = null;
        if (tipo_registro === 'Registro Entrada') {
            metodo = this.props.registrarIngresoTercero;
        } else if (tipo_registro === 'Registro Salida') {
            metodo = this.props.registrarSalidaTercero;
        }
        metodo(item.id_tercero, item.pin, success_method, notificarErrorAjaxAction)
    }

    render() {
        const {
            object_list,
            permisos_object,
            notificarErrorAjaxAction,


            modelosxcategoria,
            colaboradores_presentes
        } = this.props;
        const {
            modal_open,
            tipo_registro
        } = this.state;
        return (
            <ValidarPermisos can_see={permisos_object.list} nombre='Modelos Presentes'>
                <ContainerTextButton
                    text='Registrar Entrada'
                    onClick={() => {
                        this.setState({modal_open: true, tipo_registro: 'Registro Entrada'});

                        this.props.fetchTercerosAusentes(null, notificarErrorAjaxAction);
                    }}
                />
                <ContainerTextButton
                    text='Registrar Salida'
                    onClick={() => {
                        this.setState({modal_open: true, tipo_registro: 'Registro Salida'});

                        this.props.fetchTercerosPresentes(null, notificarErrorAjaxAction);
                    }}
                />
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
                    <h4>Colaboradores</h4>
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