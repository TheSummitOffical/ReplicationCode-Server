import * as cheerio from "cheerio";

export async function search({
  query
}) {
  const url =
    "https://html.duckduckgo.com/html/?q=" +
    encodeURIComponent(query);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await response.text();

  const $ = cheerio.load(html);

  const results = [];

  $(".result").each((_, el) => {
    const title = $(el)
      .find(".result__a")
      .text()
      .trim();

    const link = $(el)
      .find(".result__a")
      .attr("href");

    const snippet = $(el)
      .find(".result__snippet")
      .text()
      .trim();

    if (title && link) {
      results.push({
        title,
        url: link,
        snippet
      });
    }
  });

  return {
    query,
    results: results.slice(0, 1).map(result => ({
      title: result.title,
      url: result.url,
      snippet: result.snippet.slice(0, 300)
    }))
  };
}
