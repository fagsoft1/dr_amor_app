import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import {
    ACOMPANANTES as bloque_1_permisos,
    CATEGORIAS_ACOMPANANTES as bloque_2_permisos,
} from "../../../../../00_utilities/permisos/types";

import BloqueCategorias from '../../categorias/components/categorias_acompanantes_list';
import BloqueTabBase from '../../acompanantes/components/base_list';

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

    handleChange = (value) => {
        if (value !== this.state.slideIndex) {
            this.cargarElementos(value);
        }
        this.setState({
            slideIndex: value,
        });
    };

    cargarElementos(value = null) {
        const {notificarErrorAjaxAction, cargando, noCargando} = this.props;
        let index = value !== null ? value : this.state.slideIndex;
        cargando();
        if (index === 0) {
            const cargarCategorias = this.props.fetchCategoriasAcompanantes(() => noCargando(), notificarErrorAjaxAction);
            this.props.fetchAcompanantes(cargarCategorias, notificarErrorAjaxAction);
        } else if (index === 1) {
            this.props.fetchCategoriasAcompanantes(() => noCargando(), notificarErrorAjaxAction);
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
        const {notificarErrorAjaxAction, cargando} = this.props;
        cargando();
        this.props.fetchMisPermisos(() => this.cargarElementos(), notificarErrorAjaxAction)
    }

    render() {
        const {bloque_1_list, bloque_2_list, mis_permisos} = this.props;
        const permisos_object_1 = permisosAdapter(mis_permisos, bloque_1_permisos);
        const permisos_object_2 = permisosAdapter(mis_permisos, bloque_2_permisos);

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
                    <Tab label="Acompanantes" value={0}/>
                    <Tab label="Categorias" value={1}/>
                </Tabs>

                <SwipeableViews
                    index={this.state.slideIndex}
                    onChangeIndex={this.handleChange}
                >
                    <div style={styles.slide}>
                        <BloqueTabBase
                            object_list={bloque_1_list}
                            permisos_object={permisos_object_1}
                            {...this.props}
                            categorias_list={bloque_2_list}
                        />
                    </div>
                    <div style={styles.slide}>
                        <BloqueCategorias
                            object_list={bloque_2_list}
                            permisos_object={permisos_object_2}
                            {...this.props}
                        />
                    </div>
                </SwipeableViews>

                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </ValidarPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        bloque_1_list: state.acompanantes,
        bloque_2_list: state.categorias_acompanantes
    }
}

export default connect(mapPropsToState, actions)(ListadoElementos)