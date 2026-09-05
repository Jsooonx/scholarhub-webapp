import { SocialLink, EnrichmentData, SpecialNotice } from '../enriched';

// ── Romanian MFA + ARICE Shared Data ─────────────────────────────────────────────

const romaniaSocialLinks: SocialLink[] = [
  { label: 'KBRI Bucharest (Indonesian Embassy)', platform: 'instagram', handle: '@indonesiainbucharest', url: 'https://www.instagram.com/indonesiainbucharest/' },
  { label: 'PPI Romania (Indonesian Student Association)', platform: 'instagram', handle: '@ppi.rumania', url: 'https://www.instagram.com/ppi.rumania/' },
  { label: 'PPI Romania (Facebook)', platform: 'website', handle: 'PPI Romania', url: 'https://www.facebook.com/ppirromania/' },
  { label: 'Romanian Embassy in Jakarta', platform: 'instagram', handle: '@romaniainindonesia', url: 'https://www.instagram.com/romaniainindonesia/' },
  { label: 'Romanian Embassy Jakarta (Official Site)', platform: 'website', handle: 'jakarta.mae.ro', url: 'https://jakarta.mae.ro/en' },
  { label: 'Study in Romania Portal (MFA Application)', platform: 'website', handle: 'scholarships.studyinromania.gov.ro', url: 'https://scholarships.studyinromania.gov.ro' },
  { label: 'ARICE Official Site', platform: 'website', handle: 'arice.gov.ro', url: 'https://arice.gov.ro' },
];

const romaniaMfaStrategyTips: string[] = [
  'Indonesian applicants MUST go through the Study in Romania portal (scholarships.studyinromania.gov.ro) - not directly to a Romanian university',
  'Choose only 2 Romanian public universities in order of preference. Application is locked after submit - research both before submitting',
  'Apostille is ONLY required for education documents (diplomas, transcripts). Birth cert, passport, photos do NOT need apostille',
  'Mandatory 1-year Romanian language preparatory year for everyone (even for English-taught programs). No bypass.',
  'Plan to self-fund living costs. The ~925 Lei/month stipend (~€185 or ~$200) only covers basic needs if you get free dorm. Without dorm, you need €300-500/month from your own pocket.',
  'Dorm status varies by university - some give free dorm, some partial subsidy, some nothing. Check the specific university housing office before you apply.',
  'Choose cities wisely: Iași (€300-400/month) is most affordable, Bucharest (€500-700) is most expensive. Pick a program in a city you can afford.',
  'PhD applicants: contact a potential Romanian supervisor BEFORE March deadline. MFA provides zero help finding one. Securing their agreement in principle is your responsibility.',
  'Check your portal account for results, not just email. Results traditionally come mid-July but have been delayed in past cycles.',
];

const romaniaAriceSpecialNotice: SpecialNotice = {
  badge: '🇮🇩 PANDUAN KHUSUS PELAMAR INDONESIA',
  title: 'Jalur Resmi Pengajuan Rekomendasi (Surekom) & Nota Verbal via KBRI Bucharest',
  actionButton: {
    label: 'Instagram KBRI Bucharest',
    url: 'https://www.instagram.com/indonesiainbucharest/',
  },
  items: [
    '**Wajib Pantau Instagram KBRI Bucharest (@indonesiainbucharest)**: KBRI Bucharest memfasilitasi penerbitan Surat Rekomendasi (*Surekom*) resmi dan Nota Verbal diplomatik yang menjadi berkas wajib seleksi ARICE. Pastikan memantau jadwal dan pengumuman pembukaan di akun Instagram resmi KBRI.',
    '**Kirim Seluruh Berkas Lengkap via Email ke KBRI**: Pelamar Indonesia **tidak perlu mencari rekomendasi entitas ekonomi Rumania secara mandiri**. Cukup kumpulkan seluruh berkas persyaratan ARICE (Form Annex 1, 2, dan 3 yang telah diisi & ditandatangani, ijazah & transkrip terjemahan tersumpah/apostille, surat keterangan sehat, CV, paspor) lalu kirimkan via email langsung ke KBRI sebelum batas deadline internal yang ditentukan KBRI.',
    '**KBRI Menangani Surekom, Nota Verbal, & Pengiriman ke ARICE**: Jika berkas memenuhi persyaratan, KBRI Bucharest akan menerbitkan Surat Rekomendasi + Nota Verbal diplomatik. Selanjutnya, **pihak KBRI yang akan mengirimkan langsung seluruh berkas pendaftaran Anda ke panitia ARICE pusat (burse2026@arice.gov.ro / tahun berjalan) dan men-CC email pribadi Anda**. Anda tidak perlu mengirim email terpisah ke pihak ARICE.',
    '**Catatan Evaluasi / Kesempatan Revisi Berkas (Second Chance)**: Berdasarkan pengalaman seleksi pendaftar (intake 2026), jika terdapat berkas yang kurang atau keliru saat diverifikasi oleh KBRI, pelamar sempat diberikan kesempatan untuk memperbaiki dengan batas waktu khusus dari KBRI.',
  ],
  note: '⚠️ **Penting untuk Diingat**: Kebijakan kesempatan revisi berkas (*second chance*) di atas merupakan pengalaman seleksi tahun sebelumnya. Kebijakan ini dapat berubah sewaktu-waktu di masa mendatang (KBRI bisa saja menerapkan sistem gugur langsung tanpa toleransi revisi). Pastikan seluruh dokumen Anda sudah 100% lengkap, rapi, dan sesuai ketentuan sejak pertama kali dikirimkan ke KBRI!',
};

