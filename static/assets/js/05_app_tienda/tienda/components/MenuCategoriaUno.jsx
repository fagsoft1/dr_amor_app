import React, {Fragment, memo, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CategoriaDosMenu from './MenuCategoriaDos';
import Button from '@material-ui/core/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        minHeight: '5rem',
        width: '100%',
        margin: 0,
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }
});

const CategoriaUnoMenu = memo(props => {
    const [categoria_dos_seleccionada, setCategoriaDosSeleccionada] = useState(null);

    const {categoria_uno, mostrar, classes, onBack, onClick, categoria_uno_seleccionada, adicionarItemAPedidoActual} = props;
    if (mostrar) {
        return (
            <div className='col-6 col-lg-4 puntero' style={{padding: 2}}>
                <Paper className={classes.root} elevation={1}
                       onClick={() => onClick(categoria_uno.categoria_uno)}>
                    <Typography variant="body1">
                        {categoria_uno.categoria_uno}
                    </Typography>
                </Paper>
            </div>
        )
    }
    if (!mostrar && categoria_uno_seleccionada === categoria_uno.categoria_uno) {
        return <Fragment>
            {
                !categoria_dos_seleccionada &&
                <div style={{position: 'absolute', top: '-60px', left: '-60px'}}>
                    <Button onClick={onBack} color='primary' variant="outlined">
                        <FontAwesomeIcon
                            icon={['far', 'angle-double-left']}
                            size='3x'
                        />
                    </Button>
                </div>
            }
            {
                categoria_uno.categorias_dos.map(
                    c2 => <CategoriaDosMenu
                        adicionarItemAPedidoActual={adicionarItemAPedidoActual}
                        key={c2.categoria_dos}
                        mostrar={!categoria_dos_seleccionada}
                        categoria_dos_seleccionada={categoria_dos_seleccionada}
                        categoria_dos={c2}
                        onBack={() => setCategoriaDosSeleccionada(null)}
                        onClick={seleccion => setCategoriaDosSeleccionada(seleccion)}
                    />
                )
            }
        </Fragment>
    }
    return <Fragment></Fragment>
});

export default withStyles(styles)(CategoriaUnoMenu);