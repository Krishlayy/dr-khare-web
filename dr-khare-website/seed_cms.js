const mongoose = require('mongoose');
const SiteContent = require('./server/models/SiteContent');

mongoose.connect('mongodb://localhost:27017/dr-khare-website', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const defaultData = [
  {
    key: 'about_page',
    value: {
      biography_lead: 'Dr. Supreet Khare is a physician, healthcare executive, and ICMR scholar practising at the intersection of internal medicine, occupational health, and the institutions that hold modern care together.',
      biography_body: 'He currently serves as the founding Managing Director and Chief Executive Officer of Compendious Med Works, where he leads strategic growth and medical oversight for comprehensive occupational health solutions. Simultaneously, he is the Chief Executive Officer of California Medical Behavioral Health.',
      clinical_leadership: 'Throughout his career, Dr. Khare has championed policies that support clinician well-being and patient advocacy. He serves as the Medical Director of Occupational & Environmental Medicine at Lompoc Valley Medical Center and previously represented his residency program on the American College of Physicians (ACP) Council of Residents.\n\nHis dual background in clinical medicine and healthcare administration (MPH, MBA) has enabled him to pioneer systemic improvements across large hospital systems, emphasizing the importance of occupational health standards, clinical documentation integrity, and the mental health of healthcare providers.',
      research: 'As an ICMR scholar, his early research laid the groundwork for his ongoing interest in population health metrics and epidemiology. He is widely published in peer-reviewed journals, focusing heavily on internal medicine advancements, the occupational hazards of the modern clinical workforce, and innovative care models that bridge the gap between behavioral and physical health.'
    }
  },
  {
    key: 'ask_page',
    value: {
      suggestions: [
        "What leadership roles has Dr. Khare held?",
        "Tell me about Dr. Khare's research work.",
        "What are Dr. Khare's major achievements?",
        "Which institutions has Dr. Khare worked with?",
        "What certifications does Dr. Khare hold?",
        "Has Dr. Khare published in PubMed-indexed journals?"
      ]
    }
  },
  {
    key: 'homepage_pillars',
    value: [
      { id: "leadership", title: "Executive Leadership", icon: "HeartPulse", desc: "Building systems that hold modern medicine together." },
      { id: "research", title: "Clinical Research", icon: "Microscope", desc: "Occupational hazard analysis and systemic immunology." },
      { id: "clinical", title: "Occupational Medicine", icon: "Stethoscope", desc: "Fitness-for-duty, return-to-work, and corporate health." },
      { id: "innovation", title: "Health Innovation", icon: "BrainCircuit", desc: "Integrating data analytics, AI, and digital health." },
      { id: "writing", title: "Editorial & Writing", icon: "BookOpen", desc: "Thought leadership on the future of care delivery." }
    ]
  },
  {
    key: 'homepage_metrics',
    value: [
      { value: 14, suffix: "+", label: "Peer-Reviewed Publications" },
      { value: 5, suffix: "", label: "Consecutive ICMR Scholarships" },
      { value: 10, suffix: "+", label: "Original Research Projects" },
      { value: 3, suffix: "", label: "Executive Directorships" },
    ]
  },
  {
    key: 'homepage_awards',
    value: [
      { year: "2010-2014", title: "5x ICMR Short Term Studentship", org: "Indian Council of Medical Research" },
      { year: "2013", title: "Full Scholarship Invitee", org: "5th International Medical Summer School, Manchester" },
      { year: "2014", title: "Champion's Trophy", org: "Karmic Conference (Awarded by Nobel Laureate Dr. Robin Warren)" },
      { year: "2017", title: "2nd Prize, GME Scholarly Day", org: "University of Arizona" },
      { year: "2017", title: "Resident as Educator Finals", org: "University of Arizona" },
    ]
  },
  {
    key: 'page_layout',
    value: {
      sections: [
        { id: 'hero', visible: true, order: 1 },
        { id: 'video', visible: true, order: 2 },
        { id: 'research', visible: true, order: 3 },
        { id: 'publications', visible: true, order: 4 },
        { id: 'insights', visible: true, order: 5 },
        { id: 'awards', visible: true, order: 6 },
        { id: 'metrics', visible: true, order: 7 },
        { id: 'journey', visible: true, order: 8 },
        { id: 'reviews', visible: true, order: 9 },
        { id: 'ai', visible: true, order: 10 }
      ]
    }
  }
];

async function seed() {
  for (const item of defaultData) {
    await SiteContent.findOneAndUpdate({ key: item.key }, { value: item.value }, { upsert: true });
  }
  console.log('Seed complete');
  process.exit();
}

seed();
