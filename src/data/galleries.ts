import ramadanFoodPackages from "@/assets/ramadan-food-packages-10-states.jpg";
import ramadanReliefPackagesBoxesWater from "@/assets/ramadan-relief-packages-boxes-water.jpg";
import ramadanReliefPackageBoxCloseup from "@/assets/ramadan-relief-package-box-closeup.jpg";
import ramadanReliefGridBottledWater from "@/assets/ramadan-relief-grid-bottled-water.jpg";
import ramadanReliefCourtyardDisplay from "@/assets/ramadan-relief-courtyard-display.jpg";
import ramadanReliefCartonsAssembly from "@/assets/ramadan-relief-cartons-assembly.jpg";

import visuallyImpairedSchoolDutse1 from "@/assets/visually-impaired-school-dutse-1.jpg";
import visuallyImpairedSchoolDutseSignboard from "@/assets/visually-impaired-school-dutse-signboard.jpg";
import visuallyImpairedSchoolDutseMealsQueue from "@/assets/visually-impaired-school-dutse-meals-queue.jpg";
import visuallyImpairedSchoolDutseFounderHandover from "@/assets/visually-impaired-school-dutse-founder-handover.jpg";
import visuallyImpairedSchoolDutseTeamDistribution from "@/assets/visually-impaired-school-dutse-team-distribution.jpg";
import visuallyImpairedSchoolDutseStudentsJerseys from "@/assets/visually-impaired-school-dutse-students-jerseys.jpg";
import visuallyImpairedSchoolDutseGroupOfficial from "@/assets/visually-impaired-school-dutse-group-official.jpg";
import visuallyImpairedSchoolDutseHandoverProvisions from "@/assets/visually-impaired-school-dutse-handover-provisions.jpg";
import visuallyImpairedSchoolDutseSuppliesDisplay from "@/assets/visually-impaired-school-dutse-supplies-display.jpg";
import visuallyImpairedSchoolDutseHostelDormitory from "@/assets/visually-impaired-school-dutse-hostel-dormitory.jpg";
import visuallyImpairedSchoolDutseStudentsAssembly from "@/assets/visually-impaired-school-dutse-students-assembly.jpg";
import visuallyImpairedSchoolDutseFemaleStudents from "@/assets/visually-impaired-school-dutse-female-students.jpg";
import visuallyImpairedSchoolDutseHandoverYellow from "@/assets/visually-impaired-school-dutse-handover-yellow.jpg";
import visuallyImpairedSchoolDutseStudentsSmiles from "@/assets/visually-impaired-school-dutse-students-smiles.jpg";
import visuallyImpairedSchoolDutseSchoolLeadership from "@/assets/visually-impaired-school-dutse-school-leadership.jpg";
import visuallyImpairedSchoolDutseGroupPresentation from "@/assets/visually-impaired-school-dutse-group-presentation.jpg";

import footballTournamentTrophyPresentation from "@/assets/football-tournament-trophy-presentation.jpg";
import footballTournamentTrophyHandoverCrowd from "@/assets/football-tournament-trophy-handover-crowd.jpg";
import footballTournamentFounderSpeech from "@/assets/football-tournament-founder-speech.jpg";
import footballTournamentCeremonialKickoffTable from "@/assets/football-tournament-ceremonial-kickoff-table.jpg";
import footballTournamentPitchInspectionYellow from "@/assets/football-tournament-pitch-inspection-yellow.jpg";
import footballTournamentPitchInspectionRed from "@/assets/football-tournament-pitch-inspection-red.jpg";
import footballTournamentCashAwardsCloseup from "@/assets/football-tournament-cash-awards-closeup.jpg";
import footballTournamentCashAwards from "@/assets/football-tournament-cash-awards.jpg";
import footballTournamentSpectatorStandsGroup from "@/assets/football-tournament-spectator-stands-group.jpg";
import footballTournamentVipSpectatorsFounder from "@/assets/football-tournament-vip-spectators-founder.jpg";
import footballTournamentDelegatesDiscussion from "@/assets/football-tournament-delegates-discussion.jpg";

export interface FieldPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  caption: string;
  aspectRatio?: string;
  isMainHeadImage?: boolean;
}

