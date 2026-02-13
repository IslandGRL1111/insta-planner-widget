import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ allowed: false });
    }

    const { data, error } = await supabase
      .from("Widget_Tokens")
      .select("id")
      .eq("token", token)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return res.status(403).json({ allowed: false });
    }

    return res.status(200).json({ allowed: true });

  } catch (err) {
    return res.status(500).json({ allowed: false });
  }
}
