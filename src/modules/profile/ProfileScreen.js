import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUserData, getUserStats } from '../../services/userService';
import { getUserVehicles } from '../../services/vehicleService';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ reservations: 0, parkingSpots: 0, earnings: 0 });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // Cargar datos del usuario
      const { data: userInfo } = await getCurrentUserData();
      if (userInfo) {
        setUserData(userInfo);
      }

      // Cargar estadísticas
      const { data: userStats } = await getUserStats();
      if (userStats) {
        setStats(userStats);
      }

      // Cargar vehículos
      const { data: userVehicles } = await getUserVehicles();
      if (userVehicles) {
        setVehicles(userVehicles);
      }
    } catch (error) {
      console.error('Error al cargar datos del perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Cerrando sesión...');
              const { error } = await signOut();

              if (error) {
                console.error('Error al cerrar sesión:', error);
                Alert.alert('Error', 'No se pudo cerrar sesión. Intenta de nuevo.');
              } else {
                console.log('Sesión cerrada exitosamente');
              }
            } catch (error) {
              console.error('Excepción al cerrar sesión:', error);
              Alert.alert('Error', 'Ocurrió un error inesperado al cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleManageVehicles = () => {
    navigation.navigate('VehiclesList');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header con foto de perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {userData?.photo_url ? (
            <Image
              source={{ uri: userData.photo_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={60} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.name}>{userData?.name || 'Usuario'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {userData?.phone && (
          <Text style={styles.phone}>{userData.phone}</Text>
        )}
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="calendar" size={24} color="#1E3A5F" />
          <Text style={styles.statNumber}>{stats.reservations}</Text>
          <Text style={styles.statLabel}>Reservas</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="car" size={24} color="#1E3A5F" />
          <Text style={styles.statNumber}>{stats.parkingSpots}</Text>
          <Text style={styles.statLabel}>Plazas</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="star" size={24} color="#1E3A5F" />
          <Text style={styles.statNumber}>
            {userData?.rating?.toFixed(1) || '0.0'}
          </Text>
          <Text style={styles.statLabel}>Valoración</Text>
        </View>
      </View>

      {/* Opciones del menú */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="create-outline" size={24} color="#1E3A5F" />
          </View>
          <Text style={styles.menuText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleManageVehicles}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="car-sport-outline" size={24} color="#1E3A5F" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuText}>Mis Vehículos</Text>
            <Text style={styles.menuSubtext}>
              {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''} registrado{vehicles.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="notifications-outline" size={24} color="#1E3A5F" />
          </View>
          <Text style={styles.menuText}>Notificaciones</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="settings-outline" size={24} color="#1E3A5F" />
          </View>
          <Text style={styles.menuText}>Configuración</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.signOutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1E3A5F',
    padding: 30,
    alignItems: 'center',
    paddingBottom: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90A4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#B0C4DE',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#B0C4DE',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: '#d32f2f',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
