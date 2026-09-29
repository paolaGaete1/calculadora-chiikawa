import React from "react";
import { View, Image, ScrollView, Text, StyleSheet } from "react-native";

const IMAGES = [
  require("../assets/chiikawa/group-pink.png"),
  require("../assets/chiikawa/poster.jpg"),
  require("../assets/chiikawa/bunny-closeup.png"),
  require("../assets/chiikawa/group-trees.jpg"),
];

/**
 * Banner decorativo con imágenes de Chiikawa.
 * Se muestra arriba de la calculadora y se adapta al ancho
 * disponible (scroll horizontal en pantallas pequeñas).
 */
export default function Banner({ width, height }) {
  return (
    <View style={[styles.wrapper, { width }]}>
      <Text style={styles.title}>🌸 Chiikawa Calculator 🌸</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {IMAGES.map((source, index) => (
          <View key={index} style={[styles.imageCard, { height }]}>
            <Image
              source={source}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#7a4a63",
    marginBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 8,
    gap: 10,
  },
  imageCard: {
    aspectRatio: 1.4,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#ffffff",
    marginRight: 10,
    backgroundColor: "#ffe3ef",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
