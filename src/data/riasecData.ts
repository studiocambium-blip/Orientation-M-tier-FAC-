import { RiasecDimension, RiasecDimensionInfo, Question } from '../types/riasec';

export const RIASEC_DIMENSIONS: Record<RiasecDimension, RiasecDimensionInfo> = {
  R: {
    code: 'R',
    letter: 'R',
    nameFr: 'Réaliste (Action & Technique)',
    nameEn: 'Realistic (Action & Hands-on)',
    tagline: 'L’action concrète, le maniement d’équipement et l’engagement sur le terrain',
    taglineEn: 'Direct hands-on action, equipment operation, and field deployment',
    description:
      'Préférence pour les tâches physiques, l’utilisation d’outils, de machinerie, de véhicules, d’armements et d’équipements techniques. Les profils réalistes s’épanouissent dans le monde tangible et opérationnel.',
    descriptionEn:
      'Preference for physical tasks, utilizing tools, machinery, vehicles, armaments, and technical gear. Realistic individuals excel in the tangible, operational world.',
    militaryRelevance:
      'Cœur des forces de combat terrestres, navales et aériennes. Essentiel pour l’infanterie, les blindés, les techniciens de maintenance aéronautique ou navale, les plongeurs et les sapeurs de combat.',
    militaryRelevanceEn:
      'Core of land, naval, and air combat forces. Critical for infantry, armored crews, aircraft/marine technicians, divers, and combat engineers.',
    typicalTraits: ['Pragmatique', 'Endurant', 'Manuel', 'Sens tactile', 'Orienté vers les résultats concrets', 'Calme sous l’effort physique'],
    typicalTraitsEn: ['Pragmatic', 'Enduring', 'Hands-on', 'Practical', 'Results-driven', 'Calm under physical exertion'],
    militaryKeywords: ['Armement tactique', 'Mécanique lourde', 'Opérations tout-terrain', 'Frégates et sous-marins', 'Pilotage', 'Génie de combat'],
    militaryKeywordsEn: ['Tactical weaponry', 'Heavy mechanics', 'All-terrain ops', 'Frigates & submarines', 'Combat engineering', 'Piloting'],
    color: '#c41230', // Rouge Forces Canada
    badgeBg: 'rgba(196, 18, 48, 0.10)',
    accentBorder: 'rgba(196, 18, 48, 0.35)'
  },
  I: {
    code: 'I',
    letter: 'I',
    nameFr: 'Investigateur (Analyse & Renseignement)',
    nameEn: 'Investigative (Analysis & Intelligence)',
    tagline: 'L’investigation logique, l’analyse tactique et les sciences appliquées',
    taglineEn: 'Logical inquiry, tactical intelligence analysis, and applied sciences',
    description:
      'Préférence pour la recherche, l’analyse critique de données complexes, la résolution de problèmes abstraits, la cyberdéfense, la science médicale et la compréhension approfondie des systèmes technologiques.',
    descriptionEn:
      'Preference for research, critical data analysis, abstract problem solving, cyber defence, medical science, and in-depth mastery of technological systems.',
    militaryRelevance:
      'Pilier du renseignement militaire, de la guerre électronique, de la cyberdéfense, de la médecine militaire, de la météorologie et de la maintenance d’avionique de haute technologie.',
    militaryRelevanceEn:
      'Pillar of military intelligence, electronic warfare, cyber operations, military medicine, meteorology, and high-tech avionics maintenance.',
    typicalTraits: ['Analytique', 'Curieux', 'Méthodique', 'Rationnel', 'Observateur critique', 'Orienté vers la logique pure'],
    typicalTraitsEn: ['Analytical', 'Inquisitive', 'Methodical', 'Rational', 'Critical observer', 'Logic-driven'],
    militaryKeywords: ['Cyberdéfense', 'Renseignement tactique', 'Avionique avancée', 'Médecine et chirurgie', 'Météo aéronautique', 'Cryptographie'],
    militaryKeywordsEn: ['Cyber defence', 'Tactical intelligence', 'Advanced avionics', 'Medicine & surgery', 'Aerospace weather', 'Cryptography'],
    color: '#0284c7', // Bleu Air / Renseignement
    badgeBg: 'rgba(2, 132, 199, 0.10)',
    accentBorder: 'rgba(2, 132, 199, 0.35)'
  },
  A: {
    code: 'A',
    letter: 'A',
    nameFr: 'Artistique (Communication & Créativité)',
    nameEn: 'Artistic (Media & Creative Expression)',
    tagline: 'La communication visuelle, l’expression créative et l’influence médiatique',
    taglineEn: 'Visual storytelling, creative expression, and strategic communications',
    description:
      'Préférence pour les activités d’expression personnelle, la production de médias, le graphisme, la captation d’images sur le vif, la rédaction d’impact et les traditions cérémoniales et musicales des forces armées.',
    descriptionEn:
      'Preference for personal expression, media production, graphic design, frontline image capture, impactful writing, and military ceremonial and musical heritage.',
    militaryRelevance:
      'Indispensable pour les affaires publiques militaires, la photographie de combat et de presse, les spécialistes de l’image opérationnelle, la guerre de l’information et les musiciens des régiments.',
    militaryRelevanceEn:
      'Vital for public affairs, combat camera and photojournalism, visual information specialists, information operations, and brass & reed band musicians.',
    typicalTraits: ['Créatif', 'Expressif', 'Sens esthétique', 'Intuitif', 'Sensible aux perceptions', 'Innovant'],
    typicalTraitsEn: ['Creative', 'Expressive', 'Aesthetic sense', 'Intuitive', 'Perceptive', 'Innovative'],
    militaryKeywords: ['Photographie opérationnelle', 'Affaires publiques', 'Musique régimentaire', 'Création graphique', 'Médias tactiques'],
    militaryKeywordsEn: ['Combat camera', 'Public affairs', 'Regimental bands', 'Graphic design', 'Tactical media'],
    color: '#7c3aed', // Violet créatif
    badgeBg: 'rgba(124, 58, 237, 0.10)',
    accentBorder: 'rgba(124, 58, 237, 0.35)'
  },
  S: {
    code: 'S',
    letter: 'S',
    nameFr: 'Social (Entraide & Soutien Humain)',
    nameEn: 'Social (Care & Personnel Support)',
    tagline: 'Le soutien aux troupes, les soins de santé et la cohésion d’équipe',
    taglineEn: 'Troop welfare, emergency healthcare, and team cohesion',
    description:
      'Préférence pour l’aide aux personnes, l’instruction, la formation des recrues, les soins médicaux de première ligne, l’écoute et le maintien de la cohésion morale et physique du groupe.',
    descriptionEn:
      'Preference for helping people, instructing, training recruits, frontline trauma care, active listening, and upholding the physical and moral wellbeing of colleagues.',
    militaryRelevance:
      'Clé de voûte des Services de santé des Forces canadiennes (techniciens médicaux, infirmiers, médecins), des aumôniers, des instructeurs militaires, des policiers militaires et du soutien au personnel.',
    militaryRelevanceEn:
      'Keystone of Canadian Forces Health Services (medical technicians, nursing officers, physicians), chaplains, drill instructors, military police, and personnel support.',
    typicalTraits: ['Bienveillant', 'Pédagogue', 'Empathique', 'Coopératif', 'Écoute active', 'Dévoué au groupe'],
    typicalTraitsEn: ['Compassionate', 'Pedagogical', 'Empathetic', 'Cooperative', 'Active listener', 'Dedicated to the group'],
    militaryKeywords: ['Évacuation médicale (MEDEVAC)', 'Soins de traumatologie', 'Instruction des recrues', 'Services d’aumônerie', 'Police communautaire'],
    militaryKeywordsEn: ['MEDEVAC', 'Trauma life support', 'Recruit instruction', 'Chaplaincy', 'Community policing'],
    color: '#059669', // Vert Armée / Santé
    badgeBg: 'rgba(5, 150, 105, 0.10)',
    accentBorder: 'rgba(5, 150, 105, 0.35)'
  },
  E: {
    code: 'E',
    letter: 'E',
    nameFr: 'Entreprenant (Commandement & Leadership)',
    nameEn: 'Enterprising (Command & Leadership)',
    tagline: 'La prise de décision sous pression, le commandement et l’initiative',
    taglineEn: 'Decisive tactical leadership, initiative, and commanding under fire',
    description:
      'Préférence pour diriger des équipes, assumer des responsabilités stratégiques, négocier, convaincre, commander lors de situations critiques et guider les troupes vers un objectif clair.',
    descriptionEn:
      'Preference for commanding teams, accepting high operational accountability, negotiating, persuading, leading in crisis situations, and driving missions forward.',
    militaryRelevance:
      'Essence même du corps des officiers, des commandants de peloton, d’escadrons de vol, de navires de guerre, des gestionnaires de missions tactiques et des officiers d’opérations interarmées.',
    militaryRelevanceEn:
      'Foundation of officer leadership, platoon commanders, flight commanders, naval warships, tactical mission managers, and joint operations staff.',
    typicalTraits: ['Leader naturel', 'Décisif', 'Audacieux', 'Communicateur assertif', 'Résistant au stress', 'Persuasif'],
    typicalTraitsEn: ['Natural leader', 'Decisive', 'Bold', 'Assertive communicator', 'Stress-resilient', 'Persuasive'],
    militaryKeywords: ['Commandement de troupe', 'Stratégie de mission', 'Guerre navale', 'Pilote commandant de bord', 'Gestion de crise tactique'],
    militaryKeywordsEn: ['Troop command', 'Mission strategy', 'Naval warfare', 'Aircraft commander', 'Crisis management'],
    color: '#d97706', // Or / Ambre
    badgeBg: 'rgba(217, 119, 6, 0.10)',
    accentBorder: 'rgba(217, 119, 6, 0.35)'
  },
  C: {
    code: 'C',
    letter: 'C',
    nameFr: 'Conventionnel (Rigueur & Logistique)',
    nameEn: 'Conventional (Supply Chain & Process)',
    tagline: 'La précision procédurale, la chaîne logistique et la discipline administrative',
    taglineEn: 'Procedural rigor, supply chain management, and regulatory compliance',
    description:
      'Préférence pour le respect des procédures et règlements militaires (STANAG/DOAD), la gestion des flux logistiques, le contrôle d’inventaire, le suivi budgétaire, les communications sécurisées et le contrôle du trafic.',
    descriptionEn:
      'Preference for military standard operating procedures (STANAGs/DAODs), supply chain tracking, inventory accuracy, budget oversight, secure communications, and airspace control.',
    militaryRelevance:
      'Colonne vertébrale du ravitaillement, de la logistique de déploiement mondial, des commis administratifs et financiers, des contrôleurs aériens, des spécialistes en munitions et transmissions.',
    militaryRelevanceEn:
      'Backbone of supply distribution, worldwide expeditionary logistics, financial and administrative managers, air traffic controllers, ammunition and signals specialists.',
    typicalTraits: ['Rigoureux', 'Organisé', 'Fiable', 'Respectueux des règles', 'Précis', 'Sens du détail'],
    typicalTraitsEn: ['Thorough', 'Organized', 'Dependable', 'Rule-respecting', 'Precise', 'Detail-oriented'],
    militaryKeywords: ['Gestion de munitions', 'Chaîne d’approvisionnement', 'Réglementation militaire', 'Contrôle aérien', 'Administration financière'],
    militaryKeywordsEn: ['Ammunition tracking', 'Supply chain', 'Military regulations', 'Air traffic control', 'Financial administration'],
    color: '#1e3a8a', // Bleu Marine foncé
    badgeBg: 'rgba(30, 58, 138, 0.10)',
    accentBorder: 'rgba(30, 58, 138, 0.35)'
  }
};

