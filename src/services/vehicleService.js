import { supabase } from './supabase';

/**
 * Servicio para gestionar vehículos del usuario
 */

// Obtener todos los vehículos del usuario actual
export const getUserVehicles = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    return { data: null, error };
  }
};

// Crear un nuevo vehículo
export const createVehicle = async (vehicleData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert([
        {
          user_id: user.id,
          brand: vehicleData.brand,
          model: vehicleData.model,
          color: vehicleData.color || null,
          license_plate: vehicleData.license_plate || null,
          is_primary: vehicleData.is_primary || false,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    return { data: null, error };
  }
};

// Actualizar un vehículo existente
export const updateVehicle = async (vehicleId, updates) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', vehicleId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    return { data: null, error };
  }
};

// Marcar un vehículo como principal (y desmarcar los demás)
export const setPrimaryVehicle = async (vehicleId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Primero, desmarcar todos los vehículos del usuario como primarios
    await supabase
      .from('vehicles')
      .update({ is_primary: false })
      .eq('user_id', user.id);

    // Luego, marcar el vehículo seleccionado como primario
    const { data, error } = await supabase
      .from('vehicles')
      .update({ is_primary: true })
      .eq('id', vehicleId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error al establecer vehículo principal:', error);
    return { data: null, error };
  }
};

// Eliminar un vehículo
export const deleteVehicle = async (vehicleId) => {
  try {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    return { error };
  }
};
