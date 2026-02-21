export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ allowed: false });
    }

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ allowed: false });
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/Widget_Tokens?token=eq.${token}&is_active=eq.true`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(403).json({ allowed: false });
    }

    return res.status(200).json({
  allowed: true,
  token
});
    
  } catch (error) {
    return res.status(500).json({ allowed: false });
  }
}
