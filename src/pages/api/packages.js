import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'singlepackage.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileData);

    return new Response(JSON.stringify(jsonData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}