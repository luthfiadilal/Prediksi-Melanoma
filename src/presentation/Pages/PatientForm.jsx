import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";

export default function PatientRegistration({ onRegistered }) {
  const [form, setForm] = useState({
    full_name: "",
    birth_date: "",
    gender: "Laki-laki",
    complaint: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("patients")
        .insert([form])
        .select()
        .single();

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pasien berhasil didaftarkan",
        confirmButtonColor: "#ec4899",
      });
      onRegistered?.(data);
      setForm({
        full_name: "",
        birth_date: "",
        gender: "Laki-laki",
        complaint: "",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.message,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-pink-100 transition-all duration-200 hover:shadow-xl max-w-lg mx-auto"
    >
      {/* Judul Form */}
      <div className="text-center mb-4">
        <div className="flex justify-center mb-2">
          <Icon
            icon="mdi:account-plus"
            width="40"
            height="40"
            className="text-pink-500"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Pendaftaran Pasien</h2>
        <p className="text-gray-500 text-sm">
          Silakan isi data pasien dengan lengkap di bawah ini.
        </p>
      </div>

      {/* Nama Lengkap */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lengkap
        </label>
        <input
          name="full_name"
          type="text"
          placeholder="Masukkan nama pasien"
          value={form.full_name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 focus:border-pink-400 focus:ring focus:ring-pink-100 p-3 rounded-lg outline-none transition"
        />
      </div>

      {/* Grid 2 Kolom: Tanggal Lahir & Jenis Kelamin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tanggal Lahir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Lahir
          </label>
          <input
            name="birth_date"
            type="date"
            value={form.birth_date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 focus:border-pink-400 focus:ring focus:ring-pink-100 p-3 rounded-lg outline-none transition"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Kelamin
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 focus:border-pink-400 focus:ring focus:ring-pink-100 p-3 rounded-lg outline-none transition"
          >
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
      </div>

      {/* Keluhan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keluhan Pasien
        </label>
        <textarea
          name="complaint"
          placeholder="Tuliskan keluhan pasien..."
          value={form.complaint}
          onChange={handleChange}
          rows="3"
          className="w-full border border-gray-300 focus:border-pink-400 focus:ring focus:ring-pink-100 p-3 rounded-lg outline-none transition resize-none"
        />
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg shadow-md transition flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            <Icon
              icon="eos-icons:loading"
              className="animate-spin"
              width="20"
              height="20"
            />
            Menyimpan...
          </>
        ) : (
          <>
            <Icon icon="mdi:content-save" width="22" height="22" />
            Simpan
          </>
        )}
      </button>
    </form>
  );
}
