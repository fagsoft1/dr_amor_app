import {TIPO_COMPROBANTE_CONTABLE_TYPES as TYPES} from '../../../../01_actions/00_types';
import baseReducer from '../../../baseReducer'

export default function (state = [], action) {
    return baseReducer(TYPES, state, action)
}