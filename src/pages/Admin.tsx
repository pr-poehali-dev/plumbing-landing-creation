import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const URLS = {
  auth: "https://functions.poehali.dev/55e6545f-de32-4ec1-b2e9-c56578cdcda4",
  upload: "https://functions.poehali.dev/84a6e3ed-8a59-4077-9c83-fab7a1f3233a",
  list: "https://functions.poehali.dev/8af98359-a4c4-482e-97a1-b5b093139d65",
};

const TAGS = ["Ремонт", "Трубопровод", "Отопление", "Монтаж", "Аварийный", "Водоснабжение"];

interface Photo {
  id: number;
  title: string;
  image_url: string;
  tag: string;
  area: string;
  duration: string;
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  const [form, setForm] = useState({ title: "", tag: TAGS[0], area: "", duration: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = async () => {
    setPhotosLoading(true);
    try {
      const res = await fetch(URLS.list);
      const data = await res.json();
      setPhotos(data.photos || []);
    } finally {
      setPhotosLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadPhotos();
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch(URLS.auth, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        setToken(data.token);
      } else {
        setAuthError(data.error || "Неверный пароль");
      }
    } catch {
      setAuthError("Ошибка соединения");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) { setUploadError("Выберите фото"); return; }
    setUploading(true);
    setUploadError("");
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        const res = await fetch(URLS.upload, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...form, image: base64 }),
        });
        const data = await res.json();
        if (data.success) {
          setUploadSuccess(true);
          setForm({ title: "", tag: TAGS[0], area: "", duration: "" });
          setImageFile(null);
          setImagePreview("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          await loadPhotos();
          setTimeout(() => setUploadSuccess(false), 3000);
        } else {
          setUploadError(data.error || "Ошибка загрузки");
        }
        setUploading(false);
      };
    } catch {
      setUploadError("Ошибка соединения");
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await fetch(URLS.upload, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan flex items-center justify-center glow-cyan mx-auto mb-4">
              <Icon name="Shield" size={28} className="text-background" />
            </div>
            <h1 className="font-display text-3xl font-bold text-cyan text-glow">АКВА<span className="text-foreground">МАСТЕР</span></h1>
            <p className="text-muted-foreground mt-2 text-sm">Панель управления</p>
          </div>
          <form onSubmit={handleLogin} className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-5">
            <h2 className="font-display text-xl font-bold text-center">Вход в админку</h2>
            <div>
              <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Пароль</label>
              <input
                type="password"
                required
                placeholder="Введите пароль..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-all"
              />
            </div>
            {authError && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                <Icon name="AlertCircle" size={16} />
                {authError}
              </div>
            )}
            <button
              type="submit"
              disabled={authLoading}
              className="flex items-center justify-center gap-2 bg-cyan text-background px-6 py-3 rounded-full font-display font-bold tracking-wide hover:glow-cyan transition-all duration-300 disabled:opacity-50"
            >
              {authLoading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <Icon name="LogIn" size={18} />}
              Войти
            </button>
          </form>
          <p className="text-center mt-4">
            <a href="/" className="text-xs text-muted-foreground hover:text-cyan transition-colors font-display tracking-wide uppercase">
              ← Вернуться на сайт
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan flex items-center justify-center">
              <Icon name="Wrench" size={16} className="text-background" />
            </div>
            <span className="font-display font-bold text-lg text-cyan">АКВА<span className="text-foreground">МАСТЕР</span></span>
            <span className="text-muted-foreground text-sm ml-2 hidden sm:block">/ Панель управления</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs font-display tracking-wide uppercase text-muted-foreground hover:text-cyan transition-colors hidden sm:block">
              На сайт
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 rounded-full text-sm font-display hover:border-destructive/50 hover:text-destructive transition-all"
            >
              <Icon name="LogOut" size={14} />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* Upload form */}
        <div>
          <h2 className="font-display text-2xl font-bold mb-6">Добавить фото</h2>
          <form onSubmit={handleUpload} className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-5">

            {/* Image drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-52 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan/50 transition-all overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <Icon name="ImagePlus" size={36} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Нажмите чтобы выбрать фото</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG до 5 МБ</p>
                </>
              )}
              {imagePreview && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                  <span className="text-white text-sm font-display">Сменить фото</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            <div>
              <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Название</label>
              <input
                type="text" required placeholder="Ванная комната под ключ"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Категория</label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-all appearance-none"
                >
                  {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Площадь</label>
                <input
                  type="text" placeholder="8 м²"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-display tracking-widest uppercase text-muted-foreground mb-2">Срок выполнения</label>
              <input
                type="text" placeholder="3 дня"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 transition-all"
              />
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                <Icon name="AlertCircle" size={16} />
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="flex items-center gap-2 text-cyan text-sm bg-cyan/10 border border-cyan/20 rounded-xl px-4 py-3">
                <Icon name="CheckCircle2" size={16} />
                Фото успешно добавлено!
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="flex items-center justify-center gap-2 bg-cyan text-background px-6 py-3 rounded-full font-display font-bold tracking-wide hover:glow-cyan transition-all duration-300 disabled:opacity-50 mt-1"
            >
              {uploading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <Icon name="Upload" size={18} />}
              {uploading ? "Загрузка..." : "Загрузить фото"}
            </button>
          </form>
        </div>

        {/* Photos list */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Фото портфолио</h2>
            <span className="text-sm text-muted-foreground font-display">{photos.length} фото</span>
          </div>

          {photosLoading ? (
            <div className="flex items-center justify-center py-16">
              <Icon name="Loader2" size={32} className="text-cyan animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl flex flex-col items-center justify-center py-16 text-center">
              <Icon name="ImageOff" size={40} className="text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Пока нет загруженных фото</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Добавьте первое фото слева</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:border-cyan/20 transition-all">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-20 h-16 object-cover rounded-xl flex-shrink-0 bg-secondary"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-sm truncate">{photo.title}</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {photo.tag && <span className="text-xs bg-cyan/10 text-cyan border border-cyan/20 px-2 py-0.5 rounded-full font-display">{photo.tag}</span>}
                      {photo.area && <span className="text-xs text-muted-foreground">{photo.area}</span>}
                      {photo.duration && <span className="text-xs text-muted-foreground">· {photo.duration}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    disabled={deletingId === photo.id}
                    className="flex-shrink-0 w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:border-destructive/50 hover:text-destructive transition-all disabled:opacity-50"
                  >
                    {deletingId === photo.id
                      ? <Icon name="Loader2" size={15} className="animate-spin" />
                      : <Icon name="Trash2" size={15} />
                    }
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
