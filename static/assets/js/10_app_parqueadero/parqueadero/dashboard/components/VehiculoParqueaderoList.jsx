import React, {memo} from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import classNames from "classnames";


import VehiculoParqueaderoItem from './VehiculoParqueaderoItem';

const styles = theme => (
    {
        vehiculoItem: {
            color: theme.palette.primary.dark,
            padding: '3px',
            width: '100%',
            textAlign: 'center',
        },
        vehiculoItemInterno: {
            border: `1px solid ${theme.palette.primary.dark}`,
            padding: '5px',
            borderRadius: '5px'
        },
        vehiculoItemInternoText: {
            padding: '0px',
            fontSize: '0.7rem'
        },
        vehiculoItemInternoTextPlaca: {
            padding: '0px',
            fontSize: '1.3rem'
        },
    });

const VehiculoParqueaderoListado = memo(props => {
    const {
        listado_vehiculos,
        classes,
        actual_time,
        onSelectVehiculoParqueadero,
        onImprimir
    } = props;
    return (
        <div className='row'>
            {_.map(listado_vehiculos, v =>
                <div
                    className={classNames(classes.vehiculoItem, "col-12 col-xs-6 col-sm-3 col-md-2")}
                    key={v.id}
                >
                    <VehiculoParqueaderoItem
                        onImprimir={onImprimir}
                        vehiculo={v}
                        style={classes}
                        actual_time={actual_time}
                        onSelectVehiculoParqueadero={onSelectVehiculoParqueadero}
                    />
                </div>
            )}
        </div>
    )
});

export default withStyles(styles, {withTheme: true})(VehiculoParqueaderoListado);