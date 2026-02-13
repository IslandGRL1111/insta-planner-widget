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
  platformRaw: p.properties["Platform Name"]?.multi_select,
  statusRaw: p.properties["Status"]?.status?.name,
  showRaw: p.properties["Show in Widget"]?.checkbox
}));

  res.status(200).json(posts);
}
