// AZ Elevated Builders — SEO site data
// Cities within ~60 miles of Brentwood, CA + service definitions

export const BRAND = {
  name: "AZ Elevated Builders",
  domain: "https://azelevatedbuilders.com",
  phone: "(925) 812-3150",
  phoneHref: "+19258123150",
  phoneE164: "+19258123150",          // schema.org wants one canonical format
  email: "Azbuild3rs@gmail.com",
  city: "Brentwood",
  state: "CA",
  license: "CSLB Lic. # 1106795",
  // Single canonical entity node every page points at, so Google and AI
  // assistants resolve all 534 pages to one business.
  // Lead destination. Paste the Make custom-webhook URL here and rebuild —
  // Used by the organic website forms. Empty = forms fall back to phone/email.
  leadWebhook: "https://hook.us2.make.com/iva9bps6bve2k4lodckbgu266qets1yr",
  drivewayLeadWebhook: "https://hook.us2.make.com/rfn92i38h057afwomnibttrt0v0vhhtx",
  // Google Ads conversion tracking, paid landing page only. While the id is
  // empty nothing loads — no tag, no advertising cookies — which is what
  // privacy.html currently promises. Paste the conversion ID and label from
  // Google Ads to switch it on, and update that privacy paragraph in the same
  // change. Format: adsConversionId "AW-123456789", label "AbC-D_efGh12"
  // GA4, site-wide. Ads conversion tracking can also be driven from a GA4 key
  // event imported into Google Ads, which is the route that does not need a
  // conversion label.
  gaMeasurementId: "G-5Y4CM5S793",
  adsConversionId: "AW-17025083840",
  adsConversionLabel: "",
  entityId: "https://azelevatedbuilders.com/#organization",
  gbp: "https://www.google.com/maps/place/Az+Elevated+Builders/data=!4m2!3m1!1s0x0:0xeeb9e70cbadf8999",
  sameAs: [
    "https://www.google.com/maps/place/Az+Elevated+Builders/data=!4m2!3m1!1s0x0:0xeeb9e70cbadf8999",
    // TODO: add real Instagram / Facebook / Yelp / Houzz URLs when supplied
  ],
};

