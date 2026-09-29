# Calculadora (Expo + React Native)

Calculadora simple compatible con **web, iOS y Android** usando Expo.

## Estructura

```
calculadora-expo/
├── App.js                     # Punto de entrada, monta <Calculator />
├── components/
│   └── Calculator.js          # UI + estilos responsivos
├── hooks/
│   └── useCalculator.js       # Toda la lógica de la calculadora
├── app.json
├── babel.config.js
└── package.json
```

## Lógica (`useCalculator`)

El hook expone:

- `displayValue`: valor actual mostrado en pantalla.
- `operator`: operador activo (`+`, `-`, `×`, `÷`) o `null`.
- `inputDigit(digit)`: agrega un dígito.
- `inputDot()`: agrega punto decimal.
- `toggleSign()`: cambia el signo del valor actual.
- `inputPercent()`: convierte el valor actual a porcentaje.
- `handleOperator(op)`: selecciona operación pendiente.
- `handleEquals()`: ejecuta el cálculo.
- `clearAll()`: reinicia la calculadora.

## Diseño responsivo

`components/Calculator.js` usa `useWindowDimensions` para:

- Limitar el ancho máximo del "card" de la calculadora (ideal en web/tablet).
- Recalcular el tamaño de los botones según el ancho disponible.
- Escalar la tipografía (`fontScale`) para pantallas pequeñas o grandes.
- Aplicar sombra nativa (`shadowColor`, etc.) en iOS/Android y `boxShadow` en web mediante `Platform.select`.

## Cómo correr el proyecto

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Ejecuta en modo desarrollo:

   ```bash
   npm run start      # abre el menú de Expo (QR para Expo Go)
   npm run web        # abre en el navegador
   npm run android    # abre en emulador/dispositivo Android
   npm run ios        # abre en simulador iOS (solo macOS)
   ```

> Necesitas tener instalado [Expo CLI](https://docs.expo.dev/get-started/installation/) (se instala automáticamente vía `npx expo`) y, para probar en el móvil físico, la app **Expo Go**.
