import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('packages');
  const [packages, setPackages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [settings, setSettings] = useState({ heroTitle: '', heroSubtitle: '', heroBgImage: '', whatsappNumber: '', email: '', address: '' });
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', location: '', text: '' });
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [about, setAbout] = useState({ title: '', subtitle: '', image: '', heading: '', description: '', pointsText: '' });

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
      fetchAllData();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn]);

  const fetchAllData = () => {
    fetchPackages(); fetchSettings(); fetchGallery(); fetchTestimonials(); fetchFaqs(); fetchAbout();
  };

  const fetchPackages = async () => { try { const res = await fetch('/api/packages'); setPackages(await res.json()); } catch (e) {} };
  const fetchSettings = async () => { try { const res = await fetch('/api/settings'); setSettings(await res.json()); } catch (e) {} };
  const fetchGallery = async () => { try { const res = await fetch('/api/gallery'); setGallery(await res.json()); } catch (e) {} };
  const fetchTestimonials = async () => { try { const res = await fetch('/api/testimonials'); setTestimonials(await res.json()); } catch (e) {} };
  const fetchFaqs = async () => { try { const res = await fetch('/api/faq'); setFaqs(await res.json()); } catch (e) {} };
  const fetchAbout = async () => { try { const res = await fetch('/api/about'); const data = await res.json(); setAbout({ ...data, pointsText: data.points?.join('\n') || '' }); } catch (e) {} };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === 'deva' && loginData.password === 'dragon77') {
      setIsLoggedIn(true);
      localStorage.setItem('adminAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Username atau Password salah!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminAuth');
    setLoginData({ username: '', password: '' });
  };

  // --- FUNGSI UTILITY: UPLOAD FILE KE GITHUB API ---
  const uploadImageFile = async (fileObj) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Full = reader.result;
          const base64Data = base64Full.split(',')[1];
          const uniqueFilename = `${Date.now()}-${fileObj.name.replace(/\s+/g, '-')}`;

          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: uniqueFilename, base64Data })
          });
          const result = await res.json();

          if (result.success) {
            resolve(result.url); // Mengembalikan URL publik gambar
          } else {
            reject(result.error);
          }
        } catch (err) {
          reject('Koneksi upload gagal');
        }
      };
      reader.readAsDataURL(fileObj);
    });
  };

  const saveToGitHub = async (filename, contentData) => {
    try {
      const res = await fetch('/api/save-to-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content: contentData })
      });
      const result = await res.json();
      if (result.success) {
        alert('Berhasil tersimpan permanen ke Database GitHub! 🚀');
      } else {
        alert('Gagal: ' + result.error);
      }
    } catch (e) {
      alert('Terjadi kesalahan koneksi ke GitHub.');
    }
  };

  const savePackagesToAPI = async (data) => { setPackages(data); await saveToGitHub('singlepackage.json', data); };
  const saveSettingsToAPI = async (e) => { e.preventDefault(); await saveToGitHub('siteSettings.json', settings); alert('Settings/Hero tersimpan!'); };
  const saveGalleryToAPI = async (data) => { setGallery(data); await saveToGitHub('gallery.json', data); };
  const saveTestimonialsToAPI = async (data) => { setTestimonials(data); await saveToGitHub('testimonials.json', data); };
  const saveFaqsToAPI = async (data) => { setFaqs(data); await saveToGitHub('faq.json', data); };
  const saveAboutToAPI = async (e) => { 
    e.preventDefault(); 
    const dataToSave = { ...about, points: about.pointsText.split('\n').filter(i => i.trim() !== '') }; 
    delete dataToSave.pointsText; 
    await saveToGitHub('about.json', dataToSave); 
  };

  const handleDeletePackage = (i) => { if (window.confirm('Hapus?')) { const n = [...packages]; n.splice(i, 1); savePackagesToAPI(n); } };
  const openEditModal = (i) => { setEditingIndex(i); const p = packages[i]; setFormData({ ...p, detailsText: p.details?.join('\n')||'', itineraryText: p.itinerary?.join('\n')||'', whatToBringText: p.whatToBring?.join('\n')||'' }); };
  const openAddModal = () => { setEditingIndex(-1); setFormData({ title: '', slug: '', originalPrice: '', discountedPrice: '', image: '', detailsText: '', itineraryText: '', whatToBringText: '', bookNowUrl: '' }); };
  
  // --- SIMPAN PAKET DENGAN DUKUNGAN UPLOAD FILE GAMBAR ---
  const savePackage = async () => {
    let imageUrl = formData.image;
    const fileInput = document.getElementById('package-file-input');

    if (fileInput && fileInput.files[0]) {
      alert('Mengupload gambar paket ke GitHub...');
      try {
        imageUrl = await uploadImageFile(fileInput.files[0]);
      } catch (err) {
        alert('Gagal upload gambar: ' + err);
        return;
      }
    }

    const n = [...packages];
    const u = { ...formData, image: imageUrl };
    u.details = u.detailsText?.split('\n').filter(i=>i.trim()!=='')||[];
    u.itinerary = u.itineraryText?.split('\n').filter(i=>i.trim()!=='')||[];
    u.whatToBring = u.whatToBringText?.split('\n').filter(i=>i.trim()!=='')||[];
    if(u.slug) u.moreInfoUrl = `/${u.slug}`;
    delete u.detailsText; delete u.itineraryText; delete u.whatToBringText;

    if (editingIndex === -1) n.push(u);
    else n[editingIndex] = u;

    savePackagesToAPI(n);
    setEditingIndex(null);
  };

  const handleDeleteImage = (id) => { if (window.confirm('Hapus?')) saveGalleryToAPI(gallery.filter(i => i.id !== id)); };
  const handleAddTestimonial = (e) => { e.preventDefault(); if(!newTestimonial.text) return; saveTestimonialsToAPI([...testimonials, { id: Date.now(), ...newTestimonial }]); setNewTestimonial({ name: '', location: '', text: '' }); };
  const handleDeleteTestimonial = (id) => { if(window.confirm('Hapus testimoni?')) saveTestimonialsToAPI(testimonials.filter(t => t.id !== id)); };
  const handleAddFaq = (e) => { e.preventDefault(); if(!newFaq.question) return; saveFaqsToAPI([...faqs, { id: Date.now(), ...newFaq }]); setNewFaq({ question: '', answer: '' }); };
  const handleDeleteFaq = (id) => { if(window.confirm('Hapus FAQ?')) saveFaqsToAPI(faqs.filter(f => f.id !== id)); };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-600 mb-2">Admin Panel</h1>
            <p className="text-gray-500">Silakan login untuk mengelola website.</p>
          </div>
          {loginError && (<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded">{loginError}</div>)}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input type="text" value={loginData.username} onChange={(e) => setLoginData({...loginData, username: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition" required />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-300">Login Sekarang</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans relative">
      <aside className="w-64 bg-gray-900 text-white flex flex-col sticky top-0 h-screen flex-shrink-0 z-10">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-emerald-500">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-4">Content</p>
          <button onClick={() => setActiveTab('hero')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'hero' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>🖼️ Hero Section</button>
          <button onClick={() => setActiveTab('about')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'about' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>📝 About Us</button>
          <button onClick={() => setActiveTab('gallery')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'gallery' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>📷 Gallery</button>
          <button onClick={() => setActiveTab('testimonials')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'testimonials' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>💬 Testimonials</button>
          <button onClick={() => setActiveTab('faq')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'faq' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>❓ FAQ</button>
          
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6 px-4">Management</p>
          <button onClick={() => setActiveTab('packages')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'packages' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>📦 Tour Packages</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'settings' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>⚙️ Settings</button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold transition shadow-md">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-8 min-w-0">
        
        {/* TAB ABOUT US (DENGAN UPLOAD GAMBAR) */}
        {activeTab === 'about' && (
          <div className="animate-fadeIn max-w-4xl">
            <header className="mb-8"><h1 className="text-3xl font-bold text-gray-800">Edit About Us</h1></header>
            <form onSubmit={async (e) => {
              e.preventDefault();
              let imgUrl = about.image;
              const fileInput = document.getElementById('about-file-input');
              if (fileInput && fileInput.files[0]) {
                alert('Mengupload gambar About Us...');
                try {
                  imgUrl = await uploadImageFile(fileInput.files[0]);
                } catch(err) { alert('Gagal upload: ' + err); return; }
              }
              const updatedAbout = { ...about, image: imgUrl };
              setAbout(updatedAbout);
              saveAboutToAPI({ preventDefault: () => {}, ...updatedAbout, target: { value: '' } });
            }} className="bg-white rounded-xl border p-6 space-y-6 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-sm font-semibold mb-2">Judul</label><input type="text" value={about.title} onChange={(e) => setAbout({...about, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
                <div><label className="block text-sm font-semibold mb-2">Sub-judul</label><input type="text" value={about.subtitle} onChange={(e) => setAbout({...about, subtitle: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Upload Gambar Baru (Atau biarkan kosong)</label>
                {about.image && <p className="text-xs text-gray-500 mb-2">Gambar saat ini: <a href={about.image} target="_blank" className="text-emerald-600 underline">Lihat</a></p>}
                <input type="file" id="about-file-input" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              </div>
              <div><label className="block text-sm font-semibold mb-2">Heading Teks</label><input type="text" value={about.heading} onChange={(e) => setAbout({...about, heading: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
              <div><label className="block text-sm font-semibold mb-2">Deskripsi Paragraf</label><textarea rows="4" value={about.description} onChange={(e) => setAbout({...about, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none"></textarea></div>
              <div><label className="block text-sm font-semibold mb-2">Poin-poin Keunggulan (Enter)</label><textarea rows="4" value={about.pointsText} onChange={(e) => setAbout({...about, pointsText: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none"></textarea></div>
              <div className="pt-4 flex justify-end"><button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-emerald-700">Save Changes</button></div>
            </form>
          </div>
        )}

        {/* TAB FAQ */}
        {activeTab === 'faq' && (
          <div className="animate-fadeIn relative">
            <header className="mb-8"><h1 className="text-3xl font-bold text-gray-800">Manage FAQ</h1></header>
            <form onSubmit={handleAddFaq} className="bg-white rounded-xl shadow-sm border p-6 mb-8 flex flex-col gap-4">
              <div><label className="block text-sm font-semibold mb-1">Pertanyaan</label><input type="text" value={newFaq.question} onChange={(e) => setNewFaq({...newFaq, question: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" required /></div>
              <div><label className="block text-sm font-semibold mb-1">Jawaban</label><textarea rows="3" value={newFaq.answer} onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" required></textarea></div>
              <div className="flex justify-end"><button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-md">+ Add FAQ</button></div>
            </form>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.id} className="bg-white p-6 rounded-xl border group flex justify-between items-start">
                  <div><h3 className="font-bold text-lg mb-2">Q: {f.question}</h3><p className="text-gray-600">A: {f.answer}</p></div>
                  <button onClick={() => handleDeleteFaq(f.id)} className="text-red-500 bg-red-50 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 ml-4">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="animate-fadeIn relative">
            <header className="mb-8"><h1 className="text-3xl font-bold text-gray-800">Manage Testimonials</h1></header>
            <form onSubmit={handleAddTestimonial} className="bg-white rounded-xl shadow-sm border p-6 mb-8 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1">Nama</label><input type="text" value={newTestimonial.name} onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" required /></div>
                <div><label className="block text-sm font-semibold mb-1">Asal</label><input type="text" value={newTestimonial.location} onChange={(e) => setNewTestimonial({...newTestimonial, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" required /></div>
              </div>
              <div><label className="block text-sm font-semibold mb-1">Ulasan</label><textarea rows="3" value={newTestimonial.text} onChange={(e) => setNewTestimonial({...newTestimonial, text: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" required></textarea></div>
              <div className="flex justify-end"><button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">+ Add Testimonial</button></div>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-6 rounded-xl border relative group">
                  <p className="text-gray-600 italic mb-4">"{t.text}"</p><p className="font-bold">- {t.name}, {t.location}</p>
                  <button onClick={() => handleDeleteTestimonial(t.id)} className="absolute top-2 right-2 text-red-500 bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100">Hapus</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB GALLERY */}
        {activeTab === 'gallery' && (
          <div className="animate-fadeIn">
            <header className="mb-8"><h1 className="text-3xl font-bold">Manage Gallery</h1></header>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fileInput = document.getElementById('image-file-input');
              const altInput = document.getElementById('image-alt-input');
              
              if (!fileInput.files[0]) { alert('Pilih file gambar dulu!'); return; }
              alert('Mengupload gambar ke GitHub...');
              try {
                const url = await uploadImageFile(fileInput.files[0]);
                const newImageObj = { id: Date.now(), url, alt: altInput.value || 'Gallery Image' };
                saveGalleryToAPI([...gallery, newImageObj]);
                fileInput.value = ''; altInput.value = '';
                alert('Berhasil upload gambar!');
              } catch (err) { alert('Gagal: ' + err); }
            }} className="bg-white rounded-xl shadow-sm border p-6 mb-8 flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">Pilih File Gambar</label>
                <input type="file" id="image-file-input" accept="image/*" className="w-full px-3 py-2 border rounded-lg text-sm file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">Keterangan (Alt)</label>
                <input type="text" id="image-alt-input" placeholder="Keterangan foto" className="w-full px-4 py-2 border rounded-lg outline-none" />
              </div>
              <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold h-[42px]">+ Upload</button>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {gallery.map((img) => (
                <div key={img.id} className="bg-white rounded-xl border overflow-hidden group relative">
                  <div className="aspect-square w-full"><img src={img.url} alt={img.alt} className="w-full h-full object-cover" /></div>
                  <button onClick={() => handleDeleteImage(img.id)} className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB PACKAGES */}
        {activeTab === 'packages' && (
          <div className="animate-fadeIn">
            <header className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold">Manage Tour Packages</h1><button onClick={openAddModal} className="bg-emerald-600 text-white px-6 py-2 rounded-lg">+ Add New</button></header>
            <div className="bg-white rounded-xl border overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead><tr className="bg-gray-50 border-b"><th className="p-4">Title</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr></thead>
                <tbody>{packages.map((pkg, i) => (<tr key={i} className="border-b hover:bg-gray-50"><td className="p-4">{pkg.title}</td><td className="p-4 text-emerald-600">{pkg.discountedPrice}</td><td className="p-4 text-right space-x-2"><button onClick={() => openEditModal(i)} className="text-blue-500">Edit</button><button onClick={() => handleDeletePackage(i)} className="text-red-500">Delete</button></td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB HERO (DENGAN UPLOAD GAMBAR BACKGROUND) */}
        {activeTab === 'hero' && (
          <div className="animate-fadeIn max-w-3xl">
            <header className="mb-8"><h1 className="text-3xl font-bold">Hero Section</h1></header>
            <form onSubmit={async (e) => {
              e.preventDefault();
              let bgUrl = settings.heroBgImage;
              const fileInput = document.getElementById('hero-file-input');
              if (fileInput && fileInput.files[0]) {
                alert('Mengupload background Hero...');
                try {
                  bgUrl = await uploadImageFile(fileInput.files[0]);
                } catch(err) { alert('Gagal upload: ' + err); return; }
              }
              const updatedSettings = { ...settings, heroBgImage: bgUrl };
              setSettings(updatedSettings);
              saveSettingsToAPI({ preventDefault: () => {}, ...updatedSettings });
            }} className="bg-white rounded-xl border p-6 space-y-6">
              <div><label className="block text-sm font-semibold mb-2">Headline</label><input type="text" value={settings.heroTitle||''} onChange={(e) => setSettings({...settings, heroTitle: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
              <div><label className="block text-sm font-semibold mb-2">Subtitle</label><textarea rows="3" value={settings.heroSubtitle||''} onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none"></textarea></div>
              <div>
                <label className="block text-sm font-semibold mb-2">Upload Background Baru</label>
                {settings.heroBgImage && <p className="text-xs text-gray-500 mb-2">Background saat ini: <a href={settings.heroBgImage} target="_blank" className="text-emerald-600 underline">Lihat</a></p>}
                <input type="file" id="hero-file-input" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700" />
              </div>
              <div className="pt-4 flex justify-end"><button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg">Save</button></div>
            </form>
          </div>
        )}

        {/* TAB SETTINGS */}
        {activeTab === 'settings' && (
          <div className="animate-fadeIn max-w-3xl">
            <header className="mb-8"><h1 className="text-3xl font-bold">Settings</h1></header>
            <form onSubmit={saveSettingsToAPI} className="bg-white rounded-xl border p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-sm font-semibold mb-2">WhatsApp</label><input type="text" value={settings.whatsappNumber||''} onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
                <div><label className="block text-sm font-semibold mb-2">Email</label><input type="email" value={settings.email||''} onChange={(e) => setSettings({...settings, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
              </div>
              <div><label className="block text-sm font-semibold mb-2">Address</label><textarea rows="2" value={settings.address||''} onChange={(e) => setSettings({...settings, address: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none"></textarea></div>
              <div className="pt-4 flex justify-end"><button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg">Save</button></div>
            </form>
          </div>
        )}
      </main>

      {/* MODAL EDIT PACKAGES (DENGAN UPLOAD FILE GAMBAR) */}
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editingIndex === -1 ? 'Add New Package' : 'Edit Package'}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="block text-sm font-semibold mb-1">Title</label><input type="text" value={formData.title||''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
              <div><label className="block text-sm font-semibold mb-1">Slug</label><input type="text" value={formData.slug||''} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="block text-sm font-semibold mb-1">Original Price</label><input type="text" value={formData.originalPrice||''} onChange={(e) => setFormData({...formData, originalPrice: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
              <div><label className="block text-sm font-semibold mb-1">Discount Price</label><input type="text" value={formData.discountedPrice||''} onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Upload File Gambar Paket</label>
              {formData.image && <p className="text-xs text-gray-500 mb-1">Gambar saat ini: <a href={formData.image} target="_blank" className="text-emerald-600 underline">Lihat</a></p>}
              <input type="file" id="package-file-input" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700" />
            </div>
            <div className="mb-4"><label className="block text-sm font-semibold mb-1">Details (Enter)</label><textarea rows="2" value={formData.detailsText||''} onChange={(e) => setFormData({...formData, detailsText: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none"></textarea></div>
            <div className="mb-4"><label className="block text-sm font-semibold mb-1">Itinerary (Enter)</label><textarea rows="2" value={formData.itineraryText||''} onChange={(e) => setFormData({...formData, itineraryText: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none"></textarea></div>
            <div className="mb-4"><label className="block text-sm font-semibold mb-1">What to Bring (Enter)</label><textarea rows="2" value={formData.whatToBringText||''} onChange={(e) => setFormData({...formData, whatToBringText: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none"></textarea></div>
            <div className="mt-8 flex justify-end space-x-4">
              <button onClick={() => setEditingIndex(null)} className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={savePackage} className="px-6 py-2 bg-emerald-600 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;