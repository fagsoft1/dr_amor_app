import React, {Component, Fragment} from 'react';
import Typography from "@material-ui/core/Typography";
import ServiciosDialog from './sevicios_dialog_tabla';

const Celda = (props) => {
    const {servicios, es_total = false} = props;
    const validos = servicios.filter(s => [1, 2].includes(s.estado)).length;
    const solicitud_anular = servicios.filter(s => s.estado === 4).length;
    return (
        <div
            className='puntero'
            style={{color: solicitud_anular > 0 && !es_total ? 'red' : ''}}
        >
            {validos}
        </div>
    )
};

class TablaServiciosResumen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtro_servicios_categoria: 'T',
            filtro_servicios_tarifa: 'T',
            open_dialog_servicios: false
        };
    }

    getServiciosResumenFiltrados(lista_servicios) {
        const {filtro_servicios_categoria, filtro_servicios_tarifa} = this.state;
        if (filtro_servicios_categoria && filtro_servicios_categoria !== 'T') {
            lista_servicios = lista_servicios.filter(s => s.categoria === filtro_servicios_categoria)
        }
        if (filtro_servicios_tarifa && filtro_servicios_tarifa !== 'T') {
            lista_servicios = lista_servicios.filter(s => s.tiempo_minutos === filtro_servicios_tarifa)
        }
        return lista_servicios
    }

    consultaServicios(c = null, f = null) {
        if (c && f) {
            this.setState({filtro_servicios_categoria: c, filtro_servicios_tarifa: f, open_dialog_servicios: true})
        } else if (f) {
            this.setState({filtro_servicios_categoria: null, filtro_servicios_tarifa: f, open_dialog_servicios: true})
        } else if (c) {
            this.setState({filtro_servicios_categoria: c, filtro_servicios_tarifa: null, open_dialog_servicios: true})
        } else {
            this.setState({filtro_servicios_categoria: 'T', filtro_servicios_tarifa: 'T', open_dialog_servicios: true})
        }
    }

    render() {
        const {consultas_ventas_empresas, styles} = this.props;
        const {open_dialog_servicios} = this.state;
        let todos_los_servicios = [];
        let servicios_resumen_matrix = {};

        _.map(consultas_ventas_empresas, e => {
            e.servicios.map(s => {
                todos_los_servicios = [...todos_los_servicios, s]
            })
        });

        const categoria_x = _.uniq(_.map(todos_los_servicios, e => e.categoria));
        const fracciones_tiempo_y = _.uniq(_.map(todos_los_servicios, e => e.tiempo_minutos));

        categoria_x.map(c => {
            servicios_resumen_matrix = {...servicios_resumen_matrix, [c]: {}};
            fracciones_tiempo_y.map(ft => {
                servicios_resumen_matrix[c] = {
                    ...servicios_resumen_matrix[c], [ft]: {
                        servicios: todos_los_servicios.filter(s => (s.categoria === c && s.tiempo_minutos === ft))
                    }
                }
            });
        });

        const listado_servicios = this.getServiciosResumenFiltrados(todos_los_servicios);
        return (
            <div className='row'>
                {
                    open_dialog_servicios &&
                    <ServiciosDialog
                        styles={styles}
                        is_open={open_dialog_servicios}
                        listado_servicios={listado_servicios}
                        onCerrar={() => {
                            this.setState({
                                open_dialog_servicios: false,
                                filtro_servicios_categoria: 'T',
                                filtro_servicios_tarifa: 'T'
                            })
                        }}
                    />
                }
                <div className="col-12 text-left">
                    <Typography variant="h6" gutterBottom color="primary">
                        Resumen Servicios
                    </Typography>
                </div>
                <div className="col-12">
                    <table className='table table-striped table-responsive'
                           style={{...styles.table, fontSize: '1.4rem'}}>
                        <thead>
                        <tr
                            style={styles.table.tr}
                        >
                            <th style={styles.table.td}>Categoría</th>
                            {
                                fracciones_tiempo_y.map(f => <th style={styles.table.td} key={f}>{f}</th>)
                            }
                            <th style={styles.table.td}>Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            categoria_x.map(c => <tr key={c} style={styles.table.tr}>
                                <td style={styles.table.td}>{c}</td>
                                {
                                    fracciones_tiempo_y.map(f =>
                                        <td
                                            style={styles.table.td}
                                            key={f}
                                            className='puntero'
                                            onClick={() => this.consultaServicios(c, f)}
                                        >
                                            <Celda servicios={servicios_resumen_matrix[c][f].servicios}/>
                                        </td>
                                    )
                                }
                                <td
                                    style={styles.table.td}
                                    className='puntero'
                                    onClick={() => this.consultaServicios(c, null)}
                                >
                                    <Celda servicios={todos_los_servicios.filter(e => e.categoria === c)}
                                           es_total={true}/>
                                </td>
                            </tr>)
                        }
                        </tbody>
                        <tfoot>
                        <tr style={styles.table.tr}>
                            <td style={styles.table.td}>Total</td>
                            {
                                fracciones_tiempo_y.map(f =>
                                    <td
                                        style={styles.table.td}
                                        key={f}
                                        className='puntero'
                                        onClick={() => this.consultaServicios(null, f)}
                                    >
                                        <Celda servicios={todos_los_servicios.filter(e => e.tiempo_minutos === f)}
                                               es_total={true}/>
                                    </td>
                                )
                            }
                            <td
                                style={styles.table.td}
                                className='puntero'
                                onClick={() => this.consultaServicios(null, null)}
                            >
                                <Celda servicios={todos_los_servicios} es_total={true}/>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        )
    }
};

export default TablaServiciosResumen;