export default async function handler(req, res) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();

  const posts = json.results.map(p => ({
    show: p.properties["Show in Widget"]?.checkbox,
    pinned: p.properties["Pin Post?"]?.checkbox,
    platform: p.properties["Platform name"]?.multi_select.map(x=>x.name) || [],
    type: p.properties["Type of post"]?.multi_select.map(x=>x.name) || [],
    image: p.properties["Post Preview"]?.files?.[0]?.file?.url || null,
  }));

  res.status(200).json(posts);
}
