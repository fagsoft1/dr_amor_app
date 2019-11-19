import React, {useEffect} from 'react';
import useTengoPermisos from "../../../../../00_utilities/hooks/useTengoPermisos";
import {BANCOS, CUENTAS_BANCARIAS_BANCOS} from "../../../../../permisos";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import {useSelector} from "react-redux/es/hooks/useSelector";
import * as actions from "../../../../../01_actions";
import Typography from "@material-ui/core/Typography";
import ValidarPermisos from "../../../../../permisos/validar_permisos";

import crudHOC from "../../../../../00_utilities/components/HOCCrud";

import CreateForm from "./forms/BancoContabilidadCuentaBancariaCRUDForm";
import Tabla from "./BancoContablidadCuentaBancariaCRUDTable";

const CRUD = crudHOC(CreateForm, Tabla);

const BancoContabilidadDetail = props => {
    const {id} = props.match.params;
    const permisos_bancos = useTengoPermisos(BANCOS);
    const permisos_cuentas_bancarias = useTengoPermisos(CUENTAS_BANCARIAS_BANCOS);
    const dispatch = useDispatch();

    const cargarDatos = () => {
        dispatch(actions.fetchBanco(id));
    };

    const banco = useSelector(state => state.contabilidad_bancos[id]);

    const method_pool = {
        fetchObjectMethod: (id, options) => dispatch(actions.fetchCuentaBancariaBanco(id, options)),
        deleteObjectMethod: (id, options) => dispatch(actions.deleteCuentaBancariaBanco(id, options)),
        createObjectMethod: (item, options) => dispatch(actions.createCuentaBancariaBanco({
            ...item,
            banco: id
        }, options)),
        updateObjectMethod: (id, item, options) => dispatch(actions.updateCuentaBancariaBanco(id, item, options)),
    };

    useEffect(() => {
        cargarDatos();
        return () => {
            dispatch(actions.clearBancos());
        }
    }, []);

    if (!banco) {
        return <Typography variant="overline" gutterBottom color="primary">
            Cargando...
        </Typography>
    }

    const {nombre, nit, cuentas_bancarias} = banco;
    const list = _.mapKeys(cuentas_bancarias, 'id');
    return (
        <ValidarPermisos can_see={permisos_bancos.detail} nombre='Banco'>
            <Typography variant="h5" gutterBottom color="primary">
                Detalle Banco {nombre}
            </Typography>
            <div className="row">
                <div className="col-12">
                    <Typography variant="body1" gutterBottom color="primary">
                        Nit: {nit}
                    </Typography>
                </div>
                <div className="col-12">
                    <CRUD
                        posSummitMethod={() => cargarDatos()}
                        posDeleteMethod={() => cargarDatos()}
                        method_pool={method_pool}
                        list={list}
                        permisos_object={permisos_cuentas_bancarias}
                        plural_name=''
                        singular_name='Cuenta Bancaria'
                        cargarDatos={cargarDatos}
                    />
                </div>
            </div>
        </ValidarPermisos>
    )
};

export default BancoContabilidadDetail;