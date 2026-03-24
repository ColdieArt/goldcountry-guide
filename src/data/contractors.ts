import { Contractor } from "./types";

export const contractors: Contractor[] = [
  // ─── Electricians (existing + placeholders) ───────────────────
  {
    slug: "jc-electrical",
    name: "JC Electrical",
    tradeSlug: "electricians",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "newcastle", active: true },
      { citySlug: "loomis", active: true },
      { citySlug: "rocklin", active: true },
    ],
    phone: "(530) 555-0101",
    website: "https://jcelectrical.example.com",
    description:
      "JC Electrical has been serving Auburn and the surrounding Gold Country foothills for over 15 years. Specializing in residential electrical work including panel upgrades, EV charger installations, and whole-home rewiring.",
    specialties: ["Panel Upgrades", "EV Chargers", "Whole-Home Rewiring"],
    yearsInBusiness: 15,
    licensed: true,
    licenseNumber: "C10-123456",
    membershipStatus: "featured",
    active: true,
    featuredProjectSlugs: ["panel-upgrade-smith-auburn"],
    leadPreferences: {
      premiumLevel: "premium",
      acceptedBudgetTiers: ["medium", "large", "enterprise"],
      maxLeadsPerMonth: 20,
    },
  },
  {
    slug: "foothill-electric",
    name: "Foothill Electric",
    tradeSlug: "electricians",
    primaryCitySlug: "grass-valley",
    additionalCities: [
      { citySlug: "nevada-city", active: true },
    ],
    phone: "(530) 555-0110",
    description: "Foothill Electric provides residential and light commercial electrical services in Nevada County.",
    specialties: ["Lighting Design", "Code Corrections", "Generator Installs"],
    yearsInBusiness: 12,
    licensed: true,
    licenseNumber: "C10-200001",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "placer-power-electric",
    name: "Placer Power Electric",
    tradeSlug: "electricians",
    primaryCitySlug: "rocklin",
    additionalCities: [
      { citySlug: "roseville", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(916) 555-0111",
    description: "Placer Power Electric handles panel upgrades, new construction wiring, and solar hook-ups across western Placer County.",
    specialties: ["Solar Hook-ups", "New Construction", "Panel Upgrades"],
    yearsInBusiness: 9,
    licensed: true,
    licenseNumber: "C10-200002",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "gold-rush-wiring",
    name: "Gold Rush Wiring",
    tradeSlug: "electricians",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "newcastle", active: true },
      { citySlug: "grass-valley", active: true },
    ],
    phone: "(530) 555-0112",
    description: "Gold Rush Wiring specializes in older-home rewiring and bringing vintage properties up to modern code in the Gold Country foothills.",
    specialties: ["Older Home Rewiring", "Knob & Tube Replacement", "Inspections"],
    yearsInBusiness: 20,
    licensed: true,
    licenseNumber: "C10-200003",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "sierra-spark-electric",
    name: "Sierra Spark Electric",
    tradeSlug: "electricians",
    primaryCitySlug: "nevada-city",
    additionalCities: [
      { citySlug: "grass-valley", active: true },
    ],
    phone: "(530) 555-0113",
    description: "Sierra Spark Electric offers fast, reliable electrical repair and installation services throughout Nevada County.",
    specialties: ["Troubleshooting", "Ceiling Fans", "Outlet Upgrades"],
    yearsInBusiness: 6,
    licensed: true,
    licenseNumber: "C10-200004",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "roseville-electric-pros",
    name: "Roseville Electric Pros",
    tradeSlug: "electricians",
    primaryCitySlug: "roseville",
    additionalCities: [
      { citySlug: "rocklin", active: true },
    ],
    phone: "(916) 555-0114",
    description: "Roseville Electric Pros is a family-owned electrical company focused on safety, quality, and fair pricing in the Roseville area.",
    specialties: ["EV Chargers", "Smart Home Wiring", "Landscape Lighting"],
    yearsInBusiness: 7,
    licensed: true,
    licenseNumber: "C10-200005",
    membershipStatus: "free",
    active: true,
  },

  // ─── Plumbers (existing + placeholders) ───────────────────────
  {
    slug: "sierra-plumbing-co",
    name: "Sierra Plumbing Co.",
    tradeSlug: "plumbers",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "rocklin", active: true },
      { citySlug: "roseville", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(530) 555-0202",
    website: "https://sierraplumbing.example.com",
    description:
      "Sierra Plumbing Co. provides reliable plumbing services throughout Placer County. From emergency repairs to full repiping, their team handles jobs of all sizes.",
    specialties: ["Water Heaters", "Repiping", "Emergency Repairs"],
    yearsInBusiness: 10,
    licensed: true,
    licenseNumber: "C36-789012",
    membershipStatus: "premium",
    active: true,
    featuredProjectSlugs: ["tankless-heater-jones-auburn"],
    leadPreferences: {
      premiumLevel: "standard",
      acceptedBudgetTiers: ["small", "medium", "large"],
    },
  },
  {
    slug: "nv-county-plumbing",
    name: "NV County Plumbing",
    tradeSlug: "plumbers",
    primaryCitySlug: "grass-valley",
    additionalCities: [
      { citySlug: "nevada-city", active: true },
    ],
    phone: "(530) 555-0210",
    description: "NV County Plumbing serves Nevada County with honest, dependable plumbing from drain cleaning to full remodels.",
    specialties: ["Drain Cleaning", "Bath Remodels", "Sewer Lines"],
    yearsInBusiness: 14,
    licensed: true,
    licenseNumber: "C36-300001",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "foothills-plumbing-and-drain",
    name: "Foothills Plumbing & Drain",
    tradeSlug: "plumbers",
    primaryCitySlug: "newcastle",
    additionalCities: [
      { citySlug: "auburn", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(530) 555-0211",
    description: "Foothills Plumbing & Drain offers affordable plumbing solutions for homes in the central foothill communities.",
    specialties: ["Leak Detection", "Water Heaters", "Fixture Installs"],
    yearsInBusiness: 5,
    licensed: true,
    licenseNumber: "C36-300002",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "roseville-rooter",
    name: "Roseville Rooter",
    tradeSlug: "plumbers",
    primaryCitySlug: "roseville",
    additionalCities: [
      { citySlug: "rocklin", active: true },
    ],
    phone: "(916) 555-0212",
    description: "Roseville Rooter clears drains fast and handles all residential plumbing needs in Roseville and Rocklin.",
    specialties: ["Rooter Service", "Camera Inspections", "Garbage Disposals"],
    yearsInBusiness: 11,
    licensed: true,
    licenseNumber: "C36-300003",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "gold-vein-plumbing",
    name: "Gold Vein Plumbing",
    tradeSlug: "plumbers",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "grass-valley", active: true },
      { citySlug: "newcastle", active: true },
    ],
    phone: "(530) 555-0213",
    description: "Gold Vein Plumbing brings decades of foothill experience to every job, from simple faucet swaps to whole-house repiping.",
    specialties: ["Repiping", "Gas Lines", "Faucet Installs"],
    yearsInBusiness: 18,
    licensed: true,
    licenseNumber: "C36-300004",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "loomis-plumbing-works",
    name: "Loomis Plumbing Works",
    tradeSlug: "plumbers",
    primaryCitySlug: "loomis",
    additionalCities: [
      { citySlug: "rocklin", active: true },
    ],
    phone: "(916) 555-0214",
    description: "Loomis Plumbing Works provides prompt, professional plumbing services to the Loomis and Rocklin communities.",
    specialties: ["Tankless Water Heaters", "Slab Leaks", "Sump Pumps"],
    yearsInBusiness: 8,
    licensed: true,
    licenseNumber: "C36-300005",
    membershipStatus: "free",
    active: true,
  },

  // ─── Roofers (existing + placeholders) ────────────────────────
  {
    slug: "gold-country-roofing",
    name: "Gold Country Roofing",
    tradeSlug: "roofers",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "grass-valley", active: true },
      { citySlug: "nevada-city", active: true },
      { citySlug: "newcastle", active: true },
    ],
    phone: "(530) 555-0303",
    description:
      "Gold Country Roofing specializes in roof replacements and repairs for homes in the Sierra foothills. Experienced with composition shingle, tile, and metal roofing systems.",
    specialties: ["Roof Replacement", "Tile Roofing", "Storm Damage Repair"],
    yearsInBusiness: 8,
    licensed: true,
    licenseNumber: "C39-345678",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "sierra-top-roofing",
    name: "Sierra Top Roofing",
    tradeSlug: "roofers",
    primaryCitySlug: "grass-valley",
    additionalCities: [
      { citySlug: "nevada-city", active: true },
    ],
    phone: "(530) 555-0310",
    description: "Sierra Top Roofing provides quality roof installations and repairs throughout Nevada County.",
    specialties: ["Metal Roofing", "Leak Repair", "Gutter Install"],
    yearsInBusiness: 10,
    licensed: true,
    licenseNumber: "C39-400001",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "placer-roofing-solutions",
    name: "Placer Roofing Solutions",
    tradeSlug: "roofers",
    primaryCitySlug: "rocklin",
    additionalCities: [
      { citySlug: "roseville", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(916) 555-0311",
    description: "Placer Roofing Solutions delivers reliable roofing for new and existing homes in western Placer County.",
    specialties: ["Composition Shingle", "Flat Roofs", "Inspections"],
    yearsInBusiness: 13,
    licensed: true,
    licenseNumber: "C39-400002",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "roseville-roofing-co",
    name: "Roseville Roofing Co.",
    tradeSlug: "roofers",
    primaryCitySlug: "roseville",
    additionalCities: [
      { citySlug: "rocklin", active: true },
    ],
    phone: "(916) 555-0312",
    description: "Roseville Roofing Co. is a trusted local roofer offering free inspections and competitive pricing.",
    specialties: ["Re-roofing", "Ventilation", "Solar Prep"],
    yearsInBusiness: 6,
    licensed: true,
    licenseNumber: "C39-400003",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "foothill-roof-masters",
    name: "Foothill Roof Masters",
    tradeSlug: "roofers",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "newcastle", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(530) 555-0313",
    description: "Foothill Roof Masters brings craftsmanship and attention to detail to every roofing project in the foothills.",
    specialties: ["Tile Roofing", "Cedar Shake", "Emergency Tarps"],
    yearsInBusiness: 15,
    licensed: true,
    licenseNumber: "C39-400004",
    membershipStatus: "free",
    active: true,
  },

  // ─── HVAC ─────────────────────────────────────────────────────
  {
    slug: "auburn-heating-and-air",
    name: "Auburn Heating & Air",
    tradeSlug: "hvac",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "newcastle", active: true },
      { citySlug: "loomis", active: true },
      { citySlug: "rocklin", active: true },
    ],
    phone: "(530) 555-0401",
    description: "Auburn Heating & Air keeps Gold Country homes comfortable year-round with expert HVAC installation and repair.",
    specialties: ["AC Install", "Furnace Repair", "Duct Sealing"],
    yearsInBusiness: 17,
    licensed: true,
    licenseNumber: "C20-500001",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "sierra-climate-control",
    name: "Sierra Climate Control",
    tradeSlug: "hvac",
    primaryCitySlug: "grass-valley",
    additionalCities: [
      { citySlug: "nevada-city", active: true },
    ],
    phone: "(530) 555-0402",
    description: "Sierra Climate Control specializes in efficient heating and cooling for mountain and foothill homes in Nevada County.",
    specialties: ["Heat Pumps", "Mini Splits", "Zoning Systems"],
    yearsInBusiness: 11,
    licensed: true,
    licenseNumber: "C20-500002",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "roseville-comfort-hvac",
    name: "Roseville Comfort HVAC",
    tradeSlug: "hvac",
    primaryCitySlug: "roseville",
    additionalCities: [
      { citySlug: "rocklin", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(916) 555-0403",
    description: "Roseville Comfort HVAC provides fast, affordable heating and cooling services in the greater Roseville area.",
    specialties: ["AC Replacement", "Thermostats", "Maintenance Plans"],
    yearsInBusiness: 9,
    licensed: true,
    licenseNumber: "C20-500003",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "nv-city-hvac",
    name: "NV City HVAC",
    tradeSlug: "hvac",
    primaryCitySlug: "nevada-city",
    additionalCities: [
      { citySlug: "grass-valley", active: true },
    ],
    phone: "(530) 555-0404",
    description: "NV City HVAC understands the unique heating challenges of mountain living and delivers reliable, efficient solutions.",
    specialties: ["Wood Stove Integration", "Radiant Heat", "AC Install"],
    yearsInBusiness: 14,
    licensed: true,
    licenseNumber: "C20-500004",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "placer-air-systems",
    name: "Placer Air Systems",
    tradeSlug: "hvac",
    primaryCitySlug: "rocklin",
    additionalCities: [
      { citySlug: "roseville", active: true },
      { citySlug: "auburn", active: true },
    ],
    phone: "(916) 555-0405",
    description: "Placer Air Systems designs and installs high-efficiency HVAC systems for new construction and retrofits.",
    specialties: ["New Construction HVAC", "Energy Audits", "Ductwork"],
    yearsInBusiness: 10,
    licensed: true,
    licenseNumber: "C20-500005",
    membershipStatus: "free",
    active: true,
  },

  // ─── Tree Service ─────────────────────────────────────────────
  {
    slug: "gold-country-tree-care",
    name: "Gold Country Tree Care",
    tradeSlug: "tree-service",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "newcastle", active: true },
      { citySlug: "grass-valley", active: true },
    ],
    phone: "(530) 555-0501",
    description: "Gold Country Tree Care provides safe, professional tree removal and trimming throughout the foothills.",
    specialties: ["Tree Removal", "Trimming", "Stump Grinding"],
    yearsInBusiness: 12,
    licensed: true,
    licenseNumber: "D49-600001",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "sierra-arbor-works",
    name: "Sierra Arbor Works",
    tradeSlug: "tree-service",
    primaryCitySlug: "nevada-city",
    additionalCities: [
      { citySlug: "grass-valley", active: true },
    ],
    phone: "(530) 555-0502",
    description: "Sierra Arbor Works is a certified arborist team serving Nevada County with expert tree health and removal services.",
    specialties: ["Arborist Consulting", "Hazard Trees", "Fire Clearing"],
    yearsInBusiness: 16,
    licensed: true,
    licenseNumber: "D49-600002",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "placer-tree-pros",
    name: "Placer Tree Pros",
    tradeSlug: "tree-service",
    primaryCitySlug: "rocklin",
    additionalCities: [
      { citySlug: "roseville", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(916) 555-0503",
    description: "Placer Tree Pros handles tree removal, trimming, and stump grinding for residential properties in western Placer County.",
    specialties: ["Large Tree Removal", "Crown Reduction", "Lot Clearing"],
    yearsInBusiness: 8,
    licensed: true,
    licenseNumber: "D49-600003",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "loomis-tree-service",
    name: "Loomis Tree Service",
    tradeSlug: "tree-service",
    primaryCitySlug: "loomis",
    additionalCities: [
      { citySlug: "newcastle", active: true },
      { citySlug: "auburn", active: true },
    ],
    phone: "(916) 555-0504",
    description: "Loomis Tree Service specializes in oak and pine care for the foothill landscape.",
    specialties: ["Oak Care", "Pine Removal", "Emergency Storm Cleanup"],
    yearsInBusiness: 10,
    licensed: true,
    licenseNumber: "D49-600004",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "roseville-tree-experts",
    name: "Roseville Tree Experts",
    tradeSlug: "tree-service",
    primaryCitySlug: "roseville",
    additionalCities: [
      { citySlug: "rocklin", active: true },
    ],
    phone: "(916) 555-0505",
    description: "Roseville Tree Experts offers fast, insured tree services for the Roseville and Rocklin communities.",
    specialties: ["Tree Trimming", "Stump Removal", "Hedge Shaping"],
    yearsInBusiness: 7,
    licensed: true,
    licenseNumber: "D49-600005",
    membershipStatus: "free",
    active: true,
  },

  // ─── General Contractors ──────────────────────────────────────
  {
    slug: "auburn-builders",
    name: "Auburn Builders",
    tradeSlug: "general-contractors",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "newcastle", active: true },
      { citySlug: "grass-valley", active: true },
    ],
    phone: "(530) 555-0601",
    description: "Auburn Builders manages residential remodels, additions, and new custom home construction in the Gold Country foothills.",
    specialties: ["Custom Homes", "Additions", "Kitchen Remodels"],
    yearsInBusiness: 22,
    licensed: true,
    licenseNumber: "B-700001",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "sierra-summit-construction",
    name: "Sierra Summit Construction",
    tradeSlug: "general-contractors",
    primaryCitySlug: "grass-valley",
    additionalCities: [
      { citySlug: "nevada-city", active: true },
    ],
    phone: "(530) 555-0602",
    description: "Sierra Summit Construction builds and remodels homes throughout Nevada County with a focus on mountain-style living.",
    specialties: ["Remodels", "ADUs", "Decks & Patios"],
    yearsInBusiness: 15,
    licensed: true,
    licenseNumber: "B-700002",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "placer-home-builders",
    name: "Placer Home Builders",
    tradeSlug: "general-contractors",
    primaryCitySlug: "rocklin",
    additionalCities: [
      { citySlug: "roseville", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(916) 555-0603",
    description: "Placer Home Builders delivers quality general contracting for new builds and whole-home renovations in western Placer County.",
    specialties: ["New Construction", "Bathroom Remodels", "Garage Conversions"],
    yearsInBusiness: 13,
    licensed: true,
    licenseNumber: "B-700003",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "nevada-city-remodel-co",
    name: "Nevada City Remodel Co.",
    tradeSlug: "general-contractors",
    primaryCitySlug: "nevada-city",
    additionalCities: [
      { citySlug: "grass-valley", active: true },
    ],
    phone: "(530) 555-0604",
    description: "Nevada City Remodel Co. specializes in sensitive renovations of historic and Victorian-era homes.",
    specialties: ["Historic Renovation", "Permit Management", "Structural Repair"],
    yearsInBusiness: 19,
    licensed: true,
    licenseNumber: "B-700004",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "roseville-general-contracting",
    name: "Roseville General Contracting",
    tradeSlug: "general-contractors",
    primaryCitySlug: "roseville",
    additionalCities: [
      { citySlug: "rocklin", active: true },
    ],
    phone: "(916) 555-0605",
    description: "Roseville General Contracting handles home additions, remodels, and commercial tenant improvements.",
    specialties: ["Home Additions", "Commercial TI", "Room Conversions"],
    yearsInBusiness: 11,
    licensed: true,
    licenseNumber: "B-700005",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "loomis-country-builders",
    name: "Loomis Country Builders",
    tradeSlug: "general-contractors",
    primaryCitySlug: "loomis",
    additionalCities: [
      { citySlug: "newcastle", active: true },
    ],
    phone: "(916) 555-0606",
    description: "Loomis Country Builders brings a personal, community-focused approach to home construction and renovation.",
    specialties: ["Barn Conversions", "Outdoor Living", "Foundation Work"],
    yearsInBusiness: 9,
    licensed: true,
    licenseNumber: "B-700006",
    membershipStatus: "free",
    active: true,
  },

  // ─── Concrete Contractors ─────────────────────────────────────
  {
    slug: "gold-country-concrete",
    name: "Gold Country Concrete",
    tradeSlug: "concrete-contractors",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "newcastle", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(530) 555-0701",
    description: "Gold Country Concrete pours driveways, patios, foundations, and retaining walls throughout the Auburn area.",
    specialties: ["Driveways", "Foundations", "Retaining Walls"],
    yearsInBusiness: 14,
    licensed: true,
    licenseNumber: "C8-800001",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "sierra-concrete-works",
    name: "Sierra Concrete Works",
    tradeSlug: "concrete-contractors",
    primaryCitySlug: "grass-valley",
    additionalCities: [
      { citySlug: "nevada-city", active: true },
    ],
    phone: "(530) 555-0702",
    description: "Sierra Concrete Works specializes in decorative and stamped concrete for mountain properties.",
    specialties: ["Stamped Concrete", "Colored Concrete", "Walkways"],
    yearsInBusiness: 10,
    licensed: true,
    licenseNumber: "C8-800002",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "placer-flatwork",
    name: "Placer Flatwork",
    tradeSlug: "concrete-contractors",
    primaryCitySlug: "rocklin",
    additionalCities: [
      { citySlug: "roseville", active: true },
    ],
    phone: "(916) 555-0703",
    description: "Placer Flatwork delivers precision flatwork, slabs, and curbing for residential and commercial properties.",
    specialties: ["Slabs", "Curbing", "Commercial Flatwork"],
    yearsInBusiness: 8,
    licensed: true,
    licenseNumber: "C8-800003",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "roseville-concrete-co",
    name: "Roseville Concrete Co.",
    tradeSlug: "concrete-contractors",
    primaryCitySlug: "roseville",
    additionalCities: [
      { citySlug: "rocklin", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(916) 555-0704",
    description: "Roseville Concrete Co. handles everything from small patio pours to large commercial foundations.",
    specialties: ["Patios", "Pool Decks", "Foundations"],
    yearsInBusiness: 12,
    licensed: true,
    licenseNumber: "C8-800004",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "foothill-concrete-solutions",
    name: "Foothill Concrete Solutions",
    tradeSlug: "concrete-contractors",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "grass-valley", active: true },
      { citySlug: "newcastle", active: true },
    ],
    phone: "(530) 555-0705",
    description: "Foothill Concrete Solutions provides durable, high-quality concrete work for the foothill region.",
    specialties: ["Retaining Walls", "Stairways", "Exposed Aggregate"],
    yearsInBusiness: 16,
    licensed: true,
    licenseNumber: "C8-800005",
    membershipStatus: "free",
    active: true,
  },

  // ─── Architects ───────────────────────────────────────────────
  {
    slug: "auburn-design-studio",
    name: "Auburn Design Studio",
    tradeSlug: "architects",
    primaryCitySlug: "auburn",
    additionalCities: [
      { citySlug: "newcastle", active: true },
      { citySlug: "grass-valley", active: true },
    ],
    phone: "(530) 555-0801",
    description: "Auburn Design Studio creates custom residential plans that blend with the natural beauty of the Gold Country landscape.",
    specialties: ["Custom Home Design", "ADU Plans", "Remodel Blueprints"],
    yearsInBusiness: 18,
    licensed: true,
    licenseNumber: "ARC-900001",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "nevada-county-architects",
    name: "Nevada County Architects",
    tradeSlug: "architects",
    primaryCitySlug: "nevada-city",
    additionalCities: [
      { citySlug: "grass-valley", active: true },
    ],
    phone: "(530) 555-0802",
    description: "Nevada County Architects designs mountain-style homes and assists with permitting in Nevada County.",
    specialties: ["Mountain Style Homes", "Permitting", "Green Design"],
    yearsInBusiness: 20,
    licensed: true,
    licenseNumber: "ARC-900002",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "placer-architectural-group",
    name: "Placer Architectural Group",
    tradeSlug: "architects",
    primaryCitySlug: "rocklin",
    additionalCities: [
      { citySlug: "roseville", active: true },
      { citySlug: "loomis", active: true },
    ],
    phone: "(916) 555-0803",
    description: "Placer Architectural Group provides full-service residential architecture for new builds and major remodels.",
    specialties: ["New Construction Plans", "3D Rendering", "Site Planning"],
    yearsInBusiness: 14,
    licensed: true,
    licenseNumber: "ARC-900003",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "roseville-home-design",
    name: "Roseville Home Design",
    tradeSlug: "architects",
    primaryCitySlug: "roseville",
    additionalCities: [
      { citySlug: "rocklin", active: true },
    ],
    phone: "(916) 555-0804",
    description: "Roseville Home Design helps homeowners envision and plan their dream homes with modern, functional layouts.",
    specialties: ["Modern Design", "Open Floor Plans", "Energy Efficiency"],
    yearsInBusiness: 9,
    licensed: true,
    licenseNumber: "ARC-900004",
    membershipStatus: "free",
    active: true,
  },
  {
    slug: "grass-valley-design-build",
    name: "Grass Valley Design-Build",
    tradeSlug: "architects",
    primaryCitySlug: "grass-valley",
    additionalCities: [
      { citySlug: "nevada-city", active: true },
      { citySlug: "auburn", active: true },
    ],
    phone: "(530) 555-0805",
    description: "Grass Valley Design-Build offers integrated architecture and construction management for a seamless build experience.",
    specialties: ["Design-Build", "Cabin Design", "Historic Restoration Plans"],
    yearsInBusiness: 12,
    licensed: true,
    licenseNumber: "ARC-900005",
    membershipStatus: "free",
    active: true,
  },
];

