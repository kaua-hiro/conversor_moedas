import React from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Image, FlatList, SafeAreaView, StatusBar 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Importando a Lógica (Back)
import { useCurrencyConverter, FLAGS } from '../../hooks/useCurrencyConverter';

export default function App() {
  const {
    inputValue, setInputValue,
    fromCurrency, setFromCurrency,
    toCurrency, setToCurrency,
    result,
    history,
    handleConvert,
    handleSwap,
    handleReset,
    clearHistory
  } = useCurrencyConverter();

  return (
    <LinearGradient colors={['#0B0F19', '#1A233A']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
        
        <View style={styles.header}>
          <Feather name="activity" size={28} color="#00E5FF" />
          <Text style={styles.headerTitle}>Nexus Converter</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Valor a converter</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#475569"
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
            />
          </View>

          <View style={styles.selectorsContainer}>
            {/* Origem com Picker Nativo Restabelecido */}
            <View style={styles.pickerWrapper}>
              <Image source={{ uri: FLAGS[fromCurrency as keyof typeof FLAGS] }} style={styles.flag} />
              <Picker
                selectedValue={fromCurrency}
                style={styles.picker}
                dropdownIconColor="#00E5FF"
                onValueChange={(itemValue) => setFromCurrency(itemValue)}
              >
                <Picker.Item label="BRL" value="BRL" color="#FFFFFF" />
                <Picker.Item label="USD" value="USD" color="#FFFFFF" />
                <Picker.Item label="EUR" value="EUR" color="#FFFFFF" />
                <Picker.Item label="GBP" value="GBP" color="#FFFFFF" />
              </Picker>
            </View>

            <TouchableOpacity onPress={handleSwap} style={styles.swapButton} activeOpacity={0.7}>
              <Feather name="refresh-cw" size={20} color="#00E5FF" />
            </TouchableOpacity>

            {/* Destino com Picker Nativo Restabelecido */}
            <View style={styles.pickerWrapper}>
              <Image source={{ uri: FLAGS[toCurrency as keyof typeof FLAGS] }} style={styles.flag} />
              <Picker
                selectedValue={toCurrency}
                style={styles.picker}
                dropdownIconColor="#00E5FF"
                onValueChange={(itemValue) => setToCurrency(itemValue)}
              >
                <Picker.Item label="BRL" value="BRL" color="#FFFFFF" />
                <Picker.Item label="USD" value="USD" color="#FFFFFF" />
                <Picker.Item label="EUR" value="EUR" color="#FFFFFF" />
                <Picker.Item label="GBP" value="GBP" color="#FFFFFF" />
              </Picker>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.button, styles.resetBtn]} onPress={handleReset} activeOpacity={0.7}>
              <Feather name="trash-2" size={20} color="#F87171" />
              <Text style={styles.resetBtnText}>Limpar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleConvert} activeOpacity={0.8} style={{ flex: 1, marginLeft: 10 }}>
              <LinearGradient colors={['#00E5FF', '#007AFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.convertBtnGradient}>
                <Feather name="zap" size={20} color="#FFFFFF" />
                <Text style={styles.convertBtnText}>Converter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Resultado Estimado</Text>
              <Text style={styles.resultValue}>{result}</Text>
            </View>
          )}
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="clock" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <Text style={styles.historyTitle}>Histórico</Text>
            </View>
            {history.length > 0 && (
              <TouchableOpacity onPress={clearHistory} style={styles.clearHistoryBtn}>
                <Text style={styles.clearText}>Limpar Tudo</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <FlatList
            data={history as any[]}
            keyExtractor={(item: any) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }: any) => (
              <View style={styles.historyItem}>
                <Feather name="check-circle" size={16} color="#00E5FF" style={{ marginRight: 10 }} />
                <Text style={styles.historyItemText}>{item.text}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="inbox" size={32} color="#334155" />
                <Text style={styles.emptyText}>Nenhuma transação registrada.</Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginLeft: 10, letterSpacing: 1 },
  card: { backgroundColor: 'rgba(21, 27, 43, 0.8)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(51, 65, 85, 0.5)', marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { color: '#94A3B8', fontSize: 14, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 16, padding: 18, fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', borderWidth: 1, borderColor: '#334155' },
  selectorsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
  
  pickerWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 16, paddingHorizontal: 10, borderWidth: 1, borderColor: '#334155', height: 55 },
  // O Picker com os atributos corretos para ficar escuro e sem bordas nativas
  picker: { flex: 1, color: '#FFFFFF', height: 55, backgroundColor: '#0F172A', borderWidth: 0, outlineStyle: 'none' as any },
  
  flag: { width: 28, height: 20, marginRight: 5, borderRadius: 4 },
  swapButton: { backgroundColor: 'rgba(30, 41, 59, 0.8)', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: '#00E5FF' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  button: { flex: 1, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  resetBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#475569', marginRight: 10 },
  convertBtnGradient: { padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  resetBtnText: { fontWeight: 'bold', fontSize: 16, color: '#F87171', marginLeft: 8 },
  convertBtnText: { fontWeight: '900', fontSize: 16, color: '#FFFFFF', marginLeft: 8, textTransform: 'uppercase', letterSpacing: 1 },
  resultContainer: { marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(51, 65, 85, 0.5)', alignItems: 'center' },
  resultLabel: { fontSize: 14, color: '#94A3B8', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 },
  resultValue: { fontSize: 36, fontWeight: '900', color: '#00E5FF', textShadowColor: 'rgba(0, 229, 255, 0.3)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  historyContainer: { flex: 1, backgroundColor: 'rgba(21, 27, 43, 0.8)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(51, 65, 85, 0.5)' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  clearHistoryBtn: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(30, 41, 59, 0.6)', borderRadius: 8, borderWidth: 1, borderColor: '#475569' },
  clearText: { color: '#F87171', fontWeight: '600', fontSize: 12 },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: 16, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(51, 65, 85, 0.5)' },
  historyItemText: { fontSize: 15, color: '#E2E8F0', fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 40 },
  emptyText: { textAlign: 'center', color: '#475569', marginTop: 10, fontSize: 14 }
});