const fs = require('fs');
const path = require('path');

// Replicate providerGroup from src/lib/scholarships.ts
function providerGroup(provider) {
  const p = provider.toLowerCase();
  if (p.includes('daad') || p.includes('deutschlandstipendium') || p.includes('bayer foundation') || p.includes('boell') || p.includes('adenauer') || p.includes('naumann') || p.includes('seidel') || p.includes('ebert') || p.includes('evangelisches studienwerk') || p.includes('sdw') || p.includes('copernicus') || p.includes('kaad') || p.includes('minds')) return 'germany';
  if (p.includes('mext') || p.includes('jasso') || p.includes('inpex') || p.includes('honjo') || p.includes('panasonic') || p.includes('rotary yoneyama') || p.includes('ajinomoto') || p.includes('sato yo') || p.includes('hashiya') || p.includes('heiwa nakajima') || p.includes('kawasaki') || p.includes('kajima') || p.includes('tokyu') || p.includes('mori seiki') || p.includes('obayashi')) return 'japan';
  if (p.includes('turkiye burslari') || p.includes('türkiye burslari') || p.includes('yaser') || p.includes('türkiye scholarships') || p.includes('turkey scholarships')) return 'turkey';
  if (p.includes('vanier') || p.includes('banting') || p.includes('elgin') || p.includes('trudeau') || p.includes('ontario graduate') || p.includes('quebec') || p.includes('shastri') || p.includes('oas') || p.includes('auf') || p.includes('mitacs') || p.includes('mcf') || p.includes('mastercard foundation')) return 'canada';
  if (p.includes('eiffel') || p.includes('boutmy') || p.includes('charpak') || p.includes('erasmus') || p.includes('france excellence') || p.includes('make our planet great again') || p.includes('mopga') || p.includes('cnrs') || p.includes('inserm') || p.includes('cea')) return 'france';
  if (p.includes('singa') || p.includes('a*star') || p.includes('temasek') || p.includes('lee kuan yew') || p.includes('singapore international graduate') || p.includes('president\'s graduate fellowship') || p.includes('development bank of singapore') || p.includes('dbs') || p.includes('ocbc') || p.includes('uob')) return 'singapore';
  if (p.includes('chevening') || p.includes('rhodes') || p.includes('gates cambridge') || p.includes('marshall') || p.includes('commonwealth') || p.includes('great scholarship') || p.includes('windle') || p.includes('westminster') || p.includes('clarendon') || p.includes('jardine')) return 'united-kingdom';
  if (p.includes('fulbright') || p.includes('humphrey') || p.includes('maccoy') || p.includes('aaew') || p.includes('aauw') || p.includes('p.e.o.') || p.includes('rotary foundation') || p.includes('east-west') || p.includes('carnegie') || p.includes('knight-hennessy') || p.includes('schwarzman') || p.includes('gates millennium')) return 'united-states';
  if (p.includes('belgian') || p.includes('vlir-uos') || p.includes('ares') || p.includes('wallonie-bruxelles') || p.includes('wbi') || p.includes('fnrs') || p.includes('fwo') || p.includes('innoviris')) return 'belgium';
  if (p.includes('erasmus+') || p.includes('erasmus mundus') || p.includes('marie curie') || p.includes('msca') || p.includes('erc') || p.includes('european research council')) return 'eu';
  if (p.includes('italian') || p.includes('invest your talent') || p.includes('maeci') || p.includes('edisu') || p.includes('dsu') || p.includes('aliss') || p.includes('er.go') || p.includes('laziodisco') || p.includes('unito') || p.includes('unipd')) return 'italy';
  if (p.includes('swedish institute') || p.includes('si scholarship') || p.includes('visby') || p.includes('stint') || p.includes('vr') || p.includes('forte') || p.includes('formas') || p.includes('wallenberg')) return 'sweden';
  if (p.includes('chinese government') || p.includes('csc') || p.includes('confucius') || p.includes('silk road') || p.includes('mofcom') || p.includes('cas-twas') || p.includes('ansuo')) return 'china';
  if (p.includes('stipendium hungaricum') || p.includes('hungarian government') || p.includes('tempus public') || p.includes('fao hungary') || p.includes('ceepus')) return 'hungary';
  if (p.includes('taiwan scholarship') || p.includes('icdf') || p.includes('moe taiwan') || p.includes('most taiwan') || p.includes('academia sinica') || p.includes('tsmc')) return 'taiwan';
  if (p.includes('swiss government') || p.includes('eskas') || p.includes('sbfi') || p.includes('snsf') || p.includes('eth board') || p.includes('zeno karl schindler')) return 'switzerland';
  if (p.includes('ernst mach') || p.includes('franz werfel') || p.includes('richard plaschka') || p.includes('oead') || p.includes('austrian government') || p.includes('fwo')) return 'austria';
  if (p.includes('finland scholarship') || p.includes('edu fi') || p.includes('academy of finland') || p.includes('cimo') || p.includes('nokia foundation') || p.includes('skr') || p.includes('wihuri')) return 'finland';
  if (p.includes('manaaki new zealand') || p.includes('nzds') || p.includes('new zealand scholarships') || p.includes('royal society te aparangi')) return 'new-zealand';
  if (p.includes('government of ireland') || p.includes('goi-ies') || p.includes('irish research council') || p.includes('irc') || p.includes('sfi') || p.includes('hrb')) return 'ireland';
  if (p.includes('danish government') || p.includes('danish ministry of higher education') || p.includes('denmark government') || p.includes('study in denmark')) return 'denmark';
  if (p.includes('lanekassen') || p.includes('lånekassen') || p.includes('norwegian government') || p.includes('rcn') || p.includes('norad') || p.includes('siu') || p.includes('diku') || p.includes('hk-dir') || p.includes('bi norwegian')) return 'norway';
  if (p.includes('hong kong phd') || p.includes('hkpf') || p.includes('research grants council') || p.includes('ugc.edu.hk') || p.includes('university of hong kong')) return 'hong-kong';
  if (p.includes('malaysia international') || p.includes('mohe') || (p.includes('malaysian government') && p.includes('scholarship')) || p.includes('university of malaya') || p.includes('universiti sains malaysia') || p.includes('universiti putra malaysia') || p.includes('universiti teknologi malaysia') || p.includes('monash malaysia') || p.includes('nottingham malaysia') || p.includes('curtin malaysia') || p.includes('taylor')) return 'malaysia';
  
  // Fallback
  return p.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Replicate universities list and getMatchedUniversityLogos from scholarships.ts
const universities = [
  { name: 'National University of Singapore (NUS)', logo: '/images/logos/NUS.png', keywords: ['nus', 'national university of singapore'] },
  { name: 'Nanyang Technological University (NTU)', logo: '/images/logos/NTU.png', keywords: ['ntu_sg', 'nanyang'] },
  { name: 'Singapore Management University (SMU)', logo: '/images/logos/SMU.png', keywords: ['smu', 'singapore management'] },
  { name: 'Singapore University of Technology and Design (SUTD)', logo: '/images/logos/SUTD.png', keywords: ['sutd', 'singapore university of technology and design'] },
  
  { name: 'University of Toronto', logo: '/images/logos/UofT.png', keywords: ['uoft', 'university of toronto', 'toronto'] },
  { name: 'McGill University', logo: '/images/logos/McGill.png', keywords: ['mcgill'] },
  { name: 'University of British Columbia (UBC)', logo: '/images/logos/UBC.png', keywords: ['ubc', 'british columbia'] },
  { name: 'McMaster University', logo: '/images/logos/McMaster.png', keywords: ['mcmaster'] },
  { name: 'University of Waterloo', logo: '/images/logos/Waterloo.png', keywords: ['waterloo'] },

  { name: 'Kyoto University', logo: '/images/logos/KyotoU.png', keywords: ['kyoto'] },
  { name: 'University of Tokyo', logo: '/images/logos/UofTokyo.png', keywords: ['tokyo', 'uoftokyo'] },
  { name: 'Osaka University', logo: '/images/logos/Osaka.png', keywords: ['osaka'] },
  { name: 'Tohoku University', logo: '/images/logos/Tohoku.png', keywords: ['tohoku'] },
  { name: 'Tokyo Institute of Technology', logo: '/images/logos/TokyoTech.png', keywords: ['tokyo institute of technology', 'tokyo tech'] },

  { name: 'Heidelberg University', logo: '/images/logos/HeidelbergU.png', keywords: ['heidelberg'] },
  { name: 'LMU Munich', logo: '/images/logos/LMU.png', keywords: ['lmu', 'ludwig-maximilians'] },
  { name: 'Technical University of Munich (TUM)', logo: '/images/logos/TUM.png', keywords: ['tum', 'munich', 'münchen'] },
  { name: 'Freie Universität Berlin', logo: '/images/logos/FUBerlin.png', keywords: ['freie universität berlin', 'freie universitat berlin', 'fu berlin'] },
  { name: 'Karlsruhe Institute of Technology (KIT)', logo: '/images/logos/KIT.png', keywords: ['kit', 'karlsruhe institute'] },

  { name: 'Paris Sciences et Lettres University (PSL)', logo: '/images/logos/PSLU.png', keywords: ['psl', 'paris sciences', 'saclay'] },
  { name: 'Institut Polytechnique de Paris', logo: '/images/logos/InstitutPolytechniqueDeParis.png', keywords: ['polytechnique de paris', 'polytechnic institute of paris'] },
  { name: 'Sorbonne University', logo: '/images/logos/Sorbonne.png', keywords: ['sorbonne'] },
  { name: 'Université Paris-Saclay', logo: '/images/logos/ParisSaclay.png', keywords: ['paris-saclay', 'paris saclay'] },

  { name: 'Middle East Technical University (METU)', logo: '/images/logos/METU.png', keywords: ['metu', 'middle east technical'] },
  { name: 'Istanbul Technical University (ITU)', logo: '/images/logos/ITU.png', keywords: ['itu', 'istanbul technical'] },
  { name: 'Boğaziçi University', logo: '/images/logos/Bogazici.png', keywords: ['bogazici', 'boğaziçi'] },
  { name: 'Hacettepe University', logo: '/images/logos/Hacettepe.png', keywords: ['hacettepe'] },
  { name: 'Koç University', logo: '/images/logos/Koc.png', keywords: ['koc university', 'koç university'] },

  { name: 'University of Oxford', logo: '/images/logos/Oxford.png', keywords: ['oxford'] },
  { name: 'University of Cambridge', logo: '/images/logos/Cambridge.png', keywords: ['cambridge'] },
  { name: 'Imperial College London', logo: '/images/logos/ImperialCollegeLondon.png', keywords: ['imperial college', 'imperial college london'] },
  { name: 'University of Edinburgh', logo: '/images/logos/Edinburgh.png', keywords: ['edinburgh'] },
  { name: 'University College London (UCL)', logo: '/images/logos/UCL.png', keywords: ['ucl', 'university college london'] },

  { name: 'University of Melbourne', logo: '/images/logos/Melbourne.png', keywords: ['melbourne'] },
  { name: 'University of Sydney', logo: '/images/logos/Sydney.png', keywords: ['sydney'] },
  { name: 'Australian National University (ANU)', logo: '/images/logos/ANU.png', keywords: ['anu', 'australian national university'] },
  { name: 'Monash University', logo: '/images/logos/Monash_AUS.png', keywords: ['monash'] },
  { name: 'University of Queensland (UQ)', logo: '/images/logos/UQ.png', keywords: ['uq_aus', 'university of queensland'] },
  { name: 'UNSW Sydney', logo: '/images/logos/UNSW.png', keywords: ['unsw', 'new south wales'] },
  { name: 'Flinders University', logo: '/images/logos/Flinders.png', keywords: ['flinders'] },
  { name: 'Griffith University', logo: '/images/logos/Griffith.png', keywords: ['griffith'] },

  { name: 'Seoul National University (SNU)', logo: '/images/logos/SNU.png', keywords: ['snu', 'seoul national university'] },
  { name: 'KAIST', logo: '/images/logos/KAIST.png', keywords: ['kaist', 'korea advanced institute of science'] },
  { name: 'Yonsei University', logo: '/images/logos/Yonsei.png', keywords: ['yonsei'] },
  { name: 'Korea University', logo: '/images/logos/KoreaU.png', keywords: ['korea university'] },
  { name: 'Pohang University of Science and Technology (POSTECH)', logo: '/images/logos/POSTECH.png', keywords: ['postech', 'pohang university'] },

  // Netherlands Universities
  { name: 'TU Delft', logo: '/images/logos/TUDelft.png', keywords: ['tu delft', 'delft university'] },
  { name: 'Vrije Universiteit Amsterdam', logo: '/images/logos/VUAmsterdam.png', keywords: ['vrije universiteit amsterdam', 'vu amsterdam', 'vu fellowship'] },
  { name: 'University of Amsterdam', logo: '/images/logos/UniversityofAmsterdam.png', keywords: ['amsterdam', 'uva'] },
  { name: 'Leiden University', logo: '/images/logos/LeidenU.png', keywords: ['leiden'] },
  { name: 'University of Groningen', logo: '/images/logos/Groningen.png', keywords: ['groningen', 'rug'] },
  { name: 'Maastricht University', logo: '/images/logos/Maastricht.png', keywords: ['maastricht'] },
  { name: 'Radboud University', logo: '/images/logos/RadboudU.png', keywords: ['radboud'] },

  // South Korea (KOICA/GKS partners)
  { name: 'Sungkyunkwan University (SKKU)', logo: '/images/logos/SKKU.png', keywords: ['sungkyunkwan', 'skku'] },
  { name: 'KDI School of Public Policy and Management', logo: '/images/logos/KDI.png', keywords: ['kdi school', 'kdi'] },
  { name: 'Handong Global University', logo: '/images/logos/Handong.png', keywords: ['handong'] },
  { name: 'Incheon National University', logo: '/images/logos/Incheon.png', keywords: ['incheon'] },
  { name: 'Kyungpook National University', logo: '/images/logos/Kyungpook.png', keywords: ['kyungpook'] },
  { name: 'Pukyong National University', logo: '/images/logos/Pukyong.png', keywords: ['pukyong'] },
  { name: 'University of Seoul', logo: '/images/logos/Seoul.png', keywords: ['university of seoul'] },

  // Turkey & Others
  { name: 'Asian Institute of Technology (AIT)', logo: '/images/logos/AIT.png', keywords: ['ait', 'asian institute of technology'] },
  { name: 'Ankara University', logo: '/images/logos/AnkaraU.png', keywords: ['ankara university'] },
  { name: 'Ankara Hacı Bayram Veli University', logo: '/images/logos/AnkaraHaciBayramVeliU.png', keywords: ['bayram veli'] },
  { name: 'Ankara Music and Fine Arts University', logo: '/images/logos/AnkaraMusicandFineArtsU.png', keywords: ['music and fine arts'] },
  { name: 'ENS de Lyon', logo: '/images/logos/ENSdeLyon.png', keywords: ['ens de lyon', 'ens lyon'] },

  // SEARCA partner universities (Philippines, Malaysia, Indonesia)
  { name: 'University of the Philippines Los Baños (UPLB)', logo: '/images/logos/UPLB.png', keywords: ['uplb', 'los baños', 'los banos', 'university of the philippines los'] },
  { name: 'Universiti Putra Malaysia (UPM)', logo: '/images/logos/UPM.png', keywords: ['upm', 'universiti putra malaysia', 'putra malaysia'] },
  { name: 'Universitas Gadjah Mada (UGM)', logo: '/images/logos/UGM.png', keywords: ['ugm', 'gadjah mada', 'universitas gadjah'] },

  // Italy Universities
  { name: 'Politecnico di Milano', logo: '/images/logos/Polimi.png', keywords: ['polimi', 'politecnico di milano'] },
  { name: 'Sapienza Università di Roma', logo: '/images/logos/Sapienza.png', keywords: ['sapienza', 'sapienza università di roma', 'sapienza university of rome'] },
  
  // China Universities
  { name: 'Tsinghua University', logo: '/images/logos/Tsinghua.png', keywords: ['tsinghua'] },
  { name: 'Peking University', logo: '/images/logos/Peking.png', keywords: ['peking'] },
  { name: 'Zhejiang University', logo: '/images/logos/Zhejiang.png', keywords: ['zhejiang'] },

  // Hungary Universities
  { name: 'Eötvös Loránd University (ELTE)', logo: '/images/logos/ELTE.png', keywords: ['elte', 'eötvös', 'eotvos'] },
  { name: 'Semmelweis University', logo: '/images/logos/Semmelweis.png', keywords: ['semmelweis'] },
  { name: 'University of Szeged', logo: '/images/logos/Szeged.png', keywords: ['szeged'] },
  { name: 'University of Debrecen', logo: '/images/logos/Debrecen.png', keywords: ['debrecen'] },

  // Sweden Universities
  { name: 'KTH Royal Institute of Technology', logo: '/images/logos/KTH.png', keywords: ['kth', 'royal institute of technology'] },
  { name: 'Lund University', logo: '/images/logos/LundU.png', keywords: ['lund', 'lunds universitet'] },
  { name: 'Uppsala University', logo: '/images/logos/UppsalaU.png', keywords: ['uppsala', 'uppsala universitet'] },
  { name: 'Chalmers University of Technology', logo: '/images/logos/Chalmers.png', keywords: ['chalmers'] },
  { name: 'Stockholm University', logo: '/images/logos/StockholmU.png', keywords: ['stockholm university'] },
  { name: 'University of Gothenburg', logo: '/images/logos/GothenburgU.png', keywords: ['gothenburg'] },
  { name: 'Karolinska Institutet', logo: '/images/logos/Karolinska.png', keywords: ['karolinska'] },

  // Taiwan Universities
  { name: 'National Taiwan University (NTU)', logo: '/images/logos/NTU_Taiwan.png', keywords: ['ntu_tw', 'national taiwan university'] },
  { name: 'National Tsing Hua University (NTHU)', logo: '/images/logos/NTHU.png', keywords: ['nthu', 'national tsing hua university', 'tsing hua'] },
  { name: 'National Yang Ming Chiao Tung University (NYCU)', logo: '/images/logos/NYCU.png', keywords: ['nycu', 'national yang ming chiao tung university', 'chiao tung'] },

  // Swiss Universities
  { name: 'ETH Zurich', logo: '/images/logos/ETH.png', keywords: ['eth', 'eth zurich', 'eth zürich', 'eidgenössische technische hochschule'] },
  { name: 'EPFL', logo: '/images/logos/EPFL.png', keywords: ['epfl', 'école polytechnique fédérale de lausanne', 'polytechnique federale de lausanne'] },
  { name: 'University of Zurich', logo: '/images/logos/UZH.png', keywords: ['uzh', 'university of zurich', 'university of zürich', 'universität zürich'] },
  { name: 'University of Geneva', logo: '/images/logos/UNIGE.png', keywords: ['university of geneva', 'unige', 'université de genève'] },

  // Austrian Universities
  { name: 'TU Wien', logo: '/images/logos/TUWien.png', keywords: ['tu wien', 'vienna university of technology', 'technische universität wien'] },
  { name: 'University of Vienna', logo: '/images/logos/Vienna.png', keywords: ['university of vienna', 'universität wien', 'univie'] },
  { name: 'University of Innsbruck', logo: '/images/logos/Innsbruck.png', keywords: ['innsbruck', 'universität innsbruck'] },

  // Finnish Universities
  { name: 'University of Helsinki', logo: '/images/logos/Helsinki.png', keywords: ['university of helsinki', 'helsingin yliopisto'] },
  { name: 'Aalto University', logo: '/images/logos/Aalto.png', keywords: ['aalto', 'aalto-yliopisto', 'aalto university'] },
  { name: 'Tampere University', logo: '/images/logos/Tampere.png', keywords: ['tampere', 'tampere university'] },
  { name: 'University of Oulu', logo: '/images/logos/Oulu.png', keywords: ['oulu', 'university of oulu', 'oulun yliopisto'] },
  { name: 'Hanken School of Economics', logo: '/images/logos/Hanken.png', keywords: ['hanken', 'hanken school of economics'] },

  // New Zealand Universities
  { name: 'University of Auckland', logo: '/images/logos/Auckland.png', keywords: ['auckland', 'university of auckland'] },
  { name: 'University of Otago', logo: '/images/logos/Otago.png', keywords: ['otago', 'university of Otago'] },
  { name: 'Victoria University of Wellington', logo: '/images/logos/VUW.png', keywords: ['vuw', 'victoria university of wellington', 'victoria university wellington'] },
  { name: 'Massey University', logo: '/images/logos/Massey.png', keywords: ['massey'] },

  // Ireland Universities
  { name: 'Trinity College Dublin', logo: '/images/logos/TCD.png', keywords: ['tcd', 'trinity college dublin', 'university of dublin'] },
  { name: 'University College Dublin (UCD)', logo: '/images/logos/UCD.png', keywords: ['ucd', 'university college dublin'] },
  { name: 'University College Cork (UCC)', logo: '/images/logos/UCC.png', keywords: ['ucc', 'university college cork'] },
  { name: 'Munster Technological University (MTU)', logo: '/images/logos/MTU.png', keywords: ['mtu', 'munster technological'] },
  { name: 'Maynooth University', logo: '/images/logos/Maynooth.png', keywords: ['maynooth'] },
  { name: 'Royal College of Surgeons in Ireland (RCSI)', logo: '/images/logos/RCSI.png', keywords: ['rcsi', 'royal college of surgeons'] },

  // Spain Universities
  { name: 'IE University', logo: '/images/logos/IE_University.png', keywords: ['ie university', 'ie business', 'ie'] },
  { name: 'Universidad de Girona (UdG)', logo: '/images/logos/UdG.png', keywords: ['girona', 'udg'] },

  // Poland Universities
  { name: 'University of Warsaw (UW)', logo: '/images/logos/UW.png', keywords: ['warsaw_uw', 'uw'] },
  { name: 'Warsaw University of Technology', logo: '/images/logos/Warsaw_Unitech.png', keywords: ['warsaw_unitech', 'warsaw university of technology', 'warsaw unitech'] },
  { name: 'Jagiellonian University (JU)', logo: '/images/logos/JU.png', keywords: ['jagiellonian', 'ju'] },

  // Denmark Universities
  { name: 'University of Copenhagen', logo: '/images/logos/Copenhagen.png', keywords: ['copenhagen', 'københavns universitet'] },
  { name: 'Technical University of Denmark (DTU)', logo: '/images/logos/DTU_Denmark.png', keywords: ['dtu_dk', 'technical university of denmark'] },
  { name: 'Aarhus University', logo: '/images/logos/Aarhus.png', keywords: ['aarhus'] },
  { name: 'Copenhagen Business School (CBS)', logo: '/images/logos/CBS.png', keywords: ['cbs', 'copenhagen business school'] },
  { name: 'Aalborg University (AAU)', logo: '/images/logos/AAU.png', keywords: ['aau', 'aalborg university'] },
  { name: 'Roskilde University (RUC)', logo: '/images/logos/RUC.png', keywords: ['ruc', 'roskilde university'] },

  // Norway Universities
  { name: 'University of Oslo', logo: '/images/logos/Oslo.png', keywords: ['uio', 'university of oslo', 'oslo universitet'] },
  { name: 'University of Bergen', logo: '/images/logos/Bergen.png', keywords: ['uib', 'university of bergen', 'bergen universitet'] },
  { name: 'NTNU', logo: '/images/logos/NTNU.png', keywords: ['ntnu', 'norwegian university of science and technology', 'norges teknisk-naturvitenskapelige'] },

  // Hong Kong Universities
  { name: 'University of Hong Kong (HKU)', logo: '/images/logos/HKU.png', keywords: ['hku', 'university of hong kong'] },
  { name: 'The Chinese University of Hong Kong (CUHK)', logo: '/images/logos/CUHK.png', keywords: ['cuhk', 'chinese university of hong kong'] },
  { name: 'Hong Kong University of Science and Technology (HKUST)', logo: '/images/logos/HKUST.png', keywords: ['hkust', 'hong kong university of science and technology'] },
  { name: 'City University of Hong Kong (CityU)', logo: '/images/logos/CityU.png', keywords: ['cityu', 'city university of hong kong'] },
  { name: 'The Hong Kong Polytechnic University (PolyU)', logo: '/images/logos/PolyU.png', keywords: ['polyu', 'polytechnic university of hong kong'] },

  // Malaysia Universities
  { name: 'University of Malaya (UM)', logo: '/images/logos/UM.png', keywords: ['um_my', 'university of malaya'] },
  { name: 'Universiti Putra Malaysia (UPM)', logo: '/images/logos/UPM.png', keywords: ['upm', 'universiti putra malaysia', 'putra malaysia'] },
  { name: 'Universiti Kebangsaan Malaysia (UKM)', logo: '/images/logos/UKM.png', keywords: ['ukm', 'universiti kebangsaan malaysia'] },
  { name: 'Universiti Sains Malaysia (USM)', logo: '/images/logos/USM.png', keywords: ['usm', 'universiti sains malaysia'] },
  { name: 'Universiti Teknologi Malaysia (UTM)', logo: '/images/logos/UTM.png', keywords: ['utm', 'universiti teknologi malaysia'] },
  { name: 'Monash University Malaysia', logo: '/images/logos/Monash_AUS.png', keywords: ['monash malaysia', 'monash university malaysia'] },
  { name: 'University of Nottingham Malaysia', logo: '/images/logos/Nottingham_Malaysia.png', keywords: ['nottingham malaysia', 'university of nottingham malaysia'] },
  { name: 'Curtin University Malaysia', logo: '/images/logos/Curtin_Malaysia.png', keywords: ['curtin malaysia', 'curtin university malaysia'] },
  { name: 'Taylor\'s University', logo: '/images/logos/Taylors.png', keywords: ['taylor', 'taylors', "taylor's university"] },

  // Norway Universities
  { name: 'BI Norwegian Business School', logo: '/images/logos/BI_Norwegian.png', keywords: ['bi norwegian', 'bi norwegian business school', 'bi business school'] },

  // France Universities
  { name: 'Sciences Po Paris', logo: '/images/logos/SciencesPo.png', keywords: ['sciences po', 'sciences po paris', 'émile boutmy', 'emile boutmy'] },

  // Belgium Universities
  { name: 'KU Leuven', logo: '/images/logos/KULeuven.png', keywords: ['ku leuven', 'k.u. leuven', 'katholieke universiteit leuven', 'science@leuven', 'global minds'] },
  { name: 'Ghent University', logo: '/images/logos/GhentU.png', keywords: ['ghent', 'gent university', 'universiteit gent'] },
  { name: 'Vrije Universiteit Brussel (VUB)', logo: '/images/logos/VUB.png', keywords: ['vub', 'vrije universiteit brussel'] },
  { name: 'Université catholique de Louvain (UCLouvain)', logo: '/images/logos/Bologna.png', keywords: ['uclouvain', 'louvain', 'catholique de louvain'] },
  { name: 'University of Antwerp', logo: '/images/logos/Bologna.png', keywords: ['antwerp', 'universiteit antwerpen'] },
  { name: 'Hasselt University', logo: '/images/logos/Bologna.png', keywords: ['hasselt', 'universiteit hasselt'] },

  // Romania Universities
  { name: 'University of Bucharest', logo: '/images/logos/Bucharest.png', keywords: ['unibuc', 'university of bucharest', 'bucharest university'] },
  { name: 'Babeș-Bolyai University', logo: '/images/logos/UBB.png', keywords: ['ubb', 'babes-bolyai', 'babeș-bolyai', 'babes bolyai'] },
  { name: 'Transilvania University of Brașov', logo: '/images/logos/Transilvania.png', keywords: ['transilvania university', 'transilvania academica', 'brasov', 'brașov', 'unitbv'] },
  { name: 'West University of Timișoara', logo: '/images/logos/WUT.png', keywords: ['west university of timi', 'timisoara', 'timișoara', 'wut', 'uvt'] },

  // Russia Universities
  { name: 'Lomonosov Moscow State University', logo: '/images/logos/MSU.png', keywords: ['moscow state university', 'lomonosov', 'msu'] },
  { name: 'Saint Petersburg State University', logo: '/images/logos/SPbU.png', keywords: ['saint petersburg state', 'spbu', 'spbsu'] },
  { name: 'HSE University', logo: '/images/logos/HSE.png', keywords: ['hse', 'higher school of economics'] },
  { name: 'Bauman Moscow State Technical University', logo: '/images/logos/BMSTU.png', keywords: ['bauman moscow', 'bmstu', 'bauman state'] },
  { name: 'Moscow State Institute of International Relations (MGIMO)', logo: '/images/logos/MGIMO.png', keywords: ['mgimo'] },
  { name: 'NUST MISIS', logo: '/images/logos/MISIS.png', keywords: ['nust misis', 'misis'] },

  // Qatar Universities
  { name: 'Qatar University (QU)', logo: '/images/logos/QU.png', keywords: ['qatar university', 'qu'] },
  { name: 'Hamad Bin Khalifa University (HBKU)', logo: '/images/logos/HBKU.svg', keywords: ['hamad bin khalifa', 'hbku'] },
  { name: 'Doha Institute for Graduate Studies', logo: '/images/logos/DohaInstitute.svg', keywords: ['doha institute'] },

  // Saudi Arabia Universities
  { name: 'King Saud University (KSU)', logo: '/images/logos/KSU.png', keywords: ['king saud', 'ksu'] },
  { name: 'King Abdulaziz University (KAU)', logo: '/images/logos/KAU.png', keywords: ['king abdulaziz', 'kau'] },
  { name: 'King Fahd University of Petroleum & Minerals (KFUPM)', logo: '/images/logos/KFUPM.png', keywords: ['king fahd', 'kfupm', 'petroleum and minerals'] },
  { name: 'KAUST', logo: '/images/logos/KAUST.png', keywords: ['kaust', 'king abdullah'] },
  { name: 'Umm Al-Qura University', logo: '/images/logos/UQU.png', keywords: ['umm al-qura', 'uqu'] },
  { name: 'Islamic University of Madinah', logo: '/images/logos/IUMadinah.png', keywords: ['islamic university of madinah', 'madinah'] },
];

function getMatchedUniversityLogos(s) {
  const text = `${s.name} ${s.provider} ${s.description ?? ''}`.toLowerCase();
  const list = [];

  if (text.includes('knight-hennessy') || text.includes('stanford university')) {
    list.push(
      { name: 'Stanford University', logo: '/images/logos/Stanford.png' },
      { name: 'Stanford Graduate School of Business', logo: '/images/logos/StanfordGSB.png' },
      { name: 'Stanford Graduate School of Education', logo: '/images/logos/StanfordGSE.png' },
      { name: 'Stanford School of Engineering', logo: '/images/logos/StanfordEngineering.png' },
      { name: 'Stanford School of Humanities & Sciences', logo: '/images/logos/StanfordHumanitiesSciences.png' },
      { name: 'Stanford Law School', logo: '/images/logos/StanfordLaw.png' },
      { name: 'Stanford Medicine', logo: '/images/logos/StanfordMedicine.png' },
      { name: 'Stanford Doerr School of Sustainability', logo: '/images/logos/StanfordDoerrSustainability.png' }
    );
  }

  if (text.includes('adb-japan scholarship') || text.includes('asian development bank')) {
    list.push(
      { name: 'University of Tokyo', logo: '/images/logos/UofTokyo.png' },
      { name: 'Ritsumeikan University', logo: '/images/logos/Ritsumeikan.png' },
      { name: 'Institute of Science Tokyo', logo: '/images/logos/ScienceTokyo.png' },
      { name: 'Asian Institute of Technology (AIT)', logo: '/images/logos/AIT.png' },
      { name: 'National University of Singapore (NUS)', logo: '/images/logos/NUS.png' }
    );
  }

  if (text.includes('joint japan/world bank') || text.includes('jj/wbgsp') || text.includes('world bank')) {
    list.push(
      { name: 'Brandeis University', logo: '/images/logos/Brandeis.png' },
      { name: 'Columbia University', logo: '/images/logos/ColumbiaU.png' },
      { name: 'Johns Hopkins University', logo: '/images/logos/JohnsHopkins.png' },
      { name: 'KIT Royal Tropical Institute', logo: '/images/logos/KITRoyalTropicalInstitute.png' },
      { name: 'Vrije Universiteit Amsterdam', logo: '/images/logos/VUAmsterdam.png' },
      { name: 'University of California, Berkeley', logo: '/images/logos/UCBerkeley.png' },
      { name: 'University of Tokyo', logo: '/images/logos/UofTokyo.png' },
      { name: 'University of Tsukuba', logo: '/images/logos/Tsukuba.png' },
      { name: 'Williams College', logo: '/images/logos/WilliamsCollege.png' },
      { name: 'Yale University', logo: '/images/logos/Yale.png' }
    );
  }

  universities.forEach((univ) => {
    const matched = univ.keywords.some((kw) => {
      if (kw === 'itu') {
        return s.country === 'Turkey' && (
          text.includes('itu ') || text.includes('itu/') || text.includes('itu,') || text.includes(' itu')
        );
      }
      if (kw === 'ntu_sg') {
        const regex = new RegExp(`\\bntu\\b`, 'i');
        return s.country === 'Singapore' && regex.test(text);
      }
      if (kw === 'ntu_tw') {
        const regex = new RegExp(`\\bntu\\b`, 'i');
        return s.country === 'Taiwan' && regex.test(text);
      }
      if (kw === 'dtu_dk') {
        const regex = new RegExp(`\\bdtu\\b`, 'i');
        return s.country === 'Denmark' && regex.test(text);
      }
      if (kw === 'um_my') {
        const regex = new RegExp(`\\bum\\b`, 'i');
        return s.country === 'Malaysia' && regex.test(text);
      }
      if (kw === 'uq_aus') {
        const regex = new RegExp(`\\buq\\b`, 'i');
        return s.country === 'Australia' && regex.test(text);
      }
      if (kw === 'warsaw_uw') {
        const regex = new RegExp(`\\buniversity of warsaw\\b|\\bwarsaw university\\b`, 'i');
        if (regex.test(text)) return true;
        if (text.includes('warsaw') && !text.includes('technology') && !text.includes('unitech')) return true;
        return false;
      }
      if (kw === 'warsaw_unitech') {
        const regex = new RegExp(`\\bwarsaw university of technology\\b|\\bwarsaw unitech\\b`, 'i');
        return regex.test(text);
      }
      if (kw === 'university of hong kong') {
        return text.includes('university of hong kong') && !text.includes('city university of hong kong') && !text.includes('chinese university of hong kong');
      }
      if (kw === 'copenhagen') {
        return text.includes('copenhagen') && !text.includes('copenhagen business school') && !text.includes('cbs');
      }
      if (kw === 'tokyo') {
        return text.includes('tokyo') && !text.includes('tokyo institute of technology') && !text.includes('tokyo tech') && !text.includes('science tokyo');
      }
      if (kw === 'munich' || kw === 'münchen') {
        return (text.includes('munich') || text.includes('münchen')) && !text.includes('lmu') && !text.includes('ludwig-maximilians');
      }
      if (kw === 'monash') {
        return text.includes('monash') && !text.includes('monash malaysia') && !text.includes('monash university malaysia');
      }
      if (['nus', 'lmu', 'ubc', 'tum', 'psl', 'anu', 'unsw', 'snu', 'kaist', 'postech', 'kit', 'smu', 'sutd', 'ucl', 'skku', 'kdi', 'ait', 'uva', 'rug', 'polimi', 'kth', 'nthu', 'nycu', 'eth', 'epfl', 'uzh', 'vuw', 'tcd', 'ucd', 'ucc', 'copenhagen', 'aarhus', 'uio', 'uib', 'ntnu', 'hku', 'cuhk', 'hkust', 'ukm', 'debrecen', 'massey', 'mtu', 'maynooth', 'rcsi', 'ie', 'udg', 'uw', 'ju', 'ncn', 'nawa', 'unibuc', 'ubb', 'unitbv', 'wut', 'uvt', 'msu', 'spbu', 'spbsu', 'hse', 'bmstu', 'mgimo', 'misis', 'qu', 'upm', 'usm', 'utm', 'ugm', 'ksu', 'kau', 'uqu', 'hbku', 'vub', 'unige', 'uoft', 'cityu', 'polyu', 'cbs', 'aau', 'ruc'].includes(kw)) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        return regex.test(text);
      }
      return text.includes(kw);
    });

    if (matched) {
      list.push({ name: univ.name, logo: univ.logo });
    }
  });

  return list;
}

// Load data and generate list
const dataPath = path.join(__dirname, '..', 'data', 'scholarships.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const out = data.scholarships.map((s) => {
  const matches = getMatchedUniversityLogos(s);
  const matchNames = matches.map(m => m.name);
  return {
    name: s.name,
    provider: s.provider,
    country: s.country,
    matched_logos: matchNames.length > 0 ? matchNames : ['[FALLBACK TRIGGERED]']
  };
});

fs.writeFileSync(path.join(__dirname, '..', 'scratch', 'all_scholarships_and_matched_logos.json'), JSON.stringify(out, null, 2));
console.log('Wrote to scratch/all_scholarships_and_matched_logos.json');
