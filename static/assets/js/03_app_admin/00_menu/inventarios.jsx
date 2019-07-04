import React, {memo} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/DrawerMenuListItem';
import ListCollapse from '../../00_utilities/components/ui/drawer/DrawerMenuListCollapse';


const MenuInventarios = memo(props => {
    const {permisos_menu} = props;
    const {
        admin_bodegas,
        admin_bodegas_kardex,
        admin_bodegas_kardex_traslados
    } = permisos_menu;
    return (
        (
            admin_bodegas ||
            admin_bodegas_kardex ||
            admin_bodegas_kardex_traslados
        ) &&
        <ListCollapse icono='warehouse' texto='Inventarios'>
            {admin_bodegas &&
            <DrawerListItem
                size='1x'
                link='/app/admin/inventarios/bodegas/list'
                texto='Bodegas'
                icono='warehouse'
                type='nested'
            />}
            {admin_bodegas_kardex &&
            <DrawerListItem
                size='1x'
                link='/app/admin/inventarios/movimientos_inventarios/list'
                texto='Kardex'
                icono='inventory'
                type='nested'
            />}
            {admin_bodegas_kardex_traslados &&
            <DrawerListItem
                size='1x'
                link='/app/admin/inventarios/traslados/list'
                texto='Kardex Traslados'
                icono='exchange'
                type='nested'
            />}
        </ListCollapse>
    )
});

export default MenuInventarios;