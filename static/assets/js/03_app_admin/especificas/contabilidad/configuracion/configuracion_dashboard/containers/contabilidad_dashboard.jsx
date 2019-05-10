import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import ValidarPermisos from "../../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';
import { withStyles } from '@material-ui/core/styles';
import {
    CUENTAS_CONTABLES as bloque_1_permisos
} from "../../../../../../00_utilities/permisos/types";

import CuentasContables from '../../cuentas_contables/components/cuentas_contables_list';

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
    tab: {
        fontSize: '0.2rem'
    }
});

class ListadoElementos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'Configuraciones';
        this.singular_name = 'Configuraciones';
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
        if (index === 3) {
            this.props.fetchCuentasContables();
        }
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([bloque_1_permisos], {callback: () => this.cargarDatos()});
    }


    componentWillUnmount() {
        this.props.clearCuentasContables();
    }

    cargarDatos() {
        this.cargarElementos();
    }

    render() {
        const {cuentas_contables, mis_permisos, classes} = this.props;
        const permisos_object_1 = permisosAdapter(mis_permisos, bloque_1_permisos);

        const can_see = permisos_object_1.list;
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
                    <Tab label="Diarios" value={0}/>
                    <Tab label="Impuestos" value={1}/>
                    <Tab label="Bancos" value={2}/>
                    <Tab label="Cuentas Contables" value={3}/>
                </Tabs>
                {
                    this.state.slideIndex === 0 &&
                    <div>Aqui los diarios</div>
                }
                {
                    this.state.slideIndex === 1 &&
                    <div>Aqui Dashboard Impuestos</div>
                }
                {
                    this.state.slideIndex === 2 &&
                    <div>Aqui Bancos</div>
                }
                {
                    this.state.slideIndex === 3 &&
                    <CuentasContables
                        posSummitMethod={() => this.cargarDatos()}
                        con_titulo={false}
                        object_list={cuentas_contables}
                        permisos_object={permisos_object_1}
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
        cuentas_contables: state.contabilidad_cuentas_contables,
        mis_permisos: state.mis_permisos
    }
}

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(ListadoElementos))