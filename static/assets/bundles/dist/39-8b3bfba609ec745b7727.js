(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{1018:function(e,a,t){"use strict";(function(e){var r,n=t(0),s=t.n(n),o=t(4),c=t.n(o),i=t(54);(r=t(2).enterModule)&&r(e);var l={cursor:"pointer",position:"fixed",top:"80px",right:"40px","&:hover":{color:"red"},"&:active":{color:"green"}},u=Object(n.memo)(function(e){return s.a.createElement(i.a,{style:l,onClick:e.cargarDatos,icon:["far","sync-alt"],size:"2x"})});u.propTypes={cargarDatos:c.a.func};var d,m,p=u;a.a=p,d=t(2).default,m=t(2).leaveModule,d&&(d.register(l,"style","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/00_utilities/components/system/CargarDatos.jsx"),d.register(u,"CargarDatos","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/00_utilities/components/system/CargarDatos.jsx"),d.register(p,"default","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/00_utilities/components/system/CargarDatos.jsx"),m(e))}).call(this,t(5)(e))},1026:function(e,a,t){"use strict";(function(e){var r,n=t(0),s=t.n(n),o=t(4),c=t.n(o);(r=t(2).enterModule)&&r(e);var i=Object(n.memo)(function(e){var a=e.can_see,t=e.nombre,r=e.children;return console.log("renderizón validar permiso"),a?s.a.createElement(n.Fragment,null,r):s.a.createElement(n.Fragment,null,"No tiene suficientes permisos para ver ".concat(t,"."))});i.propTypes={can_see:c.a.bool,nombre:c.a.string};var l,u,d=i;a.a=d,l=t(2).default,u=t(2).leaveModule,l&&(l.register(i,"ValidaPermisos","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/permisos/validar_permisos.jsx"),l.register(d,"default","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/permisos/validar_permisos.jsx"),u(e))}).call(this,t(5)(e))},1490:function(e,a,t){"use strict";t.r(a),function(e){var r,n=t(0),s=t.n(n),o=t(15),c=t(13),i=t(1018),l=t(1026),u=t(29),d=t(1491),m=t(1492),p=t(153),f=t(23),b=t.n(f);(r=t(2).enterModule)&&r(e);var h,v,j=function(e){var a=e.pdv_colaborador,t=e.quitarPuntoVenta;return s.a.createElement(n.Fragment,null,a&&a.length>0&&s.a.createElement("table",{className:"table table-striped table-responsive"},s.a.createElement("tbody",null,a.map(function(e){return s.a.createElement("tr",{key:e.id},s.a.createElement("td",null,e.nombre),s.a.createElement("td",null,s.a.createElement(m.a,{onClick:function(){return t(e)}})))}))))},g=Object(n.memo)(function(e){var a=e.match.params.id,t=Object(o.useSelector)(function(e){return e.mis_permisos}),r=Object(o.useSelector)(function(e){return e.puntos_ventas}),m=Object(o.useSelector)(function(e){return e.colaboradores[a]}),f=Object(u.j)(t,p.h),h=function(e,a){return function(e){if(Array.isArray(e))return e}(e)||function(e,a){var t=[],r=!0,n=!1,s=void 0;try{for(var o,c=e[Symbol.iterator]();!(r=(o=c.next()).done)&&(t.push(o.value),!a||t.length!==a);r=!0);}catch(e){n=!0,s=e}finally{try{r||null==c.return||c.return()}finally{if(n)throw s}}return t}(e,a)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(Object(n.useState)(null),2),v=h[0],g=h[1],y=Object(o.useDispatch)(),P=function(){return y(c.fetchColaborador(a,{callback:E}))},E=function(){y(c.fetchPuntosVentas_por_colaborador(a,{callback:function(e){g(e),y(c.fetchPuntosVentas())}}))};Object(n.useEffect)(function(){return y(c.fetchMisPermisosxListado([p.h],{callback:P})),function(){y(c.clearColaboradores()),y(c.clearPermisos()),y(c.clearPuntosVentas())}},[]);var x=v?_.pickBy(r,function(e){return!_.map(v,function(e){return e.id}).includes(e.id)}):null;return m?s.a.createElement(l.a,{can_see:f.detail,nombre:"detalles de Colaborador"},s.a.createElement(b.a,{variant:"h5",gutterBottom:!0,color:"primary"},"Detalle Colaborador ",m.full_name_proxy),s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-12"},"Puntos de Venta"),s.a.createElement("div",{className:"col-12"},s.a.createElement(d.a,{addPuntoVenta:function(e){y(c.adicionarPuntoVenta(a,e.id,{callback:E}))},puntos_ventas:x})),s.a.createElement("div",{className:"col-12"},s.a.createElement(j,{pdv_colaborador:v,quitarPuntoVenta:function(e){y(c.quitarPuntoVenta(a,e.id,{callback:E}))}}))),s.a.createElement(i.a,{cargarDatos:P})):s.a.createElement(b.a,{variant:"overline",gutterBottom:!0,color:"primary"},"Cargando...")}),y=g;a.default=y,h=t(2).default,v=t(2).leaveModule,h&&(h.register(j,"TablaPDV","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/03_app_admin/especificas/terceros_colaboradores/colaboradores/ColaboradorDetail.jsx"),h.register(g,"Detail","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/03_app_admin/especificas/terceros_colaboradores/colaboradores/ColaboradorDetail.jsx"),h.register(y,"default","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/03_app_admin/especificas/terceros_colaboradores/colaboradores/ColaboradorDetail.jsx"),v(e))}.call(this,t(5)(e))},1491:function(e,a,t){"use strict";(function(e){var r,n=t(0),s=t.n(n),o=t(235),c=t.n(o),i=t(20),l=t.n(i);(r=t(2).enterModule)&&r(e);var u,d,m=Object(n.memo)(function(e){var a=function(e,a){return function(e){if(Array.isArray(e))return e}(e)||function(e,a){var t=[],r=!0,n=!1,s=void 0;try{for(var o,c=e[Symbol.iterator]();!(r=(o=c.next()).done)&&(t.push(o.value),!a||t.length!==a);r=!0);}catch(e){n=!0,s=e}finally{try{r||null==c.return||c.return()}finally{if(n)throw s}}return t}(e,a)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(Object(n.useState)(null),2),t=a[0],r=a[1],o=e.puntos_ventas,i=e.addPuntoVenta,u=_.map(_.orderBy(o,["nombre"],["asc"]),function(e){return e});return s.a.createElement(n.Fragment,null,u.length>0&&s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col-12 col-md-6"},s.a.createElement(c.a,{data:u,placeholder:"Punto Venta",valueField:"id",textField:"nombre",onSelect:function(e){return r(e)}})),s.a.createElement("div",{className:"col-12 col-md-2"},t&&s.a.createElement(l.a,{color:"primary",className:"ml-3",onClick:function(){i(t)}},"Adicionar"))))}),p=m;a.a=p,u=t(2).default,d=t(2).leaveModule,u&&(u.register(m,"AddPuntoVenta","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/03_app_admin/especificas/terceros_colaboradores/colaboradores/ColaboradorDetailAddPuntoVenta.jsx"),u.register(p,"default","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/03_app_admin/especificas/terceros_colaboradores/colaboradores/ColaboradorDetailAddPuntoVenta.jsx"),d(e))}).call(this,t(5)(e))},1492:function(e,a,t){"use strict";(function(e){var r,n=t(0),s=t.n(n),o=t(4),c=t.n(o),i=t(601),l=t.n(i),u=t(32),d=t(54);(r=t(2).enterModule)&&r(e);var m=Object(n.memo)(function(e){var a=e.onClick,t=e.classes;return s.a.createElement("div",{className:"text-center"},s.a.createElement(l.a,{style:{margin:0,padding:4},onClick:a},s.a.createElement(d.a,{className:t.icono,icon:["far","trash"],size:"xs"})))});m.propTypes={onClick:c.a.func};var p,f,b=function(e){return{icono:{color:e.palette.primary.dark}}},_=Object(u.withStyles)(b,{withTheme:!0})(m);a.a=_,p=t(2).default,f=t(2).leaveModule,p&&(p.register(m,"IconButtonTableDelete","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/00_utilities/components/ui/icon/TableIconButtonDelete.jsx"),p.register(b,"styles","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/00_utilities/components/ui/icon/TableIconButtonDelete.jsx"),p.register(_,"default","/Users/fabioandresgarciasanchez/PycharmProjects/dr_amor_app/static/assets/js/00_utilities/components/ui/icon/TableIconButtonDelete.jsx"),f(e))}).call(this,t(5)(e))}}]);