export const CITIES = [
  // Contra Costa County
  { name: "Brentwood", slug: "brentwood", county: "Contra Costa County", blurb: "Based in Brentwood, we serve Shadow Lakes, Deer Ridge and the neighborhoods off Balfour Road.", permit: "the City of Brentwood Building Division", era: "1990s and 2000s subdivisions wrapped around a much older downtown core", hoods: ["Shadow Lakes", "Deer Ridge", "Brentwood Park", "Garin Ranch"], profile: "modern", terrain: "expansive clay soil and triple-digit Delta summers" },
  { name: "Oakley", slug: "oakley", county: "Contra Costa County", blurb: "We offer remodeling and construction services in Oakley's subdivisions and Delta-side neighborhoods.", permit: "the City of Oakley Building Division", era: "late-1990s through 2010s tract construction with pockets of older Delta cottages", hoods: ["Summer Lake", "Magnolia Park", "Cypress Grove"], profile: "delta", terrain: "sandy Delta soil and a high water table close to the shoreline" },
  { name: "Antioch", slug: "antioch", county: "Contra Costa County", blurb: "We serve Antioch, from Rivertown to the neighborhoods around Lone Tree Way.", permit: "the City of Antioch Building Inspection Division", era: "everything from pre-war Rivertown cottages to 1970s ranches and 2000s hillside tracts", hoods: ["Rivertown", "Lone Tree Valley", "Mira Vista Hills", "Black Diamond"], profile: "postwar", terrain: "a mix of river-flat lots downtown and clay hillsides to the south" },
  { name: "Discovery Bay", slug: "discovery-bay", county: "Contra Costa County", blurb: "Waterfront living puts extra demands on a house. We build and remodel around docks, decks and Delta weather in Discovery Bay.", permit: "Contra Costa County Building Inspection, since Discovery Bay is unincorporated", era: "1980s through 2000s waterfront and golf-course homes", hoods: ["Discovery Bay Country Club", "Ravenswood", "Lakeshore", "The Willows"], profile: "delta", terrain: "levee-adjacent lots, a high water table and constant Delta wind and humidity" },
  { name: "Pittsburg", slug: "pittsburg", county: "Contra Costa County", blurb: "We offer remodeling and concrete work for Pittsburg's older homes and newer developments.", permit: "the City of Pittsburg Building Division", era: "1940s–60s working-town housing plus newer hillside development to the south", hoods: ["Old Town", "Vista Del Mar", "San Marco", "Woodlands"], profile: "postwar", terrain: "waterfront flats giving way to steep clay slopes inland" },
  { name: "Concord", slug: "concord", county: "Contra Costa County", blurb: "We offer whole-home remodeling and additions for Concord's ranch and split-level homes.", permit: "the City of Concord Building Division", era: "post-war 1950s and 60s ranch and split-level tracts", hoods: ["Todos Santos", "Dana Estates", "Ygnacio Valley", "Clayton Valley"], profile: "postwar", terrain: "flat valley lots with expansive clay and hot inland summers" },
  { name: "Clayton", slug: "clayton", county: "Contra Costa County", blurb: "Our Clayton services include kitchen remodeling, outdoor living and exterior updates.", permit: "the City of Clayton Building Division", era: "1970s–90s custom and semi-custom homes on generous lots", hoods: ["Oakhurst", "Peacock Creek", "Regency Woods", "downtown Clayton"], profile: "modern", terrain: "Mt. Diablo foothill slopes and wildland-urban interface fire requirements" },
  { name: "Walnut Creek", slug: "walnut-creek", county: "Contra Costa County", blurb: "We provide remodeling, concrete and finish work for Walnut Creek homes.", permit: "the City of Walnut Creek Building Division", era: "1950s–70s ranches, mid-century customs and newer downtown infill", hoods: ["Rossmoor", "Northgate", "Walnut Heights", "Downtown Walnut Creek"], adjacent: ["Saranap"], profile: "postwar", terrain: "valley floor and oak-covered hillside lots with mature tree protection rules" },
  { name: "Pleasant Hill", slug: "pleasant-hill", county: "Contra Costa County", blurb: "We offer remodeling services for Pleasant Hill's post-war homes, including plumbing, electrical and finish work.", permit: "the City of Pleasant Hill Building Division", era: "1950s and 60s post-war tracts, many never significantly updated", hoods: ["Gregory Gardens", "Poets Corner", "Sherman Acres", "Valley High"], profile: "postwar", terrain: "flat lots with original clay sewer laterals and aging service panels" },
  { name: "Martinez", slug: "martinez", county: "Contra Costa County", blurb: "We offer remodeling services for Martinez homes, from downtown Victorians to hillside ranches.", permit: "the City of Martinez Building Division", era: "Victorian and Craftsman downtown stock alongside 1960s–80s hillside homes", hoods: ["Downtown Martinez", "Muir Station", "Virginia Hills"], adjacent: ["Alhambra Valley", "Vine Hill"], profile: "historic", terrain: "steep older streets, knob-and-tube legacies and hillside drainage" },
  { name: "Lafayette", slug: "lafayette", county: "Contra Costa County", blurb: "We offer remodeling, finish carpentry and cabinetry services in Lafayette.", permit: "the City of Lafayette Building Division", era: "1950s–70s ranch homes on wooded lots, many now extensively remodeled", hoods: ["Happy Valley", "Burton Valley", "Trail neighborhood", "Reliez Valley"], profile: "postwar", terrain: "wooded hillside parcels with tree ordinances and fire-zone construction rules" },
  { name: "Orinda", slug: "orinda", county: "Contra Costa County", blurb: "Orinda's wooded lots and custom homes call for careful additions, structural know-how and finishes that disappear into the original.", permit: "the City of Orinda Building Department", era: "1930s–60s custom homes, many original and architecturally distinctive", hoods: ["Orinda Downs", "Sleepy Hollow", "Glorietta", "Orinda Village"], profile: "historic", terrain: "steep wooded canyons, narrow access roads and strict fire-zone requirements" },
  { name: "Moraga", slug: "moraga", county: "Contra Costa County", blurb: "In Moraga we handle everything from kitchen and bath remodels to full exterior repaints and new concrete.", permit: "the Town of Moraga Planning and Building Department", era: "1960s and 70s family homes on large lots", hoods: ["Moraga Country Club", "Campolindo", "Sanders Ranch", "Rheem Valley"], profile: "postwar", terrain: "rolling hillside lots with slope-stability and drainage considerations" },
  { name: "Alamo", slug: "alamo", county: "Contra Costa County", blurb: "Our Alamo services include bathroom remodeling, custom cabinetry, outdoor kitchens and painting.", permit: "Contra Costa County Building Inspection, since Alamo is unincorporated", era: "large custom estates from the 1960s onward, many on acre-plus parcels", hoods: ["Westside Alamo", "Round Hill", "Stone Valley", "Alamo Oaks"], profile: "modern", terrain: "acre-plus lots, private drives and septic systems on some parcels" },
  { name: "Danville", slug: "danville", county: "Contra Costa County", blurb: "We offer remodeling and construction services in Danville and neighboring Blackhawk.", permit: "the Town of Danville Building Division", era: "1970s–90s custom homes plus older Westside cottages near downtown", hoods: ["Westside Danville", "Greenbrook", "Sycamore Valley", "Tassajara Ranch"], adjacent: ["Blackhawk", "Diablo"], profile: "modern", terrain: "valley and foothill lots, several with HOA design review on top of town permits" },
  { name: "San Ramon", slug: "san-ramon", county: "Contra Costa County", blurb: "We offer kitchen and bathroom remodeling, ADUs and outdoor living projects in San Ramon.", permit: "the City of San Ramon Building and Safety Division", era: "1980s through 2010s planned communities, many with original builder finishes", hoods: ["Dougherty Valley", "Windemere", "Bishop Ranch area", "Gale Ranch"], profile: "modern", terrain: "planned-community lots where HOA architectural review runs alongside city permits" },
  { name: "Richmond", slug: "richmond", county: "Contra Costa County", blurb: "We offer remodeling services for Richmond's bungalows, hillside homes and waterfront properties.", permit: "the City of Richmond Building Regulations Division", era: "pre-war bungalows and wartime housing alongside newer hillside and marina builds", hoods: ["Point Richmond", "Marina Bay", "Richmond Annex", "May Valley"], profile: "historic", terrain: "older foundations, dated wiring and bay-adjacent moisture exposure" },
  { name: "El Cerrito", slug: "el-cerrito", county: "Contra Costa County", blurb: "We offer remodeling services in El Cerrito, with planning for sloped lots and existing home layouts.", permit: "the City of El Cerrito Building Division", era: "1920s–50s bungalows and mid-century homes stepping up the hillside", hoods: ["El Cerrito Hills", "Fairmount", "Richmond Annex border", "Cerrito Vista"], profile: "historic", terrain: "narrow sloped lots with tight access and downhill drainage to manage" },
  // Alameda County
  { name: "Oakland", slug: "oakland", county: "Alameda County", blurb: "We offer remodeling services across Oakland, from Rockridge Craftsman homes to hillside properties.", permit: "the City of Oakland Bureau of Building", era: "Craftsman, Victorian and Mediterranean stock largely pre-1940", hoods: ["Rockridge", "Montclair", "Temescal", "Glenview"], profile: "historic", terrain: "older foundations, seismic considerations and steep hillside lots" },
  { name: "Berkeley", slug: "berkeley", county: "Alameda County", blurb: "We offer remodeling services for Berkeley's older homes, with attention to existing materials and current code requirements.", permit: "the City of Berkeley Permit Service Center", era: "brown-shingle and Craftsman homes, a great many built before 1930", hoods: ["Elmwood", "North Berkeley", "Claremont", "Westbrae"], profile: "historic", terrain: "century-old framing, knob-and-tube remnants and strict local review" },
  { name: "Alameda", slug: "alameda", county: "Alameda County", blurb: "We offer remodeling and finish carpentry for Alameda's Victorian, Edwardian and Craftsman homes.", permit: "the City of Alameda Permit Center", era: "Victorian, Edwardian and Craftsman housing on a flat island grid", hoods: ["Gold Coast", "East End", "Bronze Coast", "Bay Farm Island"], profile: "historic", terrain: "island salt air, original millwork worth preserving and historic review in places" },
  { name: "San Leandro", slug: "san-leandro", county: "Alameda County", blurb: "Our San Leandro services include kitchen updates, ADU conversions and interior remodeling.", permit: "the City of San Leandro Building Division", era: "1940s–60s post-war tracts on compact, regular lots", hoods: ["Broadmoor", "Estudillo Estates", "Bal Theatre area", "Marina Faire"], profile: "postwar", terrain: "flat lots and detached garages to assess for possible ADU conversions" },
  { name: "Castro Valley", slug: "castro-valley", county: "Alameda County", blurb: "We offer remodeling, concrete and painting services throughout Castro Valley.", permit: "Alameda County Building Inspection, since Castro Valley is unincorporated", era: "1950s–70s ranch homes with newer custom builds up the canyon", hoods: ["Palomares Hills", "Five Canyons", "Proctor", "Lake Chabot area"], profile: "postwar", terrain: "canyon lots, sloped driveways and fire-zone requirements in the upper hills" },
  { name: "Hayward", slug: "hayward", county: "Alameda County", blurb: "Our Hayward services include ADUs, kitchen and bathroom remodeling, and concrete driveways.", permit: "the City of Hayward Permit Center", era: "1950s–70s tracts plus older downtown stock and newer hillside homes", hoods: ["Hayward Highlands", "Fairway Park", "Mt. Eden", "Glen Eden"], profile: "postwar", terrain: "proximity to the Hayward Fault, which shapes structural work on additions" },
  { name: "Dublin", slug: "dublin", county: "Alameda County", blurb: "We offer kitchen, bathroom and interior updates for Dublin homes.", permit: "the City of Dublin Building and Safety Division", era: "late-1990s through 2010s planned developments with builder-grade finishes", hoods: ["Dublin Ranch", "Positano", "Schaefer Ranch", "West Dublin"], profile: "modern", terrain: "newer construction and HOA review requirements on some properties" },
  { name: "Pleasanton", slug: "pleasanton", county: "Alameda County", blurb: "We offer remodeling services throughout Pleasanton, from downtown cottages to Ruby Hill homes.", permit: "the City of Pleasanton Building and Safety Division", era: "downtown Victorians and Craftsman cottages alongside 1980s–2000s estates", hoods: ["Ruby Hill", "Downtown Pleasanton", "Vintage Hills", "Birdland"], profile: "postwar", terrain: "a downtown historic district with design review, plus large estate parcels east of town" },
  { name: "Livermore", slug: "livermore", county: "Alameda County", blurb: "We offer outdoor living projects, ADUs and whole-home remodeling in Livermore.", permit: "the City of Livermore Building Division", era: "older downtown bungalows through 1990s and 2000s vineyard-adjacent homes", hoods: ["Downtown Livermore", "South Livermore", "Sunset East", "Vineyard Avenue"], profile: "postwar", terrain: "hot dry summers and larger parcels near rural areas" },
  { name: "Fremont", slug: "fremont", county: "Alameda County", blurb: "We offer remodeling and construction services across Fremont's neighborhoods.", permit: "the City of Fremont Building and Safety Division", era: "1950s–70s tracts across its several merged districts, plus newer infill", hoods: ["Mission San Jose", "Niles", "Irvington", "Warm Springs"], profile: "postwar", terrain: "distinct districts with different housing eras, and hillside lots toward Mission Peak" },
  // San Joaquin County
  { name: "Tracy", slug: "tracy", county: "San Joaquin County", blurb: "We offer concrete, painting and whole-home remodeling services in Tracy.", permit: "the City of Tracy Building Division", era: "older downtown homes ringed by fast 1990s–2010s subdivision growth", hoods: ["Downtown Tracy", "Edgewood", "Berkshire", "Presidio"], profile: "modern", terrain: "Central Valley heat and wind that punish exterior finishes and paint" },
  { name: "Mountain House", slug: "mountain-house", county: "San Joaquin County", blurb: "Our Mountain House services include kitchen remodeling, flooring, backyard projects and ADUs.", permit: "the Town of Mountain House, which incorporated in 2024 and now runs its own building department", era: "homes in a master-planned community built almost entirely since 2001", hoods: ["Questa", "Bethany", "Altamont", "Wicklund"], profile: "modern", terrain: "newer construction in planned neighborhoods" },
  { name: "Lathrop", slug: "lathrop", county: "San Joaquin County", blurb: "We serve Lathrop, including River Islands, Mossdale Landing and established neighborhoods throughout the city.", permit: "the City of Lathrop Building Division", era: "established older neighborhoods plus the rapidly growing River Islands development", hoods: ["River Islands", "Mossdale Landing", "Historic Lathrop"], profile: "modern", terrain: "river-adjacent lots with drainage and levee considerations" },
  { name: "Manteca", slug: "manteca", county: "San Joaquin County", blurb: "We offer remodeling and construction services throughout Manteca.", permit: "the City of Manteca Building Division", era: "mid-century cores with heavy 2000s and 2010s subdivision expansion", hoods: ["Downtown Manteca", "Woodward Park", "Union Ranch"], profile: "modern", terrain: "flat valley lots and long hot summers that drive shade and cooling upgrades" },
  { name: "Stockton", slug: "stockton", county: "San Joaquin County", blurb: "We offer remodeling services for Stockton's older homes and newer neighborhoods.", permit: "the City of Stockton Community Development Building Division", era: "grand pre-war homes in the older districts alongside post-war and newer north-side tracts", hoods: ["Miracle Mile", "Brookside", "Victory Park", "Pacific Avenue"], adjacent: ["Lincoln Village"], profile: "historic", terrain: "century-old homes with original systems, and Delta humidity on the west side" },
  // Solano County
  { name: "Rio Vista", slug: "rio-vista", county: "Solano County", blurb: "We offer remodeling and concrete services in Rio Vista, including downtown, Trilogy and Riverwalk.", permit: "the City of Rio Vista Building Department", era: "an older river-town core with newer active-adult development at Trilogy", hoods: ["Downtown Rio Vista", "Trilogy", "Riverwalk"], profile: "delta", terrain: "Delta wind, river humidity and soft soils near the waterfront" },
  { name: "Fairfield", slug: "fairfield", county: "Solano County", blurb: "We offer remodeling, painting and concrete services for Fairfield homes.", permit: "the City of Fairfield Building Division", era: "1960s–80s ranch tracts with newer development toward Green Valley", hoods: ["Green Valley", "Cordelia", "Rancho Solano", "Village 5"], profile: "postwar", terrain: "the Cordelia wind gap, which is hard on exterior paint and roofing" },
  { name: "Vacaville", slug: "vacaville", county: "Solano County", blurb: "Our Vacaville services include kitchen and bathroom remodeling, ADUs and concrete work.", permit: "the City of Vacaville Building Division", era: "1970s–2000s subdivisions plus older homes near the historic downtown", hoods: ["Browns Valley", "North Village", "Downtown Vacaville", "Cheyenne"], profile: "modern", terrain: "hot dry summers and larger lots that suit outdoor living and shade structures" },
  { name: "Vallejo", slug: "vallejo", county: "Solano County", blurb: "We offer whole-home remodeling for Vallejo's Victorian, Craftsman and mid-century homes.", permit: "the City of Vallejo Building Division", era: "Victorian and Craftsman heritage stock alongside wartime and post-war housing", hoods: ["Heritage District", "St. Vincent's Hill", "Glen Cove", "Hiddenbrooke"], profile: "historic", terrain: "waterfront exposure, older foundations and historic districts with added review" },
  { name: "Benicia", slug: "benicia", county: "Solano County", blurb: "We offer remodeling services for Benicia's historic downtown homes and waterside properties.", permit: "the City of Benicia Building Division", era: "pre-1900 and Victorian homes in one of California's oldest towns", hoods: ["Old Town Benicia", "Southampton", "Waterfront District"], profile: "historic", terrain: "salt air off the strait and historic-district review on many downtown properties" },
  // Napa County
  { name: "Napa", slug: "napa", county: "Napa County", blurb: "We offer remodeling, outdoor living and ADU projects across Napa.", permit: "the City of Napa Building Division", era: "Victorian and Craftsman homes downtown with newer development on the outskirts", hoods: ["Old Town Napa", "Alta Heights", "Browns Valley", "Carneros edge"], profile: "historic", terrain: "seismic retrofit considerations and wildfire-zone rules" },
  { name: "American Canyon", slug: "american-canyon", county: "Napa County", blurb: "We offer kitchen, flooring and backyard updates in American Canyon.", permit: "the City of American Canyon Building Division", era: "homes built from the 1990s onward, many with original builder finishes", hoods: ["Vintage Ranch", "Napa Junction", "Canyon Creek"], profile: "modern", terrain: "bay-edge wind exposure and newer residential construction" },
];

