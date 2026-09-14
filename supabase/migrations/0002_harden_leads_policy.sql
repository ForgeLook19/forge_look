-- Aplica las mismas restricciones de 0001 a proyectos donde la primera
-- migración ya se hubiera ejecutado antes de este endurecimiento.

alter table public.leads
    alter column source set not null;

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conrelid = 'public.leads'::regclass
          and conname = 'leads_idea_length_check'
    ) then
        alter table public.leads add constraint leads_idea_length_check
            check (char_length(btrim(idea)) between 1 and 2000);
    end if;

    if not exists (
        select 1 from pg_constraint
        where conrelid = 'public.leads'::regclass
          and conname = 'leads_source_check'
    ) then
        alter table public.leads add constraint leads_source_check
            check (source = 'landing_need_finder');
    end if;
end $$;

drop policy if exists "Cualquiera puede crear un lead" on public.leads;

create policy "Cualquiera puede crear un lead"
    on public.leads
    for insert
    to anon
    with check (
        source = 'landing_need_finder'
        and char_length(btrim(idea)) between 1 and 2000
    );
