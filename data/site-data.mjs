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
  { name: "Brentwood", slug: "brentwood", county: "Contra Costa County", blurb: "Our home base. From Shadow Lakes to Deer Ridge and the older neighborhoods off Balfour Road, we know Brentwood's housing stock street by street.", permit: "the City of Brentwood Building Division", era: "1990s and 2000s subdivisions wrapped around a much older downtown core", hoods: ["Shadow Lakes", "Deer Ridge", "Brentwood Park", "Garin Ranch"], profile: "modern", terrain: "expansive clay soil and triple-digit Delta summers" },
  { name: "Oakley", slug: "oakley", county: "Contra Costa County", blurb: "Five minutes from our shop, Oakley's newer subdivisions and Delta-side properties are some of our most frequent job sites.", permit: "the City of Oakley Building Division", era: "late-1990s through 2010s tract construction with pockets of older Delta cottages", hoods: ["Summer Lake", "Magnolia Park", "Cypress Grove"], profile: "delta", terrain: "sandy Delta soil and a high water table close to the shoreline" },
  { name: "Antioch", slug: "antioch", county: "Contra Costa County", blurb: "From Rivertown's older homes to the newer builds off Lone Tree Way, Antioch remodels make up a big share of our calendar.", permit: "the City of Antioch Building Inspection Division", era: "everything from pre-war Rivertown cottages to 1970s ranches and 2000s hillside tracts", hoods: ["Rivertown", "Lone Tree Valley", "Mira Vista Hills", "Black Diamond"], profile: "postwar", terrain: "a mix of river-flat lots downtown and clay hillsides to the south" },
  { name: "Discovery Bay", slug: "discovery-bay", county: "Contra Costa County", blurb: "Waterfront living puts extra demands on a house. We build and remodel around docks, decks and Delta weather in Discovery Bay.", permit: "Contra Costa County Building Inspection, since Discovery Bay is unincorporated", era: "1980s through 2000s waterfront and golf-course homes", hoods: ["Discovery Bay Country Club", "Ravenswood", "Lakeshore", "The Willows"], profile: "delta", terrain: "levee-adjacent lots, a high water table and constant Delta wind and humidity" },
  { name: "Pittsburg", slug: "pittsburg", county: "Contra Costa County", blurb: "Pittsburg's mix of mid-century homes and new hillside construction keeps our remodel and concrete crews busy year-round.", permit: "the City of Pittsburg Building Division", era: "1940s–60s working-town housing plus newer hillside development to the south", hoods: ["Old Town", "Vista Del Mar", "San Marco", "Woodlands"], profile: "postwar", terrain: "waterfront flats giving way to steep clay slopes inland" },
  { name: "Concord", slug: "concord", county: "Contra Costa County", blurb: "Concord's ranchers and split-levels are perfect candidates for the whole-home remodels and additions we specialize in.", permit: "the City of Concord Building Division", era: "post-war 1950s and 60s ranch and split-level tracts", hoods: ["Todos Santos", "Dana Estates", "Ygnacio Valley", "Clayton Valley"], profile: "postwar", terrain: "flat valley lots with expansive clay and hot inland summers" },
  { name: "Clayton", slug: "clayton", county: "Contra Costa County", blurb: "At the foot of Mt. Diablo, Clayton homeowners call us for high-end kitchens, outdoor living and exterior refreshes.", permit: "the City of Clayton Building Division", era: "1970s–90s custom and semi-custom homes on generous lots", hoods: ["Oakhurst", "Peacock Creek", "Regency Woods", "downtown Clayton"], profile: "modern", terrain: "Mt. Diablo foothill slopes and wildland-urban interface fire requirements" },
  { name: "Walnut Creek", slug: "walnut-creek", county: "Contra Costa County", blurb: "Walnut Creek expects a higher standard of finish — exactly the kind of detailed, quality-first work our crew was built for.", permit: "the City of Walnut Creek Building Division", era: "1950s–70s ranches, mid-century customs and newer downtown infill", hoods: ["Rossmoor", "Northgate", "Walnut Heights", "Downtown Walnut Creek"], adjacent: ["Saranap"], profile: "postwar", terrain: "valley floor and oak-covered hillside lots with mature tree protection rules" },
  { name: "Pleasant Hill", slug: "pleasant-hill", county: "Contra Costa County", blurb: "Pleasant Hill's post-war homes hide surprises behind the walls. Our in-house trades handle them without blowing up the schedule.", permit: "the City of Pleasant Hill Building Division", era: "1950s and 60s post-war tracts, many never significantly updated", hoods: ["Gregory Gardens", "Poets Corner", "Sherman Acres", "Valley High"], profile: "postwar", terrain: "flat lots with original clay sewer laterals and aging service panels" },
  { name: "Martinez", slug: "martinez", county: "Contra Costa County", blurb: "From downtown Victorians to hillside ranchers, Martinez remodels reward a crew that respects older construction.", permit: "the City of Martinez Building Division", era: "Victorian and Craftsman downtown stock alongside 1960s–80s hillside homes", hoods: ["Downtown Martinez", "Muir Station", "Virginia Hills"], adjacent: ["Alhambra Valley", "Vine Hill"], profile: "historic", terrain: "steep older streets, knob-and-tube legacies and hillside drainage" },
  { name: "Lafayette", slug: "lafayette", county: "Contra Costa County", blurb: "Lafayette clients hire for quality, not price. Our finish carpentry and cabinetry work is built for exactly that bar.", permit: "the City of Lafayette Building Division", era: "1950s–70s ranch homes on wooded lots, many now extensively remodeled", hoods: ["Happy Valley", "Burton Valley", "Trail neighborhood", "Reliez Valley"], profile: "postwar", terrain: "wooded hillside parcels with tree ordinances and fire-zone construction rules" },
  { name: "Orinda", slug: "orinda", county: "Contra Costa County", blurb: "Orinda's wooded lots and custom homes call for careful additions, structural know-how and finishes that disappear into the original.", permit: "the City of Orinda Building Department", era: "1930s–60s custom homes, many original and architecturally distinctive", hoods: ["Orinda Downs", "Sleepy Hollow", "Glorietta", "Orinda Village"], profile: "historic", terrain: "steep wooded canyons, narrow access roads and strict fire-zone requirements" },
  { name: "Moraga", slug: "moraga", county: "Contra Costa County", blurb: "In Moraga we handle everything from kitchen and bath remodels to full exterior repaints and new concrete.", permit: "the Town of Moraga Planning and Building Department", era: "1960s and 70s family homes on large lots", hoods: ["Moraga Country Club", "Campolindo", "Sanders Ranch", "Rheem Valley"], profile: "postwar", terrain: "rolling hillside lots with slope-stability and drainage considerations" },
  { name: "Alamo", slug: "alamo", county: "Contra Costa County", blurb: "Alamo estates demand estate-level work — steam showers, custom cabinetry, outdoor kitchens and flawless paint.", permit: "Contra Costa County Building Inspection, since Alamo is unincorporated", era: "large custom estates from the 1960s onward, many on acre-plus parcels", hoods: ["Westside Alamo", "Round Hill", "Stone Valley", "Alamo Oaks"], profile: "modern", terrain: "acre-plus lots, private drives and septic systems on some parcels" },
  { name: "Danville", slug: "danville", county: "Contra Costa County", blurb: "From Westside Danville to Blackhawk, we deliver the detailed, high-end remodels this market expects.", permit: "the Town of Danville Building Division", era: "1970s–90s custom homes plus older Westside cottages near downtown", hoods: ["Westside Danville", "Greenbrook", "Sycamore Valley", "Tassajara Ranch"], adjacent: ["Blackhawk", "Diablo"], profile: "modern", terrain: "valley and foothill lots, several with HOA design review on top of town permits" },
  { name: "San Ramon", slug: "san-ramon", county: "Contra Costa County", blurb: "San Ramon's newer homes are ready for personality — chef's kitchens, spa baths, ADUs and backyard living.", permit: "the City of San Ramon Building and Safety Division", era: "1980s through 2010s planned communities, many with original builder finishes", hoods: ["Dougherty Valley", "Windemere", "Bishop Ranch area", "Gale Ranch"], profile: "modern", terrain: "planned-community lots where HOA architectural review runs alongside city permits" },
  { name: "Richmond", slug: "richmond", county: "Contra Costa County", blurb: "Richmond's older bungalows and view homes in the hills both benefit from a crew that owns every trade in-house.", permit: "the City of Richmond Building Regulations Division", era: "pre-war bungalows and wartime housing alongside newer hillside and marina builds", hoods: ["Point Richmond", "Marina Bay", "Richmond Annex", "May Valley"], profile: "historic", terrain: "older foundations, dated wiring and bay-adjacent moisture exposure" },
  { name: "El Cerrito", slug: "el-cerrito", county: "Contra Costa County", blurb: "El Cerrito remodels mean working smart on sloped lots and mid-century layouts — both familiar ground for our crew.", permit: "the City of El Cerrito Building Division", era: "1920s–50s bungalows and mid-century homes stepping up the hillside", hoods: ["El Cerrito Hills", "Fairmount", "Richmond Annex border", "Cerrito Vista"], profile: "historic", terrain: "narrow sloped lots with tight access and downhill drainage to manage" },
  // Alameda County
  { name: "Oakland", slug: "oakland", county: "Alameda County", blurb: "From Rockridge craftsman homes to hills contemporaries, Oakland's older housing stock is where our experience pays off.", permit: "the City of Oakland Bureau of Building", era: "Craftsman, Victorian and Mediterranean stock largely pre-1940", hoods: ["Rockridge", "Montclair", "Temescal", "Glenview"], profile: "historic", terrain: "old foundations, seismic soft-story concerns and steep hills wiring" },
  { name: "Berkeley", slug: "berkeley", county: "Alameda County", blurb: "Berkeley homes are full of character — and code surprises. We remodel them with respect for both.", permit: "the City of Berkeley Permit Service Center", era: "brown-shingle and Craftsman homes, a great many built before 1930", hoods: ["Elmwood", "North Berkeley", "Claremont", "Westbrae"], profile: "historic", terrain: "century-old framing, knob-and-tube remnants and strict local review" },
  { name: "Alameda", slug: "alameda", county: "Alameda County", blurb: "Alameda's Victorians and storybook homes deserve trades with real finish skills. That's the crew we bring.", permit: "the City of Alameda Permit Center", era: "Victorian, Edwardian and Craftsman housing on a flat island grid", hoods: ["Gold Coast", "East End", "Bronze Coast", "Bay Farm Island"], profile: "historic", terrain: "island salt air, original millwork worth preserving and historic review in places" },
  { name: "San Leandro", slug: "san-leandro", county: "Alameda County", blurb: "San Leandro's post-war neighborhoods are prime for kitchen updates, ADU conversions and full interior refreshes.", permit: "the City of San Leandro Building Division", era: "1940s–60s post-war tracts on compact, regular lots", hoods: ["Broadmoor", "Estudillo Estates", "Bal Theatre area", "Marina Faire"], profile: "postwar", terrain: "flat lots and detached garages that convert well to ADUs" },
  { name: "Castro Valley", slug: "castro-valley", county: "Alameda County", blurb: "Castro Valley's ranchers and hillside homes keep our remodel, concrete and paint crews moving all year.", permit: "Alameda County Building Inspection, since Castro Valley is unincorporated", era: "1950s–70s ranch homes with newer custom builds up the canyon", hoods: ["Palomares Hills", "Five Canyons", "Proctor", "Lake Chabot area"], profile: "postwar", terrain: "canyon lots, sloped driveways and fire-zone requirements in the upper hills" },
  { name: "Hayward", slug: "hayward", county: "Alameda County", blurb: "In Hayward we build ADUs, remodel kitchens and baths, and pour the driveways that finish the job right.", permit: "the City of Hayward Permit Center", era: "1950s–70s tracts plus older downtown stock and newer hillside homes", hoods: ["Hayward Highlands", "Fairway Park", "Mt. Eden", "Glen Eden"], profile: "postwar", terrain: "proximity to the Hayward Fault, which shapes structural work on additions" },
  { name: "Dublin", slug: "dublin", county: "Alameda County", blurb: "Dublin's newer homes are built fast — we're the crew owners call when they want them finished right.", permit: "the City of Dublin Building and Safety Division", era: "late-1990s through 2010s planned developments with builder-grade finishes", hoods: ["Dublin Ranch", "Positano", "Schaefer Ranch", "West Dublin"], profile: "modern", terrain: "newer construction where upgrades matter more than repairs, often under HOA review" },
  { name: "Pleasanton", slug: "pleasanton", county: "Alameda County", blurb: "Pleasanton expects polish, from downtown cottages to Ruby Hill estates. Quality-first is the only way we work.", permit: "the City of Pleasanton Building and Safety Division", era: "downtown Victorians and Craftsman cottages alongside 1980s–2000s estates", hoods: ["Ruby Hill", "Downtown Pleasanton", "Vintage Hills", "Birdland"], profile: "postwar", terrain: "a downtown historic district with design review, plus large estate parcels east of town" },
  { name: "Livermore", slug: "livermore", county: "Alameda County", blurb: "Wine country living on the Alameda side — Livermore clients call us for outdoor living, ADUs and whole-home remodels.", permit: "the City of Livermore Building Division", era: "older downtown bungalows through 1990s and 2000s vineyard-adjacent homes", hoods: ["Downtown Livermore", "South Livermore", "Sunset East", "Vineyard Avenue"], profile: "postwar", terrain: "hot dry summers and larger rural-edge parcels where outdoor living pays off" },
  { name: "Fremont", slug: "fremont", county: "Alameda County", blurb: "Fremont homeowners invest in their houses for the long haul. Our warrantied, quality-first work fits that mindset.", permit: "the City of Fremont Building and Safety Division", era: "1950s–70s tracts across its several merged districts, plus newer infill", hoods: ["Mission San Jose", "Niles", "Irvington", "Warm Springs"], profile: "postwar", terrain: "distinct districts with different housing eras, and hillside lots toward Mission Peak" },
  // San Joaquin County
  { name: "Tracy", slug: "tracy", county: "San Joaquin County", blurb: "Just over the pass from Brentwood, Tracy is core territory for our concrete, paint and full-remodel crews.", permit: "the City of Tracy Building Division", era: "older downtown homes ringed by fast 1990s–2010s subdivision growth", hoods: ["Downtown Tracy", "Edgewood", "Berkshire", "Presidio"], profile: "modern", terrain: "Central Valley heat and wind that punish exterior finishes and paint" },
  { name: "Mountain House", slug: "mountain-house", county: "San Joaquin County", blurb: "Mountain House's newer homes are perfect for the upgrades that make them yours — kitchens, floors, backyards and ADUs.", permit: "the Town of Mountain House, which incorporated in 2024 and now runs its own building department", era: "a master-planned community built almost entirely since 2001", hoods: ["Questa", "Bethany", "Altamont", "Wicklund"], profile: "modern", terrain: "uniform newer construction where personalization, not repair, drives most projects" },
  { name: "Lathrop", slug: "lathrop", county: "San Joaquin County", blurb: "From River Islands to established Lathrop neighborhoods, we bring East Bay finish quality over the hill.", permit: "the City of Lathrop Building Division", era: "established older neighborhoods plus the rapidly growing River Islands development", hoods: ["River Islands", "Mossdale Landing", "Historic Lathrop"], profile: "modern", terrain: "river-adjacent lots with drainage and levee considerations" },
  { name: "Manteca", slug: "manteca", county: "San Joaquin County", blurb: "Manteca homeowners get the same crew, the same standard and the same warranty we bring to our East Bay jobs.", permit: "the City of Manteca Building Division", era: "mid-century cores with heavy 2000s and 2010s subdivision expansion", hoods: ["Downtown Manteca", "Woodward Park", "Union Ranch"], profile: "modern", terrain: "flat valley lots and long hot summers that drive shade and cooling upgrades" },
  { name: "Stockton", slug: "stockton", county: "San Joaquin County", blurb: "Stockton's older neighborhoods reward experienced trades — and our crews have decades in every one of them.", permit: "the City of Stockton Community Development Building Division", era: "grand pre-war homes in the older districts alongside post-war and newer north-side tracts", hoods: ["Miracle Mile", "Brookside", "Victory Park", "Pacific Avenue"], adjacent: ["Lincoln Village"], profile: "historic", terrain: "century-old homes with original systems, and Delta humidity on the west side" },
  // Solano County
  { name: "Rio Vista", slug: "rio-vista", county: "Solano County", blurb: "Delta-side Rio Vista is a quick run from Brentwood, and a regular stop for our remodel and concrete work.", permit: "the City of Rio Vista Building Department", era: "an older river-town core with newer active-adult development at Trilogy", hoods: ["Downtown Rio Vista", "Trilogy", "Riverwalk"], profile: "delta", terrain: "Delta wind, river humidity and soft soils near the waterfront" },
  { name: "Fairfield", slug: "fairfield", county: "Solano County", blurb: "Fairfield's mix of older ranchers and newer builds keeps every one of our trades — paint to concrete — in demand.", permit: "the City of Fairfield Building Division", era: "1960s–80s ranch tracts with newer development toward Green Valley", hoods: ["Green Valley", "Cordelia", "Rancho Solano", "Village 5"], profile: "postwar", terrain: "the Cordelia wind gap, which is hard on exterior paint and roofing" },
  { name: "Vacaville", slug: "vacaville", county: "Solano County", blurb: "Vacaville homeowners call us for kitchens, baths, ADUs and the concrete work that ties a property together.", permit: "the City of Vacaville Building Division", era: "1970s–2000s subdivisions plus older homes near the historic downtown", hoods: ["Browns Valley", "North Village", "Downtown Vacaville", "Cheyenne"], profile: "modern", terrain: "hot dry summers and larger lots that suit outdoor living and shade structures" },
  { name: "Vallejo", slug: "vallejo", county: "Solano County", blurb: "Vallejo's Victorians and mid-century homes are full of potential — our whole-home remodels bring it out.", permit: "the City of Vallejo Building Division", era: "Victorian and Craftsman heritage stock alongside wartime and post-war housing", hoods: ["Heritage District", "St. Vincent's Hill", "Glen Cove", "Hiddenbrooke"], profile: "historic", terrain: "waterfront exposure, older foundations and historic districts with added review" },
  { name: "Benicia", slug: "benicia", county: "Solano County", blurb: "Benicia's historic downtown homes and waterside properties get the careful, detail-first treatment they deserve.", permit: "the City of Benicia Building Division", era: "one of California's oldest towns, with substantial pre-1900 and Victorian stock", hoods: ["Old Town Benicia", "Southampton", "Waterfront District"], profile: "historic", terrain: "salt air off the strait and historic-district review on many downtown properties" },
  // Napa County
  { name: "Napa", slug: "napa", county: "Napa County", blurb: "Wine country standards, East Bay work ethic. We take remodels, outdoor living and ADU projects across Napa.", permit: "the City of Napa Building Division", era: "Victorian and Craftsman homes downtown with newer development on the outskirts", hoods: ["Old Town Napa", "Alta Heights", "Browns Valley", "Carneros edge"], profile: "historic", terrain: "seismic retrofit needs, wildfire-zone rules and a strong outdoor-living culture" },
  { name: "American Canyon", slug: "american-canyon", county: "Napa County", blurb: "American Canyon's newer neighborhoods are ideal for the kitchen, flooring and backyard upgrades we do every week.", permit: "the City of American Canyon Building Division", era: "largely built out from the 1990s onward, with newer builder-grade finishes", hoods: ["Vintage Ranch", "Napa Junction", "Canyon Creek"], profile: "modern", terrain: "bay-edge wind and newer homes where upgrades outpace repairs" },
];

