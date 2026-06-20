const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/scholarships.json', 'utf8'));
const s = data.scholarships;

// Heuristic: replicate src/lib/scholarships.ts lines 1046-1250 logic.
const LOGO_RULES = [
  // Universities with logo assets
  [/university of toronto|\buoft\b/, 'UofT.png'],
  [/mcgill/, 'McGill.png'],
  [/british columbia|\bubc\b/, 'UBC.png'],
  [/mcmaster/, 'McMaster.png'],
  [/waterloo/, 'Waterloo.png'],
  [/national university of singapore|\bnus\b/, 'NUS.png'],
  [/nanyang/, 'NTU.png'],
  [/\bsmu\b|singapore management/, 'SMU.png'],
  [/\bsutd\b|singapore university of technology/, 'SUTD.png'],
  [/kyoto/, 'KyotoU.png'],
  [/tokyo/, 'UofTokyo.png'],
  [/osaka/, 'Osaka.png'],
  [/tohoku/, 'Tohoku.png'],
  [/tokyo institute|tokyo tech/, 'TokyoTech.png'],
  [/heidelberg/, 'HeidelbergU.png'],
  [/\blmu\b|ludwig-maximilians/, 'LMU.png'],
  [/technical university of munich|\btum\b|münchen/, 'TUM.png'],
  [/freie universität berlin|fu berlin/, 'FUBerlin.png'],
  [/\bkit\b|karlsruhe institute/, 'KIT.png'],
  [/paris-saclay/, 'ParisSaclay.png'],
  [/\bpsl\b|paris sciences/, 'PSLU.png'],
  [/polytechnique de paris/, 'InstitutPolytechniqueDeParis.png'],
  [/sorbonne/, 'Sorbonne.png'],
  [/middle east technical|\bmetu\b/, 'METU.png'],
  [/istanbul technical|\bitu\b/, 'ITU.png'],
  [/bogazici|boğaziçi/, 'Bogazici.png'],
  [/hacettepe/, 'Hacettepe.png'],
  [/koc university|koç university/, 'Koc.png'],
  [/oxford/, 'Oxford.png'],
  [/cambridge/, 'Cambridge.png'],
  [/imperial college/, 'ImperialCollegeLondon.png'],
  [/edinburgh/, 'Edinburgh.png'],
  [/\bucl\b|university college london/, 'UCL.png'],
  [/melbourne/, 'Melbourne.png'],
  [/sydney/, 'Sydney.png'],
  [/\banu\b|australian national/, 'ANU.png'],
  [/monash/, 'Monash_AUS.png'],
  [/queensland|\buq\b/, 'UQ.png'],
  [/\bunsw\b|new south wales/, 'UNSW.png'],
  [/flinders/, 'Flinders.png'],
  [/griffith/, 'Griffith.png'],
  [/\bsnu\b|seoul national/, 'SNU.png'],
  [/\bkaist\b|korea advanced institute of science/, 'KAIST.png'],
  [/yonsei/, 'Yonsei.png'],
  [/korea university/, 'KoreaU.png'],
  [/\bpostech\b|pohang university/, 'POSTECH.png'],
  [/tu delft|delft university/, 'TUDelft.png'],
  [/vrije universiteit amsterdam|vu amsterdam/, 'VUAmsterdam.png'],
  [/university of amsterdam|\buva\b/, 'UniversityofAmsterdam.png'],
  [/leiden/, 'LeidenU.png'],
  [/groningen|\brug\b/, 'Groningen.png'],
  [/maastricht/, 'Maastricht.png'],
  [/radboud/, 'RadboudU.png'],
  [/sungkyunkwan|\bskku\b/, 'SKKU.png'],
  [/handong/, 'Handong.png'],
  [/uplb|los baños|los banos/, 'UPLB.png'],
  [/upm|putra malaysia/, 'UPM.png'],
  [/ugm|gadjah mada/, 'UGM.png'],
  [/incheon/, 'Incheon.png'],
  [/kdi school|\bkdi\b/, 'KDI.png'],
  [/kyungpook/, 'Kyungpook.png'],
  [/pukyong/, 'Pukyong.png'],
  [/university of seoul/, 'Seoul.png'],
  [/ankara university/, 'AnkaraU.png'],
  [/bayram veli/, 'AnkaraHaciBayramVeliU.png'],
  [/music and fine arts/, 'AnkaraMusicandFineArtsU.png'],
  [/asian institute of technology|\bait\b/, 'AIT.png'],
  [/ens de lyon|ens lyon/, 'ENSdeLyon.png'],
  [/politecnico di milano|\bpolimi\b/, 'Polimi.png'],
  [/sapienza/, 'Sapienza.png'],
  [/tsinghua/, 'Tsinghua.png'],
  [/peking university|peking/, 'Peking.png'],
  [/zhejiang/, 'Zhejiang.png'],
  [/eötvös|\belte\b/, 'ELTE.png'],
  [/semmelweis/, 'Semmelweis.png'],
  [/szeged|\bszte\b/, 'Szeged.png'],
  [/national taiwan university/, 'NTU_Taiwan.png'],
  [/tsing hua|\bnthu\b/, 'NTHU.png'],
  [/chiao tung|\bnycu\b|yang ming/, 'NYCU.png'],
  [/eth zürich|eth zurich|eidgenössische|\beth\b|\bethz\b/, 'ETH.png'],
  [/epfl|école polytechnique fédérale de lausanne/, 'EPFL.png'],
  [/university of zurich|universität zürich|\buzh\b/, 'UZH.png'],
  [/university of auckland|auckland university/, 'Auckland.png'],
  [/university of otago|otago university/, 'Otago.png'],
  [/victoria university of wellington|\bvuw\b/, 'VUW.png'],
  [/trinity college dublin|\btcd\b/, 'TCD.png'],
  [/university college dublin|\bucd\b/, 'UCD.png'],
  [/university college cork|\bucc\b/, 'UCC.png'],
  [/university of copenhagen/, 'Copenhagen.png'],
  [/technical university of denmark|\bdtu\b/, 'DTU_Denmark.png'],
  [/aarhus/, 'Aarhus.png'],
  [/university of oslo|\buio\b/, 'Oslo.png'],
  [/university of bergen|\buib\b/, 'Bergen.png'],
  [/norwegian university of science and technology|\bntnu\b/, 'NTNU.png'],
  [/university of hong kong|\bhku\b/, 'HKU.png'],
  [/chinese university of hong kong|\bcuhk\b/, 'CUHK.png'],
  [/hong kong university of science and technology|\bhkust\b/, 'HKUST.png'],
  [/university of malaya/, 'UM.png'],
  [/universiti kebangsaan|\bukm\b/, 'UKM.png'],
  [/kth royal|\bkth\b/, 'KTH.png'],
  [/lund|lunds universitet/, 'LundU.png'],
  [/uppsala/, 'UppsalaU.png'],
  [/chalmers/, 'Chalmers.png'],
  [/stockholm university/, 'StockholmU.png'],
  [/gothenburg/, 'GothenburgU.png'],
  [/karolinska/, 'Karolinska.png'],
  [/university of geneva|\bunige\b/, 'UNIGE.png'],
  [/helmut veith|tu wien|vienna university of technology/, 'TUWien.png'],
  [/university of helsinki|helsingin yliopisto/, 'Helsinki.png'],
  [/aalto|aalto-yliopisto/, 'Aalto.png'],
  [/tampere/, 'Tampere.png'],
  [/oulu|oulun yliopisto/, 'Oulu.png'],
  [/hanken/, 'Hanken.png'],
  // Romania
  [/transilvania university|unitbv/, 'Transilvania.png'],
  [/west university of timi|timișoara|timisoara|\bwut\b|\buvt\b/, 'WUT.png'],
  [/babeș-bolyai|babes-bolyai|\bubb\b/, 'UBB.png'],
  [/university of bucharest|unibuc/, 'Bucharest.png'],
  // Russia
  [/moscow state university|\bmsu\b/, 'MSU.png'],
  [/saint petersburg state|\bspbu\b|\bspbsu\b/, 'SPbU.png'],
  [/higher school of economics|hse university|\bhse\b/, 'HSE.png'],
  [/bauman moscow|\bbmstu\b/, 'BMSTU.png'],
  [/mgimo university|mgimo/, 'MGIMO.png'],
  [/nust misis|misis/, 'MISIS.png'],
  // Poland
  [/university of warsaw|uniwersytet warszawski|\buw\b/, 'UW.png'],
  [/warsaw university of technology|warsaw unitech/, 'Warsaw_Unitech.png'],
  [/jagiellonian university|\bju\b/, 'JU.png'],
  // Spain
  [/ie university|\bie\b/, 'IE_University.png'],
  [/ie foundation/, 'IE_Foundation.png'],
  [/girona|\budg\b/, 'UdG.png'],
];

