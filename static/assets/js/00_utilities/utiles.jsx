import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export const ListaTitulo = (props) => {
    return (
        <div>
            <Typography variant="h2" gutterBottom color="primary">
                {props.titulo}
            </Typography>
            {
                props.can_add &&
                <button
                    className="btn btn-primary"
                    style={{cursor: "pointer"}}
                    onClick={props.onClick}
                >
                    <i className="fas fa-plus"
                       aria-hidden="true"></i>
                </button>
            }
        </div>
    )
};
ListaTitulo.propTypes = {
    titulo: PropTypes.string
};


export class ListaBusqueda extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: ''
        })
    }

    render() {
        return (
            <Fragment>
                <TextField
                    placeholder="A buscar"
                    fullWidth={true}
                    onChange={(e) => this.setState({busqueda: e.target.value})}
                    autoComplete="off"
                    value={this.state.busqueda}
                />
                {this.props.children(this.state.busqueda)}
            </Fragment>
        )
    }
};