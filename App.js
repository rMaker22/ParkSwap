import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
  const mainActions = [
    {
      title: 'Buscar Plaza',
      subtitle: 'Encuentra parking disponible',
      icon: 'search',
      color: '#4CAF50',
      screen: 'Buscar'
    },
    {
      title: 'Ofrecer Plaza',
      subtitle: 'Publica tu espacio',
      icon: 'add-circle',
      color: '#2196F3',
      action: () => alert('Próximamente: Ofrecer Plaza')
    },
    {
      title: 'Mis Reservas',
      subtitle: 'Ver reservas activas',
      icon: 'calendar',
      color: '#FF9800',
      action: () => alert('Próximamente: Mis Reservas')
    },
    {
      title: 'Mi Wallet',
      subtitle: 'Gestionar pagos',
      icon: 'wallet',
      color: '#9C27B0',
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
        <Text style={styles.logo}>🅿️ ParkSwap</Text>
        <Text style={styles.welcome}>Intercambia parking fácilmente</Text>
      </View>

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

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
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
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
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
});