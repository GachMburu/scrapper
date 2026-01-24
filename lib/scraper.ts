
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedComponent {
  type: 'table' | 'list' | 'links';
  title?: string;
  headers?: string[];
  rows: any[];
  count: number;
}

export interface ScrapedResult {
  title: string;
  metaDescription: string;
  components: ScrapedComponent[];
}

export async function scrapeUrl(url: string): Promise<ScrapedResult> {
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });

    const $ = cheerio.load(data);
    const components: ScrapedComponent[] = [];

    // 1. EXTRACT TABLES
    $('table').each((i, table) => {
      const headers: string[] = [];
      const rows: any[] = [];
      
      // Try to find headers
      $(table).find('th').each((_, th) => {
        headers.push($(th).text().trim() || `Col ${headers.length + 1}`);
      });
      // Fallback if no TH
      if (headers.length === 0) {
        $(table).find('tr').first().find('td').each((_, td) => headers.push(`Col ${headers.length + 1}`));
      }

      $(table).find('tr').each((_, tr) => {
        const rowObj: any = {};
        let hasData = false;
        $(tr).find('td').each((colIndex, td) => {
          const key = headers[colIndex] || `Col ${colIndex}`;
          const val = $(td).text().trim();
          if (val) hasData = true;
          rowObj[key] = val;
        });
        if (hasData) rows.push(rowObj);
      });

      if (rows.length > 0) components.push({ type: 'table', title: `Table ${i + 1}`, headers, rows, count: rows.length });
    });

    // 2. EXTRACT LINKS
    const links: any[] = [];
    $('a').each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text && href && !href.startsWith('#') && !href.startsWith('javascript')) {
        links.push({ "Link Text": text, "URL": href });
      }
    });
    if (links.length > 0) components.push({ type: 'links', title: 'All Links', headers: ['Link Text', 'URL'], rows: links, count: links.length });

    return {
      title: $('title').text().trim(),
      metaDescription: $('meta[name="description"]').attr('content') || '',
      components
    };
  } catch (error) {
    console.error("Scraping Error:", error);
    throw new Error(`Failed to scrape ${url}`);
  }
}