export const SERVICES = [
  {
    name: "Kitchen Remodeling", slug: "kitchen-remodeling",
    short: "Layout, cabinetry, stone, lighting and fixtures — kitchens rebuilt to be the best room in the house.",
    img: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Remodeled kitchen with custom island and stone countertops",
    body: [
      "The kitchen is the room that earns its keep — in daily use and at resale. We take kitchens down to the layout and rebuild them: new footprints where walls should move, cabinetry that uses every inch, stone and quartz counters templated to the millimeter, and lighting placed where you actually work.",
      "Because plumbing, electrical, drywall, flooring and paint all live on our own crew, your kitchen isn't waiting on a subcontractor's calendar. One schedule, one point of contact, one standard of finish.",
    ],
    features: ["Full kitchen gut-and-rebuild remodels", "Custom & semi-custom cabinetry installation", "Stone, quartz & butcher-block countertops", "Kitchen islands & layout changes", "Tile backsplashes & under-cabinet lighting", "In-house plumbing & electrical rough-in", "Appliance installation & venting", "Radiant heated flooring add-ons"],
    faqs: [
      { q: "How long does a kitchen remodel take?", a: "A pull-and-replace kitchen typically runs 3–5 weeks; a full layout change with structural work runs 6–10 weeks. You'll get a written schedule with your estimate — and because our trades are in-house, we control the timeline instead of waiting on subs." },
      { q: "Do I need permits for a kitchen remodel in {CITY}?", a: "Yes — if plumbing, electrical or walls are moving, a kitchen remodel in {CITY} needs a permit. AZ Elevated Builders handles permitting in {CITY} as part of the job, including plans and inspections, so you never deal with the counter yourself." },
      { q: "What does a kitchen remodel cost?", a: "It depends on scope and finishes, which is why every project starts with a free on-site estimate and a written scope. Financing options are available, and all work carries our written warranty of up to five years." },
    ],
  },
  {
    name: "Bathroom Remodeling", slug: "bathroom-remodeling",
    short: "Spa-level baths — tile, stone, steam showers, heated floors — waterproofed right from the rough-in.",
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Modern remodeled bathroom with walk-in shower and custom tile",
    body: [
      "A bathroom remodel is won or lost in the parts you never see: the waterproofing, the slope of the pan, the blocking behind the wall. We build those right first, then finish with the tile, stone and fixtures that make the room feel like a retreat.",
      "Steam showers, saunas and radiant heated floors are the add-ons our clients ask for most — and because we build them from the rough-in instead of retrofitting, they work flawlessly for decades.",
    ],
    features: ["Full bathroom gut remodels", "Walk-in showers & frameless glass", "Steam showers & sauna installation", "Radiant heated bathroom floors", "Custom tile & natural stone work", "Vanities, counters & storage built-ins", "In-house plumbing & electrical", "Primary-suite bath additions"],
    faqs: [
      { q: "How long does a bathroom remodel take?", a: "A standard full remodel runs 2–4 weeks. Steam showers, saunas or layout changes add time, and your written schedule will show it before we start — no surprises mid-job." },
      { q: "Can you add a steam shower or heated floors to an existing bathroom in {CITY}?", a: "Yes. AZ Elevated Builders installs steam showers and heated floors in existing {CITY} bathrooms — it is one of our most-requested upgrades. We size the steam generator, waterproof the enclosure properly and run the electrical in-house so the whole system is warrantied together." },
      { q: "Do you handle permits and inspections?", a: "Yes. AZ Elevated Builders handles all permits and inspections as part of the job — bathroom remodels involving plumbing or electrical changes are permitted and inspected, and we manage the entire process." },
    ],
  },
  {
    name: "Whole-Home Remodeling", slug: "whole-home-remodeling",
    short: "Interior and exterior remodeled as one project — layout, systems, finishes and paint under one crew.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Open-plan whole home remodel with new flooring and glazing",
    body: [
      "When a house no longer fits the life inside it, patching one room at a time gets expensive. A whole-home remodel reworks the place as one project — circulation, light, kitchens and baths, flooring, systems, paint — sequenced by a single crew so the trades never trip over each other.",
      "Much of the housing stock across our service area is 40 to 80 years old, and surprises behind the walls are the rule, not the exception. With plumbing, electrical, drywall and finish carpentry in-house, we absorb those surprises without losing the schedule.",
    ],
    features: ["Full interior renovations", "Exterior remodels & curb-appeal packages", "Layout changes & wall removal", "Plumbing & electrical updates", "Flooring, drywall, paint & trim", "Kitchen + bath combination scopes", "Energy & comfort upgrades", "Design collaboration available"],
    faqs: [
      { q: "How do you price a whole-home remodel?", a: "We walk the house with you, build a written scope room by room, and price it line by line — free. You'll know what's included, what's optional and what the schedule looks like before signing anything." },
      { q: "Can we live in the house during the remodel?", a: "Often, yes — many clients stay in the house during a whole-home remodel. AZ Elevated Builders sequences the work by zone so part of the house stays livable, keep job sites clean daily, and are upfront when a phase is better done with the house empty." },
      { q: "Do you work with designers in {CITY}?", a: "Yes. AZ Elevated Builders works with designers on {CITY} projects — bring your own designer or plans, or we can loop in a designer we trust. Either way, the drawings, the schedule and the build stay coordinated under one roof." },
    ],
  },
  {
    name: "Home Additions & ADUs", slug: "additions-adus",
    short: "New square footage that looks original — plus ADUs that earn rent or house family.",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Detached ADU guest house with pool at dusk",
    body: [
      "A good addition reads as if it was always there — the rooflines continue, the windows match, the proportions hold. We design and build primary-suite additions, kitchen expansions, family rooms and second-story pop-ups that blend into the original house instead of announcing themselves.",
      "Accessory dwelling units are the best investment in California residential construction right now: rental income, space for family, long-term property value. We handle feasibility, the state's evolving ADU rules, local permitting and utilities through final inspection.",
    ],
    features: ["Room additions & home extensions", "Primary suite & bath additions", "Detached & attached ADUs", "Garage conversions", "Feasibility & permit management", "Utility connections & upsizing", "Full kitchens & baths in every unit", "Finish levels matched to the main house"],
    faqs: [
      { q: "Are ADUs legal in {CITY}?", a: "Yes — ADUs are legal in {CITY}. California law requires cities to allow ADUs on most residential lots, and {CITY} processes them under those state rules. We confirm setbacks, size limits and utility requirements for your specific parcel during the free feasibility visit." },
      { q: "What does an ADU cost to build?", a: "It varies with size, site and finish level — a garage conversion is a different project than a detached new build. We price it in a written scope after walking your property, and financing options are available." },
      { q: "How long does an addition take?", a: "Design and permitting typically run 2–4 months depending on the city; construction runs 3–6 months for most additions and detached ADUs. We give you the real timeline up front and keep you updated weekly." },
    ],
  },
  {
    name: "Concrete & Driveways", slug: "concrete-driveways",
    short: "Driveways, patios, walkways and retaining walls — formed, poured and finished by our own crew.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Modern home exterior with new concrete driveway and walkways",
    body: [
      "Concrete is one of our highest-volume trades — driveways, patios, walkways, slabs and retaining walls, formed and poured by our own crew with quick turnarounds. The difference between concrete that lasts and concrete that cracks is in the prep: base compaction, reinforcement and joints done right.",
      "We pour standard broom finish, exposed aggregate, and stamped and colored finishes, and we tie new flatwork into drainage so water moves away from the house instead of under it.",
    ],
    features: ["New concrete driveways & extensions", "Patios & outdoor living slabs", "Walkways, steps & porches", "Retaining walls", "Stamped, colored & exposed aggregate finishes", "Old concrete demo & haul-off", "Proper base prep & reinforcement", "Drainage integration"],
    faqs: [
      { q: "How long before I can use my new driveway?", a: "Foot traffic in 24–48 hours, vehicles in about 7 days as the slab cures toward full strength. We'll give you exact numbers for your pour and weather." },
      { q: "How fast can you pour a driveway in {CITY}?", a: "Driveways are one of our quickest turnarounds — most tear-out-and-repour projects in {CITY} run 3–5 working days from demo to finished pour, weather permitting." },
      { q: "Do you build retaining walls?", a: "Yes. AZ Elevated Builders builds retaining walls — engineered where height requires it, with proper drainage behind the wall. Failed retaining walls are almost always drainage failures, so we treat the part you can't see as the most important part." },
    ],
  },
  {
    name: "Interior & Exterior Painting", slug: "painting",
    short: "Full-prep painting inside and out — 22 years on the brush, straight lines, quality coatings.",
    img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Freshly painted home exterior at dusk",
    body: [
      "Paint is the finish everyone sees, and it's where our family sets the bar: our lead painter has 22 years on the brush. Full prep — wash, scrape, sand, patch, prime — then quality coatings applied to manufacturer spec, with masking and cut lines sharp enough to pass your own inspection.",
      "Exterior repaints are one of our fastest, highest-impact projects: they transform curb appeal in days and protect siding and trim from the Delta sun and winter rain.",
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
      "Floors take more abuse than any other finish in the house, and they show every shortcut. We flatten and prep substrates before a single plank or tile goes down, then install hardwood, engineered hardwood, tile and laminate with tight seams, correct expansion gaps and clean transitions.",
      "Want warmth underfoot? We install radiant heated flooring under tile and engineered floors — a favorite in bathrooms and kitchens.",
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
    short: "Hung, taped, textured and finished by a 20-year specialist — walls you'll never think about again.",
    img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Clean finished interior walls in a remodeled home",
    body: [
      "Drywall is the trade you only notice when it's done badly — a wavy wall in raking light, a texture patch that doesn't match. Our drywall specialist has 20 years in the trade, and it shows in flat walls, crisp corners and repairs you can't find afterward.",
      "We hang, tape, texture and finish for our own remodels and as a standalone service — including matching existing textures, which is where most patch jobs fail.",
    ],
    features: ["New drywall for remodels & additions", "Water & fire damage repair", "Texture matching — orange peel, knockdown, smooth", "Level 5 smooth finishes", "Ceiling repair & popcorn removal", "Soundproofing & insulation upgrades", "Patching after plumbing/electrical work", "Paint-ready finishing"],
    faqs: [
      { q: "Can you match my existing wall texture?", a: "Yes. AZ Elevated Builders matches existing wall textures — it is the difference between a repair and an eyesore, and a specialty of our drywall crew. Orange peel, knockdown, hand troweled or smooth, the patch should disappear after paint." },
      { q: "Do you remove popcorn ceilings in {CITY}?", a: "Yes, with one important step first. On any home built before 1978 the ceiling texture must be tested for asbestos before removal. If it tests positive we bring in a certified abatement contractor; if it is clean, our crew scrapes, skims and refinishes to a smooth or light texture in {CITY}. We scrape, skim and refinish to a modern smooth or light texture, and leave the room paint-ready." },
      { q: "How fast can a repair be done?", a: "Small patches are often same-day with a return visit for texture and touch-up after drying. Larger repairs run 2–4 days because mud needs to dry between coats — rushing it is how bad patches happen." },
    ],
  },
  {
    name: "Cabinetry & Countertops", slug: "cabinetry-countertops",
    short: "Custom and semi-custom cabinets with stone and quartz counters — one scope, lines that line up.",
    img: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Custom kitchen cabinetry with stone countertops",
    body: [
      "Cabinets and counters are where a kitchen or bath goes from renovated to custom. We specify, order, template and install as one scope — so door reveals are even, counters land level, and the seam falls where nobody sees it.",
      "From full custom cabinetry to smart semi-custom lines that save budget without looking like it, we'll match the approach to the project — and our finish carpenters install it all.",
    ],
    features: ["Custom & semi-custom cabinetry", "Cabinet refacing & hardware upgrades", "Quartz, granite & natural stone counters", "Butcher block & specialty surfaces", "Precision templating & installation", "Built-ins, pantries & storage systems", "Bathroom vanities", "Soft-close & organization upgrades"],
    faqs: [
      { q: "Custom or semi-custom — which should I choose?", a: "Semi-custom covers most kitchens beautifully at a better price point; full custom earns its cost with unusual spaces, specific woods or furniture-grade details. We'll show you both against your budget at the estimate." },
      { q: "How long do new counters take?", a: "We template after cabinets are set, fabrication runs 1–2 weeks, and installation is usually a day. We sequence plumbing reconnection the same week so you're not without a sink." },
      { q: "Do you install cabinetry outside of full remodels in {CITY}?", a: "Yes. AZ Elevated Builders installs cabinetry and countertops as a standalone project — it is a common choice for {CITY} homeowners who want the biggest visual upgrade without a full gut." },
    ],
  },
  {
    name: "Finish Carpentry & Trim", slug: "finish-carpentry-trim",
    short: "Baseboards, casing, wainscot, built-ins and stairs — the details that separate remodels from renovations.",
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Detailed interior trim and finish carpentry work",
    body: [
      "Trim is the jewelry of the house — and the first place cheap work shows. Our finish carpenters measure twice, scribe to the wall, and fill and caulk so paint looks poured on. Baseboards, door and window casing, crown, wainscot and paneling, floating shelves, built-ins and stair work.",
      "It's also the highest-return finishing touch on a repaint or flooring project: new floors deserve new base, and fresh walls deserve crisp casing.",
    ],
    features: ["Baseboards & door/window casing", "Crown molding", "Wainscot, board-and-batten & paneling", "Custom built-ins & floating shelves", "Stair rails, treads & skirt boards", "Interior door replacement & hanging", "Mantels & feature walls", "Paint-grade & stain-grade work"],
    faqs: [
      { q: "Can you match existing trim profiles?", a: "Yes, in most cases AZ Elevated Builders can match your existing trim profile. Between stock profiles, combinations and custom knives for larger runs, we can continue what your house already speaks. Bring us a cutoff or we'll pull a profile on site." },
      { q: "What does trim work cost?", a: "It scales with linear footage and profile complexity, which makes it one of the easiest scopes to price accurately at a free estimate — and one of the highest-impact upgrades per dollar." },
      { q: "Do you do standalone trim projects in {CITY}?", a: "Yes. AZ Elevated Builders takes standalone trim projects in {CITY} — a base-casing-and-doors package is one of the fastest ways to lift an entire {CITY} home, usually inside a week." },
    ],
  },
  {
    name: "Steam Showers, Saunas & Heated Floors", slug: "steam-showers-saunas",
    short: "Spa features built from the rough-in — steam, sauna and radiant heat that work for decades.",
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Spa bathroom with steam shower and warm stone finishes",
    body: [
      "These are the upgrades our clients ask for by name: steam showers, saunas and radiant heated floors. They're also the projects where corner-cutting fails worst — steam finds every gap in waterproofing, and heated floors are only as good as the wire layout under them.",
      "We build spa features from the rough-in: vapor-sealed enclosures, correctly sized steam generators, dedicated circuits, and controls placed where you actually use them. Built once, built right, warrantied in writing.",
    ],
    features: ["Steam shower design & construction", "Steam generator sizing & installation", "Indoor & outdoor sauna builds", "Radiant heated floors — bathrooms, kitchens & more", "Full vapor-sealed waterproofing", "Dedicated electrical circuits & controls", "Tile & stone enclosure finishes", "Integration with full bath remodels"],
    faqs: [
      { q: "Can a steam shower go in my existing bathroom?", a: "Yes, in most cases a steam shower can be added to an existing bathroom. The enclosure needs to be sealed and sized to the generator, and we confirm both at the free estimate. Retrofit is very doable when it's planned from the rough-in rather than bolted on." },
      { q: "Are heated floors expensive to run?", a: "Less than most people expect — modern systems zone by room, run on programmable thermostats, and warm the tile you touch rather than the whole house. Bathrooms typically cost pennies a day to run." },
      { q: "Do you install saunas in {CITY}?", a: "Yes. AZ Elevated Builders installs saunas in {CITY} — indoor conversions and outdoor builds both. {CITY} homeowners usually pair a sauna with a bath remodel or a backyard project, and we design it into the larger scope." },
    ],
  },
  {
    name: "Pergolas & Outdoor Living", slug: "pergolas-outdoor-living",
    short: "Pergolas, patios, landscaping and outdoor rooms — planned as part of the house, not an afterthought.",
    img: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "Backyard pergola and outdoor living space at dusk",
    body: [
      "East Bay weather is an unfair advantage — eight months of outdoor living a year if your backyard is built for it. We design and build pergolas, patio covers, outdoor kitchens, concrete patios and the landscaping that ties it together, as one project with one crew.",
      "Because our concrete, carpentry and electrical are in-house, your pergola gets real footings, your patio drains away from the house, and your string lights are on a switch — details that separate built from bought.",
    ],
    features: ["Custom pergolas & patio covers", "Concrete patios & outdoor slabs", "Outdoor kitchens & BBQ islands", "Landscaping & planting design", "Low-voltage & string lighting", "Fences, gates & privacy screens", "Drainage & irrigation", "Full backyard transformations"],
    faqs: [
      { q: "Do pergolas need permits in {CITY}?", a: "It depends. Whether a pergola needs a permit in {CITY} comes down to size, height and attachment to the house — {CITY} exempts some smaller detached structures. We confirm requirements for your design and pull the permit when one's needed." },
      { q: "Wood or aluminum pergola?", a: "Wood wins on warmth and customization; aluminum wins on maintenance. We build both and will talk honestly about how each ages in Delta sun before you choose." },
      { q: "Can you do the whole backyard — concrete, pergola and landscaping?", a: "Yes. AZ Elevated Builders builds complete backyards — concrete, pergola and landscaping together — and prefers it that way: one plan, one schedule, one crew, so grades, drainage, footings and planting work together instead of being three contractors' problems." },
    ],
  },
];

// Intro sentence variants keyed by (cityIdx + serviceIdx) % 3 — keeps 480 pages from opening identically
export const OPENERS = [
  (s, c) => `Looking for ${s.name.toLowerCase()} in ${c.name}? AZ Elevated Builders is a family-run, CA-licensed general contractor based in Brentwood — close enough to ${c.name} to walk your project this week, and experienced enough to build it right the first time.`,
  (s, c) => `AZ Elevated Builders brings quality-first ${s.name.toLowerCase()} to ${c.name}, ${c.county}. We're a family-run, CA-licensed contractor out of Brentwood, and every trade on our crew has 15+ years in that trade.`,
  (s, c) => `${c.name} homeowners choose AZ Elevated Builders for ${s.name.toLowerCase()} because we build like it's our own house: free honest estimates, one crew across every trade, and a written warranty of up to five years.`,
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
    terrain: "It also shapes the practical side: dust control, appliance staging and where the temporary kitchen goes while we work.",
  },
  "bathroom-remodeling": {
    permit: "Bathroom permits hinge on whether plumbing moves and whether the exhaust and circuits meet current code — both get inspected, and both are our paperwork, not yours.",
    terrain: "It matters more than people expect for waterproofing detail and how quickly a room dries between coats.",
  },
  "whole-home-remodeling": {
    permit: "A whole-home scope means a full plan set and a longer review, so we sequence permitting with demolition to keep the schedule honest.",
    terrain: "It drives real decisions on insulation, window specification and how the house handles heat and moisture year-round.",
  },
  "additions-adus": {
    permit: "Additions and ADUs are the most review-heavy work we do — setbacks, lot coverage, utilities and California's ADU rules all get checked before a shovel moves.",
    terrain: "It also determines foundation approach, drainage and where a detached unit can practically sit on the lot.",
  },
  "concrete-driveways": {
    permit: "Flatwork often needs less review than interior work, but anything touching drainage, the right-of-way or a retaining wall does — we confirm before we form.",
    terrain: "This is the single biggest factor in whether concrete lasts — base prep and jointing are specified around it, not guessed at.",
  },
  "painting": {
    permit: "Repaints rarely need a permit, which makes them one of the fastest, highest-impact projects available to you.",
    terrain: "It dictates product selection and scheduling — exterior coatings need the right temperature and moisture window to cure properly.",
  },
  "flooring": {
    permit: "Flooring itself is usually permit-exempt, which keeps the timeline short — though we flag it when subfloor or structural repair changes that.",
    terrain: "It directly affects material choice, since humidity swings decide whether solid hardwood or engineered is the smarter specification.",
  },
  "drywall": {
    permit: "Drywall work is typically permit-exempt unless it accompanies structural or electrical changes, so repairs can often start within days.",
    terrain: "It also explains a lot of the cracking we get called out for — seasonal movement shows up at the same corners every year.",
  },
  "cabinetry-countertops": {
    permit: "Cabinet and counter replacement usually needs no permit on its own, which makes it the fastest route to a genuinely different-looking room.",
    terrain: "It informs material choice too, since humidity and heat swings affect how door panels and natural stone behave over time.",
  },
  "finish-carpentry-trim": {
    permit: "Trim work needs no permit, so it is one of the easiest projects to schedule and one of the fastest to finish.",
    terrain: "It matters for material selection and acclimation — wood moves, and trim installed without accounting for that opens at the joints.",
  },
  "steam-showers-saunas": {
    permit: "Steam and sauna installations mean dedicated circuits and sealed assemblies, so they are permitted and inspected — we handle both.",
    terrain: "It affects vapor management and how the assembly is detailed so moisture stays where it belongs.",
  },
  "pergolas-outdoor-living": {
    permit: "Whether a structure needs a permit comes down to size, height and attachment to the house — we confirm the threshold before design is final.",
    terrain: "It is the deciding factor in orientation, shade strategy and footing depth for anything you build outdoors.",
  },
};

