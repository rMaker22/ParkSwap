import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión actual con manejo de errores
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        console.log('[AuthContext] Sesión inicial cargada:', session ? 'Sesión activa' : 'Sin sesión');
        setSession(session);
        setUser(session?.user ?? null);
      })
      .catch((error) => {
        console.error('[AuthContext] Error al cargar sesión inicial:', error);
        setSession(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

    // Escuchar cambios en la autenticación con eventos explícitos
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthContext] Auth state changed:', event, session ? 'Sesión activa' : 'Sin sesión');

      // Manejar diferentes eventos de autenticación
      switch (event) {
        case 'SIGNED_IN':
          console.log('[AuthContext] Usuario ha iniciado sesión');
          setSession(session);
          setUser(session?.user ?? null);
          break;

        case 'SIGNED_OUT':
          console.log('[AuthContext] Usuario ha cerrado sesión');
          // Limpieza explícita del estado local
          setSession(null);
          setUser(null);
          break;

        case 'TOKEN_REFRESHED':
          console.log('[AuthContext] Token actualizado');
          setSession(session);
          setUser(session?.user ?? null);
          break;

        case 'USER_UPDATED':
          console.log('[AuthContext] Datos de usuario actualizados');
          setSession(session);
          setUser(session?.user ?? null);
          break;

        default:
          // Para cualquier otro evento, actualizar el estado
          setSession(session);
          setUser(session?.user ?? null);
      }
    });

    return () => {
      console.log('[AuthContext] Limpiando suscripción de auth');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, userData = {}) => {
    try {
      console.log('[AuthContext] Iniciando registro de usuario...');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        console.error('[AuthContext] Error en registro:', error.message);
        throw error;
      }

      console.log('[AuthContext] Registro exitoso:', data.user?.email);
      return { data, error: null };

    } catch (error) {
      console.error('[AuthContext] Error crítico en signUp:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('[AuthContext] Iniciando inicio de sesión...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[AuthContext] Error en inicio de sesión:', error.message);
        throw error;
      }

      console.log('[AuthContext] Inicio de sesión exitoso:', data.user?.email);
      return { data, error: null };

    } catch (error) {
      console.error('[AuthContext] Error crítico en signIn:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('[AuthContext] Iniciando cierre de sesión...');

      // Paso 1: Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('[AuthContext] Error al cerrar sesión en Supabase:', error);
        throw error;
      }

      console.log('[AuthContext] Sesión cerrada en Supabase exitosamente');

      // Paso 2: Limpieza manual del estado local como fallback
      // Esto asegura que el estado se limpie incluso si onAuthStateChange no se dispara
      setSession(null);
      setUser(null);
      console.log('[AuthContext] Estado local limpiado manualmente');

      // Paso 3: Limpieza explícita de AsyncStorage
      // Limpiar todas las keys relacionadas con Supabase
      try {
        const keys = await AsyncStorage.getAllKeys();
        const supabaseKeys = keys.filter(key =>
          key.includes('supabase') ||
          key.includes('sb-') ||
          key.includes('auth-token')
        );

        if (supabaseKeys.length > 0) {
          await AsyncStorage.multiRemove(supabaseKeys);
          console.log('[AuthContext] AsyncStorage limpiado:', supabaseKeys.length, 'keys removidas');
        } else {
          console.log('[AuthContext] No hay keys de Supabase en AsyncStorage');
        }
      } catch (storageError) {
        console.error('[AuthContext] Error al limpiar AsyncStorage:', storageError);
        // No lanzar el error, ya que el logout principal fue exitoso
      }

      console.log('[AuthContext] Cierre de sesión completado exitosamente');
      return { error: null };

    } catch (error) {
      console.error('[AuthContext] Error crítico en signOut:', error);

      // Incluso si hay error, intentar limpiar el estado local
      setSession(null);
      setUser(null);

      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