// ─── City coverage helpers ──────────────────────────────────────

/**
 * Returns city slugs where a contractor has active coverage.
 * Inactive contractors get NO discovery presence — returns [].
 */
export function getActiveCitySlugs(contractor: Contractor): string[] {
  if (!contractor.active) return [];
  return [
    contractor.primaryCitySlug,
    ...contractor.additionalCities
      .filter((c) => c.active)
      .map((c) => c.citySlug),
  ];
}

/**
 * Returns ALL city slugs (active + inactive coverage).
 * Used on the contractor's own profile page to show full service area.
 */
export function getAllCitySlugsForContractor(contractor: Contractor): string[] {
  return [
    contractor.primaryCitySlug,
    ...contractor.additionalCities.map((c) => c.citySlug),
  ];
}

/**
 * Checks if a contractor has active coverage in a specific city.
 * Both the membership AND the city-level coverage must be active.
 */
export function hasCityCoverage(
  contractor: Contractor,
  citySlug: string
): boolean {
  if (!contractor.active) return false;
  if (contractor.primaryCitySlug === citySlug) return true;
  return contractor.additionalCities.some(
    (c) => c.citySlug === citySlug && c.active
  );
}

// ─── Query helpers ──────────────────────────────────────────────

/** Only returns active contractors unless includeInactive is true. */
function activeOnly(list: Contractor[], includeInactive = false): Contractor[] {
  return includeInactive ? list : list.filter((c) => c.active);
}