// Rotated so the closing pitch is not byte-identical across 480 pages.
export const WHY_VARIANTS = [
  (c) => `We are a family business, and in ${c.name} that is not a marketing line — it is why the same people who quote your job are the ones standing in it. Every trade on our crew has 15+ years in that specific trade. Estimates are free, financing is available, and the work carries a written warranty of up to five years.`,
  (c) => `Most of our ${c.name} work arrives by referral, which is the only marketing a builder should need. Free estimate, a written scope before anything is demolished, one point of contact the whole way through, and a written warranty of up to five years on what we build.`,
  (c) => `We would rather lose a ${c.name} job on price than win it and cut corners to make the number work. That is the whole positioning: quality over budget, trades with 15+ years each, free estimates, financing available, and up to five years of written warranty.`,
  (c) => `Our crews are in ${c.county} every week, so a walkthrough in ${c.name} does not wait on a gap in the calendar. Free estimates, an honest schedule, clean job sites, and a written warranty of up to five years.`,
  (c) => `In ${c.name} we build the way we would build our own house — because the neighbors are watching and the referral is the next job. Free on-site estimate, written scope, 15+ years per trade, and a warranty of up to five years in writing.`,
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
    historic: "In pre-war homes the kitchen was built as a service room — small, closed off and tucked at the back. Opening it to the living space is usually the single change that transforms how the house feels, and it almost always involves structural work we handle in-house.",
    postwar: "Post-war kitchens tend to be sound but dated: original cabinet boxes, one small window and a layout built around appliances nobody makes anymore. There is usually good bones to work with and real room to improve flow without moving the whole house around.",
    modern: "Newer homes usually have the footprint right and the finishes wrong — builder-grade cabinets, thin counters and lighting placed for the floor plan rather than the cook. That makes for a faster, cleaner project focused on quality rather than structure.",
    delta: "Kitchens near the water take more abuse than most: humidity swings, hard water on fixtures, and cabinet doors that move with the seasons. We specify materials and finishes that hold up to it rather than looking good for one summer.",
  },
  "bathroom-remodeling": {
    historic: "Bathrooms in older homes are frequently original below the surface — cast iron, galvanized supply lines and a subfloor that has been quietly wet for years. We plan for finding that, because in homes this age we usually do.",
    postwar: "Post-war bathrooms are typically small, single-window rooms with an alcove tub and tile set directly on mortar. Reworking the layout inside the same footprint usually buys more than people expect.",
    modern: "In newer homes the plumbing is fine and the experience is flat — a builder tub nobody uses, a fiberglass surround, and no ventilation worth the name. The upgrade is about materials, light and the shower itself.",
    delta: "Ventilation matters more here than almost anywhere. With humidity this high, an undersized fan and a poorly sealed enclosure will grow problems behind the tile no matter how good the finish looks.",
  },
  "whole-home-remodeling": {
    historic: "A whole-home remodel on a house this old is as much restoration as renovation. Knob-and-tube remnants, unreinforced foundations and original single-pane glazing all get addressed, and the goal is a house that performs like new while still reading as itself.",
    postwar: "Post-war houses respond extremely well to whole-home work: simple framing, straightforward spans and a layout chopped into small rooms that wants opening up. The systems are usually at the end of their service life, which makes doing it all at once the economical path.",
    modern: "In newer homes a whole-home scope is about personality and quality rather than repair — better materials, better light, better storage, and finishes that were value-engineered out of the original build.",
    delta: "Out here we plan a whole-home remodel around moisture and heat first: envelope sealing, insulation and cooling capacity, then the finishes. Getting that order wrong is how a beautiful remodel becomes uncomfortable in August.",
  },
  "additions-adus": {
    historic: "Adding on to a historic home is an exercise in restraint — matching siding reveal, window proportion and roof pitch so the new volume reads as original. Some neighborhoods here also carry design review, which we plan for from the first sketch.",
    postwar: "Post-war lots are often generous relative to the house, which makes them some of the best addition and ADU candidates in the region. Detached garages in particular convert well.",
    modern: "Newer lots are tighter and frequently carry HOA architectural review alongside the city permit. We design to both from the start rather than redrawing after a rejection.",
    delta: "Additions near the Delta need extra attention to foundations and drainage given the soils and water table, which is exactly the kind of thing better discovered at feasibility than at inspection.",
  },
  "concrete-driveways": {
    historic: "Driveways at homes this old are often original, unreinforced and poured before anyone thought about base prep. Replacement is almost always the honest recommendation over patching.",
    postwar: "Concrete from the post-war era has usually served fifty-plus years and is at the end of it. We tear out, prep the base properly and repour with reinforcement and jointing that will not repeat the same cracking.",
    modern: "Newer driveways are typically structurally fine, so the work here is more often expansion, decorative finishes or extending the slab for parking and outdoor living.",
    delta: "Soils near the Delta move, and that is what breaks slabs. Base compaction, thickness and joint placement are the entire difference between concrete that lasts decades and concrete that cracks in two winters.",
  },
  "painting": {
    historic: "Older homes carry decades of previous coatings, and some of it is failing underneath what you can see. Prep is the majority of the job — and on pre-1978 homes, lead-safe practices are part of doing it properly.",
    postwar: "Post-war siding and trim take paint well once properly prepped. The usual finds are failed caulk joints, some dry rot at trim ends, and stucco cracks worth addressing before coating.",
    modern: "Newer homes usually need less repair and more color strategy — the original builder palette is often the only thing dating the house from the street.",
    delta: "Delta wind and sun are brutal on exterior finishes, particularly on south and west elevations. Product selection and cure windows matter more here than in sheltered inland neighborhoods.",
  },
  "flooring": {
    historic: "Many homes this age still have original hardwood under carpet or vinyl, and it is often worth recovering. Where it is not, we level the substrate properly first, because floors in houses this old are rarely flat.",
    postwar: "Post-war homes frequently have oak strip flooring hiding under decades of carpet. Where it can be refinished we will tell you, and where the smarter answer is replacement, we will tell you that too.",
    modern: "Newer homes typically have builder-grade carpet and laminate reaching the end of their life, on a flat slab or subfloor that makes installation fast and clean.",
    delta: "Humidity swings out here decide the material. Engineered hardwood and quality LVP handle the seasonal movement far better than solid hardwood in most homes near the water.",
  },
  "drywall": {
    historic: "Some homes this age still have original lath and plaster, which behaves nothing like drywall. Repairing and blending it takes a different skill set than hanging board, and our crew has both.",
    postwar: "Post-war textures are distinctive and very visible when a patch misses. Matching them is the difference between a repair that disappears and one that catches the eye every evening.",
    modern: "Newer homes usually need drywall work after the fact — a plumbing repair, a removed wall, or nail pops and settlement cracks that show up in the first few years.",
    delta: "Seasonal humidity swings move framing, which is why cracking here tends to reappear at the same corners. We repair with that movement in mind rather than filling and hoping.",
  },
  "cabinetry-countertops": {
    historic: "In older homes cabinetry often has to work around out-of-square walls and irregular ceiling heights. Scribing and custom fillers are what make a new install look like it belongs.",
    postwar: "Post-war cabinet boxes are usually undersized and shallow by current standards, so replacement typically buys a meaningful amount of usable storage on top of the visual change.",
    modern: "Newer homes frequently have serviceable layouts with builder-grade boxes and thin counters — which makes cabinetry and stone the highest-impact upgrade per dollar available.",
    delta: "Humidity affects how door panels and natural stone behave here, so material and finish selection matter as much as the design itself.",
  },
  "finish-carpentry-trim": {
    historic: "Trim in homes this age is often original, generously profiled and worth continuing rather than replacing. We can match or extend existing profiles so additions do not announce themselves.",
    postwar: "Post-war trim tends to be minimal — thin base, no casing depth. Upgrading the profiles is one of the least disruptive ways to make a house feel considerably more finished.",
    modern: "Newer homes usually have builder-standard trim, and stepping it up with deeper base, real casing and built-ins is what separates them from every other house on the street.",
    delta: "Wood moves with the humidity out here, so acclimation and joint detailing matter — trim installed without allowing for it opens at the miters within a season.",
  },
  "steam-showers-saunas": {
    historic: "Older homes rarely have the electrical capacity these systems need, so a subpanel or dedicated circuit is often part of the real scope alongside the waterproofing.",
    postwar: "Post-war bathrooms usually need the enclosure rebuilt from the studs to take steam properly — which is why we build it in during a full bath remodel rather than retrofitting later.",
    modern: "Newer homes generally have the panel capacity available, which makes adding steam or a sauna more straightforward than most owners expect.",
    delta: "With ambient humidity already high, vapor sealing and ventilation have to be right or the moisture simply relocates into the wall assembly.",
  },
  "pergolas-outdoor-living": {
    historic: "Yards at older homes were laid out for a different era of living — deep, narrow and rarely designed for outdoor cooking or shade. There is usually significant unused potential back there.",
    postwar: "Post-war lots tend to be flat, generous and almost purpose-built for outdoor living, which makes them some of the most rewarding backyard projects we take on.",
    modern: "Newer homes often come with a bare concrete slab and a fence. Shade, lighting, an outdoor kitchen and planting are what turn that into a room you actually use.",
    delta: "Sun and wind are the design drivers here. Orientation, shade strategy and footing depth all get planned around them, and a structure built without accounting for the wind will not last.",
  },
};
