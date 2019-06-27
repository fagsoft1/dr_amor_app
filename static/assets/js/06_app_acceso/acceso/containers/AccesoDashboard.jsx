import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {
    TIPOS_REGISTRO_INGRESO as permisos_view
} from "../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../00_utilities/common";

import ListCrud from '../components/AccesoList';


class List extends Component {
    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view]);
    }
    render() {
        const {terceros_list, mis_permisos} = this.props;
        const bloque_1_list = permisosAdapter(mis_permisos, permisos_view);
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
                    {...this.props}
                    modelosxcategoria={modelosxcategoria}
                    object_list={terceros}
                    permisos_object={bloque_1_list}
                    colaboradores_presentes={colaboradores_presentes}
                />
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        terceros_list: state.terceros
    }
}

export default connect(mapPropsToState, actions)(List)