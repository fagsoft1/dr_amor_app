import React, {Component, Fragment} from 'react';
import TextField from '@material-ui/core/TextField';

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