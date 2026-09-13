-- Tabla para guardar las ideas/necesidades que las personas escriben en el
-- formulario "¿Tienes una idea...?" de la landing (src/views/app-view.js,
-- #user-need-input). Preparada para cuando se active el backend real;
-- todavía no está conectada desde el frontend.

create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    idea text not null,
    whatsapp_number text,
    source text default 'landing_need_finder',
    created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Permite que el propio sitio (rol "anon", con la clave pública anon key)
-- inserte nuevos leads, pero no lea ni modifique los existentes.
create policy "Cualquiera puede crear un lead"
    on public.leads
    for insert
    to anon
    with check (true);

-- La lectura queda reservada al panel de Supabase / service role key,
-- no se expone al público.