export const SERVICES = [
  {
    name: "Kitchen Remodeling", slug: "kitchen-remodeling",
    short: "Kitchen layout, cabinetry, stone, lighting and fixtures, installed by our crew.",
    img: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Remodeled kitchen with custom island and stone countertops",
    body: [
      "We remodel kitchens from layout through installation: wall changes, cabinetry, stone and quartz counters, and lighting placed for cooking and everyday use.",
      "Our crew handles plumbing, electrical, drywall, flooring and paint. We coordinate the work with one schedule and one point of contact.",
    ],
    features: ["Full kitchen gut-and-rebuild remodels", "Custom & semi-custom cabinetry installation", "Stone, quartz & butcher-block countertops", "Kitchen islands & layout changes", "Tile backsplashes & under-cabinet lighting", "In-house plumbing & electrical rough-in", "Appliance installation & venting", "Radiant heated flooring add-ons"],
    faqs: [
      { q: "How long does a kitchen remodel take?", a: "A pull-and-replace kitchen typically runs 3–5 weeks; a full layout change with structural work runs 6–10 weeks. You'll get a written schedule with your estimate. Our in-house trades coordinate the work." },
      { q: "Do I need permits for a kitchen remodel in {CITY}?", a: "Yes — if plumbing, electrical or walls are moving, a kitchen remodel in {CITY} needs a permit. AZ Elevated Builders handles permitting in {CITY} as part of the job, including plans and inspections." },
      { q: "What does a kitchen remodel cost?", a: "It depends on scope and finishes, which is why every project starts with a free on-site estimate and a written scope. Financing options are available, and all work carries our written warranty of up to five years." },
    ],
  },
  {
    name: "Bathroom Remodeling", slug: "bathroom-remodeling",
    short: "Bathroom remodeling with tile, stone, steam showers and heated floors, including waterproofing and plumbing.",
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Modern remodeled bathroom with walk-in shower and custom tile",
    body: [
      "We plan bathroom remodels around waterproofing, shower-pan slope and wall support, then install the tile, stone and fixtures you choose.",
      "We also install steam showers, saunas and radiant heated floors, coordinating waterproofing, plumbing and electrical work during the remodel.",
    ],
    features: ["Full bathroom gut remodels", "Walk-in showers & frameless glass", "Steam showers & sauna installation", "Radiant heated bathroom floors", "Custom tile & natural stone work", "Vanities, counters & storage built-ins", "In-house plumbing & electrical", "Primary-suite bath additions"],
    faqs: [
      { q: "How long does a bathroom remodel take?", a: "A standard full remodel runs 2–4 weeks. Steam showers, saunas or layout changes add time, and your written schedule will show it before we start." },
      { q: "Can you add a steam shower or heated floors to an existing bathroom in {CITY}?", a: "Yes. AZ Elevated Builders installs steam showers and heated floors in existing {CITY} bathrooms. We size the steam generator, waterproof the enclosure properly and run the electrical in-house." },
      { q: "Do you handle permits and inspections?", a: "Yes. AZ Elevated Builders handles all permits and inspections as part of the job — bathroom remodels involving plumbing or electrical changes are permitted and inspected, and we manage the entire process." },
    ],
  },
  {
    name: "Whole-Home Remodeling", slug: "whole-home-remodeling",
    short: "Interior and exterior remodeled as one project — layout, systems, finishes and paint under one crew.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Open-plan whole home remodel with new flooring and glazing",
    body: [
      "A whole-home remodel can update the layout, kitchen, bathrooms, flooring, systems and finishes in one project. We plan the work in sequence and coordinate the trades.",
      "Older homes can need repairs to plumbing, wiring or framing once walls are opened. Our in-house trades assess those conditions and discuss any changes to the scope and schedule with you.",
    ],
    features: ["Full interior renovations", "Exterior remodels & curb-appeal packages", "Layout changes & wall removal", "Plumbing & electrical updates", "Flooring, drywall, paint & trim", "Kitchen + bath combination scopes", "Energy & comfort upgrades", "Design collaboration available"],
    faqs: [
      { q: "How do you price a whole-home remodel?", a: "We walk the house with you, build a written scope room by room, and price it line by line — free. You'll know what's included, what's optional and what the schedule looks like before signing anything." },
      { q: "Can we live in the house during the remodel?", a: "Often, yes — many clients stay in the house during a whole-home remodel. AZ Elevated Builders sequences the work by zone so part of the house stays livable, keeps job sites clean daily, and explains when a phase is better done with the house empty." },
      { q: "Do you work with designers in {CITY}?", a: "Yes. AZ Elevated Builders works with designers on {CITY} projects — bring your own designer or plans, or we can loop in a designer we trust. Either way, the drawings, the schedule and the build stay coordinated under one roof." },
    ],
  },
  {
    name: "Home Additions & ADUs", slug: "additions-adus",
    short: "Home additions and ADUs, from feasibility and permits through construction.",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Detached ADU guest house with pool at dusk",
    body: [
      "We design and build primary-suite additions, kitchen expansions, family rooms and second-story additions. Rooflines, windows and finishes are planned to work with the existing house.",
      "An ADU can provide space for family or a rental unit. We handle feasibility, California's ADU requirements, local permitting and utilities through final inspection.",
    ],
    features: ["Room additions & home extensions", "Primary suite & bath additions", "Detached & attached ADUs", "Garage conversions", "Feasibility & permit management", "Utility connections & upsizing", "Full kitchens & baths in every unit", "Finish levels matched to the main house"],
    faqs: [
      { q: "Are ADUs legal in {CITY}?", a: "Yes — ADUs are legal in {CITY}. California law requires cities to allow ADUs on most residential lots, and {CITY} processes them under those state rules. We confirm setbacks, size limits and utility requirements for your specific parcel during the free feasibility visit." },
      { q: "What does an ADU cost to build?", a: "It varies with size, site and finish level — a garage conversion is a different project than a detached new build. We price it in a written scope after walking your property, and financing options are available." },
      { q: "How long does an addition take?", a: "Design and permitting typically run 2–4 months depending on the city; construction runs 3–6 months for most additions and detached ADUs. We provide a written schedule and keep you updated weekly." },
    ],
  },
  {
    name: "Concrete & Driveways", slug: "concrete-driveways",
    short: "Driveways, patios, walkways and retaining walls — formed, poured and finished by our own crew.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Modern home exterior with new concrete driveway and walkways",
    body: [
      "Our crew builds driveways, patios, walkways, slabs and retaining walls. We plan base compaction, reinforcement and joints for the site and the way the concrete will be used.",
      "We pour standard broom finish, exposed aggregate, and stamped and colored finishes, and we tie new flatwork into drainage so water moves away from the house instead of under it.",
    ],
    features: ["New concrete driveways & extensions", "Patios & outdoor living slabs", "Walkways, steps & porches", "Retaining walls", "Stamped, colored & exposed aggregate finishes", "Old concrete demo & haul-off", "Proper base prep & reinforcement", "Drainage integration"],
    faqs: [
      { q: "How long before I can use my new driveway?", a: "Foot traffic in 24–48 hours, vehicles in about 7 days as the slab cures toward full strength. We'll give you exact numbers for your pour and weather." },
      { q: "How fast can you pour a driveway in {CITY}?", a: "Driveways are one of our quickest turnarounds — most tear-out-and-repour projects in {CITY} run 3–5 working days from demo to finished pour, weather permitting." },
      { q: "Do you build retaining walls?", a: "Yes. AZ Elevated Builders builds retaining walls — engineered where height requires it, with proper drainage behind the wall. We plan drainage behind the wall as part of the installation." },
    ],
  },
  {
    name: "Interior & Exterior Painting", slug: "painting",
    short: "Full-prep painting inside and out — 22 years on the brush, straight lines, quality coatings.",
    img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Freshly painted home exterior at dusk",
    body: [
      "Our lead painter has 22 years of experience. We wash, scrape, sand, patch and prime as needed, then apply coatings to manufacturer specifications with careful masking and edging.",
      "Exterior painting updates the appearance of a home and helps protect siding and trim from sun and rain.",
    ],
    features: ["Full exterior repaints", "Interior walls, ceilings & trim", "Cabinet painting & refinishing", "Stucco, siding & trim repair before paint", "Complete prep: wash, scrape, patch, prime", "Premium coatings & color consultation", "Clean masking & daily site cleanup", "Fast, scheduled turnarounds"],
    faqs: [
      { q: "How long does an exterior repaint take?", a: "Most single-family exteriors run 4–7 working days including prep and dry time between coats. Larger homes or heavy repair scopes take longer — the written schedule comes with your free estimate." },
      { q: "What paint brands do you use?", a: "Premium lines from major manufacturers, chosen for the surface and exposure — and we're happy to match a brand or color spec you already have. Every coating is applied to manufacturer spec so warranties hold." },
      { q: "Do you paint in winter in {CITY}?", a: "Yes. AZ Elevated Builders paints exteriors through the winter in {CITY} — the season has plenty of paintable windows. We track temperature and moisture and schedule exterior coats when conditions let the coating cure properly." },
    ],
  },
  {
    name: "Flooring Installation", slug: "flooring",
    short: "Hardwood, engineered, tile and laminate — plus radiant heat — installed flat, tight and clean.",
    img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "New hardwood flooring in a bright remodeled living space",
    body: [
      "We flatten and prepare substrates, then install hardwood, engineered hardwood, tile and laminate with the specified expansion gaps and transitions.",
      "We also install radiant heated flooring under compatible tile and engineered flooring.",
    ],
    features: ["Solid hardwood installation", "Engineered hardwood", "Tile flooring — porcelain, ceramic & stone", "Laminate & LVP", "Radiant heated floor systems", "Subfloor repair & leveling", "Baseboard & transition detailing", "Old flooring removal & disposal"],
    faqs: [
      { q: "Which flooring is right for my project?", a: "It depends on the room, the traffic and the look you want — solid hardwood refinishes for generations, engineered handles moisture swings better, tile wins wet rooms, laminate and LVP take a beating for less. We'll walk options and samples at the free estimate." },
      { q: "How long does flooring installation take?", a: "Most single-room installs run 1–3 days; whole-home flooring runs about a week depending on prep. Materials may need days on-site to acclimate first — we build that into the schedule." },
      { q: "Do you level uneven floors in older {CITY} homes?", a: "Yes. AZ Elevated Builders levels uneven floors before installing — settling and out-of-flat slabs are standard in older {CITY} housing stock. We grind or self-level before install, because flooring is only as good as what's under it." },
    ],
  },
  {
    name: "Drywall Installation & Repair", slug: "drywall",
    short: "Drywall installation, taping, texturing and repairs by a specialist with 20 years of experience.",
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Clean finished interior walls in a remodeled home",
    body: [
      "Our drywall specialist has 20 years of experience in installation, finishing and repairs. We prepare flat surfaces, finish corners and match surrounding textures.",
      "We hang, tape, texture and finish drywall for remodels and standalone projects, including repairs to existing walls and ceilings.",
    ],
    features: ["New drywall for remodels & additions", "Water & fire damage repair", "Texture matching — orange peel, knockdown, smooth", "Level 5 smooth finishes", "Ceiling repair & popcorn removal", "Soundproofing & insulation upgrades", "Patching after plumbing/electrical work", "Paint-ready finishing"],
    faqs: [
      { q: "Can you match my existing wall texture?", a: "Yes. AZ Elevated Builders matches existing wall textures. Orange peel, knockdown, hand troweled or smooth, the patch should disappear after paint." },
      { q: "Do you remove popcorn ceilings in {CITY}?", a: "Yes, with one important step first. On any home built before 1978 the ceiling texture must be tested for asbestos before removal. If it tests positive we bring in a certified abatement contractor; if it is clean, our crew scrapes, skims and refinishes to a smooth or light texture in {CITY}. We leave the room ready for paint." },
      { q: "How fast can a repair be done?", a: "Small patches are often same-day with a return visit for texture and touch-up after drying. Larger repairs run 2–4 days because mud needs to dry between coats." },
    ],
  },
  {
    name: "Cabinetry & Countertops", slug: "cabinetry-countertops",
    short: "Custom and semi-custom cabinets with stone and quartz countertops.",
    img: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Custom kitchen cabinetry with stone countertops",
    body: [
      "We specify, order, template and install cabinets and countertops together, coordinating cabinet alignment, counter levels and seam placement.",
      "We help you choose custom or semi-custom cabinetry to suit the space and budget. Our finish carpenters handle the installation.",
    ],
    features: ["Custom & semi-custom cabinetry", "Cabinet refacing & hardware upgrades", "Quartz, granite & natural stone counters", "Butcher block & specialty surfaces", "Precision templating & installation", "Built-ins, pantries & storage systems", "Bathroom vanities", "Soft-close & organization upgrades"],
    faqs: [
      { q: "Custom or semi-custom — which should I choose?", a: "Semi-custom covers most kitchens beautifully at a better price point; full custom earns its cost with unusual spaces, specific woods or furniture-grade details. We'll show you both against your budget at the estimate." },
      { q: "How long do new counters take?", a: "We template after cabinets are set, fabrication runs 1–2 weeks, and installation is usually a day. We sequence plumbing reconnection the same week so you're not without a sink." },
      { q: "Do you install cabinetry outside of full remodels in {CITY}?", a: "Yes. AZ Elevated Builders installs cabinetry and countertops as standalone projects in {CITY}. We can assess the existing cabinets and counters and discuss the options with you." },
    ],
  },
  {
    name: "Finish Carpentry & Trim", slug: "finish-carpentry-trim",
    short: "Baseboards, casing, wainscot, built-ins and stairs, fitted to your home.",
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Detailed interior trim and finish carpentry work",
    body: [
      "Our finish carpenters install and repair baseboards, door and window casing, crown molding, wainscot, paneling, shelves, built-ins and stair details. We fit each piece to the surrounding walls and prepare it for paint or stain.",
      "Trim work can be included with a remodel, repaint or flooring project, or scheduled separately.",
    ],
    features: ["Baseboards & door/window casing", "Crown molding", "Wainscot, board-and-batten & paneling", "Custom built-ins & floating shelves", "Stair rails, treads & skirt boards", "Interior door replacement & hanging", "Mantels & feature walls", "Paint-grade & stain-grade work"],
    faqs: [
      { q: "Can you match existing trim profiles?", a: "Yes, in most cases AZ Elevated Builders can match your existing trim profile. Between stock profiles, combinations and custom knives for larger runs, we can match the existing trim. Bring us a cutoff or we'll pull a profile on site." },
      { q: "What does trim work cost?", a: "Cost depends on the amount of trim, profile complexity and installation conditions. We measure the space and provide a free estimate." },
      { q: "Do you do standalone trim projects in {CITY}?", a: "Yes. AZ Elevated Builders takes standalone trim projects in {CITY} — a base-casing-and-doors package is one of the fastest ways to lift an entire {CITY} home, usually inside a week." },
    ],
  },
  {
    name: "Steam Showers, Saunas & Heated Floors", slug: "steam-showers-saunas",
    short: "Steam showers, saunas and radiant heated floors, including waterproofing and electrical installation.",
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Spa bathroom with steam shower and warm stone finishes",
    body: [
      "Steam showers, saunas and heated floors require coordinated waterproofing, electrical work and equipment sizing. We plan those requirements with the room layout.",
      "We install vapor-sealed enclosures, correctly sized steam generators, dedicated circuits and accessible controls. Our work carries a written warranty of up to five years.",
    ],
    features: ["Steam shower design & construction", "Steam generator sizing & installation", "Indoor & outdoor sauna builds", "Radiant heated floors — bathrooms, kitchens & more", "Full vapor-sealed waterproofing", "Dedicated electrical circuits & controls", "Tile & stone enclosure finishes", "Integration with full bath remodels"],
    faqs: [
      { q: "Can a steam shower go in my existing bathroom?", a: "Yes, in most cases a steam shower can be added to an existing bathroom. The enclosure needs to be sealed and sized to the generator, and we confirm both at the free estimate. We plan the required plumbing, electrical and waterproofing changes before installation." },
      { q: "Are heated floors expensive to run?", a: "Running cost depends on the heated area, system wattage, thermostat schedule and your electricity rate. We review the system specifications with you when planning the installation." },
      { q: "Do you install saunas in {CITY}?", a: "Yes. AZ Elevated Builders installs saunas in {CITY}, including indoor conversions and outdoor builds. We can include a sauna in a bathroom remodel or backyard project." },
    ],
  },
  {
    name: "Pergolas & Outdoor Living", slug: "pergolas-outdoor-living",
    short: "Pergolas, patios, landscaping and outdoor rooms, designed and built together.",
    img: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Backyard pergola and outdoor living space at dusk",
    body: [
      "We design and build pergolas, patio covers, outdoor kitchens, concrete patios and landscaping as one coordinated project.",
      "Our concrete, carpentry and electrical crews coordinate footings, patio drainage, lighting and power connections.",
    ],
    features: ["Custom pergolas & patio covers", "Concrete patios & outdoor slabs", "Outdoor kitchens & BBQ islands", "Landscaping & planting design", "Low-voltage & string lighting", "Fences, gates & privacy screens", "Drainage & irrigation", "Full backyard transformations"],
    faqs: [
      { q: "Do pergolas need permits in {CITY}?", a: "It depends. Whether a pergola needs a permit in {CITY} comes down to size, height and attachment to the house — {CITY} exempts some smaller detached structures. We confirm requirements for your design and pull the permit when one's needed." },
      { q: "Wood or aluminum pergola?", a: "Wood offers a natural finish and flexible detailing; aluminum generally needs less maintenance. We build both and can help you compare appearance, upkeep and site exposure." },
      { q: "Can you do the whole backyard — concrete, pergola and landscaping?", a: "Yes. AZ Elevated Builders can include concrete, a pergola and landscaping in one backyard project. We coordinate grades, drainage, footings and planting in the same plan." },
    ],
  },
];