export type RamadanPhoto = FieldPhoto;
export type GalleryPhoto = FieldPhoto;
export type TournamentPhoto = FieldPhoto;

export const ramadanGallery: RamadanPhoto[] = [
  {
    id: "ramadan-relief-boxes-water-courtyard",
    src: ramadanReliefPackagesBoxesWater,
    alt: "Rows of white branded Ramadan Package cartons with packs of bottled table water donated by Abba Roller Foundation and Seyi Tinubu",
    title: "Ramadan Food & Water Packages for Muslim Ummah",
    category: "Food & Water Cartons",
    caption:
      "Extensive rows of white branded cartons featuring food provisions topped with packs of clean bottled drinking water, organized for the Muslim Ummah across Northern Nigeria.",
    isMainHeadImage: true,
  },
  {
    id: "ramadan-relief-box-closeup",
    src: ramadanReliefPackageBoxCloseup,
    alt: "Close-up of official white Ramadan Package carton donated by Abba Roller Foundation (ARF) and Seyi Tinubu with bottled water",
    title: "ARF & Seyi Tinubu Ramadan Relief Package",
    category: "Branded Provisions",
    caption:
      "Official Ramadan Package cartons specially branded with Abba Roller Foundation (ARF) and Seyi Tinubu, dedicated to supporting Muslim families and the Ummah during the sacred month of Ramadan.",
  },
  {
    id: "ramadan-food-packages-cooked-meals",
    src: ramadanFoodPackages,
    alt: "1,500 food package pieces and freshly cooked hot meal packs with whole fish, rice, and fresh vegetables across 10 states",
    title: "1,500 Cooked Food Packages & Bundles",
    category: "Iftar & Sahur Meals",
    caption:
      "Freshly prepared hot takeaway meals featuring seasoned rice, whole fish, and salad greens packaged alongside bundled food parcels for multi-state Ramadan relief.",
  },
  {
    id: "ramadan-relief-grid-bottled-water",
    src: ramadanReliefGridBottledWater,
    alt: "High-angle perspective of columns of Ramadan packages with packs of drinking water",
    title: "Nationwide Staging & Water Logistics",
    category: "Food & Water Cartons",
    caption:
      "Vast grid of food packages and table water packs staged in regional hubs ready for immediate delivery into high-need Muslim communities.",
  },
  {
    id: "ramadan-relief-courtyard-display",
    src: ramadanReliefCourtyardDisplay,
    alt: "Courtyard display showing rows of stacked food boxes and water bottles for Ramadan relief",
    title: "Courtyard Assembly for Fasting Households",
    category: "Grassroots Distribution",
    caption:
      "Organized distribution lines ensuring orderly, dignified, and direct handover of food boxes and table water to fasting individuals and families.",
  },
  {
    id: "ramadan-relief-cartons-assembly",
    src: ramadanReliefCartonsAssembly,
    alt: "Extensive rows of Ramadan food packages and bottled water cartons ready for distribution",
    title: "Comprehensive Relief Consignment",
    category: "Grassroots Distribution",
    caption:
      "Hundreds of boxed food provisions and water bottles prepared to bring relief, hydration, and nutritional sustenance to the Muslim Ummah.",
  },
];

