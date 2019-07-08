import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../01_actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TablaServiciosResumen from "./servicios/components/tabla_resumen_servicios";

const styles = {
    table: {
        fontSize: '0.8rem',
        td: {
            padding: '0',
            margin: '0',
            paddingLeft: '3px',
            paddingRight: '3px',
            border: '1px solid black'
        },
        td_right: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            border: '1px solid black'
        },
        td_total: {
            padding: '0',
            margin: '0',
            paddingRight: '3px',
            paddingLeft: '3px',
            textAlign: 'right',
            borderBottom: 'double 3px'
        },
        tr: {
            padding: '0',
            margin: '0',
        }
    },
};

class ResumenVentasEmpresas extends Component {
    cargarDatos() {
        this.props.fetchConsultaVentasEmpresas();
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearConsultaVentasEmpresas();
    }

    render() {
        const {consultas_ventas_empresas} = this.props;
        let todos_las_ventas_productos = [];
        _.map(consultas_ventas_empresas, e => {
            e.ventas_productos.map(vp => {
                vp.productos.map(p => {
                    todos_las_ventas_productos = [...todos_las_ventas_productos, p]
                })
            })
        });
        return (
            <div className='row'>
                <div className="col-12 col-md-4">
                    <TablaServiciosResumen
                        styles={styles}
                        consultas_ventas_empresas={consultas_ventas_empresas}
                    />
                </div>
                <div
                    style={{
                        cursor: "pointer",
                        position: "relative",
                        left: "10px"
                    }}
                    onClick={() => {
                        this.cargarDatos();
                    }}
                >
                    <FontAwesomeIcon icon={['far', 'sync-alt']} size='2x'/>
                </div>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        consultas_ventas_empresas: state.consultas_ventas_empresas
    }
}

export default connect(mapPropsToState, actions)(ResumenVentasEmpresas)