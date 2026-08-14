// src/pages/api/packages.js
import fs from 'fs';
import path from 'path';

// Mencari lokasi file JSON di dalam folder project
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'singlepackage.json');

export const GET = async () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal membaca data' }), { status: 500 });
  }
};

export const POST = async ({ request }) => {
  try {
    const newData = await request.json();
    
    // Menulis ulang isi file JSON dengan data terbaru dari dashboard
    fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
    
    return new Response(JSON.stringify({ success: true, message: 'Data berhasil disimpan!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};