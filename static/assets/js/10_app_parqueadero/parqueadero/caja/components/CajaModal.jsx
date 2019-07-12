import React, {memo} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import {pesosColombianos} from "../../../../00_utilities/common";

const PagoDialog = memo(props => {
    const {
        is_open,
        onCerrar = null,
        vehiculo,
        info_pago,
        onPagar
    } = props;
    if (!vehiculo || !info_pago) {
        return <div>Cargando..</div>
    }
    return (
        <Dialog
            fullScreen={false}
            open={is_open}
        >
            <DialogTitle id="responsive-dialog-title">
                Pago Parqueadero {vehiculo.vehiculo_placa}
            </DialogTitle>
            <DialogContent>
                <div className="row">
                    <div className="col-12">
                        <Typography variant="h1" color="primary" noWrap>
                            {vehiculo.vehiculo_placa}
                        </Typography>
                    </div>
                    <div className="col-12">
                        <Typography variant="h6" color="primary" noWrap>
                            {vehiculo.tipo_vehiculo_nombre}
                        </Typography>
                    </div>
                    <div className="col-12">
                        <Typography variant="h6" color="primary" noWrap>
                            {vehiculo.modalidad_fraccion_tiempo_nombre}
                        </Typography>
                    </div>
                    <div className="col-12 text-center">
                        <Typography variant="h3" color="primary" noWrap>
                            {info_pago && pesosColombianos(info_pago.valor)}
                        </Typography>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onPagar}
                >
                    Pagar
                </Button>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={onCerrar}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
});

export default PagoDialog;