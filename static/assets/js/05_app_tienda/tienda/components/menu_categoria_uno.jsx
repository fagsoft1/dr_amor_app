import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CategoriaDosMenu from '../components/menu_categoria_dos';
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

class CategoriaUnoMenu extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            categoria_dos_seleccionada: null
        });
    }

    render() {
        const {categoria_uno, mostrar, classes, onBack, onClick, categoria_uno_seleccionada, adicionarItemAPedidoActual} = this.props;
        const {categoria_dos_seleccionada} = this.state;
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
                            onBack={() => this.setState({categoria_dos_seleccionada: null})}
                            onClick={(seleccion) => this.setState({categoria_dos_seleccionada: seleccion})}
                        />
                    )
                }
            </Fragment>
        }
        return <Fragment></Fragment>
    }
}

export default withStyles(styles)(CategoriaUnoMenu);