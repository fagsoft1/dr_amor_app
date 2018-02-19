import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";
import TextField from 'material-ui/TextField';

export const ListaTitulo = (props) => {
    return (
        <div>
            <h3 className="h3-responsive">{props.titulo}</h3>
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
                    floatingLabelText="A buscar"
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