export const RIASEC_QUESTIONS: Question[] = [
  // --- REALISTE (5 questions) ---
  {
    id: 1,
    dimension: 'R',
    prompt: 'Travailler manuellement à réparer des moteurs, des circuits mécaniques ou de l’équipement lourd sur le terrain.',
    promptEn: 'Working hands-on to repair engines, mechanical systems, or heavy tactical equipment in the field.',
    operationalContext: 'Maintenance mécanique de blindés ou de systèmes propulsifs de frégates.',
    operationalContextEn: 'Mechanical maintenance on armored combat vehicles or naval frigate propulsion units.'
  },
  {
    id: 2,
    dimension: 'R',
    prompt: 'Évoluer dans un environnement physique intense en plein air, peu importe les intempéries (froid boréal, boue, mer agitée).',
    promptEn: 'Operating in rugged outdoor environments regardless of severe weather conditions (arctic cold, mud, rough seas).',
    operationalContext: 'Déploiement opérationnel d’infanterie ou patrouille côtière en milieu hostile.',
    operationalContextEn: 'Operational infantry deployment or coastal patrol in austere environments.'
  },
  {
    id: 3,
    dimension: 'R',
    prompt: 'Manier des outils spécialisés de haute précision, de l’armement individuel ou des instruments d’ingénierie concrète.',
    promptEn: 'Operating high-precision specialized tools, personal weapons systems, or hands-on engineering instruments.',
    operationalContext: 'Calibrage d’armement de précision ou désamorçage de charges de génie.',
    operationalContextEn: 'Precision weapons calibration or field demolition engineering.'
  },
  {
    id: 4,
    dimension: 'R',
    prompt: 'Piloter ou conduire des véhicules tout-terrain, des embarcations d’assaut ou des engins de transport blindés.',
    promptEn: 'Navigating and driving off-road tactical vehicles, rigid-hull assault boats, or armored personnel carriers.',
    operationalContext: 'Conduite tactique de LAV 6.0 ou d’embarcations pneumatiques rigides (RHIB).',
    operationalContextEn: 'Tactical piloting of Light Armoured Vehicles (LAV 6.0) or Rigid Hull Inflatable Boats (RHIB).'
  },
  {
    id: 5,
    dimension: 'R',
    prompt: 'Bâtir et installer des infrastructures temporaires, des ponts militaires ou des systèmes de protection physique de campement.',
    promptEn: 'Constructing temporary defensive structures, military tactical bridges, or protective field fortifications.',
    operationalContext: 'Génie de combat et franchissement d’obstacles sur zone opérationnelle.',
    operationalContextEn: 'Combat engineering obstacle clearance, bridging, and camp hardening.'
  },

  // --- INVESTIGATEUR (5 questions) ---
  {
    id: 6,
    dimension: 'I',
    prompt: 'Analyser des données satellitaires, des interceptions radar ou des signaux pour déceler les intentions adverses.',
    promptEn: 'Analyzing satellite imagery, radar intercepts, or electronic signals to assess adversary intent and movements.',
    operationalContext: 'Veille stratégique au sein d’une cellule de renseignement interarmées.',
    operationalContextEn: 'Strategic monitoring within a joint intelligence fusion cell.'
  },
  {
    id: 7,
    dimension: 'I',
    prompt: 'Traquer des failles de sécurité numérique, analyser du code informatique et contrer des cyberattaques sophistiquées.',
    promptEn: 'Detecting network vulnerabilities, analyzing malicious code, and neutralizing complex cyber intrusions.',
    operationalContext: 'Opérations défensives du commandement cybernétique des Forces canadiennes.',
    operationalContextEn: 'Defensive cyber operations supporting Canadian Armed Forces mission systems.'
  },
  {
    id: 8,
    dimension: 'I',
    prompt: 'Diagnostiquer des pannes électroniques complexes ou des défaillances logiques dans des calculateurs d’aéronefs.',
    promptEn: 'Diagnosing intricate electronic failures or software anomalies within high-tech aircraft computers.',
    operationalContext: 'Dépannage d’avionique embarquée sur CF-18 Hornet ou hélicoptère Cyclone.',
    operationalContextEn: 'Avionics troubleshooting on CF-18 Hornet fighters or CH-148 Cyclone maritime helicopters.'
  },
  {
    id: 9,
    dimension: 'I',
    prompt: 'Étudier les conditions météorologiques, géographiques et environnementales pour anticiper les risques d’une mission.',
    promptEn: 'Studying meteorological, oceanographic, and geospatial data to anticipate environmental hazards for upcoming missions.',
    operationalContext: 'Prévisions aérospatiales et modélisation géomatique avant une opération aérienne ou maritime.',
    operationalContextEn: 'Aerospace forecasting and geomatics modeling prior to air or sea sorties.'
  },
  {
    id: 10,
    dimension: 'I',
    prompt: 'Approfondir la compréhension scientifique d’un problème médical, balistique ou physique complexe sans se limiter à des explications superficielles.',
    promptEn: 'Investigating complex scientific, ballistic, or clinical problems deeply rather than accepting surface-level explanations.',
    operationalContext: 'Recherche appliquée en médecine tactique opérationnelle ou expertise balistique.',
    operationalContextEn: 'Applied operational medicine research or ballistics engineering analysis.'
  },

  // --- ARTISTIQUE (5 questions) ---
  {
    id: 11,
    dimension: 'A',
    prompt: 'Capter des images photographiques ou vidéos de haute qualité au cœur des opérations pour documenter et valoriser la mission.',
    promptEn: 'Capturing high-resolution video and photography in operational settings to document missions and convey national stories.',
    operationalContext: 'Rôle de technicien en imagerie opérationnelle en mission extérieure.',
    operationalContextEn: 'Imagery technician embedded with combat or expeditionary units.'
  },
  {
    id: 12,
    dimension: 'A',
    prompt: 'Jouer d’un instrument de musique dans un ensemble d’harmonie ou une fanfare lors de défilés et de cérémonies nationales.',
    promptEn: 'Performing music in a brass & reed orchestra or drum line during military ceremonies, parades, and state events.',
    operationalContext: 'Musicien dans l’une des musiques régimentaires régulières des FAC.',
    operationalContextEn: 'Musician in one of the Canadian Armed Forces regular regimental bands.'
  },
  {
    id: 13,
    dimension: 'A',
    prompt: 'Rédiger des articles et communiqués officiels, concevoir des visuels percutants ou produire du contenu audiovisuel.',
    promptEn: 'Authoring official briefings, articles, visual assets, or producing impactful media content for internal and public audiences.',
    operationalContext: 'Officier des affaires publiques informant la population canadienne et les médias.',
    operationalContextEn: 'Public affairs officer engaging media and the Canadian public.'
  },
  {
    id: 14,
    dimension: 'A',
    prompt: 'Imaginer des manières originales et créatives de transmettre un message clé à des publics variés.',
    promptEn: 'Designing creative, compelling visual and narrative strategies to communicate critical themes to diverse audiences.',
    operationalContext: 'Campagnes d’information tactique et de cohésion régimentaire.',
    operationalContextEn: 'Strategic communications campaigns and unit cohesion messaging.'
  },
  {
    id: 15,
    dimension: 'A',
    prompt: 'Apprécier le symbolisme des traditions, l’histoire militaire, l’héraldique et la mise en scène cérémoniale solennelle.',
    promptEn: 'Appreciating regimental traditions, military history, heraldry, and solemn ceremonial choreography.',
    operationalContext: 'Préservation du patrimoine régimentaire et protocole militaire canadien.',
    operationalContextEn: 'Preserving regimental heritage, battle honors, and Canadian military protocol.'
  },

  // --- SOCIAL (5 questions) ---
  {
    id: 16,
    dimension: 'S',
    prompt: 'Intervenir immédiatement pour porter secours, prodiguer des premiers soins d’urgence et stabiliser un blessé.',
    promptEn: 'Providing immediate emergency medical care, triage, and trauma stabilization under demanding conditions.',
    operationalContext: 'Technicien médical en poste de secours avancé au front.',
    operationalContextEn: 'Medical technician stationed at a frontline advanced dressing station.'
  },
  {
    id: 17,
    dimension: 'S',
    prompt: 'Instruire, guider et former de nouvelles recrues pour les aider à se dépasser et à acquérir de solides compétences.',
    promptEn: 'Teaching, coaching, and mentoring new recruits to build confidence, military discipline, and mission-ready skills.',
    operationalContext: 'Instructeur à l’École de leadership et de recrues des Forces canadiennes (ELRFC).',
    operationalContextEn: 'Instructor at the Canadian Forces Leadership and Recruit School (CFLRS).'
  },
  {
    id: 18,
    dimension: 'S',
    prompt: 'Être attentif au moral de ses pairs, écouter activement ceux qui vivent des difficultés et offrir un soutien bienveillant.',
    promptEn: 'Supporting comrades through stress and fatigue, actively listening, and fostering mental resilience within the unit.',
    operationalContext: 'Soutien aux militaires et cohésion psychologique en déploiement opérationnel.',
    operationalContextEn: 'Peer mental health support and unit moral cohesion during deployments.'
  },
  {
    id: 19,
    dimension: 'S',
    prompt: 'Participer à des missions d’assistance humanitaire et venir en aide à des populations civiles sinistrées.',
    promptEn: 'Deploying on humanitarian relief operations to assist civilian communities struck by natural disasters or conflict.',
    operationalContext: 'Opération LENTUS lors d’inondations, de feux de forêt ou de crises internationales.',
    operationalContextEn: 'Operation LENTUS responding to domestic floods, wildfires, or overseas disasters.'
  },
  {
    id: 20,
    dimension: 'S',
    prompt: 'Désamorcer des tensions entre individus par la médiation, la négociation calme et l’écoute empathique.',
    promptEn: 'Diffusing interpersonal tension through calm negotiation, de-escalation tactics, and empathetic problem-solving.',
    operationalContext: 'Police militaire intervenant en situation de conflit relationnel sur une base.',
    operationalContextEn: 'Military Police performing conflict resolution and base community peacekeeping.'
  },

  // --- ENTREPRENANT (5 questions) ---
  {
    id: 21,
    dimension: 'E',
    prompt: 'Prendre l’initiative de diriger un groupe, attribuer les rôles et assumer la pleine responsabilité du succès d’une mission.',
    promptEn: 'Stepping forward to lead a team, assigning responsibilities, and accepting full accountability for mission success.',
    operationalContext: 'Commandement d’un peloton de 30 soldats en manœuvre tactique.',
    operationalContextEn: 'Commanding a platoon of 30 soldiers on tactical exercises.'
  },
  {
    id: 22,
    dimension: 'E',
    prompt: 'Prendre des décisions rapides sous forte pression temporelle même lorsque toutes les informations ne sont pas parfaites.',
    promptEn: 'Making critical decisions rapidly under severe time pressure, even with incomplete situational intelligence.',
    operationalContext: 'Officier de quart à la passerelle d’une frégate de patrouille canadienne.',
    operationalContextEn: 'Officer of the Watch on the bridge of a Canadian patrol frigate.'
  },
  {
    id: 23,
    dimension: 'E',
    prompt: 'Convaincre, motiver et mobiliser une équipe pour surmonter la fatigue et accomplir un objectif exigeant.',
    promptEn: 'Inspiring, mobilizing, and motivating teammates to push through adversity and achieve difficult objectives.',
    operationalContext: 'Briefing opérationnel d’un chef de section avant l’action.',
    operationalContextEn: 'Section commander delivering operational briefings before assault.'
  },
  {
    id: 24,
    dimension: 'E',
    prompt: 'Coordonner des moyens aériens, terrestres ou logistiques d’envergure dans un plan d’action ambitieux.',
    promptEn: 'Synchronizing multi-domain air, land, or naval assets into a coherent, comprehensive tactical battle plan.',
    operationalContext: 'Officier de guerre tactique orchestrant un appui-feu combiné.',
    operationalContextEn: 'Tactical warfare officer coordinating combined arms fire support.'
  },
  {
    id: 25,
    dimension: 'E',
    prompt: 'Négocier fermement avec des intervenants externes, des autorités civiles ou des forces alliées pour faire respecter un accord.',
    promptEn: 'Negotiating assertively with foreign counterparts, local leaders, or coalition partners to safeguard interests.',
    operationalContext: 'Officier de liaison dans une coalition internationale de l’OTAN.',
    operationalContextEn: 'Liaison officer working inside a multilateral NATO joint force headquarters.'
  },

  // --- CONVENTIONNEL (5 questions) ---
  {
    id: 26,
    dimension: 'C',
    prompt: 'Veiller au respect rigoureux des procédures établies, des listes de vérification et des normes strictes de sécurité.',
    promptEn: 'Enforcing strict compliance with established standard checklists, flight safety protocols, and technical procedures.',
    operationalContext: 'Vérification pré-vol sur aéronef ou respect des protocoles de tir d’artillerie.',
    operationalContextEn: 'Pre-flight safety checks on aircraft or artillery firing protocols.'
  },
  {
    id: 27,
    dimension: 'C',
    prompt: 'Gérer avec exactitude des registres d’approvisionnement, des pièces de rechange et du matériel de haute valeur.',
    promptEn: 'Maintaining precision tracking of equipment registries, critical replacement parts, and high-value weapons assets.',
    operationalContext: 'Technicien en approvisionnement gérant les stocks d’un bataillon de soutien.',
    operationalContextEn: 'Supply technician managing warehouse inventory for a forward support battalion.'
  },
  {
    id: 28,
    dimension: 'C',
    prompt: 'Suivre à la lettre des protocoles de transmission radio codés et consigner scrupuleusement les journaux de bord opérationnels.',
    promptEn: 'Adhering strictly to encrypted tactical communications procedures and meticulously updating operational logs.',
    operationalContext: 'Opérateur des transmissions assurant la permanence du réseau de commandement.',
    operationalContextEn: 'Signals operator maintaining secure command-and-control radio nets.'
  },
  {
    id: 29,
    dimension: 'C',
    prompt: 'Gérer la solde, les dossiers administratifs du personnel militaire et les mouvements de mutation sans commettre d’erreur.',
    promptEn: 'Processing military pay, personnel records, security clearances, and deployment orders with zero margin for error.',
    operationalContext: 'Administration financière et gestion des ressources humaines de la base.',
    operationalContextEn: 'Financial clerk and military human resources specialist managing base personnel.'
  },
  {
    id: 30,
    dimension: 'C',
    prompt: 'Organiser méthodiquement son espace de travail, classer les données et s’assurer que chaque équipement est rigoureusement à sa place.',
    promptEn: 'Systematically organizing workflows, airspace routes, and maintaining flawless spatial tracking of air and maritime traffic.',
    operationalContext: 'Contrôleur de la circulation aérienne organisant les flux d’aéronefs au radar.',
    operationalContextEn: 'Air traffic controller sequencing tactical fighter and transport airframes.'
  }
];

export const RESPONSE_OPTIONS = [
  { value: 1, label: 'Désintérêt total', labelEn: 'Strongly Disinterested', short: 'Pas du tout', shortEn: 'Not at all' },
  { value: 2, label: 'Plutôt désintéressé', labelEn: 'Somewhat Disinterested', short: 'Peu', shortEn: 'Little' },
  { value: 3, label: 'Neutre / Modéré', labelEn: 'Neutral / Moderate', short: 'Neutre', shortEn: 'Neutral' },
  { value: 4, label: 'Intéressé', labelEn: 'Interested', short: 'Intéressé', shortEn: 'Interested' },
  { value: 5, label: 'Très grand intérêt', labelEn: 'Strongly Interested', short: 'Très intéressé', shortEn: 'Very interested' }
];