export const dutseSchoolGallery: GalleryPhoto[] = [
  {
    id: "dutse-main-head-image",
    src: visuallyImpairedSchoolDutse1,
    alt: "Young visually impaired student resting thoughtfully in the hostel dormitory at the Visually Impaired School in Dutse, Jigawa State",
    title: "Hostel Welfare Visit",
    category: "Primary Documentation",
    caption:
      "A young visually impaired student in the school hostel in Dutse, Jigawa State. ARF's outreach reached right into the residential dormitories to ensure every child received direct personal care.",
    isMainHeadImage: true,
  },
  {
    id: "dutse-female-students-hostel",
    src: visuallyImpairedSchoolDutseFemaleStudents,
    alt: "Two young visually impaired female students sitting together in their residential dormitory room in Dutse",
    title: "Female Students in Hostel",
    category: "Pad Up & Dormitory Care",
    caption:
      "Visually impaired female pupils sitting in their residential hostel room. ARF's Pad Up initiative provided sanitary pads, toiletries, and personal hygiene kits to support the girls' health and dignity.",
  },
  {
    id: "dutse-signboard-official",
    src: visuallyImpairedSchoolDutseSignboard,
    alt: "Visually impaired students holding cooked meals in front of the Jigawa State School for the Visually Impaired signboard in Limawa, Dutse",
    title: "Official School Signboard",
    category: "Official Verification",
    caption:
      "Pupils holding freshly prepared meal packs in front of the official signboard: 'JIGAWA STATE SCHOOL FOR THE VISUALLY IMPAIRED, Motto: Education is light for All, Address: Limawa, Dutse, Jigawa State.'",
  },
  {
    id: "dutse-handover-provisions",
    src: visuallyImpairedSchoolDutseHandoverProvisions,
    alt: "Hon. Usman Aminu Usman presenting laundry detergent packs, washing buckets, and hot meals to a student",
    title: "Detergents & Care Handover",
    category: "Hygiene Handover",
    caption:
      "Founder & Chairman Hon. Usman Aminu Usman (Abba Roller) personally presenting branded detergent packs, washing buckets, bowls, and hot meal packs to a female student.",
  },
  {
    id: "dutse-handover-yellow",
    src: visuallyImpairedSchoolDutseHandoverYellow,
    alt: "Hon. Usman Aminu Usman presenting relief buckets and takeaway meals to a student in a yellow hijab",
    title: "Dignified Welfare Handover",
    category: "Personal Handover",
    caption:
      "Direct handover of personal care provisions: Founder Hon. Usman Aminu Usman presenting relief supplies, washing basins, and hot meals to a visually impaired female pupil in yellow attire.",
  },
  {
    id: "dutse-supplies-display",
    src: visuallyImpairedSchoolDutseSuppliesDisplay,
    alt: "Comprehensive relief materials display featuring sanitary pads, soaps, toothpaste, detergents, food containers, and buckets",
    title: "Complete Relief Consignment",
    category: "Provisions Inventory",
    caption:
      "Exemplary consignment of relief provisions: Pad Up sanitary pads, cartons of beauty and antibacterial soaps, Pepsodent toothpaste, washing detergents, wash basins, buckets, and freshly prepared hot meals.",
  },
  {
    id: "dutse-meals-queue",
    src: visuallyImpairedSchoolDutseMealsQueue,
    alt: "Four visually impaired students standing in line holding fresh takeaway food containers",
    title: "Hot Meals for Students",
    category: "Nutritional Relief",
    caption:
      "Visually impaired students holding wholesome, freshly cooked hot takeaway meals delivered directly to their residential hostel.",
  },
  {
    id: "dutse-founder-handover",
    src: visuallyImpairedSchoolDutseFounderHandover,
    alt: "Hon. Usman Aminu Usman handing over takeaway meals to students in front of the Foundation banner",
    title: "Direct Leadership Handover",
    category: "Food Distribution",
    caption:
      "Hon. Usman Aminu Usman distributing nutritious meals directly into the hands of visually impaired pupils without intermediaries.",
  },
  {
    id: "dutse-group-official",
    src: visuallyImpairedSchoolDutseGroupOfficial,
    alt: "Complete group photo with school teachers, principal, Foundation leadership, and visually impaired students",
    title: "School Community Commemoration",
    category: "Delegation Group",
    caption:
      "ARF leadership, school administrators, teachers, and pupils gathering in front of the school signboard with their welfare buckets, care packages, and meal packs.",
  },
  {
    id: "dutse-students-smiles",
    src: visuallyImpairedSchoolDutseStudentsSmiles,
    alt: "Hon. Usman Aminu Usman alongside visually impaired pupils wearing Abba Roller Foundation jerseys holding meals and welfare buckets",
    title: "Founder With Pupils & Meals",
    category: "Youth Empowerment",
    caption:
      "Hon. Usman Aminu Usman surrounded by smiling students wearing custom ARF jerseys, receiving hot nutritious meal packs, washing buckets, and daily care provisions.",
  },
  {
    id: "dutse-school-leadership",
    src: visuallyImpairedSchoolDutseSchoolLeadership,
    alt: "Hon. Usman Aminu Usman in consultation with school administrators and staff at Jigawa State School for the Visually Impaired",
    title: "School Leadership Engagement",
    category: "Institutional Partnership",
    caption:
      "Founder & Chairman Hon. Usman Aminu Usman engaging with the school leadership and teachers at the school grounds in Limawa, Dutse, reaffirming sustained foundation support.",
  },
  {
    id: "dutse-group-presentation",
    src: visuallyImpairedSchoolDutseGroupPresentation,
    alt: "Comprehensive delegation photograph with school pupils, educators, and ARF leadership displaying relief supplies and care bags",
    title: "Outreach Mission Presentation",
    category: "Delegation Group",
    caption:
      "A joyful moment with pupils, teachers, and the Abba Roller Foundation team presenting customized welfare packages, food containers, and hygiene supplies.",
  },
  {
    id: "dutse-students-jerseys",
    src: visuallyImpairedSchoolDutseStudentsJerseys,
    alt: "Senior visually impaired students wearing custom Abba Roller Foundation sports jerseys with relief buckets",
    title: "Student Welfare & Custom Kits",
    category: "Youth Empowerment",
    caption:
      "Senior students at the school wearing customized Abba Roller Foundation jerseys, with individual washing buckets and care provisions.",
  },
  {
    id: "dutse-team-distribution",
    src: visuallyImpairedSchoolDutseTeamDistribution,
    alt: "ARF team members and Founder distributing meal packs to pupils",
    title: "Coordinated Relief Team",
    category: "Grassroots Access",
    caption:
      "The Foundation team on-site at the school, coordinating meal distribution and personal welfare checks for students.",
  },
  {
    id: "dutse-hostel-dormitory",
    src: visuallyImpairedSchoolDutseHostelDormitory,
    alt: "A visually impaired student resting safely in a residential dormitory bunk bed equipped with mosquito netting",
    title: "Hostel Living & Dormitory Care",
    category: "Hostel Welfare",
    caption:
      "Inside the residential dormitory quarters in Dutse. ARF’s intervention provides hygiene products, cleaning agents, and living essentials to safeguard daily living conditions.",
  },
  {
    id: "dutse-students-assembly",
    src: visuallyImpairedSchoolDutseStudentsAssembly,
    alt: "Students assembled in the school compound during the foundation's welfare visit",
    title: "School Compound Assembly",
    category: "Community Fellowship",
    caption:
      "Dozens of pupils gathered in the school grounds during the Foundation’s outreach in Dutse, Jigawa State.",
  },
];

