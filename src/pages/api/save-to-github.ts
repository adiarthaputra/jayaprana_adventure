import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { filename, content } = body; // filename misal: "singlepackage.json"

    // Ambil Token dan Info Repo dari Environment Variables
    const token = import.meta.env.GITHUB_TOKEN;
    const GITHUB_REPO = import.meta.env.GITHUB_REPO || "adiarthaputra/jayaprana_adventure"; 
    const BRANCH = "main"; // atau "master"

    const path = `src/data/${filename}`;
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

    // 1. Ambil SHA file lama di GitHub (Syarat wajib GitHub API untuk update file)
    const getRes = await fetch(url, {
      headers: {
        "Authorization": `token ${token}`,
        "User-Agent": "Astro-Admin-Panel"
      }
    });
    
    let sha = "";
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 2. Ubah data JSON baru ke format Base64 (Syarat format data GitHub API)
    const jsonString = JSON.stringify(content, null, 2);
    const contentBase64 = Buffer.from(jsonString).toString('base64');

    // 3. Kirim perintah PUT ke GitHub untuk menimpa file dengan data baru
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Astro-Admin-Panel"
      },
      body: JSON.stringify({
        message: `Update ${filename} via Admin Dashboard`,
        content: contentBase64,
        sha: sha, // SHA file lama wajib disertakan
        branch: BRANCH
      })
    });

    if (!putRes.ok) {
      const errData = await putRes.json();
      throw new Error(errData.message || "Gagal menyimpan ke GitHub");
    }

    return new Response(JSON.stringify({ success: true, message: "Berhasil simpan ke GitHub Database!" }), {
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