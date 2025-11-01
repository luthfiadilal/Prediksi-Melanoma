import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

export default function RegisterDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Buat akun di Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        alert("Gagal registrasi: " + error.message);
        setLoading(false);
        return;
      }

      // 3️⃣ Simpan data dokter ke tabel doctors
      const { error: insertError } = await supabase.from("doctors").insert([
        {
          id: data.user.id, // id dari Supabase Auth
          full_name: form.full_name,
          email: form.email,
          password_hash: form.password,
        },
      ]);

      if (insertError) {
        alert("Gagal menyimpan data dokter: " + insertError.message);
      } else {
        alert("Registrasi berhasil! Silakan login.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error registrasi:", err);
      alert("Terjadi kesalahan, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-pink-600">
          Registrasi Dokter
        </h2>

        <input
          type="text"
          name="full_name"
          placeholder="Nama Lengkap"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-700 text-white font-semibold py-2 rounded"
        >
          {loading ? "Mendaftarkan..." : "Daftar"}
        </button>

        <p className="text-center text-sm mt-2">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-pink-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
