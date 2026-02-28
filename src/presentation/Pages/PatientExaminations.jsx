import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { Icon } from "@iconify/react";
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
    } catch {
        return dateString;
    }
};

const getPredictionColor = (pred) => {
    if (pred === "Melanoma") return "text-red-600";
    if (pred === "NonSkin") return "text-gray-500";
    return "text-green-600";
};

export default function PatientExaminations() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [examinations, setExaminations] = useState([]);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [notification, setNotification] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const doctor = JSON.parse(localStorage.getItem("doctorData"));

    useEffect(() => {
        if (!doctor) {
            navigate("/login");
            return;
        }
        fetchData();
    }, [patientId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch patient info
            const { data: patientData, error: pErr } = await supabase
                .from("patients")
                .select("*")
                .eq("id", patientId)
                .single();

            if (pErr) throw pErr;
            setPatient(patientData);

            // Fetch examinations for this patient
            const { data: examData, error: eErr } = await supabase
                .from("examinations")
                .select(
                    `
          id_examination,
          examination_date,
          model_prediction,
          confidence_score,
          image_url,
          notes,
          complaint,
          patients (id, full_name, gender, birth_date),
          doctors (full_name)
        `
                )
                .eq("patient_id", patientId)
                .order("examination_date", { ascending: false });

            if (eErr) throw eErr;
            setExaminations(examData);
        } catch (err) {
            console.error(err);
            Swal.fire("Gagal", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id_examination) => {
        e.stopPropagation();
        setNotification(null);

        const result = await Swal.fire({
            title: "Hapus Data?",
            text: "Data pemeriksaan akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#fb7185",
            cancelButtonColor: "#94a3b8",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            customClass: { popup: "rounded-xl" },
        });

        if (result.isConfirmed) {
            try {
                const { error } = await supabase
                    .from("examinations")
                    .delete()
                    .eq("id_examination", id_examination);

                if (error) throw error;

                setExaminations((prev) =>
                    prev.filter((ex) => ex.id_examination !== id_examination)
                );

                setNotification({
                    type: "success",
                    title: "Berhasil Dihapus",
                    message: "Data riwayat pemeriksaan telah dihapus.",
                });
                setTimeout(() => setNotification(null), 3000);
            } catch (err) {
                console.error(err);
                setNotification({
                    type: "error",
                    title: "Gagal Menghapus",
                    message: "Terjadi kesalahan server.",
                });
                setTimeout(() => setNotification(null), 3000);
            }
        }
    };

    const openModal = (exam) => {
        setSelectedExam(exam);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedExam(null);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("supabaseSession");
        localStorage.removeItem("doctorData");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 relative overflow-x-hidden">
            {/* Animasi */}
            <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.4s ease-out forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.35s ease-out forwards; }
      `}</style>

            {/* Toast */}
            {notification && (
                <div className="fixed top-24 right-6 z-50 animate-slide-in">
                    <div
                        className={`flex items-start gap-4 px-6 py-4 bg-white rounded-xl shadow-2xl border-l-4 max-w-sm w-full ${notification.type === "success"
                            ? "border-emerald-500"
                            : "border-rose-500"
                            }`}
                    >
                        <div className="flex-shrink-0">
                            {notification.type === "success" ? (
                                <Icon
                                    icon="mdi:check-circle-outline"
                                    className="text-emerald-500"
                                    width="24"
                                    height="24"
                                />
                            ) : (
                                <Icon
                                    icon="mdi:alert-circle-outline"
                                    className="text-rose-500"
                                    width="24"
                                    height="24"
                                />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3
                                className={`font-bold text-sm ${notification.type === "success"
                                    ? "text-emerald-800"
                                    : "text-rose-800"
                                    }`}
                            >
                                {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                {notification.message}
                            </p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <Icon icon="mdi:close" width="16" height="16" />
                        </button>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <nav
                className={`w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm py-3 px-4 sm:px-6 flex justify-between items-center fixed top-0 left-0 z-20 transition-all duration-300 ${isModalOpen ? "blur-sm pointer-events-none" : ""
                    }`}
            >
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:skin" width="28" height="28" className="text-pink-600" />
                    <button
                        onClick={() => navigate("/")}
                        className="text-base sm:text-lg font-bold text-gray-800 hover:text-pink-600 transition"
                    >
                        Melanoma Detection
                    </button>
                </div>

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

                <button
                    className="sm:hidden text-gray-800 focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <Icon icon={menuOpen ? "mdi:close" : "mdi:menu"} width="28" height="28" />
                </button>
            </nav>

            {/* Main Content */}
            <div
                className={`pt-24 px-3 sm:px-8 max-w-5xl mx-auto transition-all duration-300 ${isModalOpen ? "blur-sm pointer-events-none" : ""
                    }`}
            >
                {/* Tombol Kembali */}
                <button
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-800 font-medium mb-6 transition"
                >
                    <Icon icon="mdi:arrow-left" width="20" height="20" />
                    Kembali ke Daftar Pasien
                </button>

                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <Icon
                            icon="mdi:loading"
                            className="animate-spin text-pink-400"
                            width="48"
                            height="48"
                        />
                    </div>
                ) : (
                    <>
                        {/* Info Pasien */}
                        {patient && (
                            <div className="animate-fade-up bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-5 mb-8 flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold text-2xl flex-shrink-0">
                                    {patient.full_name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {patient.full_name}
                                    </h2>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1 text-sm text-gray-600">
                                        <span>
                                            <span className="font-medium">Jenis Kelamin:</span>{" "}
                                            {patient.gender === "L"
                                                ? "Laki-laki"
                                                : patient.gender === "P"
                                                    ? "Perempuan"
                                                    : patient.gender || "-"}
                                        </span>
                                        {patient.birth_date && (
                                            <span>
                                                <span className="font-medium">Tgl Lahir:</span>{" "}
                                                {new Date(patient.birth_date).toLocaleDateString(
                                                    "id-ID",
                                                    { year: "numeric", month: "long", day: "numeric" }
                                                )}
                                            </span>
                                        )}

                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Judul Section */}
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Icon
                                icon="mdi:clipboard-text-outline"
                                className="text-pink-500"
                                width="22"
                                height="22"
                            />
                            Riwayat Pemeriksaan
                            <span className="ml-2 bg-pink-100 text-pink-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                {examinations.length} data
                            </span>
                        </h3>

                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200 mb-6 animate-fade-up">
                            <table className="min-w-full text-sm text-gray-700">
                                <thead className="bg-pink-100 text-gray-900">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            ID Pemeriksaan
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Dokter
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Tanggal
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Prediksi
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Confidence
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold">
                                            Gambar
                                        </th>
                                        <th className="px-4 py-3 text-center font-semibold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examinations.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-8 text-gray-500"
                                            >
                                                Belum ada riwayat pemeriksaan untuk pasien ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        examinations.map((exam) => (
                                            <tr
                                                key={exam.id_examination}
                                                onClick={() => openModal(exam)}
                                                className="hover:bg-pink-50 transition cursor-pointer border-b border-gray-100"
                                            >
                                                <td className="px-4 py-3 font-mono text-gray-500 text-xs">
                                                    #{exam.id_examination}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {exam.doctors?.full_name || "-"}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {formatDateTime(exam.examination_date)}
                                                </td>
                                                <td
                                                    className={`px-4 py-3 font-semibold ${getPredictionColor(
                                                        exam.model_prediction
                                                    )}`}
                                                >
                                                    {exam.model_prediction}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {exam.confidence_score}%
                                                </td>
                                                <td className="px-4 py-3">
                                                    <img
                                                        src={exam.image_url}
                                                        alt="hasil"
                                                        className="w-14 h-14 object-cover rounded-md border"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={(e) =>
                                                            handleDelete(e, exam.id_examination)
                                                        }
                                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                                                        title="Hapus"
                                                    >
                                                        <Icon
                                                            icon="mdi:trash-can-outline"
                                                            width="20"
                                                            height="20"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block sm:hidden space-y-3 mb-10">
                            {examinations.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">
                                    Belum ada riwayat pemeriksaan.
                                </p>
                            ) : (
                                examinations.map((exam) => (
                                    <div
                                        key={exam.id_examination}
                                        onClick={() => openModal(exam)}
                                        className="border border-gray-200 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:shadow-md bg-white transition relative animate-fade-up"
                                    >
                                        <img
                                            src={exam.image_url}
                                            alt="hasil"
                                            className="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-mono text-gray-400">
                                                #{exam.id_examination}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-700 truncate">
                                                Dokter: {exam.doctors?.full_name || "-"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDateTime(exam.examination_date)}
                                            </p>
                                            <p
                                                className={`text-sm font-semibold mt-0.5 ${getPredictionColor(
                                                    exam.model_prediction
                                                )}`}
                                            >
                                                {exam.model_prediction} ({exam.confidence_score}%)
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, exam.id_examination)}
                                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                                            title="Hapus"
                                        >
                                            <Icon icon="mdi:trash-can-outline" width="18" height="18" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Modal Detail */}
            <DetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                data={selectedExam}
            />
        </div>
    );
}
