import React, {memo} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/DrawerMenuListItem';
import ListCollapse from '../../00_utilities/components/ui/drawer/DrawerMenuListCollapse';


const MenuCaja = memo(props => {
    const {permisos_menu} = props;
    const {
        admin_cajas_billetes_monedas,
        admin_cajas_conceptos_operaciones_cajas
    } = permisos_menu;
    return (
        (
            admin_cajas_billetes_monedas ||
            admin_cajas_conceptos_operaciones_cajas
        ) &&
        <ListCollapse icono='money-bill-alt' texto='Cajas'>
            {admin_cajas_billetes_monedas &&
            <DrawerListItem
                size='1x'
                link='/app/admin/cajas/billetes_monedas/list'
                texto='Billetes y Monedas'
                icono='money-bill-alt'
                type='nested'
            />}
            {admin_cajas_conceptos_operaciones_cajas &&
            <DrawerListItem
                size='1x'
                link='/app/admin/cajas/conceptos_operaciones_caja/list'
                texto='Conceptos Operaciones Caja'
                icono='list'
                type='nested'
            />}
        </ListCollapse>
    )
});

export default MenuCaja;