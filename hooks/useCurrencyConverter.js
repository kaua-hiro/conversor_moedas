import { useState } from 'react';
import { Keyboard, Alert } from 'react-native';

// Taxas e Bandeiras agora ficam isoladas aqui
const RATES = {
  USD: 1,
  BRL: 5.15,
  EUR: 0.92,
  GBP: 0.79
};

export const FLAGS = {
  BRL: 'https://flagcdn.com/w80/br.png',
  USD: 'https://flagcdn.com/w80/us.png',
  EUR: 'https://flagcdn.com/w80/eu.png',
  GBP: 'https://flagcdn.com/w80/gb.png'
};

// Nosso Hook Customizado (O "Cérebro" do App)
export function useCurrencyConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const handleConvert = () => {
    Keyboard.dismiss();
    
    if (!inputValue || isNaN(inputValue.replace(',', '.'))) {
      Alert.alert('Erro', 'Por favor, digite um valor numérico válido.');
      return;
    }

    if (fromCurrency === toCurrency) {
      Alert.alert('Aviso', 'Selecione moedas diferentes para converter.');
      return;
    }

    const amount = parseFloat(inputValue.replace(',', '.'));
    
    const amountInUSD = amount / RATES[fromCurrency];
    const finalAmount = amountInUSD * RATES[toCurrency];
    
    const formattedInput = formatCurrency(amount, fromCurrency);
    const formattedResult = formatCurrency(finalAmount, toCurrency);
    
    setResult(formattedResult);

    const newHistoryItem = {
      id: Math.random().toString(),
      text: `${formattedInput} ➔ ${formattedResult}`
    };
    setHistory(prev => [newHistoryItem, ...prev]);
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const handleReset = () => {
    setInputValue('');
    setResult(null);
    Keyboard.dismiss();
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Retornamos tudo que a interface vai precisar usar
  return {
    inputValue, setInputValue,
    fromCurrency, setFromCurrency,
    toCurrency, setToCurrency,
    result,
    history,
    handleConvert,
    handleSwap,
    handleReset,
    clearHistory
  };
}