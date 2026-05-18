import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type CatalogRole = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  salary_range: string | null;
  demand_level: string | null;
  growth_pct: number | null;
};

export type CatalogSkill = {
  id: string;
  name: string;
  category: string;
  icon: string | null;
};

export type RoleWithSkills = CatalogRole & {
  skills: { name: string; priority: string; category: string }[];
};

export const getRoles = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("roles")
    .select("id,slug,title,description,icon,salary_range,demand_level,growth_pct")
    .order("title");
  if (error) throw new Error(error.message);
  return (data ?? []) as CatalogRole[];
});

export const getSkills = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("skills")
    .select("id,name,category,icon")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as CatalogSkill[];
});

export const getRoleSkills = createServerFn({ method: "POST" })
  .inputValidator((d: { roleId: string }) => d)
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("role_skills")
      .select("priority, skills(name, category)")
      .eq("role_id", data.roleId);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r: any) => ({
      name: r.skills.name as string,
      category: r.skills.category as string,
      priority: r.priority as string,
    }));
  });
