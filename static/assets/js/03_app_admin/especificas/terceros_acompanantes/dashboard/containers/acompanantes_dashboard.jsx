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
    ACOMPANANTES as bloque_1_permisos,
    CATEGORIAS_ACOMPANANTES as bloque_2_permisos,
} from "../../../../../00_utilities/permisos/types";

import BloqueCategorias from '../../categorias/components/categorias_acompanantes_list';
import BloqueAcompanantes from '../../acompanantes/components/acompanantes_list';
import BloqueFraccionesTiempo from '../../fracciones_tiempos/components/fracciones_tiempos_list';

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
        this.plural_name = 'Panel Acompanantes';
        this.singular_name = 'Panel Acompanante';
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
            const cargarCategorias = this.props.fetchCategoriasAcompanantes();
            this.props.fetchAcompanantes({callback: cargarCategorias});
        } else if (index === 1) {
            this.props.fetchCategoriasAcompanantes();
        } else if (index === 2) {
            this.props.fetchFraccionesTiemposAcompanantes();
        }
    }

    componentDidMount() {
        this.cargarDatos();
    }


    componentWillUnmount() {
        this.props.clearAcompanantes();
        this.props.clearCategoriasAcompanantes();
    }

    cargarDatos() {
        this.cargarElementos();
    }

    render() {
        const {bloque_1_list, bloque_2_list, bloque_3_list} = this.props;
        const permisos_object_1 = permisosAdapter(bloque_1_permisos);
        const permisos_object_2 = permisosAdapter(bloque_2_permisos);

        const can_see =
            permisos_object_1.list ||
            permisos_object_2.list;
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Titulo>{this.singular_name}</Titulo>

                <Tabs
                    onChange={this.handleChange}
                    value={this.state.slideIndex}
                >
                    <Tab label="Acompanantes"/>
                    <Tab label="Categorias"/>
                    <Tab label="Fracciones Tiempo"/>
                </Tabs>

                {
                    this.state.slideIndex === 0 &&
                    <BloqueAcompanantes
                        object_list={bloque_1_list}
                        permisos_object={permisos_object_1}
                        {...this.props}
                        categorias_list={bloque_2_list}
                    />
                }
                {
                    this.state.slideIndex === 1 &&
                    <BloqueCategorias
                        object_list={bloque_2_list}
                        permisos_object={permisos_object_2}
                        {...this.props}
                    />
                }
                {
                    this.state.slideIndex === 2 &&
                    <BloqueFraccionesTiempo
                        object_list={bloque_3_list}
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
        bloque_1_list: state.acompanantes,
        bloque_2_list: state.categorias_acompanantes,
        bloque_3_list: state.fracciones_tiempos_acompanantes,
    }
}

export default connect(mapPropsToState, actions)(ListadoElementos)