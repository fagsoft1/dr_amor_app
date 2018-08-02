import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {
    COLABORADORES as permisos_view
} from "../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../00_utilities/common";

import ListCrud from '../components/acceso_list';


class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearColaboradores();
        this.props.clearAcompanantes();
    }

    cargarDatos() {
        const {  notificarErrorAjaxAction} = this.props;
        
        this.props.fetchTercerosPresentes(null, notificarErrorAjaxAction);
    }

    render() {
        const {terceros_list, auth: {mis_permisos}} = this.props;
        const bloque_1_list = permisosAdapter( permisos_view);
        const terceros = _.map(terceros_list, c => {
            return ({
                id: c.id,
                nombre: c.full_name_proxy
            })
        });


        const modelos_presentes = _.pickBy(terceros_list, tercero => {
            return (tercero.es_acompanante & tercero.presente)
        });

        const colaboradores_presentes = _.pickBy(terceros_list, tercero => {
            return (tercero.es_colaborador & tercero.presente)
        });

        const categorias = _.groupBy(modelos_presentes, 'categoria_modelo_nombre');
        let modelosxcategoria = [];
        _.mapKeys(categorias, (categoria, nombre) => {
            modelosxcategoria = [...modelosxcategoria, {"categoria": nombre, "modelos": categoria}];
        });

        return (
            <div className='cr-reg-acc'>
                <ListCrud
                    modelosxcategoria={modelosxcategoria}
                    object_list={terceros}
                    permisos_object={bloque_1_list}
                    colaboradores_presentes={colaboradores_presentes}
                    {...this.props}
                />
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        terceros_list: state.terceros
    }
}

export default connect(mapPropsToState, actions)(List)