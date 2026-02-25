export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ saved: false });
  }

  const { token, widget_type, posts } = req.body;

  if (!token || !posts || !posts.length) {
    return res.status(400).json({ saved: false });
  }

  try {
    const upserts = posts.map((post, index) => ({
      token,
      widget_type,
      post_id: post.id,
      position: index,
      updated_at: new Date().toISOString()
    }));

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/feed_layout`,
      {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates"
        },
        body: JSON.stringify(upserts)
      }
    );

    if (!response.ok) {
      return res.status(500).json({ saved: false });
    }

    return res.status(200).json({ saved: true });

  } catch (err) {
    return res.status(500).json({ saved: false });
  }
}
