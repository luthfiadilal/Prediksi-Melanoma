import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export default function HistoryPage({
  doctor: propDoctor,
  handleLogout: propLogout,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [doctor] = useState(
    propDoctor || JSON.parse(localStorage.getItem("doctorData"))
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleLogout =
    propLogout ||
    (async () => {
      await supabase.auth.signOut();
      localStorage.removeItem("supabaseSession");
      localStorage.removeItem("doctorData");
      navigate("/login");
    });

  useEffect(() => {
    if (!doctor) {
      navigate("/login");
      return;
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("examinations")
        .select(
          `
          id_examination,
          examination_date,
          patients (id, full_name, gender, birth_date)
        `
        )
        .order("examination_date", { ascending: false });

      if (error) throw error;
      setHistory(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", err.message, "error");
    }
  };

  // Group unik per pasien
  const filteredData = history.filter((item) =>
    item.patients?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const patientMap = {};
  filteredData.forEach((item) => {
    const pid = item.patients?.id || "unknown";
    if (!patientMap[pid]) {
      patientMap[pid] = {
        patient: item.patients,
        count: 0,
        latestDate: item.examination_date,
      };
    }
    patientMap[pid].count += 1;
    if (item.examination_date > patientMap[pid].latestDate) {
      patientMap[pid].latestDate = item.examination_date;
    }
  });

  const patientList = Object.values(patientMap);

  const totalPages = Math.ceil(patientList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = patientList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 relative overflow-x-hidden">
      {/* Animasi CSS */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.3s ease-out forwards; }
      `}</style>

      {/* Navbar */}
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm py-3 px-4 sm:px-6 flex justify-between items-center fixed top-0 left-0 z-20">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:skin" width="28" height="28" className="text-pink-600" />
          <button
            onClick={() => navigate("/")}
            className="text-base sm:text-lg font-bold text-gray-800 hover:text-pink-600 transition"
          >
            Melanoma Detection
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          <button
            onClick={() => navigate("/about")}
            className="text-gray-700 hover:text-pink-600 font-medium transition"
          >
            Tentang
          </button>
          <button
            onClick={() => navigate("/history")}
            className="text-pink-600 font-semibold transition"
          >
            Riwayat
          </button>
          {doctor && (
            <>
              <span className="text-gray-700 font-medium">{doctor.full_name}</span>
              <button
                onClick={handleLogout}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-medium transition"
              >
                Keluar
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-gray-800 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon icon={menuOpen ? "mdi:close" : "mdi:menu"} width="28" height="28" />
        </button>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-3 sm:px-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Riwayat Pemeriksaan
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Pilih pasien untuk melihat riwayat pemeriksaannya
        </p>

        {/* Search */}
        <div className="mb-5 flex justify-start">
          <div className="relative w-full sm:w-72">
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="18"
              height="18"
            />
            <input
              type="text"
              placeholder="Cari nama pasien..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg pl-9 pr-4 py-2 w-full focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>
        </div>

        {/* ==== Desktop Table ==== */}
        <div className="hidden sm:block overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200 mb-6 animate-fade-up">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-pink-100 text-gray-900">
              <tr>
                <th className="px-5 py-3 text-left font-semibold w-10">#</th>
                <th className="px-5 py-3 text-left font-semibold">Nama Pasien</th>
                <th className="px-5 py-3 text-left font-semibold">Jenis Kelamin</th>
                <th className="px-5 py-3 text-left font-semibold">Pemeriksaan Terakhir</th>
                <th className="px-5 py-3 text-left font-semibold">Jumlah Riwayat</th>
                <th className="px-5 py-3 text-center font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    Tidak ada data pasien ditemukan.
                  </td>
                </tr>
              ) : (
                currentPatients.map(({ patient, count, latestDate }, idx) => {
                  const pid = patient?.id || "unknown";
                  return (
                    <tr
                      key={pid}
                      onClick={() => navigate(`/history/${pid}`)}
                      className="hover:bg-pink-50 transition cursor-pointer border-b border-gray-100 group"
                    >
                      <td className="px-5 py-4 text-gray-400 text-sm">
                        {indexOfFirstItem + idx + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm flex-shrink-0 group-hover:bg-pink-200 transition">
                            {patient?.full_name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="font-semibold text-gray-800">
                            {patient?.full_name || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {patient?.gender === "L"
                          ? "Laki-laki"
                          : patient?.gender === "P"
                            ? "Perempuan"
                            : patient?.gender || "-"}
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-sm">
                        {formatDateTime(latestDate)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-2 py-1 rounded-full">
                          {count} pemeriksaan
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Icon
                          icon="mdi:chevron-right"
                          className="inline-block text-pink-400 group-hover:text-pink-600 transition"
                          width="22"
                          height="22"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ==== Mobile Card View ==== */}
        <div className="block sm:hidden space-y-3 mb-6">
          {currentPatients.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Tidak ada data pasien ditemukan.
            </p>
          ) : (
            currentPatients.map(({ patient, count, latestDate }) => {
              const pid = patient?.id || "unknown";
              return (
                <div
                  key={pid}
                  onClick={() => navigate(`/history/${pid}`)}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white hover:shadow-md hover:border-pink-300 transition cursor-pointer flex items-center gap-4 animate-fade-up"
                >
                  <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg flex-shrink-0">
                    {patient?.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">
                      {patient?.full_name || "-"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {patient?.gender === "L"
                        ? "Laki-laki"
                        : patient?.gender === "P"
                          ? "Perempuan"
                          : patient?.gender || "-"}{" "}
                      •{" "}
                      <span className="text-pink-600 font-medium">
                        {count} pemeriksaan
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Terakhir: {formatDateTime(latestDate)}
                    </p>
                  </div>
                  <Icon
                    icon="mdi:chevron-right"
                    className="text-pink-400 flex-shrink-0"
                    width="22"
                    height="22"
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border text-gray-700 disabled:opacity-50 hover:bg-pink-100 transition"
            >
              <Icon icon="mdi:chevron-left" width="20" height="20" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-md border text-sm font-medium transition ${currentPage === i + 1
                  ? "bg-pink-500 text-white border-pink-500"
                  : "hover:bg-pink-100 text-gray-700"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border text-gray-700 disabled:opacity-50 hover:bg-pink-100 transition"
            >
              <Icon icon="mdi:chevron-right" width="20" height="20" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
