import React, {Component, Fragment} from 'react';
import ListadoServicios from './cuenta_conceptos/servicios';
import ListadoConsumos from './cuenta_conceptos/consumos';
import ListadoEgresos from './cuenta_conceptos/otros';
import ResumenLiquidacion from './cuenta_conceptos_resumen';

const styles = {
    table: {
        fontSize: '0.7rem',
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

class ConceptosCuenta extends Component {
    render() {
        const {cuenta, cuenta: {tipo_cuenta}} = this.props;
        return (
            <Fragment>
                <ResumenLiquidacion
                    styles={styles}
                    cuenta={cuenta}
                />
                <div className="col-12" style={{paddingLeft: '40px'}}>
                    <div className="row">
                        <div className="col-12">
                            {
                                tipo_cuenta === 'A' &&
                                <ListadoServicios
                                    styles={styles}
                                    cuenta={cuenta}
                                />
                            }
                        </div>
                        <div className="col-12">
                            <ListadoConsumos
                                styles={styles}
                                cuenta={cuenta}
                            />
                        </div>
                        {
                            ['A', 'C'].includes(tipo_cuenta) &&
                            <div className="col-12">
                                <ListadoEgresos
                                    styles={styles}
                                    cuenta={cuenta}
                                />
                            </div>
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default ConceptosCuenta