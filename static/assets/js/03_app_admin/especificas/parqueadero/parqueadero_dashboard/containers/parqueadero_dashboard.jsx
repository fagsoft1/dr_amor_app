import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import {
    TIPOS_VEHICULOS as bloque_1_permisos,
    MODALIDADES_FRACCIONES_TIEMPOS as bloque_2_permisos,
} from "../../../../../00_utilities/permisos/types";

import BloqueTiposVehiculos from '../../tipo_vehiculo/components/tipos_vehiculos_list';
import BloqueModalidadFraccionTiempo
    from '../../modalidades_fracciones_tiempo/components/modalidades_fracciones_tiempos_list';

class ListadoElementos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'Panel Parqueadero';
        this.singular_name = 'Panel Parqueadero';
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
            const cargarEmpresas = () => this.props.fetchEmpresas();
            this.props.fetchTiposVehiculos({callback: cargarEmpresas});
        } else if (index === 1) {
            const cargarTiposVehiculos = () => this.props.fetchTiposVehiculos();
            this.props.fetchModalidadesFraccionesTiempos({callback: cargarTiposVehiculos});
        }
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([bloque_1_permisos, bloque_2_permisos], {callback: () => this.cargarDatos()});
    }


    componentWillUnmount() {
        this.props.clearTiposVehiculos();
        this.props.clearModalidadesFraccionesTiempos();
    }

    cargarDatos() {
        this.cargarElementos();
    }

    render() {
        const {
            tipos_vehiculos,
            mis_permisos,
            modalidades_fracciones_tiempo
        } = this.props;
        const permisos_object_1 = permisosAdapter(mis_permisos, bloque_1_permisos);
        const permisos_object_2 = permisosAdapter(mis_permisos, bloque_2_permisos);

        const can_see =
            permisos_object_1.list ||
            permisos_object_2.list;
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Typography variant="h5" gutterBottom color="primary">
                    {this.singular_name}
                </Typography>
                <Tabs indicatorColor="primary"
                      textColor="primary"
                      onChange={this.handleChange}
                      value={this.state.slideIndex}
                >
                    <Tab label="Tipos Vehiculos" value={0}/>
                    <Tab label="Modalidades Parqueo" value={1}/>
                </Tabs>
                <div className="row">
                    <div className="col-12">
                        {
                            this.state.slideIndex === 0 &&
                            <BloqueTiposVehiculos
                                object_list={tipos_vehiculos}
                                permisos_object={permisos_object_1}
                                {...this.props}
                            />
                        }
                        {
                            this.state.slideIndex === 1 &&
                            <BloqueModalidadFraccionTiempo
                                object_list={modalidades_fracciones_tiempo}
                                permisos_object={permisos_object_2}
                                tipos_vehiculos_list={tipos_vehiculos}
                                {...this.props}
                            />
                        }
                    </div>
                </div>
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />

            </ValidarPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        tipos_vehiculos: state.parqueadero_tipos_vehiculos,
        modalidades_fracciones_tiempo: state.parqueadero_modalidades_fracciones_tiempo,
        empresas_list: state.empresas,
        mis_permisos: state.mis_permisos,
    }
}

export default connect(mapPropsToState, actions)(ListadoElementos)