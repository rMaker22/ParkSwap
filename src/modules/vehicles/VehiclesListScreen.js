import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserVehicles, deleteVehicle, setPrimaryVehicle } from '../../services/vehicleService';

export default function VehiclesListScreen({ navigation }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  // Recargar vehículos cuando la pantalla recibe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadVehicles();
    });

    return unsubscribe;
  }, [navigation]);

  const loadVehicles = async () => {
    try {
      const { data, error } = await getUserVehicles();
      if (error) {
        console.error('Error al cargar vehículos:', error);
        Alert.alert('Error', 'No se pudieron cargar los vehículos');
      } else {
        setVehicles(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadVehicles();
  };

  const handleAddVehicle = () => {
    navigation.navigate('AddVehicle');
  };

  const handleSetPrimary = async (vehicleId) => {
    try {
      const { error } = await setPrimaryVehicle(vehicleId);
      if (error) {
        Alert.alert('Error', 'No se pudo marcar el vehículo como principal');
      } else {
        loadVehicles();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteVehicle = async (vehicleId, vehicleName) => {
    console.log('🔴 [VehiclesListScreen] handleDeleteVehicle ejecutado:', vehicleId);

    // Detectar si estamos en web o móvil
    const isWeb = typeof window !== 'undefined' && window.confirm;

    let confirmed = false;

    if (isWeb) {
      console.log('🔴 [VehiclesListScreen] Ejecutando en Web - usando window.confirm');
      confirmed = window.confirm(`¿Estás seguro de que quieres eliminar ${vehicleName}?`);
    } else {
      console.log('🔴 [VehiclesListScreen] Ejecutando en Móvil - usando Alert.alert');
      // En móvil, mostrar Alert nativo
      Alert.alert(
        'Eliminar Vehículo',
        `¿Estás seguro de que quieres eliminar ${vehicleName}?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => console.log('🔴 [VehiclesListScreen] Usuario canceló la eliminación')
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              await executeDeleteVehicle(vehicleId);
            },
          },
        ]
      );
      return; // Salir aquí para móvil, ya que el Alert maneja el flujo
    }

    // Para web, continuar con el flujo si confirmó
    if (confirmed) {
      console.log('🔴 [VehiclesListScreen] Usuario confirmó en Web');
      await executeDeleteVehicle(vehicleId);
    } else {
      console.log('🔴 [VehiclesListScreen] Usuario canceló en Web');
    }
  };

  const executeDeleteVehicle = async (vehicleId) => {
    try {
      console.log('🔴 [VehiclesListScreen] Intentando eliminar vehículo:', vehicleId);
      const { error } = await deleteVehicle(vehicleId);

      if (error) {
        console.error('🔴 [VehiclesListScreen] Error al eliminar:', error);
        const errorMsg = `No se pudo eliminar el vehículo: ${error.message || 'Error desconocido'}`;

        if (typeof window !== 'undefined' && window.alert) {
          window.alert(errorMsg);
        } else {
          Alert.alert('Error', errorMsg);
        }
      } else {
        console.log('🔴 [VehiclesListScreen] Vehículo eliminado exitosamente');

        if (typeof window !== 'undefined' && window.alert) {
          window.alert('Vehículo eliminado correctamente');
        } else {
          Alert.alert('Éxito', 'Vehículo eliminado correctamente');
        }

        await loadVehicles();
      }
    } catch (error) {
      console.error('🔴 [VehiclesListScreen] Excepción al eliminar:', error);

      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Error: Ocurrió un error inesperado al eliminar el vehículo');
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado al eliminar el vehículo');
      }
    }
  };

  const renderVehicleItem = ({ item }) => {
    const vehicleName = `${item.brand} ${item.model}`;

    return (
      <View style={styles.vehicleCard}>
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleIcon}>
            <Ionicons name="car-sport" size={32} color="#1E3A5F" />
          </View>
          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleTitleRow}>
              <Text style={styles.vehicleName}>{vehicleName}</Text>
              {item.is_primary && (
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryText}>Principal</Text>
                </View>
              )}
            </View>
            {item.color && (
              <Text style={styles.vehicleDetail}>Color: {item.color}</Text>
            )}
            {item.license_plate && (
              <Text style={styles.vehicleDetail}>
                Matrícula: {item.license_plate}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.vehicleActions}>
          {!item.is_primary && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSetPrimary(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="star-outline" size={20} color="#4A90A4" />
              <Text style={styles.actionButtonText}>Marcar Principal</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteVehicle(item.id, vehicleName)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color="#d32f2f" />
            <Text style={[styles.actionButtonText, styles.deleteText]}>
              Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {vehicles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-sport-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No tienes vehículos</Text>
          <Text style={styles.emptyText}>
            Añade tu primer vehículo para poder usar ParkSwap
          </Text>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          renderItem={renderVehicleItem}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddVehicle}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  vehicleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  vehicleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginRight: 8,
  },
  primaryBadge: {
    backgroundColor: '#4A90A4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  primaryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  vehicleDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  vehicleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#fff',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#4A90A4',
    marginLeft: 4,
    fontWeight: '500',
  },
  deleteText: {
    color: '#d32f2f',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
