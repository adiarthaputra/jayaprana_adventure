import fs from 'fs';
import path from 'path';

const galleryFilePath = path.join(process.cwd(), 'src', 'data', 'gallery.json');

export const GET = async () => {
  try {
    const data = fs.readFileSync(galleryFilePath, 'utf8');
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal membaca data galeri' }), { status: 500 });
  }
};

export const POST = async ({ request }) => {
  try {
    const newGallery = await request.json();
    fs.writeFileSync(galleryFilePath, JSON.stringify(newGallery, null, 2), 'utf8');
    
    return new Response(JSON.stringify({ success: true, message: 'Galeri berhasil diperbarui!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};