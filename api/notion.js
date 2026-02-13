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

  const posts = json.results
  .filter(p =>
    p.properties["Show in Widget"]?.checkbox === true &&
    p.properties["Platform Name"]?.multi_select.some(x => x.name === "🩷Instagram")
    p.properties["Status"]?.status?.name === "🕒Scheduled"
  )
  .map(p => ({
    id: p.id,
    pinned: p.properties["Pin Post?"]?.checkbox || false,
    title: p.properties["Content Title/ Caption/ Hook"]?.title?.[0]?.plain_text || "",
    date: p.properties["Scheduled Date & Time"]?.date?.start || null,
    platform: p.properties["Platform Name"]?.multi_select.map(x=>x.name) || [],
    type: p.properties["Type of Post"]?.multi_select.map(x=>x.name) || [],
    images: p.properties["Post Preview"]?.files?.map(f => f.file?.url) || [],
  }));

  res.status(200).json(posts);
}
