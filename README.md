# react-map-click

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Componente que permite interacción con SVG's con funciones dirigidas a administración de terrenos por lote.

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo


## Pendientes

- Estilizar componentes
- Crear estilos de los temas predeterminados
- usar GetBBox para evitar marcar puntos manualmente
- Al maximizar los puntos no coinden ya que son absolutos y no porcentuales
- Exportar Template del Tooltip(?)
- Mudar los filtros a un estado local del componente Search
- Migrar todo a TS
	- Eliminar Porptypes
- cambiar iconos perzonalizados
- Agregar deteccion de userAgent para evitar conflictos con los listeners(onClick y onTouch)

## Bugs
- Al usar transition a nivel general hay un conflicto al mover el mapa cuando existe un tooltip.
	- posible solucion(crear una clase y deshabilitar la animacion cuando exista un tooltip) 
```
.map-container > svg > g{

transition:transform  0.25s  ease-in-out

}
```
