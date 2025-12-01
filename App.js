import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import ProfileScreen from './src/modules/profile/ProfileScreen';
import EditProfileScreen from './src/modules/profile/EditProfileScreen';
import VehiclesListScreen from './src/modules/vehicles/VehiclesListScreen';
import AddVehicleScreen from './src/modules/vehicles/AddVehicleScreen';
import { getUserVehicles } from './src/services/vehicleService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [primaryVehicle, setPrimaryVehicle] = useState(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);

  useEffect(() => {
    loadPrimaryVehicle();
  }, []);

  // Recargar vehículo cuando la pantalla recibe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPrimaryVehicle();
    });
    return unsubscribe;
  }, [navigation]);

  const loadPrimaryVehicle = async () => {
    try {
      const { data, error } = await getUserVehicles();
      if (!error && data) {
        const primary = data.find(v => v.is_primary);
        setPrimaryVehicle(primary || data[0] || null);
      }
    } catch (error) {
      console.error('Error al cargar vehículo:', error);
    } finally {
      setLoadingVehicle(false);
    }
  };

  const mainActions = [
    {
      title: 'Buscar Plaza',
      subtitle: 'Encuentra parking disponible',
      icon: 'search',
      color: '#2C5F8D',
      screen: 'Buscar'
    },
    {
      title: 'Ofrecer Plaza',
      subtitle: 'Publica tu espacio',
      icon: 'add-circle',
      color: '#4A90A4',
      action: () => alert('Próximamente: Ofrecer Plaza')
    },
    {
      title: 'Mis Reservas',
      subtitle: 'Ver reservas activas',
      icon: 'calendar',
      color: '#5B7C99',
      action: () => alert('Próximamente: Mis Reservas')
    },
    {
      title: 'Mi Wallet',
      subtitle: 'Gestionar pagos',
      icon: 'wallet',
      color: '#6B7C93',
      screen: 'Wallet'
    },
  ];

  const handleAction = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.logo}>🅿️arkSwap</Text>
        <Text style={styles.welcome}>Intercambia parking fácilmente</Text>
      </View>

      {/* Tarjeta del vehículo principal */}
      {!loadingVehicle && (
        <View style={styles.vehicleSection}>
          {primaryVehicle ? (
            <TouchableOpacity
              style={styles.vehicleCard}
              onPress={() => navigation.navigate('Perfil', { screen: 'VehiclesList' })}
              activeOpacity={0.8}
            >
              <View style={styles.vehicleCardHeader}>
                <View style={styles.vehicleIconLarge}>
                  <Ionicons name="car-sport" size={40} color="#1E3A5F" />
                </View>
                <View style={styles.vehicleCardInfo}>
                  <View style={styles.vehicleCardTitleRow}>
                    <Text style={styles.vehicleCardTitle}>
                      {primaryVehicle.brand} {primaryVehicle.model}
                    </Text>
                    {primaryVehicle.is_primary && (
                      <View style={styles.primaryBadgeHome}>
                        <Ionicons name="star" size={12} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.vehicleCardSubtitle}>Tu vehículo actual</Text>
                  {primaryVehicle.license_plate && (
                    <View style={styles.licensePlateContainer}>
                      <Text style={styles.licensePlate}>{primaryVehicle.license_plate}</Text>
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={24} color="#B0C4DE" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addVehicleCard}
              onPress={() => navigation.navigate('Perfil', { screen: 'AddVehicle' })}
              activeOpacity={0.8}
            >
              <Ionicons name="car-sport-outline" size={40} color="#4A90A4" />
              <Text style={styles.addVehicleTitle}>Añade tu vehículo</Text>
              <Text style={styles.addVehicleSubtitle}>Para empezar a usar ParkSwap</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.actionsContainer}>
        {mainActions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionCard, { borderLeftColor: item.color }]}
            onPress={() => handleAction(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={32} color="#fff" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>{item.title}</Text>
              <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Reservas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Plazas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>0€</Text>
          <Text style={styles.statLabel}>Ganado</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Plaza</Text>
    </View>
  );
}

function WalletScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Wallet</Text>
    </View>
  );
}

// Stack Navigator para Perfil
function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E3A5F',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Mi Perfil' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
      <Stack.Screen
        name="VehiclesList"
        component={VehiclesListScreen}
        options={{ title: 'Mis Vehículos' }}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{ title: 'Añadir Vehículo' }}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Buscar') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E3A5F',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#1E3A5F',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen
        name="Perfil"
        component={ProfileStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
    );
  }

  return user ? <MainTabNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#1E3A5F',
    padding: 30,
    paddingTop: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcome: {
    fontSize: 16,
    color: '#B0C4DE',
  },
  actionsContainer: {
    padding: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  // Estilos de la sección del vehículo
  vehicleSection: {
    marginHorizontal: 16,
    marginTop: -30,
    marginBottom: 16,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90A4',
  },
  vehicleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIconLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vehicleCardInfo: {
    flex: 1,
  },
  vehicleCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  vehicleCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginRight: 8,
  },
  primaryBadgeHome: {
    backgroundColor: '#FFB74D',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleCardSubtitle: {
    fontSize: 13,
    color: '#4A90A4',
    fontWeight: '500',
    marginBottom: 8,
  },
  licensePlateContainer: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#FFB74D',
  },
  licensePlate: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  addVehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4A90A4',
    borderStyle: 'dashed',
    minHeight: 140,
  },
  addVehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginTop: 12,
    marginBottom: 4,
  },
  addVehicleSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});