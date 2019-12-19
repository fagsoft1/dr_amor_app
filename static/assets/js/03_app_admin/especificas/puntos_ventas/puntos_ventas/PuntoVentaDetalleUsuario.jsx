import React, {memo, Fragment} from 'react';
import Typography from "@material-ui/core/Typography/index";
import Paper from '@material-ui/core/Paper/index';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const PuntoVentaDetalleUsuario = memo(props => {
    const {usuarios, classes_list, classes} = props;
    return (<Fragment>
        <Paper className={classes.root} elevation={2}>
            <div className="row" style={{fontSize: '0.6rem'}}>
                <div className="col-12">
                    <div className="col-12">
                        <Typography variant="h6" gutterBottom color="primary">
                            Usuarios
                        </Typography>
                    </div>
                    <div className="col-12">
                        {usuarios.length > 0 &&
                        <List dense className={classes_list.root}>
                            {usuarios.map(e =>
                                <ListItem key={e.id} button>
                                    <ListItemText id={e.id} primary={`${e.first_name} ${e.last_name}`}/>
                                </ListItem>)}
                        </List>}
                    </div>
                </div>
            </div>
        </Paper>
    </Fragment>)
});

export default PuntoVentaDetalleUsuario;