/** Returns a contractor by slug regardless of active status (for profile pages). */
export function getContractorBySlug(slug: string): Contractor | undefined {
  return contractors.find((c) => c.slug === slug);
}

export function getContractorsByTrade(
  tradeSlug: string,
  includeInactive = false
): Contractor[] {
  return activeOnly(
    contractors.filter((c) => c.tradeSlug === tradeSlug),
    includeInactive
  );
}

/**
 * Returns contractors with active coverage in a given city.
 * Respects both membership active status AND per-city coverage.
 */
export function getContractorsByCity(
  citySlug: string,
  includeInactive = false
): Contractor[] {
  if (includeInactive) {
    return contractors.filter((c) =>
      getAllCitySlugsForContractor(c).includes(citySlug)
    );
  }
  return contractors.filter((c) => hasCityCoverage(c, citySlug));
}

/**
 * Returns contractors matching trade AND active city coverage.
 */
export function getContractorsByTradeAndCity(
  tradeSlug: string,
  citySlug: string,
  includeInactive = false
): Contractor[] {
  if (includeInactive) {
    return contractors.filter(
      (c) =>
        c.tradeSlug === tradeSlug &&
        getAllCitySlugsForContractor(c).includes(citySlug)
    );
  }
  return contractors.filter(
    (c) => c.tradeSlug === tradeSlug && hasCityCoverage(c, citySlug)
  );
}

export function getFeaturedContractors(): Contractor[] {
  return contractors.filter(
    (c) => c.active && c.membershipStatus === "featured"
  );
}