const romaniaAriceStrategyTips: string[] = [
  'Jalur Pelamar Indonesia: Kirim berkas lengkap ke KBRI Bucharest (pantau IG @indonesiainbucharest) untuk penerbitan Surekom + Nota Verbal diplomatik. KBRI akan langsung submit ke ARICE & men-CC email Anda.',
  'Batas Waktu Internal KBRI: Deadline pengumpulan berkas ke KBRI Bucharest biasanya ditutup lebih awal dari batas akhir resmi ARICE (12 Juni 2026). Selalu pantau timeline di Instagram KBRI.',
  'Semua 3 formulir lampiran wajib diisi lengkap & ditandatangani (format PDF): Annex 1 (Formulir ARICE), Annex 2 (Formulir Kementerian Pendidikan Rumania), Annex 3 (Surat Pernyataan).',
  'Dokumen pendidikan (Ijazah & Transkrip) wajib diterjemahkan tersumpah ke Bahasa Rumania, Inggris, atau Prancis, serta dilegalisir/Apostille Kemenkumham.',
  'Bidang studi prioritas: Ekonomi & Bisnis, Ilmu Pertanian, Sains Terapan/Teknik, serta Minyak & Gas. Bidang di luar prioritas hanya diproses jika kuota masih tersisa.',
  'ARICE hanya menyediakan 40 kuota untuk seluruh pelamar non-EU di dunia. Seleksi murni berbasis portofolio berkas dan nilai akademik tanpa tes tertulis/wawancara.',
  'Pastikan dokumen lengkap & valid sejak pertama kali submit. Jangan bergantung pada toleransi perbaikan berkas susulan karena kebijakan evaluasi KBRI dapat diperketat sewaktu-waktu.',
];

const romaniaDifferentiators: { label: string; description: string }[] = [
  {
    label: 'Real Stipend: 925 Lei/Month (~€185 or ~$200)',
    description: 'The actual amount awardees receive is 925 Lei per month. Enough for basic needs ONLY if you get a free dorm. Without dorm, you need to self-fund €300-500/month from personal savings.',
  },
  {
    label: 'Dormitory Varies Per University (Not Guaranteed Free)',
    description: 'Each Romanian university decides its own dorm policy: some give free dorm, some partial subsidy, some nothing (you pay private rent €150-300/month). Check housing office before applying.',
  },
  {
    label: 'Apostille Only for Education Documents',
    description: 'Apostille is required ONLY for diplomas, transcripts, and birth certificate at the REGISTRATION phase. Passport copies, photos, and ID cards do NOT need apostille.',
  },
  {
    label: 'Mandatory Romanian Language Year',
    description: 'Even for English-taught programs, all non-Romanian speakers must complete 1-year preparatory language course before starting their degree. No bypass, no exemption (except B1 certificate or 4+ years in Romanian school).',
  },
  {
    label: '2-University Choice Limit',
    description: 'You can only choose 2 Romanian public universities in order of preference. Application is LOCKED after submit - cannot add or change anything later.',
  },
  {
    label: 'Two Separate Timelines (MFA vs ARICE)',
    description: 'MFA opens mid-February, deadline end of March, results mid-July. ARICE opens May, deadline mid-June, results September. Do not confuse them.',
  },
  {
    label: 'PhD Needs Supervisor in Advance',
    description: 'For PhD: must contact a Romanian doctoral school professor willing to sponsor you BEFORE the deadline. Both MFA and ARICE provide zero help finding supervisors.',
  },
  {
    label: 'All Stipends Stop in Summer (Bachelor/Master)',
    description: 'Bachelor and Master stipends stop during summer vacation (July-September). Only PhD and residency awardees receive year-round stipends.',
  },
  {
    label: 'Travel Costs NOT Covered',
    description: 'International flight to Romania AND domestic transport from arrival point to your university are NOT covered by the scholarship.',
  },
  {
    label: '30-Day Post-Graduation Coverage',
    description: 'All scholarship benefits continue for 30 days after graduation for programs lasting at least one year.',
  },
];

export const romaniaEnrichment: Record<string, EnrichmentData> = {
  // ── Romanian MFA Scholarship ──
  'romanian-government-mfa-scholarship-non-eu-citizens': {
    slug: 'romanian-government-mfa-scholarship-non-eu-citizens',
    socialLinks: romaniaSocialLinks,
    strategyTips: romaniaMfaStrategyTips,
    differentiators: romaniaDifferentiators,
  },

  // ── Romanian ARICE Scholarship ──
  'romanian-government-arice-scholarship': {
    slug: 'romanian-government-arice-scholarship',
    specialNotice: romaniaAriceSpecialNotice,
    socialLinks: romaniaSocialLinks,
    strategyTips: romaniaAriceStrategyTips,
    differentiators: romaniaDifferentiators,
  },
};