const logoFiles = [
  ...fs.readdirSync('public/images/logos/').map(f => f.toLowerCase().replace(/\.(png|svg|jpg|jpeg|webp)$/i, '')),
  ...fs.readdirSync('public/images/programlogos/').map(f => f.toLowerCase().replace(/\.(png|svg|jpg|jpeg|webp)$/i, '')),
];
const logoFilePaths = [
  ...fs.readdirSync('public/images/logos/').map(f => '/images/logos/' + f),
  ...fs.readdirSync('public/images/programlogos/').map(f => '/images/programlogos/' + f),
];

function providerGroupHeuristic(p) {
  p = p.toLowerCase();
  if (p.includes('daad') || p.includes('dlr') || p.includes('studienstiftung') || p.includes('german academic')) return 'germany';
  if (p.includes('mext') || p.includes('monbukagakusho') || p.includes('jasso') || p.includes('japan student services') || p.includes('government of japan') || p.includes('adb') || p.includes('world bank')) return 'japan';
  if (p.includes('turkiye') || p.includes('ytb') || p.includes('burslari')) return 'turkey';
  if (p.includes('chevening') || p.includes('gates cambridge') || p.includes('clarendon') || p.includes('oxford university press') || p.includes('rhodes') || p.includes('commonwealth scholarship')) return 'united-kingdom';
  if (p.includes('australia awards') || p.includes('dfat') || p.includes('lpdp') || p.includes('university of melbourne') || p.includes('university of sydney') || p.includes('australian national') || p.includes('monash') || p.includes('university of queensland') || p.includes('unsw') || p.includes('flinders') || p.includes('griffith')) return 'australia';
  if (p.includes('niied') || p.includes('korean government') || p.includes('gks') || p.includes('koica') || p.includes('korea international cooperation')) return 'south-korea';
  if (p.includes('a*star') || p.includes('astar') || p.includes('singapore a') || p.includes('nus') || p.includes('nanyang') || p.includes('singa')) return 'singapore';
  if (p.includes('eiffel') || p.includes('campus france') || p.includes('french ministry') || p.includes('paris-saclay') || p.includes('paris saclay') || p.includes('sciences po') || p.includes('ens')) return 'france';
  if (p.includes('cpra') || p.includes('postdoctoral research award') || (p.includes('government of canada') && (p.includes('cihr') || p.includes('nserc') || p.includes('sshrc')))) return 'canada';
  if (p.includes('canada') || p.includes('cihr') || p.includes('nserc') || p.includes('sshrc') || p.includes('crtas') || p.includes('cgrs') || p.includes('university of toronto')) return 'canada';
  if (p.includes('fulbright') || p.includes('aminef') || p.includes('knight-hennessy') || p.includes('stanford')) return 'united-states';
  if (p.includes('nuffic') || p.includes('dutch ministry') || p.includes('justus') || p.includes('van effen') || p.includes('university of groningen') || p.includes('university of amsterdam') || p.includes('vrije universiteit amsterdam') || p.includes('vu amsterdam') || p.includes('leiden') || p.includes('maastricht') || p.includes('radboud') || p.includes('tu delft') || p.includes('delft university')) return 'netherlands';
  if (p.includes('vlir') || p.includes('vliruos') || p.includes('belgian') || p.includes('icp connect') || p.includes('ares') || p.includes('master mind') || p.includes('government of flanders') || p.includes('science@leuven') || p.includes('ku leuven')) return 'belgium';
  if (p.includes('erasmus mundus') || p.includes('erasmus+') || p.includes('european commission')) return 'eu';
  if (p.includes('swedish institute') || p.includes('svenska institutet') || p.includes('lund') || p.includes('kth') || p.includes('chalmers') || p.includes('uppsala') || p.includes('stockholm') || p.includes('gothenburg') || p.includes('karolinska')) return 'sweden';
  if (p.includes('maeci') || p.includes('italian government') || p.includes('ministry of foreign affairs and international cooperation') || p.includes('invest your talent')) return 'italy';
  if (p.includes('china scholarship council') || p.includes('csc') || p.includes('mofcom') || p.includes('ministry of commerce')) return 'china';
  if (p.includes('stipendium hungaricum') || p.includes('tempus public foundation') || p.includes('hungarian government')) return 'hungary';
  if (p.includes('taiwan') || p.includes('teco') || p.includes('icdf') || p.includes('huayu') || p.includes('national tsing hua') || p.includes('ministry of education')) return 'taiwan';
  if (p.includes('swiss government') || p.includes('sbfi') || p.includes('seri') || p.includes('swiss confederation') || p.includes('eth zurich') || p.includes('epfl') || p.includes('école polytechnique') || p.includes('university of geneva') || p.includes('unige')) return 'switzerland';
  if (p.includes('oead') || p.includes('austrian agency') || p.includes('österreich') || p.includes('austrian government') || p.includes('austrian academic') || p.includes('tu wien') || p.includes('vienna university of technology')) return 'austria';
  if (p.includes('nokia foundation') || p.includes('university of helsinki') || p.includes('helsingin yliopisto') || p.includes('aalto') || p.includes('aalto-yliopisto') || p.includes('tampere') || p.includes('tuni.fi') || p.includes('oulu') || p.includes('oulun yliopisto') || p.includes('hanken')) return 'finland';
  if (p.includes('manaaki') || p.includes('education new zealand') || p.includes('mfat') || p.includes('new zealand')) return 'new-zealand';
  if (p.includes('government of ireland') || p.includes('hea') || p.includes('research ireland') || p.includes('irish research council') || p.includes('trinity college dublin') || p.includes('university college dublin') || p.includes('ucd global') || p.includes('teagasc') || p.includes('munster technological') || p.includes('maynooth university') || p.includes('royal college of surgeons in ireland') || p.includes('rcsi')) return 'ireland';
  if ((p.includes('danish') && p.includes('ministry')) || p.includes('studyindenmark') || p.includes('denmark')) return 'denmark';
  if (p.includes('studyinnorway') || (p.includes('norway') && p.includes('universities')) || p.includes('bi norwegian')) return 'norway';
  if (p.includes('hong kong phd') || p.includes('hkpf') || p.includes('research grants council') || p.includes('ugc.edu.hk') || p.includes('university of hong kong')) return 'hong-kong';
  if (p.includes('malaysia international') || p.includes('mohe') || (p.includes('malaysian government') && p.includes('scholarship'))) return 'malaysia';
  if (p.includes('spain') || p.includes('aecid') || p.includes('la caixa') || p.includes('caixa') || p.includes('ie university') || p.includes('ie foundation') || p.includes('girona') || p.includes('udg')) return 'spain';
  if (p.includes('nawa') || p.includes('polish national agency') || p.includes('stefan banach') || p.includes('lukasiewicz') || p.includes('łukasiewicz') || p.includes('ignacy') || p.includes('jagiellonian') || p.includes('university of warsaw') || p.includes('warsaw university') || p.includes('national science centre') || p.includes('ncn ') || p.includes('ncn/')) return 'poland';
  if (p.includes('study in romania') || p.includes('scholarships.studyinromania') || p.includes('arice') || p.includes('romanian ministry of foreign') || p.includes('romanian agency for investments') || p.includes('transilvania university') || p.includes('unitbv') || p.includes('west university of timisoara') || p.includes('west university of timișoara') || p.includes('uvt')) return 'romania';
  if (p.includes('open doors') || p.includes('global universities association') || p.includes('rossotrudnichestvo') || p.includes('russian government') || p.includes('government of russia') || p.includes('russian federation') || p.includes('saint petersburg state university') || p.includes('spbu') || p.includes('nust misis') || p.includes('bmstu') || p.includes('bauman moscow') || p.includes('mgimo') || p.includes('hse university') || p.includes('higher school of economics') || p.includes('skoltech') || p.includes('presidential scholarship') || p.includes('presidentskaya') || p.includes('russian ministry')) return 'russia';
  return p.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const PROVIDER_META_KEYS = new Set([
  'germany','japan','turkey','united-kingdom','australia','south-korea','singapore','france',
  'canada','united-states','netherlands','belgium','eu','china','sweden','italy','hungary',
  'taiwan','switzerland','austria','finland','new-zealand','ireland','denmark','norway',
  'hong-kong','malaysia','spain','poland','romania','russia'
]);

// Check provider-group vs providerMeta
const missingMeta = new Map();
s.forEach(x => {
  const g = providerGroupHeuristic(x.provider);
  if (!PROVIDER_META_KEYS.has(g)) {
    const k = `${g}|${x.provider}`;
    missingMeta.set(k, (missingMeta.get(k) || 0) + 1);
  }
});

console.log('=== PROVIDERS WITHOUT providerMeta ENTRY (would fall back to 🌍 on UI) ===');
if (missingMeta.size === 0) console.log('  ✓ All providers map to a known providerMeta group.');
else Array.from(missingMeta.entries()).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log('  ', v, '×', k));
console.log('');