// Intro sentence variants keyed by (cityIdx + serviceIdx) % 3 — keeps 480 pages from opening identically
export const OPENERS = [
  (s, c) => `AZ Elevated Builders provides ${s.name.toLowerCase()} in ${c.name}. We're a family-run, CA-licensed contractor based in Brentwood. Contact us for a free on-site estimate.`,
  (s, c) => `We offer ${s.name.toLowerCase()} in ${c.name}, ${c.county}. Our family-run crew is based in Brentwood, with 15+ years of experience in each trade.`,
  (s, c) => `Planning ${s.name.toLowerCase()} in ${c.name}? AZ Elevated Builders offers free estimates with a written scope. Our work carries a written warranty of up to five years.`,
];

/* ============================================================
   LOCAL LENSES
   Each service reads the same city facts through a different lens, so a
   page varies on BOTH axes (city × service) instead of being one template
   with the city name swapped in.
============================================================ */
export const SERVICE_LOCAL = {
  "kitchen-remodeling": {
    permit: "Kitchens almost always trip the permit threshold — moving a sink or range means plumbing, gas and electrical inspections, and we pull and carry those for you.",
    terrain: "We plan dust control, appliance staging and any temporary kitchen setup before work begins.",
  },
  "bathroom-remodeling": {
    permit: "Bathroom permits hinge on whether plumbing moves and whether the exhaust and circuits meet current code. We coordinate the paperwork and inspections.",
    terrain: "We plan waterproofing details and allow time for materials to dry between coats.",
  },
  "whole-home-remodeling": {
    permit: "A whole-home scope means a full plan set and a longer review, so we account for permitting and demolition in the project schedule.",
    terrain: "We consider insulation, window specifications and the way the home handles heat and moisture throughout the year.",
  },
  "additions-adus": {
    permit: "Additions and ADUs are the most review-heavy work we do — setbacks, lot coverage, utilities and California's ADU rules all get checked before a shovel moves.",
    terrain: "We assess foundations, drainage and space on the lot when planning an addition or detached unit.",
  },
  "concrete-driveways": {
    permit: "Flatwork often needs less review than interior work, but anything touching drainage, the right-of-way or a retaining wall does — we confirm before we form.",
    terrain: "Soil and site conditions inform base preparation, reinforcement and joint placement.",
  },
  "painting": {
    permit: "Repaints rarely need a permit.",
    terrain: "Exterior coatings need the right temperature and moisture conditions to cure properly. We account for both when choosing products and scheduling the work.",
  },
  "flooring": {
    permit: "Flooring itself is usually permit-exempt, which keeps the timeline short — though we flag it when subfloor or structural repair changes that.",
    terrain: "Humidity and moisture conditions help determine which flooring materials suit the space.",
  },
  "drywall": {
    permit: "Drywall work is typically permit-exempt unless it accompanies structural or electrical changes, so repairs can often start within days.",
    terrain: "Seasonal movement can cause recurring cracks. We assess the surrounding surfaces before planning the repair.",
  },
  "cabinetry-countertops": {
    permit: "Cabinet and counter replacement usually needs no permit on its own.",
    terrain: "We consider humidity and temperature changes when selecting cabinet materials and finishes.",
  },
  "finish-carpentry-trim": {
    permit: "Trim work needs no permit, so it is one of the easiest projects to schedule and one of the fastest to finish.",
    terrain: "We allow wood trim to acclimate and plan joints to accommodate movement.",
  },
  "steam-showers-saunas": {
    permit: "Steam and sauna installations mean dedicated circuits and sealed assemblies, so they are permitted and inspected — we handle both.",
    terrain: "We plan vapor sealing and ventilation to manage moisture around steam and sauna installations.",
  },
  "pergolas-outdoor-living": {
    permit: "Whether a structure needs a permit comes down to size, height and attachment to the house — we confirm the threshold before design is final.",
    terrain: "We consider orientation, shade, wind exposure and footing requirements when planning outdoor structures.",
  },
};

