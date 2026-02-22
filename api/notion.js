export default async function handler(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    // 1️⃣ Validate token + get database ID
    const tokenRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/Widget_Tokens?token=eq.${token}&is_active=eq.true`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData || tokenData.length === 0) {
      return res.status(403).json({ error: "Invalid or inactive token" });
    }

    const notionDatabaseId = tokenData[0].notion_database_id;

    if (!notionDatabaseId) {
      return res.status(200).json({ setupRequired: true });
    }

    // 2️⃣ Query Notion using THAT database ID
    const notionRes = await fetch(
      `https://api.notion.com/v1/databases/${notionDatabaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        }
      }
    );

    const notionData = await notionRes.json();

    const posts = notionData.results
      .filter(p => {
        const show = p.properties["Show in Widget"]?.checkbox;
        return show;
      })
      .map(p => ({
        id: p.id,
        pinned: p.properties["Pin Post?"]?.checkbox || false,
        title: p.properties["Content Title/ Caption/ Hook"]?.title?.[0]?.plain_text || "",
        date: p.properties["Scheduled Date & Time"]?.date?.start || null,
        type: p.properties["Type of Post"]?.multi_select.map(x => x.name) || [],
        images: p.properties["Post Preview"]?.files?.map(f => f.file?.url) || []
      }));

    return res.status(200).json(posts);

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
