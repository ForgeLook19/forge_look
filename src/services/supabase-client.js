/**
 * SERVICIO (futuro): cliente de Supabase para el navegador.
 *
 * Todavía NO se usa desde el controlador ni la vista — es la base para cuando
 * se active el backend real (guardar los leads del formulario en la tabla
 * "leads", ver supabase/migrations/0001_create_leads_table.sql).
 *
 * Requiere:
 *   1. Copiar src/config/supabase-config.example.js -> src/config/supabase-config.js
 *      y completar url/anonKey (ese archivo está en .gitignore).
 *   2. Cargar el SDK de Supabase en el HTML antes de este módulo, por ejemplo:
 *      <script type="module">
 *        import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
 *        window.__supabaseCreateClient = createClient;
 *      </script>
 *      (o instalarlo como dependencia si se agrega un bundler más adelante).
 */
import { SUPABASE_CONFIG } from '../config/supabase-config.js';

let client = null;

/** Devuelve un cliente Supabase único (lazy singleton). */
export function getSupabaseClient() {
    if (!client) {
        if (typeof window.__supabaseCreateClient !== 'function') {
            throw new Error(
                'El SDK de Supabase no está cargado. Revisa las instrucciones en este archivo.'
            );
        }
        client = window.__supabaseCreateClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    }
    return client;
}

/** Guarda una idea del formulario "¿Tienes una idea...?" en la tabla "leads". */
export async function saveLead({ idea, whatsappNumber }) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('leads').insert({
        idea,
        whatsapp_number: whatsappNumber,
        source: 'landing_need_finder'
    });
    if (error) throw error;
}