// Rotated so the closing pitch is not byte-identical across 480 pages.
export const WHY_VARIANTS = [
  (c) => `Our family-run crew serves ${c.name}, with 15+ years of experience in each trade. Estimates are free, financing is available, and our work carries a written warranty of up to five years.`,
  (c) => `For your ${c.name} project, we provide a free estimate and a written scope before work begins. You'll have one point of contact throughout the job and a written warranty of up to five years.`,
  (c) => `We review your ${c.name} project with you and prepare a written estimate. Financing is available, and our work carries a written warranty of up to five years.`,
  (c) => `Contact us to schedule a walkthrough in ${c.name}. We provide free estimates, a written schedule and a warranty of up to five years.`,
  (c) => `Your ${c.name} project starts with a free on-site estimate and written scope. Our crew coordinates the trades, keeps the site clean and provides a written warranty of up to five years.`,
];

// Several images per service, rotated by city so neighboring pages don't
// share a hero. PLACEHOLDERS — swap for Alfonso's real job photos.
export const SERVICE_IMAGES = {
  "kitchen-remodeling": [
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1600&auto=format&fit=crop",
  ],
  "bathroom-remodeling": [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop",
  ],
  "whole-home-remodeling": [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
  ],
  "additions-adus": [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
  ],
  "concrete-driveways": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=1600&auto=format&fit=crop",
  ],
  "painting": [
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1600&auto=format&fit=crop",
  ],
  "flooring": [
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566752734-2a0cd53d1d1f?q=80&w=1600&auto=format&fit=crop",
  ],
  "drywall": [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop",
  ],
  "cabinetry-countertops": [
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1600&auto=format&fit=crop",
  ],
  "finish-carpentry-trim": [
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595514535215-9a5e0e8e04be?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1600&auto=format&fit=crop",
  ],
  "steam-showers-saunas": [
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1600&auto=format&fit=crop",
  ],
  "pergolas-outdoor-living": [
    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566752229-250ed79470f8?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598902108854-10e335adac99?q=80&w=1600&auto=format&fit=crop",
  ],
};

