import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createVehicle } from '../../services/vehicleService';

export default function AddVehicleScreen({ navigation }) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validaciones
    if (!brand.trim()) {
      Alert.alert('Error', 'Por favor ingresa la marca del vehículo');
      return;
    }

    if (!model.trim()) {
      Alert.alert('Error', 'Por favor ingresa el modelo del vehículo');
      return;
    }

    setLoading(true);

    try {
      const vehicleData = {
        brand: brand.trim(),
        model: model.trim(),
        color: color.trim() || null,
        license_plate: licensePlate.trim() || null,
        is_primary: isPrimary,
      };

      const { data, error } = await createVehicle(vehicleData);

      if (error) {
        Alert.alert('Error', 'No se pudo crear el vehículo');
        console.error('Error al crear vehículo:', error);
      } else {
        Alert.alert(
          'Éxito',
          'Vehículo añadido correctamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="car-sport" size={60} color="#1E3A5F" />
        <Text style={styles.title}>Añadir Vehículo</Text>
        <Text style={styles.subtitle}>
          Registra tu vehículo para usar ParkSwap
        </Text>
      </View>

      <View style={styles.form}>
        {/* Marca */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Marca <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ej: Toyota, Ford, Seat..."
              value={brand}
              onChangeText={setBrand}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Modelo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Modelo <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="car-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ej: Corolla, Focus, Ibiza..."
              value={model}
              onChangeText={setModel}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Color */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Color</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="color-palette-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ej: Blanco, Negro, Rojo..."
              value={color}
              onChangeText={setColor}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Matrícula */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Matrícula</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="document-text-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ej: 1234ABC"
              value={licensePlate}
              onChangeText={setLicensePlate}
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Vehículo principal */}
        <View style={styles.switchContainer}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchLabel}>Vehículo Principal</Text>
            <Text style={styles.switchDescription}>
              Usa este vehículo por defecto para tus reservas
            </Text>
          </View>
          <Switch
            value={isPrimary}
            onValueChange={setIsPrimary}
            trackColor={{ false: '#ccc', true: '#4A90A4' }}
            thumbColor={isPrimary ? '#1E3A5F' : '#f4f3f4'}
          />
        </View>

        {/* Botón de guardar */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.submitButtonText}>Añadir Vehículo</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#d32f2f',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: '#666',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#1E3A5F',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
