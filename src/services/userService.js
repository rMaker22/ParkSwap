import { supabase } from './supabase';

/**
 * Servicio para gestionar datos del usuario
 */

// Obtener datos del usuario actual desde la tabla users
export const getCurrentUserData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return { data: null, error };
  }
};

// Actualizar datos del perfil del usuario
export const updateUserProfile = async (updates) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        phone: updates.phone,
        photo_url: updates.photo_url,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return { data: null, error };
  }
};

// Subir foto de perfil a Supabase Storage
export const uploadProfilePhoto = async (uri) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Obtener la extensión del archivo
    const ext = uri.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${ext}`;
    const filePath = `avatars/${fileName}`;

    // Convertir la URI en un blob para subir
    const response = await fetch(uri);
    const blob = await response.blob();

    // Subir el archivo
    const { data, error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, blob, {
        contentType: `image/${ext}`,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Obtener la URL pública del archivo
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return { data: publicUrl, error: null };
  } catch (error) {
    console.error('Error al subir foto de perfil:', error);
    return { data: null, error };
  }
};

// Obtener estadísticas del usuario
export const getUserStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Por ahora retornamos estadísticas vacías
    // Estas se implementarán en sesiones futuras con las tablas de reservas y plazas
    return {
      data: {
        reservations: 0,
        parkingSpots: 0,
        earnings: 0,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return { data: null, error };
  }
};
