-- Tabla para guardar las ideas/necesidades que las personas escriben en el
-- formulario "¿Tienes una idea...?" de la landing (src/views/app-view.js,
-- #user-need-input). Preparada para cuando se active el backend real;
-- todavía no está conectada desde el frontend.

create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    idea text not null constraint leads_idea_length_check
        check (char_length(btrim(idea)) between 1 and 2000),
    whatsapp_number text,
    source text not null default 'landing_need_finder' constraint leads_source_check
        check (source = 'landing_need_finder'),
    created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Permite que el propio sitio (rol "anon", con la clave pública anon key)
-- inserte nuevos leads, pero no lea ni modifique los existentes.
create policy "Cualquiera puede crear un lead"
    on public.leads
    for insert
    to anon
    with check (
        source = 'landing_need_finder'
        and char_length(btrim(idea)) between 1 and 2000
    );

-- La lectura queda reservada al panel de Supabase / service role key,
-- no se expone al público.
