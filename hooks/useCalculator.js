import { useState, useCallback } from "react";

/**
 * Hook que encapsula toda la lógica de la calculadora.
 * Maneja el estado del display, el operando pendiente,
 * el operador seleccionado y las operaciones aritméticas.
 */
export default function useCalculator() {
  const [displayValue, setDisplayValue] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  // Guarda la última operación completa (ej. "6 - 9 =") para seguir
  // mostrándola en la línea pequeña justo después de presionar "=".
  const [lastExpression, setLastExpression] = useState("");
  // Modo científico: habilita funciones trigonométricas, logaritmos, etc.
  const [isScientific, setIsScientific] = useState(false);
  // true = grados, false = radianes (para sin/cos/tan)
  const [isDegrees, setIsDegrees] = useState(true);

  const toggleScientific = useCallback(() => {
    setIsScientific((prev) => !prev);
  }, []);

  const toggleAngleUnit = useCallback(() => {
    setIsDegrees((prev) => !prev);
  }, []);

  const clearAll = useCallback(() => {
    setDisplayValue("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setLastExpression("");
  }, []);

  const toggleSign = useCallback(() => {
    setDisplayValue((prev) =>
      prev.charAt(0) === "-" ? prev.slice(1) : prev === "0" ? prev : `-${prev}`
    );
  }, []);

  const inputPercent = useCallback(() => {
    setDisplayValue((prev) => {
      const value = parseFloat(prev);
      if (isNaN(value)) return prev;
      return String(value / 100);
    });
  }, []);

  const inputDot = useCallback(() => {
    setDisplayValue((prev) => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return "0.";
      }
      if (prev.includes(".")) return prev;
      return `${prev}.`;
    });
  }, [waitingForOperand]);

  const inputDigit = useCallback(
    (digit) => {
      // Si se está iniciando un número nuevo justo después de un "=",
      // limpiamos la expresión anterior para que no quede "pegada".
      if (waitingForOperand && operator === null && previousValue === null) {
        setLastExpression("");
      }
      setDisplayValue((prev) => {
        if (waitingForOperand) {
          setWaitingForOperand(false);
          return String(digit);
        }
        if (prev === "0") return String(digit);
        // Limita la longitud para que no desborde el display
        if (prev.replace("-", "").replace(".", "").length >= 12) return prev;
        return prev + digit;
      });
    },
    [waitingForOperand, operator, previousValue]
  );

  const performCalculation = (a, b, op) => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? NaN : a / b;
      case "xʸ":
        return Math.pow(a, b);
      default:
        return b;
    }
  };

  const handleOperator = useCallback(
    (nextOperator) => {
      const inputValue = parseFloat(displayValue);

      if (previousValue === null) {
        setPreviousValue(inputValue);
      } else if (operator && !waitingForOperand) {
        const result = performCalculation(previousValue, inputValue, operator);
        setPreviousValue(result);
        setDisplayValue(
          isNaN(result) ? "Error" : String(parseFloat(result.toFixed(10)))
        );
      }

      setWaitingForOperand(true);
      setOperator(nextOperator);
    },
    [displayValue, previousValue, operator, waitingForOperand]
  );

  const handleEquals = useCallback(() => {
    const inputValue = parseFloat(displayValue);

    if (operator === null || previousValue === null) return;

    const result = performCalculation(previousValue, inputValue, operator);

    setLastExpression(`${formatOperand(previousValue)} ${operator} ${formatOperand(inputValue)} =`);
    setDisplayValue(isNaN(result) ? "Error" : String(parseFloat(result.toFixed(10))));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [displayValue, previousValue, operator]);

  // --- Funciones científicas (operan directamente sobre el valor actual) ---

  const toRadians = (deg) => (deg * Math.PI) / 180;

  const factorial = (n) => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n > 170) return Infinity; // evita overflow
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const applyUnary = useCallback(
    (type) => {
      const value = parseFloat(displayValue);
      let result;
      let label = type;

      switch (type) {
        case "sin":
          result = Math.sin(isDegrees ? toRadians(value) : value);
          break;
        case "cos":
          result = Math.cos(isDegrees ? toRadians(value) : value);
          break;
        case "tan":
          result = Math.tan(isDegrees ? toRadians(value) : value);
          break;
        case "log":
          result = Math.log10(value);
          break;
        case "ln":
          result = Math.log(value);
          break;
        case "√":
          result = Math.sqrt(value);
          break;
        case "x²":
          result = value * value;
          break;
        case "1/x":
          result = 1 / value;
          break;
        case "x!":
          result = factorial(value);
          break;
        default:
          result = value;
      }

      setLastExpression(`${label}(${formatOperand(value)}) =`);
      setDisplayValue(
        isNaN(result) || result === Infinity
          ? "Error"
          : String(parseFloat(result.toFixed(10)))
      );
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    },
    [displayValue, isDegrees]
  );

  const insertConstant = useCallback((type) => {
    const value = type === "π" ? Math.PI : Math.E;
    setDisplayValue(String(value));
    setWaitingForOperand(false);
    setLastExpression("");
  }, []);

  // Línea pequeña que muestra la operación en curso, ej. "6 - 9",
  // o la última operación completa, ej. "6 - 9 =", después de calcular.
  const expression =
    operator !== null
      ? waitingForOperand
        ? `${formatOperand(previousValue)} ${operator}`
        : `${formatOperand(previousValue)} ${operator} ${displayValue}`
      : lastExpression;

  return {
    displayValue,
    operator,
    expression,
    isScientific,
    isDegrees,
    toggleScientific,
    toggleAngleUnit,
    inputDigit,
    inputDot,
    toggleSign,
    inputPercent,
    handleOperator,
    handleEquals,
    applyUnary,
    insertConstant,
    clearAll,
  };
}

function formatOperand(value) {
  if (value === null || value === undefined || isNaN(value)) return "";
  return String(value);
}
