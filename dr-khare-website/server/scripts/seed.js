require('dotenv').config();
const mongoose = require('mongoose');
const Milestone = require('../models/Milestone');
const Publication = require('../models/Publication');
const BlogPost = require('../models/BlogPost');
const AdminUser = require('../models/AdminUser');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    await Milestone.deleteMany({});
    await Publication.deleteMany({});
    await BlogPost.deleteMany({});

    let adminUser = await AdminUser.findOne({});
    if (!adminUser) {
      adminUser = await AdminUser.create({ username: 'admin', email: 'admin@drkhare.com', passwordHash: 'temp', role: 'superadmin' });
    }

    /* -------------------------------------------------------------------------- */
    /*                                 MILESTONES                                 */
    /* -------------------------------------------------------------------------- */
    const milestones = [
      {
        slug: "early-academic-foundations",
        title: "Early Academic Foundations",
        institution: "High School & Pre-Medical",
        location: "India",
        startDate: new Date('2007-06-01'),
        endDate: new Date('2009-05-30'),
        description: "Foundational years shaping a career in science and medicine.",
        category: "education",
        narrative: "<p>Dr. Khare's early academic career was defined by an intrinsic curiosity and a drive toward scientific rigor. Even before entering formal medical training, his aptitude for analytical thinking and problem-solving set the stage for what would become a highly distinguished medical career.</p>",
        achievements: ["Top percentile in national medical entrance examinations", "Foundation of analytical and scientific inquiry"],
        coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      },
      {
        slug: "afmc-pune",
        title: "Medical Degree (MBBS)",
        institution: "Armed Forces Medical College",
        location: "Pune, India",
        startDate: new Date('2009-08-01'),
        endDate: new Date('2015-03-31'),
        description: "Undergraduate medical training at one of India's most prestigious military medical institutions.",
        category: "education",
        narrative: "<p>At the Armed Forces Medical College (AFMC), Dr. Khare not only underwent rigorous clinical training but also emerged as a prolific student researcher. AFMC is known for its discipline and high academic standards, and Dr. Khare excelled in this environment, simultaneously managing clinical rotations and an unprecedented number of independent research projects.</p><p>During this time, he also demonstrated early leadership skills, taking on roles within student associations and founding a peer-reviewed scientific journal, INSPIRE, to democratize research access for medical students.</p>",
        achievements: [
          "Founder & Editor of INSPIRE — peer-reviewed scientific journal",
          "State President, Medical Students' Association of India (IFMSA-MSAI)",
          "Authored a fiction novel under the pseudonym Dr. Sparkle, the first AFMC cadet to do so"
        ],
        coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
        gallery: ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"]
      },
      {
        slug: "icmr-research-scholar",
        title: "5x ICMR Research Scholar",
        institution: "Indian Council of Medical Research",
        location: "India",
        startDate: new Date('2010-01-01'),
        endDate: new Date('2014-12-31'),
        description: "The first and only undergraduate in India to be awarded the ICMR scholarship in five consecutive years.",
        category: "award",
        narrative: "<p>The Indian Council of Medical Research (ICMR) Short Term Studentship is a highly competitive grant. Dr. Khare achieved the unprecedented feat of being awarded this scholarship for five consecutive years (2010-2014) as an undergraduate.</p><p>His ICMR-funded research spanned a staggering breadth of medical disciplines: Hematology, Neurology, Surgery, Anesthesiology, Community Medicine, and Physiology. This period cemented his identity as a clinician-researcher capable of cross-disciplinary investigation.</p>",
        achievements: [
          "First and only Indian undergraduate to win the ICMR scholarship 5 consecutive times",
          "Conducted original research in proteomics, genomics, and clinical pathways"
        ],
        coverImage: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      },
      {
        slug: "international-clinical-electives",
        title: "International Clinical Electives",
        institution: "Global Medical Institutions",
        location: "UK & Netherlands",
        startDate: new Date('2013-06-01'),
        endDate: new Date('2014-08-30'),
        description: "Global exposure through highly selective international clinical electives and research presentations.",
        category: "career",
        narrative: "<p>Dr. Khare's research acumen earned him international recognition early in his career. He became the youngest AFMC cadet to present at the International Medical Summer School in Manchester, UK, attending on a full scholarship.</p><p>He also presented at the European Society of Cardiology (ESC) Congress in Berlin and the ISCOMS conference in Groningen, Netherlands, building a global perspective on medical science and healthcare delivery.</p>",
        achievements: [
          "Full-scholarship invitee to 5th International Medical Summer School, Manchester",
          "Presented at ESC Congress (Berlin) and ISCOMS (Netherlands)"
        ],
        coverImage: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      },
      {
        slug: "clinical-research-early-development",
        title: "Clinical Research & Development",
        institution: "Institute of Bioinformatics",
        location: "Bangalore, India",
        startDate: new Date('2011-01-01'),
        endDate: new Date('2015-12-31'),
        description: "Advanced research fellowships bridging clinical medicine with proteomics and genomics.",
        category: "career",
        narrative: "<p>At the Institute of Bioinformatics (affiliated with Johns Hopkins), Dr. Khare worked as a Research Assistant focusing on proteomics, immunophenotyping, and mass spectrometry.</p><p>His early professional development was marked by intense laboratory work, translating bench science into clinical insights, particularly regarding the Flt-3 pathway for the Netpath database.</p>",
        achievements: [
          "Contributed to curation of the Flt-3 pathway for the Netpath database",
          "Winner of the Champion's Trophy at the Karmic Conference (awarded by Nobel Laureate Dr. Robin Warren)"
        ],
        coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      },
      {
        slug: "university-of-arizona",
        title: "Internal Medicine Residency",
        institution: "University of Arizona",
        location: "Tucson, AZ",
        startDate: new Date('2016-07-01'),
        endDate: new Date('2019-06-30'),
        description: "Categorical Internal Medicine training under ACGME-accredited supervision.",
        category: "education",
        narrative: "<p>Dr. Khare completed his Internal Medicine Residency at the University of Arizona College of Medicine – South Campus. Here, he honed his clinical acumen in a high-volume, diverse patient population setting.</p><p>Beyond clinical duties, he represented the residency program on the ACP Council of Residents and received travel grants to attend national leadership conferences, establishing a voice in medical advocacy.</p>",
        achievements: [
          "Represented program on the ACP Council of Residents",
          "Qualified for Resident as Educator 2017 Finals; 2nd Prize, GME Scholarly Day"
        ],
        coverImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      },
      {
        slug: "compendious-med-works",
        title: "Founder, MD & CEO",
        institution: "Compendious Med Works",
        location: "Global",
        startDate: new Date('2019-01-01'),
        endDate: null,
        description: "Founded a global healthcare content, digital strategy, and consulting firm.",
        category: "career",
        narrative: "<p>Transitioning from pure clinical practice to the business of medicine, Dr. Khare founded Compendious Med Works. The firm specializes in digital health content, clinical research consulting, and AI-enabled healthcare strategies.</p><p>This venture represents his commitment to building the operational systems that support modern healthcare, translating clinical fluency into digital operating systems.</p>",
        achievements: [
          "Bootstrapped a global healthcare consulting firm",
          "Integrated data analytics, Six Sigma, and decentralized systems into healthcare consulting"
        ],
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      },
      {
        slug: "california-medical-behavioral-health",
        title: "Chief Executive Officer",
        institution: "California Medical Behavioral Health",
        location: "San Bernardino, CA",
        startDate: new Date('2021-01-01'),
        endDate: null,
        description: "Executive leadership of clinical operations, research, and expansion in behavioral health.",
        category: "career",
        narrative: "<p>As CEO of California Medical Behavioral Health (CMBH), Dr. Khare took over executive responsibility for a major behavioral health organization serving San Bernardino and San Diego.</p><p>His leadership focuses on operational excellence, expanding access to care, and integrating clinical research into behavioral health frameworks, fundamentally improving systemic resilience.</p>",
        achievements: [
          "Led clinical operations and regional expansion across Southern California",
          "Implemented value-based care and clinical research initiatives"
        ],
        coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      },
      {
        slug: "university-of-cincinnati",
        title: "Occupational Medicine Residency",
        institution: "University of Cincinnati",
        location: "Cincinnati, OH",
        startDate: new Date('2023-07-01'),
        endDate: new Date('2025-06-30'),
        description: "A second residency focused on population health, environmental risk, and the medicine of work.",
        category: "education",
        narrative: "<p>Driven by a desire to impact population health at a systemic level, Dr. Khare undertook a second residency in Occupational Medicine at the University of Cincinnati. Working under the supervision of Victoria Wulsin, MD, DrPH, his research pivoted toward environmental hazards.</p><p>His notable work here includes analyzing parental occupation and housing age as critical risk factors for pediatric lead exposure.</p>",
        achievements: [
          "Conducted seminal research on pediatric lead exposure and occupational risk factors",
          "Expanded clinical expertise to include corporate health, toxicology, and regulatory compliance"
        ],
        coverImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      },
      {
        slug: "signify-health",
        title: "Value-Based Care Physician",
        institution: "Signify Health",
        location: "United States",
        startDate: new Date('2024-01-01'),
        endDate: null,
        description: "Advancing value-based care and population health initiatives.",
        category: "career",
        narrative: "<p>Working with Signify Health, Dr. Khare plays a crucial role in advancing value-based care. This involves comprehensive health assessments, risk stratification, and preventive care strategies designed to keep populations healthier and out of the hospital.</p>",
        achievements: [
          "Performed advanced clinical assessments to drive value-based care metrics",
          "Contributed to population health management strategies"
        ],
        coverImage: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      },
      {
        slug: "lompoc-valley-medical-center",
        title: "Medical Director, Occ & Env Medicine",
        institution: "Lompoc Valley Medical Center",
        location: "Lompoc, CA",
        startDate: new Date('2025-01-01'),
        endDate: null,
        description: "Leading occupational health programs including fitness-for-duty and regulatory compliance.",
        category: "career",
        narrative: "<p>As Medical Director of Occupational and Environmental Medicine at Lompoc Valley Medical Center, Dr. Khare oversees a comprehensive suite of employer health services.</p><p>His remit includes managing complex return-to-work cases, conducting fitness-for-duty evaluations, and ensuring stringent regulatory compliance to protect the safety of working people.</p>",
        achievements: [
          "Directing comprehensive occupational health services for regional employers",
          "Managing complex worker's compensation and return-to-work pathways"
        ],
        coverImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      },
      {
        slug: "leadership-research-innovation",
        title: "Leadership, Research & Innovation",
        institution: "Global Healthcare",
        location: "Worldwide",
        startDate: new Date('2025-06-01'),
        endDate: null,
        description: "Synthesizing clinical expertise with business administration to build resilient health systems.",
        category: "career",
        narrative: "<p>Dr. Khare's current trajectory lies at the apex of clinical medicine, executive leadership, and technological innovation. Armed with an MD, MPH, MBA, and PhD, he is uniquely positioned to address the structural vulnerabilities of modern healthcare.</p><p>His ongoing work involves leveraging data analytics, AI, and continuous quality improvement (Lean Six Sigma) to build healthcare delivery systems that are both economically viable and clinically excellent.</p>",
        achievements: [
          "Certified in Lean Six Sigma (Black Belt), Data Analytics, and Cybersecurity",
          "Synthesizing public health strategy with corporate healthcare operations"
        ],
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
        gallery: []
      }
    ];

    /* -------------------------------------------------------------------------- */
    /*                               PUBLICATIONS                                 */
    /* -------------------------------------------------------------------------- */
    const publications = [
      {
        title: "Lhermitte's Sign: The Current Status",
        type: "article",
        journal: "Annals of Indian Academy of Neurology",
        year: 2015,
        authors: ["Khare S", "Others"],
        abstract: "A comprehensive review of Lhermitte's sign, its pathophysiology, and clinical significance in modern neurology.",
        externalLink: "https://pubmed.ncbi.nlm.nih.gov/26109786/"
      },
      {
        title: "A Rare Case of Emphysematous Cholecystitis",
        type: "article",
        journal: "Journal of Clinical Diagnostics & Research",
        year: 2015,
        authors: ["Khare S", "Others"],
        abstract: "Case report analyzing the presentation, diagnostic challenges, and surgical management of emphysematous cholecystitis.",
        externalLink: "https://pubmed.ncbi.nlm.nih.gov/"
      },
      {
        title: "Pseudodementia: An Artefact or a Grey Area of Geropsychiatry?",
        type: "article",
        journal: "International Journal of Research",
        year: 2014,
        authors: ["Khare S"],
        abstract: "Exploration of the diagnostic overlap between depressive cognitive impairment and early-stage dementia in geriatric populations."
      },
      {
        title: "Amyloid Vaccine for Alzheimer Disease: Is It Feasible?",
        type: "article",
        journal: "International Journal of Research",
        year: 2014,
        authors: ["Khare S"],
        abstract: "A critical review of the immunological approaches to Alzheimer's disease and the viability of amyloid-beta vaccines."
      },
      {
        title: "Sleep and Women: Quality of Sleep, Sleep Patterns & Women's Health",
        type: "article",
        journal: "International Journal of Research",
        year: 2016,
        authors: ["Khare S"],
        abstract: "Analysis of gender disparities in sleep architecture and the impact of sleep quality on systemic health outcomes in women."
      },
      {
        title: "Current Recommendations for the Treatment of Acute Migraine",
        type: "article",
        journal: "International Journal of Research",
        year: 2016,
        authors: ["Khare S"],
        abstract: "A clinical update on the pharmacological management of acute migraine presentations in emergency and primary care settings."
      },
      {
        title: "Prevention of Misuse of Stimulant Medications for ADHD",
        type: "article",
        journal: "International Journal of Research",
        year: 2016,
        authors: ["Khare S"],
        abstract: "Policy and clinical guidelines to mitigate the diversion and misuse of prescription stimulants among young adults."
      },
      {
        title: "Telemedicine and Patient Satisfaction: Analyzing the Future",
        type: "article",
        journal: "Innov J Med Health Sci",
        year: 2016,
        authors: ["Khare S", "Chaudhary"],
        abstract: "Early research into telemedicine adoption, patient satisfaction metrics, and the scalability of remote care delivery."
      },
      {
        title: "Beevor's Sign",
        type: "article",
        journal: "International Journal of Interdisciplinary & Multidisciplinary Studies",
        year: 2014,
        authors: ["Khare S"],
        abstract: "Clinical review of Beevor's sign, its neurological localizing value, and associated pathologies."
      },
      {
        title: "Effect of Change in Body Position on Resting ECG in Young Healthy Adults",
        type: "article",
        journal: "Nigerian Journal of Cardiology",
        year: 2015,
        authors: ["Khare S"],
        abstract: "Physiological study detailing electrocardiographic alterations induced by positional changes."
      },
      {
        title: "Housing Age & Parental Occupation as Risk Factors of Pediatric Lead Exposure",
        type: "paper",
        journal: "AOHC, Chicago",
        year: 2026,
        authors: ["Khare S", "Wulsin V", "Newman N"],
        abstract: "Seminal occupational medicine research correlating environmental and parental occupational hazards with pediatric lead toxicity."
      },
      {
        title: "Role of Immunophenotyping in Acute Leukemias of Ambiguous Lineage",
        type: "paper",
        journal: "ICMR Project, AFMC",
        year: 2011,
        authors: ["Khare S"],
        abstract: "Analysis of flow cytometry applications in classifying ambiguous leukemias."
      },
      {
        title: "Post-Operative Lactic Acidosis in Prolonged Surgeries",
        type: "paper",
        journal: "ICMR Project, AFMC",
        year: 2012,
        authors: ["Khare S"],
        abstract: "Investigating the metabolic consequences and predictive value of lactic acidosis in extensive surgical procedures."
      },
      {
        title: "Risk Factors & Complications of Ventriculo-Peritoneal Shunt Surgeries",
        type: "paper",
        journal: "ICMR Project, AFMC",
        year: 2013,
        authors: ["Khare S"],
        abstract: "Retrospective analysis of VP shunt failure rates and associated perioperative risk factors."
      },
      {
        title: "Tales of Enkanto: A Paradoxical Beginning",
        type: "book",
        journal: "Published under pseudonym Dr. Sparkle",
        year: 2012,
        authors: ["Khare S"],
        abstract: "A work of fiction exploring complex narratives, marking the author as the first AFMC cadet to publish a novel."
      }
    ];

    /* -------------------------------------------------------------------------- */
    /*                                BLOG POSTS                                  */
    /* -------------------------------------------------------------------------- */
    const blogs = [
      {
        title: "The Silent Epidemic: Burnout as an Occupational Hazard",
        slug: "burnout-occupational-hazard",
        content: "<p>Burnout is no longer simply a buzzword for being tired; it is a profound occupational hazard with measurable systemic consequences. Healthcare systems are seeing unprecedented attrition rates...</p>",
        excerpt: "Why we must classify chronic professional burnout as a formal occupational hazard, and how institutions can build systemic resilience.",
        author: adminUser._id,
        status: "published",
        category: "Occupational Medicine",
        tags: ["Burnout", "Mental Health", "Workplace Safety"],
        readTimeMinutes: 5,
        featured: true,
        coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=80",
        publishDate: new Date('2023-11-10')
      },
      {
        title: "Lead Exposure in the 21st Century: The Unseen Pediatric Threat",
        slug: "pediatric-lead-exposure",
        content: "<p>Despite decades of public health interventions, pediatric lead exposure remains a critical issue, largely driven by aging infrastructure and overlooked parental occupational hazards...</p>",
        excerpt: "An analysis of housing age and parental occupation as continuing vectors for pediatric lead toxicity.",
        author: adminUser._id,
        status: "published",
        category: "Public Health",
        tags: ["Toxicology", "Pediatrics", "Environmental Health"],
        readTimeMinutes: 6,
        coverImage: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=1400&q=80",
        publishDate: new Date('2023-12-05')
      },
      {
        title: "Value-Based Care: Moving Beyond the Buzzword",
        slug: "value-based-care-reality",
        content: "<p>The transition from fee-for-service to value-based care represents the most significant shift in modern medicine's economic structure. However, operationalizing this shift requires more than just policy changes...</p>",
        excerpt: "Deconstructing the operational realities of implementing value-based care models in complex hospital systems.",
        author: adminUser._id,
        status: "published",
        category: "Healthcare Leadership",
        tags: ["Health Economics", "Policy", "Hospital Administration"],
        readTimeMinutes: 7,
        coverImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1400&q=80",
        publishDate: new Date('2024-01-15')
      },
      {
        title: "Lean Six Sigma in Clinical Operations",
        slug: "lean-six-sigma-clinical",
        content: "<p>Applying industrial quality control measures like Lean Six Sigma to clinical medicine often meets resistance. Yet, when applied correctly, these methodologies can dramatically reduce medical errors and improve patient throughput...</p>",
        excerpt: "How data-driven quality improvement methodologies can eliminate waste and improve patient outcomes.",
        author: adminUser._id,
        status: "published",
        category: "Clinical Excellence",
        tags: ["Six Sigma", "Quality Improvement", "Analytics"],
        readTimeMinutes: 5,
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
        publishDate: new Date('2024-02-20')
      },
      {
        title: "Telemedicine: Post-Pandemic Retention and Efficacy",
        slug: "telemedicine-post-pandemic",
        content: "<p>The rapid adoption of telemedicine during the pandemic proved the concept's viability at scale. Now, the challenge lies in retention and determining which clinical pathways are genuinely suited for remote delivery...</p>",
        excerpt: "Evaluating the long-term viability and clinical efficacy of remote care delivery systems.",
        author: adminUser._id,
        status: "published",
        category: "Telemedicine",
        tags: ["Digital Health", "Innovation", "Patient Care"],
        readTimeMinutes: 4,
        coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80",
        publishDate: new Date('2024-03-10')
      },
      {
        title: "The Physician Executive: Bridging the Clinical-Administrative Divide",
        slug: "physician-executive-divide",
        content: "<p>There is often a disconnect between those who administer healthcare and those who deliver it. The rise of the physician-executive is critical to bridging this divide, bringing clinical realities into board-level decision-making...</p>",
        excerpt: "Why healthcare organizations need leaders who understand both patient care and the bottom line.",
        author: adminUser._id,
        status: "published",
        category: "Healthcare Leadership",
        tags: ["Administration", "Leadership", "Career"],
        readTimeMinutes: 6,
        coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
        publishDate: new Date('2024-04-05')
      },
      {
        title: "AI in Diagnostics: Augmentation vs. Automation",
        slug: "ai-in-diagnostics",
        content: "<p>Artificial Intelligence is rapidly entering the diagnostic space. The discourse must shift from fear of automation to the realities of augmentation—how AI can serve as a powerful second read for overloaded clinicians...</p>",
        excerpt: "Exploring the integration of machine learning algorithms in diagnostic pathways and clinical decision support.",
        author: adminUser._id,
        status: "published",
        category: "AI in Healthcare",
        tags: ["Artificial Intelligence", "Machine Learning", "Diagnostics"],
        readTimeMinutes: 8,
        coverImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=80",
        publishDate: new Date('2024-05-12')
      },
      {
        title: "Fitness for Duty: Navigating Complex Return-to-Work Cases",
        slug: "fitness-for-duty-complexities",
        content: "<p>Determining a patient's fitness for duty following a significant injury or psychological event requires a nuanced understanding of both clinical recovery and the specific physical demands of their occupation...</p>",
        excerpt: "The clinical and administrative complexities of managing return-to-work evaluations in occupational medicine.",
        author: adminUser._id,
        status: "published",
        category: "Occupational Medicine",
        tags: ["Return to Work", "Corporate Health", "Worker's Comp"],
        readTimeMinutes: 5,
        coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80",
        publishDate: new Date('2024-06-01')
      },
      {
        title: "Democratizing Medical Research: The Story of INSPIRE",
        slug: "democratizing-medical-research",
        content: "<p>When we founded INSPIRE, the goal was simple: provide medical students with a platform to publish rigorous scientific work without the barrier of exorbitant submission fees...</p>",
        excerpt: "Reflecting on the foundation of a peer-reviewed journal aimed at empowering student researchers.",
        author: adminUser._id,
        status: "published",
        category: "Medical Education",
        tags: ["Research", "Publishing", "Student Advocacy"],
        readTimeMinutes: 4,
        coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
        publishDate: new Date('2024-06-15')
      },
      {
        title: "Predictive Analytics in Population Health",
        slug: "predictive-analytics-population-health",
        content: "<p>Population health management relies on predicting where interventions are needed before acute events occur. By leveraging big data, health systems can stratify risk and deploy resources proactively...</p>",
        excerpt: "How data lakes and predictive modeling are transforming preventive medicine at the macro level.",
        author: adminUser._id,
        status: "published",
        category: "Healthcare Analytics",
        tags: ["Big Data", "Predictive Modeling", "Preventive Medicine"],
        readTimeMinutes: 6,
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
        publishDate: new Date('2024-07-02')
      }
    ];

    await Milestone.insertMany(milestones);
    console.log('12 Milestones seeded.');
    
    await Publication.insertMany(publications);
    console.log('15 Publications seeded.');
    
    await BlogPost.insertMany(blogs);
    console.log('10 Blog posts seeded.');

    console.log('Database enrichment complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
