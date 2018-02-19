import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {tengousuario} from "../../../../00_utilities/common";

class UsuariosDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            first_name:'',
            last_name:'',

        })
    }
}