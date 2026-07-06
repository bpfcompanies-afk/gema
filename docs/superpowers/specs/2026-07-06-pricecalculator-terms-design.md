# Pricecalculator: Plazos, Paquetes y Licencias de Desarrollo

## Contexto

El `pricecalculator` (`src/app/pricecalculator/page.tsx`) actualmente cotiza módulos a un precio único, sin contrato. El negocio pasa a un modelo de precios por plazo de contrato (mes a mes / 3 / 6 / 12 meses) y agrega dos conceptos nuevos: **paquetes** de precio fijo y **licencias de desarrollo/co-creación**. Este spec cubre solo `pricecalculator`; `precios/page.tsx` no se toca.

Fuente de precios: tabla provista por el usuario (ver "Datos de precios" abajo).

## Modelo de datos de precios

Todas las tablas están indexadas por plazo. Los plazos son:

```ts
type Term = 'mensual' | '3m' | '6m' | '12m';
```

### Módulos a la carta

| | mensual | 3m | 6m | 12m |
|---|---|---|---|---|
| Módulo Core (cada uno) | 89.000 | 79.000 | 69.000 | 59.000 |
| Módulo Complementario (cada uno) | 35.000 | 29.000 | 25.000 | 22.000 |

Aplica igual para los 7 módulos core y los 2 complementos existentes (precio flat, igual que hoy).

### Paquetes (precio fijo, no depende de cuáles módulos se elijan)

| | mensual | 3m | 6m | 12m | cupo |
|---|---|---|---|---|---|
| Arma tu Medida | 139.000 | 119.000 | 105.000 | 89.000 | 3 módulos (core y/o complemento, a elección) |
| Operación Total | 189.000 | 159.000 | 139.000 | 119.000 | todos los módulos (auto-incluidos) |

### Expansiones de Capacidad

| | mensual | 3m | 6m | 12m |
|---|---|---|---|---|
| Compañía Adicional | 39.000 | 35.000 | 29.000 | 25.000 |
| Usuario Adicional | 11.000 | 9.000 | 8.000 | 7.000 |
| Paquete 5 Usuarios Extra | 35.000 | 29.000 | 25.000 | 19.000 |

Sin cambios de comportamiento respecto a hoy, solo se repriza según el plazo global.

### Licencias de Desarrollo / Co-creación

No tienen tarifa mensual (mínimo 3 meses = "Piloto").

| | 3m (Piloto) | 6m | 12m | cupo |
|---|---|---|---|---|
| Ultra Low-Cost | 169.000 | 149.000 | 129.000 | 1 módulo (core y/o complemento, a elección) |
| Intermedio | 249.000 | 219.000 | 189.000 | 3 módulos (core y/o complemento, a elección) |
| Todo Incluido | 329.000 | 289.000 | 250.000 | todos los módulos (auto-incluidos) |

## Modalidad (plan base) — mutuamente excluyentes

El usuario elige exactamente **una** modalidad. Es un nuevo primer paso del stepper ("Tu Modalidad"):

1. **A la carta** — sin cupo, selección libre de módulos, precio = suma de precios individuales por plazo.
2. **Paquete "Arma tu Medida"** — cupo de 3 módulos, precio fijo de paquete.
3. **Paquete "Operación Total"** — todos los módulos incluidos automáticamente, precio fijo.
4. **Licencia de Desarrollo** — al seleccionar esta modalidad, se despliega un sub-selector con las 3 licencias (Ultra Low-Cost / Intermedio / Todo Incluido). Cada licencia define su propio cupo (1, 3, o todos) y precio fijo. Es la única modalidad que oculta la opción de plazo "Mensual".

Reglas de cupo comunes a los modos con cupo fijo (Arma tu Medida, Ultra Low-Cost, Intermedio):
- Un complemento y su módulo core requerido cuentan cada uno como 1 unidad de cupo (si el usuario quiere el complemento "Movimientos", debe tener 2 cupos consumidos: "Activos Fijos" + "Movimientos").
- Al llegar al tope de cupo se bloquea la selección de módulos nuevos (se puede deseleccionar cualquiera para liberar cupo).
- Al deseleccionar un módulo core que tenga su complemento activo, el complemento también se deselecciona y libera su cupo (mismo comportamiento que hoy en modo a la carta).

Para Operación Total y Todo Incluido no hay selección: todos los módulos (7 core + 2 complementos) se muestran pre-seleccionados en modo solo-lectura.

## Selector de plazo

- Control global (no es un paso del stepper): una barra horizontal ubicada entre el header de la página y el `StepIndicator`, visible sin importar en qué paso esté el usuario (no depende de scroll ni de la visibilidad del carrito).
- Opciones: Mensual, 3 meses, 6 meses, 12 meses.
- Cuando la modalidad activa es "Licencia de Desarrollo", la opción "Mensual" se deshabilita visualmente y, si estaba seleccionada al cambiar de modalidad, el plazo se ajusta automáticamente a 3 meses (mínimo piloto). Al salir de "Licencia de Desarrollo" hacia otra modalidad, el plazo elegido se conserva (no se fuerza de vuelta a mensual).
- Cambiar el plazo re-precia todos los ítems del carrito en vivo (módulos, paquetes, licencias, expansiones), sin perder la selección de módulos/cantidades.

## Stepper actualizado

Pasos, en orden:

0. **Tu Modalidad** — elegir plan base (a la carta / Arma tu Medida / Operación Total / Licencia de Desarrollo + sub-tier).
1. **Tu Infraestructura** — selección de módulos, adaptada según el cupo de la modalidad activa (ver arriba). Si la modalidad es Operación Total o Todo Incluido, este paso se muestra en modo solo-lectura (lista de módulos incluidos, sin interacción de selección).
2. **Tu Equipo** — sin cambios (usuarios individuales / paquete×5).
3. **Tu Organización** — sin cambios (compañías adicionales).

El componente `StepIndicator` se actualiza para 4 pasos en vez de 3.

## Carrito y modal de checkout

- El carrito (`CartSummary`) agrega una línea/etiqueta indicando la modalidad y el plazo activos (ej. "Paquete Arma tu Medida · Contrato 3 meses").
- Cuando la modalidad es de cupo fijo o paquete completo, el carrito muestra una única línea de precio para "módulos" (el precio fijo del paquete/licencia), no una línea por módulo — pero puede listar debajo, sin precio individual, qué módulos fueron elegidos (para que el usuario confirme su selección).
- Cuando la modalidad es "A la carta", el carrito sigue mostrando una línea por módulo/complemento como hoy.
- Las expansiones (usuarios, compañías) siempre se listan como líneas independientes, en cualquier modalidad.
- El total general y `AnimatedTotal` sin cambios de comportamiento, solo alimentados por el nuevo cálculo.
- `CheckoutModal` refleja el mismo desglose que el carrito (modalidad + plazo + líneas + total).
- La barra flotante móvil (visible cuando `cartItems.length > 0`) no cambia de comportamiento, solo refleja el total recalculado.

## Fuera de alcance

- No se modifica `/precios` (esa página usa un modelo de planes distinto y no fue mencionada por el usuario).
- No se agrega pago en línea ni integración de backend nueva; el flujo sigue terminando en `Link href="/contacto"`.
- No se persiste la selección en URL/localStorage (comportamiento actual no lo hace; no se pidió).

## Testing

No hay suite de tests configurada en el proyecto (confirmado en `CLAUDE.md`). Verificación manual vía `npm run dev` recorriendo cada modalidad, cada plazo, y casos límite de cupo (llenar/liberar cupo, deseleccionar core con complemento activo).
