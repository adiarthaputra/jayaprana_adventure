import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { filename, base64Data } = body; // filename: nama file unik, base64Data: data mentah gambar

    const token = import.meta.env.GITHUB_TOKEN;
    const GITHUB_REPO = import.meta.env.GITHUB_REPO || "adiarthaputra/jayaprana_adventure";
    const BRANCH = "main";

    // Kita simpan gambar langsung ke folder public/uploads/ di GitHub
    const path = `public/uploads/${filename}`;
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

    // Kirim perintah PUT ke GitHub untuk membuat file gambar baru
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Astro-Admin-Panel"
      },
      body: JSON.stringify({
        message: `Upload image ${filename} via Admin Dashboard`,
        content: base64Data, // Data Base64 mentah dari gambar
        branch: BRANCH
      })
    });

    if (!putRes.ok) {
      const errData = await putRes.json();
      throw new Error(errData.message || "Gagal mengupload gambar ke GitHub");
    }

    // URL publik gambar yang bisa langsung dipakai di website
    const publicUrl = `/uploads/${filename}`;

    return new Response(JSON.stringify({ success: true, url: publicUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};