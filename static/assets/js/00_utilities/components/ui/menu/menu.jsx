import React, {Component} from 'react';
import {Link} from 'react-router-dom'

import * as actions from "../../../../01_actions/01_index";
import {connect} from "react-redux";

class MenuBase extends Component {
    componentDidMount() {
        this.props.fetchMiCuenta();
        this.props.fetchMisPermisos();
    }

    render() {
        const {mis_permisos, mi_cuenta} = this.props;
        return (
            <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light mt-0 mb-0 pt-0 pb-0">
                <Link to='/app/'>
                    <img src={`${img_static_url}/logo.png`} width="80" className="d-inline-block align-top mr-2"
                         alt=""/>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        {this.props.children(mis_permisos)}
                    </ul>
                    <ul className="navbar-nav">
                        <span className="navbar-text">{mi_cuenta.username} | <span className='puntero'
                                                                                   onClick={() => this.props.logout()}><small>Salir </small>
                        </span>
                        </span>
                    </ul>
                </div>
            </nav>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mi_cuenta: state.mi_cuenta,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(MenuBase);