export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ allowed: false });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ allowed: false });
    }

    // 🔐 Check token in Supabase
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/widget_tokens?token=eq.${token}&select=*`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    const data = await response.json();

    // If token exists in database → allow
    if (Array.isArray(data) && data.length > 0) {
      return res.status(200).json({ allowed: true });
    }

    return res.status(200).json({ allowed: false });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ allowed: false });
  }
}
