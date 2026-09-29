import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useCalculator from "../hooks/useCalculator";
import Banner from "./Banner";

const BUTTONS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

// Filas extra que aparecen solo en modo científico.
const SCIENTIFIC_BUTTONS = [
  ["sin", "cos", "tan", "xʸ"],
  ["log", "ln", "√", "x²"],
  ["1/x", "x!", "π", "e"],
];

// Imágenes de Chiikawa usadas como carita/decoración de los botones numéricos.
// Se van repitiendo (cíclicamente) en cada dígito para dar variedad kawaii.
const CHARACTER_FACES = [
  require("../assets/chiikawa/bunny-closeup.png"),
  require("../assets/chiikawa/group-pink.png"),
  require("../assets/chiikawa/poster.jpg"),
  require("../assets/chiikawa/group-trees.jpg"),
];

const DIGIT_ORDER = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function Calculator() {
  const {
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
  } = useCalculator();

  const { width, height } = useWindowDimensions();

  // Diseño responsivo: el tamaño de los botones se calcula a partir del
  // MENOR entre el ancho y el alto disponibles, así todo el layout
  // (banner + display + teclado) siempre cabe en la pantalla sin cortarse
  // ni requerir scroll, tanto en web como en móvil.
  const horizontalPadding = 14;
  const gap = 8;
  const columns = 4;
  const baseRows = BUTTONS.length;
  const sciRows = isScientific ? SCIENTIFIC_BUTTONS.length : 0;
  const rows = baseRows + sciRows;
  const maxContainerWidth = 420;

  const toggleBarHeight = 34;
  const angleToggleHeight = isScientific ? 30 : 0;
  const bannerHeight = Math.max(50, Math.min(isScientific ? 70 : 100, height * 0.1));
  const bannerTitleBlock = 22; // alto aprox. del título del banner
  const displayHeight = Math.max(56, Math.min(80, height * 0.1));
  const verticalSpacing = 8 + 10 + 10 + (isScientific ? 8 : 0); // márgenes entre bloques
  const sciRowsExtraGap = sciRows > 0 ? gap : 0; // separador entre científico y básico

  const availableWidth = Math.min(width, maxContainerWidth);
  const buttonSizeFromWidth =
    (availableWidth - horizontalPadding * 2 - gap * (columns - 1)) / columns;

  const fixedVerticalUsage =
    horizontalPadding * 2 +
    toggleBarHeight +
    angleToggleHeight +
    bannerHeight +
    bannerTitleBlock +
    displayHeight +
    verticalSpacing +
    sciRowsExtraGap;
  const remainingHeight = height * 0.97 - fixedVerticalUsage;
  const buttonSizeFromHeight = (remainingHeight - gap * (rows - 1)) / rows;

  const buttonSize = Math.max(
    30,
    Math.min(buttonSizeFromWidth, buttonSizeFromHeight, 78)
  );
  const containerWidth =
    buttonSize * columns + gap * (columns - 1) + horizontalPadding * 2;

  const fontScale = Math.max(0.55, Math.min(1, buttonSize / 78));

  const onPressButton = (label) => {
    if (!isNaN(Number(label))) {
      inputDigit(label);
      return;
    }
    switch (label) {
      case "C":
        clearAll();
        break;
      case "±":
        toggleSign();
        break;
      case "%":
        inputPercent();
        break;
      case ".":
        inputDot();
        break;
      case "=":
        handleEquals();
        break;
      case "+":
      case "-":
      case "×":
      case "÷":
      case "xʸ":
        handleOperator(label);
        break;
      case "sin":
      case "cos":
      case "tan":
      case "log":
      case "ln":
      case "√":
      case "x²":
      case "1/x":
      case "x!":
        applyUnary(label);
        break;
      case "π":
      case "e":
        insertConstant(label);
        break;
      default:
        break;
    }
  };

  const isOperator = (label) =>
    ["÷", "×", "-", "+", "xʸ"].includes(label);
  const isActiveOperator = (label) => operator === label;
  const isTopFunction = (label) => ["C", "±", "%"].includes(label);
  const isDigit = (label) => !isNaN(Number(label)) && label !== "";
  const isScientificButton = (label) =>
    ["sin", "cos", "tan", "log", "ln", "√", "x²", "1/x", "x!", "π", "e"].includes(
      label
    );

  const faceForDigit = (label) => {
    const index = DIGIT_ORDER.indexOf(label);
    if (index === -1) return null;
    return CHARACTER_FACES[index % CHARACTER_FACES.length];
  };

  return (
    <LinearGradient
      colors={["#ffe9f3", "#fff6e0", "#e8f7ee"]}
      style={styles.screen}
    >
      <View
        style={[
          styles.container,
          {
            width: containerWidth,
            padding: horizontalPadding,
          },
        ]}
      >
        <TouchableOpacity
          onPress={toggleScientific}
          activeOpacity={0.8}
          style={[styles.modeToggle, { height: toggleBarHeight }]}
        >
          <Text style={[styles.modeToggleText, { fontSize: 14 * fontScale }]}>
            {isScientific ? "🧮 Modo Básico" : "🔬 Modo Científico"}
          </Text>
        </TouchableOpacity>

        {isScientific && (
          <TouchableOpacity
            onPress={toggleAngleUnit}
            activeOpacity={0.8}
            style={[styles.angleToggle, { height: angleToggleHeight }]}
          >
            <Text
              style={[styles.angleToggleText, { fontSize: 12 * fontScale }]}
            >
              {isDegrees ? "📐 Grados (DEG)" : "📐 Radianes (RAD)"}
            </Text>
          </TouchableOpacity>
        )}

        <Banner width={containerWidth - horizontalPadding * 2} height={bannerHeight} />

        <View style={[styles.displayWrapper, { height: displayHeight }]}>
          <Text
            style={[styles.expressionText, { fontSize: 16 * fontScale }]}
            numberOfLines={1}
          >
            {expression || " "}
          </Text>
          <Text
            style={[styles.displayText, { fontSize: 38 * fontScale }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayValue}
          </Text>
        </View>

        {isScientific && (
          <View style={[styles.buttonsGrid, { marginBottom: gap }]}>
            {SCIENTIFIC_BUTTONS.map((row, rowIndex) => (
              <View
                key={`sci-${rowIndex}`}
                style={[styles.row, { marginBottom: gap }]}
              >
                {row.map((label) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() => onPressButton(label)}
                    activeOpacity={0.75}
                    style={[
                      styles.button,
                      styles.scientificButton,
                      {
                        width: buttonSize,
                        height: buttonSize,
                        borderRadius: buttonSize / 2,
                        marginRight: label === row[row.length - 1] ? 0 : gap,
                      },
                      isOperator(label) && styles.operatorButton,
                      isActiveOperator(label) && styles.operatorButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        styles.scientificButtonText,
                        { fontSize: 15 * fontScale },
                        isOperator(label) && styles.operatorButtonText,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonsGrid}>
          {BUTTONS.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={[
                styles.row,
                { marginBottom: rowIndex === BUTTONS.length - 1 ? 0 : gap },
              ]}
            >
              {row.map((label) => {
                const isZero = label === "0";
                const btnWidth = isZero ? buttonSize * 2 + gap : buttonSize;
                const face = isDigit(label) ? faceForDigit(label) : null;

                const ButtonContent = (
                  <>
                    {face && (
                      <Image
                        source={face}
                        style={styles.faceWatermark}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.faceOverlay} />
                    <Text
                      style={[
                        styles.buttonText,
                        { fontSize: 20 * fontScale },
                        isTopFunction(label) && styles.functionButtonText,
                        (isOperator(label) || label === "=") &&
                          styles.operatorButtonText,
                      ]}
                    >
                      {label}
                    </Text>
                  </>
                );

                return (
                  <TouchableOpacity
                    key={label}
                    onPress={() => onPressButton(label)}
                    activeOpacity={0.75}
                    style={[
                      styles.button,
                      {
                        width: btnWidth,
                        height: buttonSize,
                        borderRadius: buttonSize / 2,
                        marginRight: label === row[row.length - 1] ? 0 : gap,
                      },
                      isTopFunction(label) && styles.functionButton,
                      isOperator(label) && styles.operatorButton,
                      isActiveOperator(label) && styles.operatorButtonActive,
                      label === "=" && styles.equalsButton,
                    ]}
                  >
                    {ButtonContent}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#fffaf5",
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#ffd1e8",
    ...Platform.select({
      web: {
        boxShadow: "0px 10px 28px rgba(255, 173, 209, 0.45)",
      },
      default: {
        shadowColor: "#ff9fc7",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 8,
      },
    }),
  },
  modeToggle: {
    backgroundColor: "#e5d4ff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  modeToggleText: {
    color: "#6b4a9e",
    fontWeight: "700",
  },
  angleToggle: {
    backgroundColor: "#fff3c4",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#ffffff",
    alignSelf: "center",
    paddingHorizontal: 14,
  },
  angleToggleText: {
    color: "#8a6d1f",
    fontWeight: "700",
  },
  displayWrapper: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 14,
    backgroundColor: "#ffeef6",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#ffd1e8",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  expressionText: {
    color: "#c98aa8",
    fontWeight: "600",
    marginBottom: 2,
  },
  displayText: {
    color: "#b5507a",
    fontWeight: "700",
  },
  buttonsGrid: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#ffe0ef",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ffffff",
    ...Platform.select({
      web: {
        boxShadow: "0px 4px 10px rgba(255, 160, 200, 0.35)",
      },
      default: {
        shadowColor: "#ff9fc7",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
      },
    }),
  },
  faceWatermark: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.45,
  },
  faceOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  scientificButton: {
    backgroundColor: "#e5d4ff",
  },
  scientificButtonText: {
    color: "#6b4a9e",
  },
  buttonText: {
    color: "#7a4a63",
    fontWeight: "700",
  },
  functionButton: {
    backgroundColor: "#cdeee0",
  },
  functionButtonText: {
    color: "#2f6f57",
    fontWeight: "700",
  },
  operatorButton: {
    backgroundColor: "#ffc1d9",
  },
  operatorButtonActive: {
    backgroundColor: "#ff8fb3",
  },
  operatorButtonText: {
    color: "#7a1f45",
    fontWeight: "700",
  },
  equalsButton: {
    backgroundColor: "#ffb3cf",
  },
});