/* Profile-specific paragraph per service. A Berkeley kitchen page and a Dublin
   kitchen page describe genuinely different problems, so they read differently. */
export const PROFILE_NOTES = {
  "kitchen-remodeling": {
    historic: "A pre-war kitchen may be enclosed and separate from the living areas. If you want to open the layout, we assess the walls and any structural work required.",
    postwar: "A post-war kitchen may have original cabinets and a compact layout. We assess storage, lighting and appliance placement before deciding which changes are needed.",
    modern: "In a newer kitchen, the layout may already suit the household. Cabinetry, counters and lighting can be updated within that footprint.",
    delta: "Kitchens near the water can be exposed to humidity changes and hard water. We consider those conditions when choosing cabinet materials, fixtures and finishes.",
  },
  "bathroom-remodeling": {
    historic: "Older bathrooms may have cast-iron drains, galvanized supply lines or subfloor damage. We assess those conditions as part of planning the remodel.",
    postwar: "A post-war bathroom may have a compact layout, an alcove tub or older tile assemblies. We review the footprint and existing materials when planning changes.",
    modern: "A newer bathroom may benefit from changes to the tub, shower, lighting or ventilation. We assess the existing plumbing and layout before planning the work.",
    delta: "In humid conditions, ventilation and a properly sealed enclosure help control moisture around the bathroom. We review both during the remodel.",
  },
  "whole-home-remodeling": {
    historic: "Older homes may have knob-and-tube wiring, unreinforced foundations or single-pane windows. We assess these systems and discuss needed repairs alongside the remodeling plans.",
    postwar: "A post-war remodel may include opening up smaller rooms and updating aging systems. We assess framing, spans and the condition of plumbing and electrical systems before setting the scope.",
    modern: "A whole-home project in a newer house may focus on materials, lighting and storage. We assess any repair needs alongside the planned updates.",
    delta: "For a whole-home remodel near the Delta, we review moisture control, envelope sealing, insulation and cooling capacity alongside the interior finishes.",
  },
  "additions-adus": {
    historic: "For an addition to a historic home, we review the siding, window proportions and roof pitch to plan compatible details. We also check whether neighborhood design review applies.",
    postwar: "Some post-war properties have space for an addition or ADU. We assess the lot and any existing garage during the feasibility review.",
    modern: "Newer lots can be compact and may require HOA architectural review alongside city permits. We consider both during design.",
    delta: "Additions near the Delta need attention to foundations and drainage because of soil conditions and the water table. We assess these during feasibility planning.",
  },
  "concrete-driveways": {
    historic: "For an older driveway, we assess the slab, base and drainage before recommending repair or replacement.",
    postwar: "Cracking, settlement and drainage problems can develop as a driveway ages. Replacement includes evaluating the base and planning reinforcement and joints for the site.",
    modern: "We assess newer driveways for damage, drainage and available space when planning an extension or replacement.",
    delta: "Soil movement near the Delta can affect concrete slabs. We plan base preparation, slab thickness and joint placement around the site conditions.",
  },
  "painting": {
    historic: "Older homes may have several layers of paint or failing coatings. We assess surface preparation needs and account for lead-safe practices on pre-1978 homes.",
    postwar: "Before painting older siding and trim, we check caulk joints, trim ends and stucco for damage or cracks that need repair.",
    modern: "For a newer home, we assess the existing coatings and surfaces before planning preparation, repairs and color changes.",
    delta: "Sun and wind exposure affect exterior coatings, particularly on south- and west-facing surfaces. We consider exposure and curing conditions when selecting products and scheduling work.",
  },
  "flooring": {
    historic: "Older homes may have hardwood beneath carpet or vinyl. We assess its condition before discussing refinishing or replacement, and check substrate levels before installation.",
    postwar: "Some post-war homes have oak strip flooring beneath carpet. We assess its condition and discuss whether refinishing or replacement suits the project.",
    modern: "In newer homes, we assess existing carpet, laminate and subfloor conditions before planning replacement flooring and any preparation work.",
    delta: "We assess moisture and humidity conditions before recommending flooring near the water. Material options may include engineered hardwood or LVP, depending on the room and installation requirements.",
  },
  "drywall": {
    historic: "Older homes may have lath and plaster alongside drywall. We identify the existing materials and plan repairs and texture blending accordingly.",
    postwar: "When repairing a textured wall, we review the existing finish and plan a matching texture before painting.",
    modern: "Drywall repairs in a newer home may follow plumbing work, wall removal or nail pops and settlement cracks. We assess the affected surfaces before planning repairs.",
    delta: "Seasonal humidity changes can move framing and contribute to recurring cracks. We consider that movement when planning repairs.",
  },
  "cabinetry-countertops": {
    historic: "Older homes may have out-of-square walls or uneven ceiling heights. We measure these conditions and plan scribing and fillers for the cabinet installation.",
    postwar: "For older cabinets, we review dimensions, condition and available storage before discussing replacement or updates.",
    modern: "Newer kitchens may have layouts that work well with the existing cabinets. We assess whether cabinet replacement, refacing or new countertops fit the project.",
    delta: "We consider moisture exposure and maintenance needs when selecting cabinet materials, countertops and finishes.",
  },
  "finish-carpentry-trim": {
    historic: "Older homes may have original trim profiles worth retaining. We assess their condition and discuss matching or extending them where work is planned.",
    postwar: "We assess existing baseboards and casing before planning trim updates. New profiles can be selected to suit the rooms and surrounding finishes.",
    modern: "In newer homes, updated baseboards, casing and built-ins can add detail and storage while working with the existing layout.",
    delta: "Humidity changes cause wood movement. We account for acclimation and joint details when fitting trim.",
  },
  "steam-showers-saunas": {
    historic: "We check electrical capacity when planning steam showers, saunas and heated floors in older homes. A subpanel or dedicated circuit may be needed alongside waterproofing work.",
    postwar: "Adding steam to an older bathroom may require rebuilding the enclosure. We assess the existing assembly and plan vapor sealing, electrical work and the steam generator.",
    modern: "We check electrical panel capacity, available space and installation requirements before adding steam or a sauna to a newer home.",
    delta: "In humid conditions, we review vapor sealing and ventilation to help keep moisture out of surrounding wall assemblies.",
  },
  "pergolas-outdoor-living": {
    historic: "At an older property, we assess the yard layout, access and existing structures before planning a patio, outdoor kitchen or shade structure.",
    postwar: "Post-war properties may have room for a patio, pergola or outdoor kitchen. We assess the available space, drainage and access before planning the layout.",
    modern: "A backyard with an existing slab can be updated with shade, lighting, planting or an outdoor kitchen, depending on the space and intended use.",
    delta: "We consider sun and wind exposure when planning the orientation, shade and footings of outdoor structures.",
  },
};
