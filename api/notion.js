export default async function handler(req, res) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const DATABASE_ID = process.env.NOTION_DATABASE_ID;

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    // 🧠 Map Notion pages → widget-friendly objects
    const posts = (data.results || []).map((page) => {
      const props = page.properties;

      return {
        image:
          props["Post Preview"]?.files?.[0]?.file?.url ||
          props["Post Preview"]?.files?.[0]?.external?.url ||
          null,

        date: props["Scheduled Date & Time"]?.date?.start || null,

        pinned: props["Pin Post?"]?.checkbox || false,

        showInWidget: props["Show in Widget"]?.checkbox || false,

        platforms:
          props["Platform name"]?.multi_select?.map((p) => p.name) || [],

        url: props["Post URL"]?.url || null,
      };
    });

    // 🌸 FILTER LOGIC (this is the magic)
    const instagramPlannedPosts = posts.filter(
      (post) =>
        post.showInWidget === true &&
        post.platforms.includes("Instagram")
    );

    res.status(200).json({
      posts: instagramPlannedPosts,
    });
  } catch (error) {
    console.error("NOTION API ERROR:", error);
    res.status(500).json({ error: "Failed to fetch Notion posts" });
  }
}
