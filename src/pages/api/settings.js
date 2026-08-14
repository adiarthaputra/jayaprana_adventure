import fs from 'fs';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'src', 'data', 'siteSettings.json');

export const GET = async () => {
  try {
    const data = fs.readFileSync(settingsFilePath, 'utf8');
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal membaca settings' }), { status: 500 });
  }
};

export const POST = async ({ request }) => {
  try {
    const newSettings = await request.json();
    fs.writeFileSync(settingsFilePath, JSON.stringify(newSettings, null, 2), 'utf8');
    
    return new Response(JSON.stringify({ success: true, message: 'Settings berhasil disimpan!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};