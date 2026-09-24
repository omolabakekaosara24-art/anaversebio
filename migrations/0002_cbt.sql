-- ANAVERSE CBT — candidate profiles, papers, and one-shot attempts.

create table if not exists profiles (
  user_id    text primary key,
  full_name  text not null,
  email      text not null,
  role       text not null default 'student',
  created_at timestamptz not null default now()
);

create table if not exists papers (
  id                serial primary key,
  slug              text not null unique,
  title             text not null,
  subject           text not null,
  topic             text not null,
  duration_seconds  integer not null,
  created_at        timestamptz not null default now()
);

insert into papers (slug, title, subject, topic, duration_seconds)
values (
  'biology-living-organisms',
  'Characteristics of Living Organisms',
  'Biology',
  'Characteristics of Living Organisms',
  900
)
on conflict (slug) do update
  set duration_seconds = excluded.duration_seconds,
      title = excluded.title,
      subject = excluded.subject,
      topic = excluded.topic;

create table if not exists attempts (
  id             serial primary key,
  user_id        text not null,
  paper_id       integer not null references papers(id),
  device_id      text not null,
  status         text not null default 'in_progress',
  answers        jsonb not null default '{}'::jsonb,
  flagged        jsonb not null default '[]'::jsonb,
  current_index  integer not null default 0,
  started_at     timestamptz not null default now(),
  deadline_at    timestamptz not null,
  submitted_at   timestamptz,
  score          integer,
  correct_count  integer,
  unique (user_id, paper_id)
);

create index if not exists attempts_user_id_idx on attempts (user_id);
create index if not exists attempts_device_paper_idx on attempts (device_id, paper_id);
create index if not exists attempts_paper_status_idx on attempts (paper_id, status);
