import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/CargarDatos";
import ValidarPermisos from "../../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs/index';
import Tab from '@material-ui/core/Tab/index';
import Typography from '@material-ui/core/Typography/index';
import {withStyles} from '@material-ui/core/styles';
import {
    ASIENTOS_CONTABLES as bloque_1_permisos
} from "../../../../../../00_utilities/permisos/types";

import AsientosContables from '../../asientos_contables/components/asientos_contables_list';

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
        this.plural_name = 'Contabilidad';
        this.singular_name = 'Contabilidad';
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
            this.props.fetchCuentasContablesDetalles();
            this.props.fetchDiariosContables();
            this.props.fetchEmpresas();
            this.props.fetchTerceros();
        }
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([bloque_1_permisos], {callback: () => this.cargarDatos()});
    }


    componentWillUnmount() {
        this.props.clearAsientosContables();
    }

    cargarDatos() {
        this.cargarElementos();
    }

    render() {
        const {
            asientos_contables,
            mis_permisos
        } = this.props;
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
                    <Tab label="Crear Asientos" value={0}/>
                </Tabs>
                {
                    this.state.slideIndex === 0 &&
                    <AsientosContables
                        {...this.props}
                        posSummitMethod={() => this.cargarDatos()}
                        con_titulo={false}
                        object_list={asientos_contables}
                        permisos_object={permisos_object_1}
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
        asientos_contables: state.contabilidad_asientos_contables,
        cuentas_contables: state.contabilidad_cuentas_contables,
        diarios_contables: state.contabilidad_diarios_contables,
        empresas: state.empresas,
        terceros: state.terceros,
        mis_permisos: state.mis_permisos
    }
}

export default withStyles(styles, {withTheme: true})(connect(mapPropsToState, actions)(ListadoElementos))