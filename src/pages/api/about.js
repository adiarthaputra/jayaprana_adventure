import fs from 'fs';
import path from 'path';

const aboutFilePath = path.join(process.cwd(), 'src', 'data', 'about.json');

export const GET = async () => {
  try {
    const data = fs.readFileSync(aboutFilePath, 'utf8');
    return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal membaca data About Us' }), { status: 500 });
  }
};

export const POST = async ({ request }) => {
  try {
    const newData = await request.json();
    fs.writeFileSync(aboutFilePath, JSON.stringify(newData, null, 2), 'utf8');
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};