// Detect scholarship entries without a logo at all (no university match, no program logo, no group fallback)
function checkLogo(x) {
  const text = (x.name + ' ' + x.provider).toLowerCase();
  const hasWord = (w) => new RegExp(`\\b${w}\\b`, 'i').test(text);
  // Program logos
  if (text.includes('commonwealth')) return 'commonwealth.png';
  if (text.includes('adb-japan') || text.includes('asian development bank')) return 'adb-jsp.png';
  if (text.includes('joint japan/world bank') || text.includes('world bank')) return 'jjwbgsp.png';
  if (text.includes('chevening')) return 'chevening.png';
  if (text.includes('clarendon')) return 'clarendon.png';
  if (text.includes('gates cambridge')) return 'gatescambridge.png';
  if (text.includes('rhodes')) return 'rhodes.png';
  if (text.includes('erasmus mundus') || text.includes('emjm')) return 'erasmus+.png';
  if (text.includes('eiffel')) return 'franceexcellenceeiffel.png';
  if (text.includes('sciences po') || text.includes('émile boutmy')) return 'sciencepo.png';
  if (text.includes('fulbright')) return 'fulbright.png';
  if (text.includes('studienstiftung')) return 'Studienstiftung.png';
  if (text.includes('australia awards') || text.includes('lpdp-australia')) return 'australiaawards.png';
  if (text.includes('global korea') || text.includes('gks')) return 'gks.png';
  if (text.includes('jasso') || text.includes('monbukagakusho honors')) return 'jasso.png';
  if (text.includes('koica')) return 'koica.png';
  if (text.includes('vlir') || text.includes('vliruos') || text.includes('icp connect')) return 'vliruos.png';
  if (text.includes('ares')) return 'ares.png';
  if (text.includes('master mind') || text.includes('science@leuven') || text.includes('global minds')) return 'KULeuven.png';
  if (text.includes('knight-hennessy') || text.includes('stanford university')) return 'Stanford.png';
  if (text.includes('oead') || text.includes('austrian agency')) return 'OeAD.png';
  if (text.includes('nokia foundation')) return 'NokiaFoundation.png';
  // New program logos (added 2026-06-18)
  if (text.includes('a*star') || text.includes('astar')) return 'astar.png';
  if (text.includes('orange tulip') || text.includes('ots')) return 'orange_tulip.png';
  if (text.includes('holland scholarship') || text.includes('orange knowledge') || text.includes('okp') || text.includes('nl scholarship')) return 'nuffic.png';
  if (text.includes('mofcom')) return 'mofcom_china.png';
  if (text.includes('china scholarship council') || text.includes('belt and road') || text.includes('silk road')) return 'csc_china.png';
  if (text.includes('swedish institute') || text.includes('sisgp') || text.includes('pioneering women in stem') || text.includes('pwis')) return 'si_sweden.png';
  if (text.includes('maeci') || text.includes('invest your talent') || text.includes('iyt')) return 'maeci_italy.png';
  if (text.includes('stipendium hungaricum') || text.includes('tempus public foundation')) return 'stipendium_hungaricum.png';
  if (text.includes('taiwanicdf') || text.includes('icdf')) return 'taiwan_icdf.png';
  if (text.includes('moe taiwan') || text.includes('huayu') || text.includes('mandarin language study')) return 'moe_taiwan.png';
  if (text.includes('swiss government excellence') || text.includes('swiss confederation') || text.includes('seri') || text.includes('sbfi')) return 'swiss_seri.png';
  if (text.includes('manaaki')) return 'manaaki_nz.png';
  if (text.includes('goi-ies') || text.includes('goipg') || text.includes('government of ireland')) return 'irish_hea.png';
  if (text.includes('danish government') || text.includes('danish ministry of higher education')) return 'danish_govt.png';
  if (text.includes('norway tuition') || text.includes('norwegian government')) return 'norway_govt.png';
  if (text.includes('hkpfs') || text.includes('hong kong phd fellowship') || text.includes('research grants council of hong kong')) return 'hkpfs.png';
  if (hasWord('mis') || text.includes('malaysia international scholarship') || text.includes('mohe malaysia')) return 'mis_malaysia.png';
  // Romania & Russia Program Logos
  if (text.includes('arice')) return 'arice.png';
  if (text.includes('romanian government mfa') || text.includes('romanian ministry of foreign') || text.includes('study in romania')) return 'study_in_romania.png';
  if (text.includes('open doors') || text.includes('russian scholarship project')) return 'open_doors.png';
  if (text.includes('rossotrudnichestvo') || text.includes('quota via rossotrudnichestvo')) return 'rossotrudnichestvo.png';
  // Poland Program Logos
  if (text.includes('nawa') || text.includes('banach') || text.includes('lukasiewicz') || text.includes('łukasiewicz')) return 'NAWA.png';
  if (text.includes('national science centre') || text.includes('ncn')) return 'NCN.png';
  // University
  for (const [regex, logo] of LOGO_RULES) {
    if (regex.test(text)) return logo;
  }
  // Group fallback
  const p = x.provider.toLowerCase();
  if (p.includes('daad') || p.includes('dlr') || p.includes('studienstiftung') || p.includes('german academic scholarship')) return 'daad.svg';
  if (p.includes('mext') || p.includes('monbukagakusho') || p.includes('jasso') || p.includes('japan student services') || p.includes('government of japan') || p.includes('adb') || p.includes('world bank')) return 'mext.svg';
  if (p.includes('turkiye') || p.includes('ytb') || p.includes('burslari')) return 'turkiye.png';
  if (p.includes('fulbright') || p.includes('aminef') || p.includes('knight-hennessy') || p.includes('stanford')) return 'Harvard.png';
  if (p.includes('vlir') || p.includes('vliruos') || p.includes('belgian') || p.includes('science@leuven') || p.includes('ku leuven') || p.includes('ares')) return 'vliruos.png';
  if (p.includes('erasmus') || p.includes('european commission')) return 'Bologna.png';
  // Group fallback (added 2026-06-18)
  const g = providerGroupHeuristic(x.provider);
  if (g === 'netherlands') return 'nuffic.png';
  if (g === 'china') return 'csc_china.png';
  if (g === 'sweden') return 'si_sweden.png';
  if (g === 'italy') return 'maeci_italy.png';
  if (g === 'hungary') return 'stipendium_hungaricum.png';
  if (g === 'taiwan') return 'moe_taiwan.png';
  if (g === 'switzerland') return 'swiss_seri.png';
  if (g === 'new-zealand') return 'manaaki_nz.png';
  if (g === 'ireland') return 'irish_hea.png';
  if (g === 'denmark') return 'danish_govt.png';
  if (g === 'norway') return 'norway_govt.png';
  if (g === 'hong-kong') return 'hkpfs.png';
  if (g === 'malaysia') return 'mis_malaysia.png';
  if (g === 'romania') return 'study_in_romania.png';
  if (g === 'russia') return 'rossotrudnichestvo.png';
  if (g === 'poland') return 'NAWA.png';
  return null;
}

const noLogo = [];
const brokenRef = [];
s.forEach(x => {
  const logo = checkLogo(x);
  if (!logo) noLogo.push(x);
  else {
    const baseName = logo.toLowerCase().replace(/\.(png|svg|jpg|jpeg|webp)$/, '');
    if (!logoFiles.includes(baseName)) brokenRef.push({ name: x.name, provider: x.provider, expected: logo });
  }
});

console.log('=== SCHOLARSHIPS WITH NO LOGO AT ALL (will show flag/🌍 on card):', noLogo.length);
noLogo.forEach(x => console.log('  *', x.name, '|', x.provider, '|', x.country));
console.log('');
console.log('=== LOGO REFERENCES POINTING TO MISSING FILES:', brokenRef.length);
brokenRef.forEach(x => console.log('  *', x.name, '|', x.provider, '→ expects', x.expected));
