import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
    PERMISOS_1 as bloque_1_permisos,
    PERMISOS_2 as bloque_2_permisos,
} from "../../../../../00_utilities/permisos/types";

import BloqueTabBase from '../../base_crud/components/base_list';

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    slide: {
        padding: 10,
    },
};


class ListadoElementos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'NOMBREs DASHBOARDs';
        this.singular_name = 'NOMBRE DASHBOARD';
        this.cargarDatos = this.cargarDatos.bind(this);

    }

    handleChange = (event, value) => {
        if (value !== this.state.slideIndex) {
            this.cargarElementos(value);
        }
        this.setState({
            slideIndex: value,
        });
    };

    cargarElementos(value = null) {

        let index = value !== null ? value : this.state.slideIndex;

        if (index === 0) {
            this.props.fetchAlgos1();
        } else if (index === 2) {
            this.props.fetchAlgos2();
        }
    }

    componentDidMount() {
        this.cargarDatos();
    }


    componentWillUnmount() {
        this.props.clearAlgos();
    }

    cargarDatos() {
        const {cargando} = this.props;

    }

    render() {
        const {bloque_1_list, bloque_2_list} = this.props;
        const permisos_object_1 = permisosAdapter(bloque_1_permisos);
        const permisos_object_2 = permisosAdapter(bloque_2_permisos);

        const can_see =
            permisos_object_1.list ||
            permisos_object_2.list;
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Titulo>{this.singular_name}</Titulo>

                <Tabs indicatorColor="primary"
                      textColor="primary"
                      onChange={this.handleChange}
                      value={this.state.slideIndex}
                >
                    <Tab label="Bloques 1" value={0}/>
                    <Tab label="Bloques 2" value={1}/>
                </Tabs>

                {
                    this.state.slideIndex === 0 &&
                    <BloqueTabBase
                        object_list={bloque_1_list}
                        permisos_object={permisos_object_1}
                        {...this.props}
                    />
                }
                {
                    this.state.slideIndex === 1 &&
                    <BloqueTabBase
                        object_list={bloque_2_list}
                        permisos_object={permisos_object_2}
                        {...this.props}
                    />
                }

                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </ValidarPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
        bloque_1_list: state.algos,
        bloque_2_list: state.algos
    }
}

export default connect(mapPropsToState, actions)(ListadoElementos)