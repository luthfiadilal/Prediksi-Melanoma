import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DetailModal from "./DetailModal";

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
  } catch (error) {
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
  const [sortConfig, setSortConfig] = useState({
    key: "examination_date",
    direction: "desc",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [doctor, setDoctor] = useState(
    propDoctor || JSON.parse(localStorage.getItem("doctorData"))
  );

  // 🔹 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
          model_prediction,
          confidence_score,
          image_url,
          notes,
          patients (id, full_name, gender, birth_date, complaint),
          doctors (full_name)
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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const openModal = (item) => {
    setSelectedHistory(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHistory(null);
  };

  const sortedData = [...history].sort((a, b) => {
    const { key, direction } = sortConfig;
    const aValue = key.includes(".")
      ? key.split(".").reduce((o, i) => o[i], a)
      : a[key];
    const bValue = key.includes(".")
      ? key.split(".").reduce((o, i) => o[i], b)
      : b[key];
    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    item.patients?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 🔹 Navbar */}
      <nav
        className={`w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm py-3 px-4 sm:px-6 flex justify-between items-center fixed top-0 left-0 z-20 transition-all duration-300 ${
          isModalOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon
            icon="mdi:skin"
            width="28"
            height="28"
            className="text-pink-600"
          />
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
            className="text-gray-700 hover:text-pink-600 font-medium transition"
          >
            Riwayat
          </button>
          {doctor && (
            <>
              <span className="text-gray-700 font-medium">
                {doctor.full_name}
              </span>
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
          <Icon
            icon={menuOpen ? "mdi:close" : "mdi:menu"}
            width="28"
            height="28"
          />
        </button>
      </nav>

      {/* 🔹 Main Content */}
      <div
        className={`pt-24 px-3 sm:px-8 max-w-6xl mx-auto bg-white transition-all duration-300 ${
          isModalOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Riwayat Pemeriksaan
        </h2>

        <div className="mb-4 flex justify-start">
          <input
            type="text"
            placeholder="Cari nama pasien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200 mb-6">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-pink-100 text-gray-900">
              <tr>
                {[
                  { key: "id_examination", label: "ID Pasien" },
                  { key: "patients.full_name", label: "Nama Pasien" },
                  { key: "doctors.full_name", label: "Dokter" },
                  { key: "examination_date", label: "Tanggal" },
                  { key: "model_prediction", label: "Prediksi" },
                  { key: "confidence_score", label: "Confidence" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-pink-200 transition select-none"
                  >
                    {col.label}{" "}
                    {sortConfig.key === col.key && (
                      <Icon
                        icon={
                          sortConfig.direction === "asc"
                            ? "mdi:arrow-up"
                            : "mdi:arrow-down"
                        }
                        className="inline-block ml-1 text-pink-700"
                        width="16"
                        height="16"
                      />
                    )}
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold">Gambar</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr
                    key={item.id_examination}
                    onClick={() => openModal(item)}
                    className="hover:bg-pink-50 transition cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.id_examination}
                    </td>
                    <td className="px-4 py-3">{item.patients?.full_name}</td>
                    <td className="px-4 py-3">{item.doctors?.full_name}</td>
                    <td className="px-4 py-3">
                      {formatDateTime(item.examination_date)}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        item.model_prediction === "Melanoma"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.model_prediction}
                    </td>
                    <td className="px-4 py-3">{item.confidence_score}%</td>
                    <td className="px-4 py-3">
                      <img
                        src={item.image_url}
                        alt="hasil"
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden space-y-4 mb-6">
          {currentItems.length === 0 ? (
            <p className="text-center text-gray-500">
              Tidak ada data ditemukan.
            </p>
          ) : (
            currentItems.map((item) => (
              <div
                key={item.id_examination}
                onClick={() => openModal(item)}
                className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url}
                    alt="hasil"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {item.patients?.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Dokter: {item.doctors?.full_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(item.examination_date)}
                    </p>
                    <p
                      className={`font-semibold mt-1 ${
                        item.model_prediction === "Melanoma"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.model_prediction} ({item.confidence_score}%)
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔹 Pagination (Universal for Desktop & Mobile) */}
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
                className={`px-3 py-1 rounded-md border text-sm font-medium transition ${
                  currentPage === i + 1
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

      {/* Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedHistory}
      />
    </div>
  );
}
