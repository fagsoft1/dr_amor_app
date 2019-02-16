import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import {
    ALGOS as permisos_view
} from "../../../../../00_utilities/permisos/types";
import Typography from '@material-ui/core/Typography';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado([permisos_view], {callback: () => this.cargarDatos()});
    }

    componentWillUnmount() {
        this.props.clearPermisos()
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const callback = () => {
        };
        this.props.fetchAlgo(id, {callback});

    }

    render() {
        const {object, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);


        if (!object) {
            return <Typography variant="overline" gutterBottom color="primary">
                Cargando...
            </Typography>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de algo'>
                <Typography variant="h5" gutterBottom color="primary">
                    Detalle {object.username}
                </Typography>
                <div className="row">
                    LOS COMPONENTES
                </div>
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        auth: state.auth,
        mis_permisos: state.mis_permisos,
        object: state.algos[id]
    }
}

export default connect(mapPropsToState, actions)(Detail)