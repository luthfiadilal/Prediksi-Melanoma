import { useState, useRef } from "react";
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

  // --- State untuk fitur pencarian pasien ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- Mencari pasien di database ---
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedPatient(null);
    setShowDropdown(false);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("id, full_name, birth_date, gender, complaint")
          .ilike("full_name", `%${query}%`)
          .limit(10);

        if (error) throw error;
        setSearchResults(data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Gagal mencari pasien:", err.message);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  // --- Pilih pasien dari hasil pencarian, isi form otomatis ---
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchQuery(patient.full_name);
    setShowDropdown(false);
    setForm({
      full_name: patient.full_name,
      birth_date: patient.birth_date || "",
      gender: patient.gender || "Laki-laki",
      complaint: "",          // keluhan dikosongkan karena ini kunjungan baru
    });
  };

  // --- Reset ke form kosong (pasien baru) ---
  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedPatient(null);
    setSearchResults([]);
    setShowDropdown(false);
    setForm({ full_name: "", birth_date: "", gender: "Laki-laki", complaint: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let patientData;

      if (selectedPatient) {
        // Pasien lama — pakai data yang sudah ada, update complaint jika perlu
        patientData = { ...selectedPatient, complaint: form.complaint };
      } else {
        // Pasien baru — insert ke tabel patients
        const { data, error } = await supabase
          .from("patients")
          .insert([form])
          .select()
          .single();

        if (error) throw error;
        patientData = data;
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: selectedPatient
          ? "Data pasien lama berhasil dimuat"
          : "Pasien baru berhasil didaftarkan",
        confirmButtonColor: "#ec4899",
      });

      onRegistered?.(patientData);

      // Reset form setelah submit
      setForm({ full_name: "", birth_date: "", gender: "Laki-laki", complaint: "" });
      setSearchQuery("");
      setSelectedPatient(null);
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
          Cari pasien lama atau daftarkan pasien baru di bawah ini.
        </p>
      </div>

      {/* ===== SEARCH PASIEN ===== */}
      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 space-y-2">
        <label className="block text-sm font-semibold text-pink-700 mb-1 flex items-center gap-1">
          <Icon icon="mdi:magnify" width="18" />
          Cari Pasien yang Sudah Pernah Periksa
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Ketik nama pasien untuk mencari..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            className="w-full border border-pink-300 focus:border-pink-500 focus:ring focus:ring-pink-100 p-3 pr-10 rounded-lg outline-none transition bg-white"
          />
          {/* Icon kanan: loading / clear */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {searching ? (
              <Icon icon="eos-icons:loading" className="animate-spin text-pink-400" width="20" />
            ) : searchQuery ? (
              <button type="button" onClick={handleClearSearch} className="text-gray-400 hover:text-red-400 transition">
                <Icon icon="mdi:close-circle" width="20" />
              </button>
            ) : (
              <Icon icon="mdi:magnify" className="text-pink-300" width="20" />
            )}
          </span>

          {/* Dropdown hasil pencarian */}
          {showDropdown && searchResults.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-pink-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
              {searchResults.map((p) => (
                <li
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-pink-50 cursor-pointer transition border-b last:border-b-0 border-pink-50"
                >
                  <Icon icon="mdi:account-circle" width="32" className="text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{p.full_name}</p>
                    <p className="text-xs text-gray-400">
                      {p.gender} &bull;{" "}
                      {p.birth_date
                        ? new Date(p.birth_date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                        : "Tgl lahir tidak diketahui"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pesan tidak ada hasil */}
          {showDropdown && !searching && searchResults.length === 0 && searchQuery.length >= 2 && (
            <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-pink-200 rounded-xl shadow-lg px-4 py-3 text-sm text-gray-400 text-center">
              Pasien tidak ditemukan. Silakan daftarkan sebagai pasien baru.
            </div>
          )}
        </div>

        {selectedPatient && (
          <p className="text-xs text-pink-600 font-medium flex items-center gap-1 mt-1">
            <Icon icon="mdi:check-circle" width="15" />
            Data pasien lama dimuat — keluhan dapat diperbarui di bawah
          </p>
        )}
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
          readOnly={!!selectedPatient}
          className={`w-full border p-3 rounded-lg outline-none transition ${selectedPatient
              ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
              : "border-gray-300 focus:border-pink-400 focus:ring focus:ring-pink-100"
            }`}
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
            readOnly={!!selectedPatient}
            className={`w-full border p-3 rounded-lg outline-none transition ${selectedPatient
                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                : "border-gray-300 focus:border-pink-400 focus:ring focus:ring-pink-100"
              }`}
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
            disabled={!!selectedPatient}
            className={`w-full border p-3 rounded-lg outline-none transition ${selectedPatient
                ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                : "border-gray-300 focus:border-pink-400 focus:ring focus:ring-pink-100"
              }`}
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
          {selectedPatient && (
            <span className="ml-2 text-xs text-pink-500 font-normal">(isi keluhan kunjungan ini)</span>
          )}
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
            <Icon icon="eos-icons:loading" className="animate-spin" width="20" height="20" />
            Menyimpan...
          </>
        ) : (
          <>
            <Icon icon={selectedPatient ? "mdi:account-check" : "mdi:content-save"} width="22" height="22" />
            {selectedPatient ? "Lanjutkan dengan Pasien Ini" : "Daftarkan Pasien Baru"}
          </>
        )}
      </button>
    </form>
  );
}
