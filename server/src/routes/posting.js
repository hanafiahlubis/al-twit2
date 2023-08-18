import express from "express";


const posting = [
    {
        id: 1,
        caption: "Ketua Umum Partai Demokrat Agus Harimurti Yudhoyono alias AHY menanggapi dukungan Ketua Badan Pengembangan Inovasi Strategis Pengurus Besar Nahdlatul Ulama (PBNU) Yenny Wahid terhadapnya sebagai calon wakil presiden bagi Anies Baswedan. AHY menyebut telah menganggap Yenny sebagai sahabatnya.",
        img: "https://statik.tempo.co/data/2023/08/10/id_1227043/1227043_720.jpg"
    }, {
        id: 2,
        caption: "PT Waskita Karya (Persero) Tbk memastikan pembatalan penyertaan modal negara (PMN) senilai Rp 3 triliun tidak berdampak pada proyek-proyek penugasan pemerintah.",
        img: "https://statik.tempo.co/data/2018/02/09/id_683092/683092_400.jpg"

    }, {
        id: 3,
        caption: "Beramai-Ramai Membunuh Kebenaran, Agar Bersama-Sama Hidup Dalam Aib! Oleh: Letjen TNI (Purn) Kiki Syahnakri, Tokoh Militer Indonesia. Tentara musuh memasuki sebuah desa. Mereka menodai kehormatan....",
        img: "https://statik.tempo.co/data/2018/02/09/id_683092/683092_400.jpg"

    }];
const router = express.Router();

router.get("/all", (_req, res) => {
    res.json(posting)
});
export default router;
