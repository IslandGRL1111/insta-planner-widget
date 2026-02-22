export default async function handler(req, res) {
  try {
    const { token, databaseId } = req.body;

    if (!token || !databaseId) {
      return res.status(400).json({ saved: false });
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/Widget_Tokens?token=eq.${token}`,
      {
        method: "PATCH",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          notion_database_id: databaseId,
          last_used_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      return res.status(500).json({ saved: false });
    }

    return res.status(200).json({ saved: true });

  } catch (error) {
    return res.status(500).json({ saved: false });
  }
}
