export async function search({
  query
}) {
  const response = await fetch(
    "https://html.duckduckgo.com/html/?q=" +
    encodeURIComponent(query)
  );

  if (!response.ok) {
    throw new Error(
      `Search failed: ${response.status}`
    );
  }

  const html = await response.text();

  // Temporary extraction
  const results = [
    ...html.matchAll(
      /result__a[^>]*>(.*?)<\/a>/g
    )
  ].map(
    match =>
      match[1]
        .replace(/<[^>]+>/g, "")
  );

  return {
    query,
    results: results.slice(0, 5)
  };
}
