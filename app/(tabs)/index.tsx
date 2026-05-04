import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Taxas fixas baseadas no Dólar (USD) para facilitar a matemática cruzada
const RATES = {
  USD: 1,
  BRL: 5.15,
  EUR: 0.92,
  GBP: 0.79,
};

// Imagens das bandeiras (mock via URL para facilitar)
const FLAGS = {
  BRL: "https://flagcdn.com/w80/br.png",
  USD: "https://flagcdn.com/w80/us.png",
  EUR: "https://flagcdn.com/w80/eu.png",
  GBP: "https://flagcdn.com/w80/gb.png",
};

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [fromCurrency, setFromCurrency] = useState("BRL");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Função para formatar a moeda
  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  // Lógica principal de conversão e formatação matemática
  const handleConvert = () => {
    Keyboard.dismiss();

    if (!inputValue || isNaN(inputValue)) {
      Alert.alert("Erro", "Por favor, digite um valor numérico válido.");
      return;
    }

    if (fromCurrency === toCurrency) {
      Alert.alert("Aviso", "Selecione moedas diferentes para converter.");
      return;
    }

    const amount = parseFloat(inputValue.replace(",", "."));

    // Matemática: Converte o valor de origem para USD, e depois de USD para o destino
    const amountInUSD = amount / RATES[fromCurrency];
    const finalAmount = amountInUSD * RATES[toCurrency];

    const formattedInput = formatCurrency(amount, fromCurrency);
    const formattedResult = formatCurrency(finalAmount, toCurrency);

    setResult(formattedResult);

    // Salva no histórico (adicionando no topo da lista)
    const newHistoryItem = {
      id: Math.random().toString(),
      text: `${formattedInput} ➔ ${formattedResult}`,
    };
    setHistory((prev) => [newHistoryItem, ...prev]);
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const handleReset = () => {
    setInputValue("");
    setResult(null);
    Keyboard.dismiss();
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Conversor de Moedas</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Digite o valor..."
          keyboardType="numeric"
          value={inputValue}
          onChangeText={setInputValue}
        />

        <View style={styles.selectorsContainer}>
          {/* Origem */}
          <View style={styles.pickerWrapper}>
            <Image source={{ uri: FLAGS[fromCurrency] }} style={styles.flag} />
            <Picker
              selectedValue={fromCurrency}
              style={styles.picker}
              onValueChange={(itemValue) => setFromCurrency(itemValue)}
            >
              <Picker.Item label="BRL" value="BRL" />
              <Picker.Item label="USD" value="USD" />
              <Picker.Item label="EUR" value="EUR" />
              <Picker.Item label="GBP" value="GBP" />
            </Picker>
          </View>

          {/* Botão de Swap */}
          <TouchableOpacity onPress={handleSwap} style={styles.swapButton}>
            <Text style={styles.swapButtonText}>⇄</Text>
          </TouchableOpacity>

          {/* Destino */}
          <View style={styles.pickerWrapper}>
            <Image source={{ uri: FLAGS[toCurrency] }} style={styles.flag} />
            <Picker
              selectedValue={toCurrency}
              style={styles.picker}
              onValueChange={(itemValue) => setToCurrency(itemValue)}
            >
              <Picker.Item label="BRL" value="BRL" />
              <Picker.Item label="USD" value="USD" />
              <Picker.Item label="EUR" value="EUR" />
              <Picker.Item label="GBP" value="GBP" />
            </Picker>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.resetBtn]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.convertBtn]}
            onPress={handleConvert}
          >
            <Text style={styles.buttonText}>Converter</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Valor Convertido:</Text>
            <Text style={styles.resultValue}>{result}</Text>
          </View>
        )}
      </View>

      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Últimas Conversões</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearText}>Apagar</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyItemText}>{item.text}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma conversão recente.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#EDF2F7",
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    color: "#2D3748",
    marginBottom: 20,
    textAlign: "center",
  },
  selectorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF2F7",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 5,
    borderRadius: 2,
  },
  swapButton: {
    backgroundColor: "#4A5568",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  swapButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  resetBtn: {
    backgroundColor: "#E2E8F0",
    marginRight: 10,
  },
  convertBtn: {
    backgroundColor: "#3182CE",
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2D3748",
  },
  resultContainer: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#38A169",
  },
  historyContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
  },
  clearText: {
    color: "#E53E3E",
    fontWeight: "bold",
  },
  historyItem: {
    backgroundColor: "#EDF2F7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyItemText: {
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#A0AEC0",
    marginTop: 20,
  },
});