export const tournamentGallery: TournamentPhoto[] = [
  {
    id: "football-trophy-presentation",
    src: footballTournamentTrophyPresentation,
    alt: "Hon. Usman Aminu Usman presenting the golden championship trophy and brand new team jerseys to team captains",
    title: "Championship Trophy & Kit Presentation",
    category: "Championship & Honors",
    caption:
      "Founder & Chairman Hon. Usman Aminu Usman presenting the coveted Golden Tournament Cup alongside complete sets of new team jerseys to the championship finalists.",
    isMainHeadImage: true,
  },
  {
    id: "football-trophy-handover-crowd",
    src: footballTournamentTrophyHandoverCrowd,
    alt: "Ecstatic grand finale moment with golden championship cup held up high surrounded by team captains, officials, and fans",
    title: "Golden Trophy Raised on the Podium",
    category: "Championship & Honors",
    caption:
      "Ecstatic grand finale moment as the gleaming Golden Championship Trophy is held high amidst cheering fans, players, and foundation officials.",
  },
  {
    id: "football-ceremonial-kickoff-table",
    src: footballTournamentCeremonialKickoffTable,
    alt: "Ceremonial match ball, golden trophy, and team kits on the presentation table with handshake between founder and dignitaries",
    title: "Ceremonial Kickoff & Match Ball Handover",
    category: "Ceremony & Leadership",
    caption:
      "Dignitaries, community elders, and Founder Hon. Usman Aminu Usman gathered around the official match presentation table with the official match ball, trophy, and team kits.",
  },
  {
    id: "football-founder-speech",
    src: footballTournamentFounderSpeech,
    alt: "Hon. Usman Aminu Usman addressing players, officials, and spectators with a microphone",
    title: "Keynote Address by Founder",
    category: "Ceremony & Leadership",
    caption:
      "Hon. Usman Aminu Usman addressing youth, community elders, and spectators, emphasizing unity, discipline, athletic ambition, and peaceful coexistence through football.",
  },
  {
    id: "football-spectator-stands-group",
    src: footballTournamentSpectatorStandsGroup,
    alt: "Celebratory grand group photo on the stadium pavilion featuring Founder Hon. Usman Aminu Usman, women community leaders, youth ambassadors in ARF caps, and enthusiastic young football fans",
    title: "Community & ARF Delegation in the Stands",
    category: "Community & Fans",
    caption:
      "Celebratory group portrait in the stadium pavilion featuring Founder Hon. Usman Aminu Usman, women community leaders, youth ambassadors in ARF caps, and enthusiastic young football fans.",
  },
  {
    id: "football-vip-spectators-founder",
    src: footballTournamentVipSpectatorsFounder,
    alt: "Founder Hon. Usman Aminu Usman seated alongside community elders and distinguished guests, closely observing the match from the main pavilion",
    title: "Matchday Observation from the VIP Pavilion",
    category: "Community & Fans",
    caption:
      "Founder Hon. Usman Aminu Usman seated alongside community elders and distinguished guests, closely observing the high-intensity tournament match from the main pavilion.",
  },
  {
    id: "football-pitch-inspection-yellow",
    src: footballTournamentPitchInspectionYellow,
    alt: "Hon. Usman Aminu Usman shaking hands with players of KAFC Dandidibabs FC Gumel on the football pitch",
    title: "Pre-Match Inspection: KAFC Dandidibabs FC Gumel",
    category: "Pitch Inspection & Teams",
    caption:
      "Founder Hon. Usman Aminu Usman walking the pitch and shaking hands with players of KAFC Dandidibabs FC Gumel before kickoff, encouraging fair play and teamwork.",
  },
  {
    id: "football-pitch-inspection-red",
    src: footballTournamentPitchInspectionRed,
    alt: "Hon. Usman Aminu Usman shaking hands with the red kit squad lined up before kickoff",
    title: "Pre-Match Inspection: Red Warriors",
    category: "Pitch Inspection & Teams",
    caption:
      "Pre-game team inspection on the turf: Hon. Usman Aminu Usman congratulating squad players and urging them to showcase raw talent with sportsmanship.",
  },
  {
    id: "football-cash-awards-closeup",
    src: footballTournamentCashAwardsCloseup,
    alt: "Close-up of Founder Hon. Usman Aminu Usman presenting official sealed Abba Roller Foundation cash prize envelope to standout athlete",
    title: "ARF Cash Prize Envelope Handover",
    category: "Tournament Cash Awards",
    caption:
      "Founder Hon. Usman Aminu Usman directly presenting an official sealed Abba Roller Foundation cash prize envelope to a standout athlete, fueling grassroots athletic development.",
  },
  {
    id: "football-cash-awards",
    src: footballTournamentCashAwards,
    alt: "Hon. Usman Aminu Usman presenting cash prize envelopes and rewards to standout players and winning team captains",
    title: "Tournament Merit & MVP Cash Grants",
    category: "Tournament Cash Awards",
    caption:
      "Direct cash prize envelopes handed over to standout footballers, MVPs, and winning team delegates to celebrate their dedication and support grassroots sports.",
  },
  {
    id: "football-delegates-discussion",
    src: footballTournamentDelegatesDiscussion,
    alt: "Founder Hon. Usman Aminu Usman engaging in consultations with tournament organizers, team managers, and ARF youth coordinators",
    title: "Stakeholder Dialogue & Youth Leadership",
    category: "Ceremony & Leadership",
    caption:
      "Founder Hon. Usman Aminu Usman engaging in active consultations with tournament organizers, team managers, and ARF youth coordinators to plan future youth sports leagues.",
  },
];
