-- ============================================================
-- شغّل الكود ده في: Supabase Dashboard → SQL Editor → New query
-- بيعمل جدول المشاريع (الأعمال) اللي هيظهر في صفحة "الأعمال"
-- ============================================================

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text not null,
  category text not null,       -- استخدم: branding / motion / social / video
  year int not null default extract(year from now()),
  tint text not null default 'ember',  -- ember / gold / ember-glow
  image_url text,                -- رابط صورة المشروع (اختياري دلوقتي)
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- تفعيل الحماية (RLS) — أي حد بيزور الموقع يقدر "يقرأ" بس، مش يعدّل
alter table projects enable row level security;

create policy "Public can read projects"
  on projects for select
  using (true);

-- ملحوظة: التعديل/الإضافة/الحذف هيتم من لوحة Supabase نفسها
-- (Table Editor) وانت مسجل دخول بحسابك — ده معدّي من غير أي مشكلة
-- لأن دخولك بيستخدم صلاحيات المالك مش المفتاح العام.

-- ============================================================
-- بيانات تجريبية ابتدائية (اختياري) — احذف السطر ده لو مش عايزها
-- تقدر تمسحها بعدين من لوحة Supabase وتضيف مشاريعك الحقيقية
-- ============================================================
insert into projects (title_ar, title_en, category, year, tint, sort_order) values
  ('هوية بصرية — مقهى نوستالجيا', 'Visual Identity — Nostalgia Café', 'branding', 2025, 'ember', 1),
  ('إعلان موشن جرافيك — تطبيق توصيل', 'Motion Ad — Delivery App', 'motion', 2025, 'gold', 2),
  ('حملة سوشيال ميديا — إطلاق منتج', 'Social Campaign — Product Launch', 'social', 2024, 'ember-glow', 3),
  ('مونتاج فيديو — فيلم قصير', 'Video Edit — Short Film', 'video', 2024, 'ember', 4);

-- ============================================================
-- تحديث: دعم أكتر من صورة لكل مشروع (معرض مصغر)
-- شغّل السطر ده تحت في SQL Editor عشان تضيف العمود الجديد
-- ============================================================
alter table projects add column if not exists image_urls text[] default '{}';

-- ============================================================
-- تحديث: اللايكات والكومنتات
-- ============================================================

-- عداد اللايكات على كل مشروع
alter table projects add column if not exists likes_count int not null default 0;

-- دالة آمنة لزيادة اللايك (بدل ما نفتح صلاحية تعديل كاملة للجدول)
create or replace function increment_project_likes(project_id uuid)
returns int
language plpgsql
security definer
as $$
declare
  new_count int;
begin
  update projects set likes_count = likes_count + 1 where id = project_id
  returning likes_count into new_count;
  return new_count;
end;
$$;

-- جدول الكومنتات
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 60),
  message text not null check (char_length(trim(message)) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table comments enable row level security;

create policy "Public can read comments"
  on comments for select
  using (true);

create policy "Public can add comments"
  on comments for insert
  with check (true);

-- ============================================================
-- تحديث: تسجيل الدخول ونوع الحساب (عميل / شركة)
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('client', 'company')),
  email text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- يمنع تعليقات فاضية أو طويلة جدًا (سبام) حتى لو حد حاول يبعت طلب مباشر للـ API
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'comments_name_len') then
    alter table comments add constraint comments_name_len check (char_length(trim(name)) between 1 and 60);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'comments_message_len') then
    alter table comments add constraint comments_message_len check (char_length(trim(message)) between 1 and 500);
  end if;
end $$;

-- ============================================================
-- تحديث: نظام تسجيل الدخول (Supabase Auth) + ملف تعريف كل مستخدم
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  account_type text not null default 'client' check (account_type in ('client', 'company')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- بيعمل صف تلقائي في profiles أول ما حد يسجل حساب جديد
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, account_type)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    coalesce(new.raw_user_meta_data ->> 'account_type', 'client')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- تحديث: صفحة الشركاء / صنّاع المحتوى
-- ============================================================

-- صنّاع المحتوى الشركاء
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text,
  followers_count int,
  youtube_url text,
  instagram_url text,
  tiktok_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table partners enable row level security;

create policy "Public can read partners"
  on partners for select
  using (true);

-- حملات إعلانية متعددة لكل صانع محتوى
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  title text not null,
  description text,
  youtube_url text,
  views_count int,
  likes_count int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table campaigns enable row level security;

create policy "Public can read campaigns"
  on campaigns for select
  using (true);

-- صور السلايد شو في صفحة الشركاء
create table if not exists ad_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table ad_slides enable row level security;

create policy "Public can read ad_slides"
  on ad_slides for select
  using (true);

-- الأخبار الإعلانية (بتظهر في شريط بالصفحة الرئيسية)
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table news enable row level security;

create policy "Public can read news"
  on news for select
  using (true);

-- لو كان عندك جدول news من قبل من غير عمود الصورة، شغّل السطر ده كمان
alter table news add column if not exists image_url text;

