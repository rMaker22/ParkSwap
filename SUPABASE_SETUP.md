# Configuración de Supabase para ParkSwap

Este documento contiene las instrucciones paso a paso para configurar Supabase en el proyecto ParkSwap.

## 1. Crear cuenta y proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Configura el proyecto:
   - **Name**: parkswap
   - **Database Password**: Guarda esta contraseña de forma segura
   - **Region**: Selecciona la región más cercana (por ejemplo, Europe West)
   - **Pricing Plan**: Free tier es suficiente para desarrollo
5. Haz clic en "Create new project" y espera unos minutos mientras se aprovisiona

## 2. Crear las tablas en la base de datos

### Tabla `users`

```sql
-- Crear tabla users
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT auth.uid(),
  email text NOT NULL,
  phone text,
  name text,
  photo_url text,
  rating numeric DEFAULT 0,
  token_balance numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propia información
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propia información
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Política: Insertar automáticamente al registrarse
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Tabla `vehicles`

```sql
-- Crear tabla vehicles
CREATE TABLE public.vehicles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  color text,
  license_plate text,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT vehicles_pkey PRIMARY KEY (id),
  CONSTRAINT vehicles_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users(id) ON DELETE CASCADE
);

-- Habilitar RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propios vehículos
CREATE POLICY "Users can view own vehicles" ON public.vehicles
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar sus propios vehículos
CREATE POLICY "Users can insert own vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus propios vehículos
CREATE POLICY "Users can update own vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = user_id);

-- Política: Los usuarios pueden eliminar sus propios vehículos
CREATE POLICY "Users can delete own vehicles" ON public.vehicles
  FOR DELETE USING (auth.uid() = user_id);
```

## 3. Configurar Authentication

1. En el panel de Supabase, ve a **Authentication** > **Providers**
2. Asegúrate de que "Email" esté habilitado
3. Configura las opciones:
   - **Enable Email Confirmations**: Opcional (desactívalo para desarrollo)
   - **Enable Phone Confirmations**: Desactivado por ahora

## 4. Obtener las credenciales

1. Ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL**: Tu `SUPABASE_URL`
   - **anon public**: Tu `SUPABASE_ANON_KEY`

## 5. Configurar las credenciales en la app

Abre el archivo `src/services/supabase.js` y reemplaza los placeholders:

```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-clave-anon-publica-aqui';
```

## 6. Trigger para crear usuario automáticamente

Para crear automáticamente un registro en `users` cuando un usuario se registra:

```sql
-- Función para crear usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 7. Probar la configuración

1. Ejecuta la app: `npm start`
2. Prueba el registro de un nuevo usuario
3. Verifica en el panel de Supabase:
   - **Authentication** > **Users**: Debería aparecer el nuevo usuario
   - **Table Editor** > **users**: Debería aparecer el registro del usuario

## 8. Solución de problemas comunes

### Error: "Invalid API key"
- Verifica que copiaste correctamente la `SUPABASE_ANON_KEY`
- Asegúrate de que no hay espacios extra

### Error: "Failed to fetch"
- Verifica que la `SUPABASE_URL` sea correcta
- Comprueba tu conexión a internet

### Usuario no aparece en tabla users
- Verifica que el trigger `on_auth_user_created` esté creado
- Revisa los logs en **Database** > **Functions** en el panel de Supabase

### RLS errors
- Asegúrate de que las políticas de RLS estén creadas correctamente
- Verifica que RLS esté habilitado en ambas tablas

## Próximos pasos

Una vez configurado Supabase:
- [ ] Probar registro de usuario
- [ ] Probar inicio de sesión
- [ ] Verificar persistencia de sesión
- [ ] Continuar con Sesión 4: Módulo de Perfil
