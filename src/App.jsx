import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Snowflake, Ship, Truck, Plane, Package, Users, Boxes, Wrench, Radio,
  AlertTriangle, ShieldAlert, Siren, BrainCircuit, BarChart3, Bell,
  Search, LogOut, ChevronRight, ChevronDown, X, Check, Plus, Thermometer,
  Wind, Eye, CloudSnow, MapPin, Activity, FlaskConical, Fuel, HeartPulse,
  Clock, Wifi, WifiOff, RefreshCw, FileClock, Gauge, ArrowRight, Anchor,
  Sun, Moon
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend
} from "recharts";

/* =====================================================================
   POLAR — Integrated Polar Expedition Logistics & Asset Management
   Design tokens
===================================================================== */
const LIGHT_THEME = {
  void: "#F3F4F6",
  panel: "#FFFFFF",
  panelSolid: "#FFFFFF",
  subtle: "#F8F9FB",
  stripe: "#FAFBFC",
  border: "#E1E4E9",
  borderBright: "#C7CCD4",
  ice: "#1F2430",
  iceDim: "#6B7280",
  iceFaint: "#9CA3AF",
  cyan: "#2563EB",
  cyanDim: "#DBEAFE",
  amber: "#D97706",
  red: "#DC2626",
  green: "#16A34A",
  violet: "#7C3AED",
  overlay: "rgba(15,23,42,0.5)",
  mapBg: "#EEF2F7",
  mapLand: "#DCE3EC",
};

const DARK_THEME = {
  void: "#0B0F17",
  panel: "#161B26",
  panelSolid: "#161B26",
  subtle: "#11151F",
  stripe: "#1B2130",
  border: "#262E3D",
  borderBright: "#38425A",
  ice: "#E7EAF0",
  iceDim: "#98A2B5",
  iceFaint: "#69728A",
  cyan: "#3B82F6",
  cyanDim: "#1E3A5F",
  amber: "#F59E0B",
  red: "#F87171",
  green: "#34D399",
  violet: "#A78BFA",
  overlay: "rgba(0,0,0,0.6)",
  mapBg: "#0E1420",
  mapLand: "#1B2333",
};

// Mutable token object — components read T.xxx at render time, so
// mutating its properties (see applyTheme) and forcing a re-render
// is enough to re-theme the whole tree without prop-drilling.
const T = { ...LIGHT_THEME };
function applyTheme(mode){ Object.assign(T, mode === "dark" ? DARK_THEME : LIGHT_THEME); }

const fontHead = "'Inter', -apple-system, 'Segoe UI', system-ui, sans-serif";
const fontMono = "'Roboto Mono', 'SFMono-Regular', Menlo, monospace";

/* =====================================================================
   SEED DATA — realistic demo data
===================================================================== */
const ROLES = ["ADMIN","EXPEDITION_MANAGER","LOGISTICS_OFFICER","STATION_MANAGER","RESEARCHER","EMERGENCY_COORDINATOR"];

const DEMO_ACCOUNTS = [
  { id:"u1", name:"Kabir Anand", role:"ADMIN", email:"kabir.anand@polar.gov.in", password:"admin123" },
  { id:"u2", name:"Priya Deshmukh", role:"EXPEDITION_MANAGER", email:"priya.deshmukh@polar.gov.in", password:"expo123" },
  { id:"u3", name:"Rohan Bhatt", role:"LOGISTICS_OFFICER", email:"rohan.bhatt@polar.gov.in", password:"logi123" },
  { id:"u4", name:"Ananya Iyer", role:"STATION_MANAGER", email:"ananya.iyer@polar.gov.in", password:"stat123" },
  { id:"u5", name:"Dev Sharma", role:"RESEARCHER", email:"dev.sharma@polar.gov.in", password:"rsch123" },
  { id:"u6", name:"Meera Nair", role:"EMERGENCY_COORDINATOR", email:"meera.nair@polar.gov.in", password:"emrg123" },
];

const STATIONS = [
  { id:"maitri", name:"Maitri", full:"Maitri Research Station", lat:-70.76, lng:11.73, x:38, y:34, commsOk:true },
  { id:"bharati", name:"Bharati", full:"Bharati Research Station", lat:-69.41, lng:76.19, x:68, y:40, commsOk:true },
  { id:"dg", name:"Dakshin Gangotri", full:"Dakshin Gangotri Camp", lat:-70.05, lng:12.00, x:40, y:46, commsOk:true },
];

const WEATHER0 = {
  maitri:   { temp:-24, wind:38, visibility:6, snow:"Moderate", ice:"Consolidated", severity:"MODERATE" },
  bharati:  { temp:-19, wind:26, visibility:9, snow:"Light",    ice:"Stable",       severity:"LOW" },
  dg:       { temp:-28, wind:52, visibility:2, snow:"Heavy",    ice:"Shifting",     severity:"SEVERE" },
};

const PERSONNEL0 = [
  { id:"P001", name:"Arjun Malhotra", role:"Station Doctor", skills:["Medical","Trauma"], station:"maitri", status:"ON_DUTY" },
  { id:"P002", name:"Sanya Kapoor", role:"Station Doctor", skills:["Medical","Surgery"], station:"maitri", status:"ON_DUTY" },
  { id:"P003", name:"Vikram Rathore", role:"Chief Engineer", skills:["Power Systems","Vehicles"], station:"maitri", status:"ON_DUTY" },
  { id:"P004", name:"Ishaan Verma", role:"Logistics Officer", skills:["Cargo","Stowage"], station:"maitri", status:"ON_DUTY" },
  { id:"P005", name:"Tara Chatterjee", role:"Glaciologist", skills:["Research","Ice Core"], station:"maitri", status:"ON_DUTY" },
  { id:"P006", name:"Naveen Pillai", role:"Communications Officer", skills:["Radio","Satellite"], station:"maitri", status:"ON_DUTY" },
  { id:"P007", name:"Divya Menon", role:"Meteorologist", skills:["Weather","Forecasting"], station:"maitri", status:"ON_DUTY" },
  { id:"P008", name:"Aditya Kulkarni", role:"Mechanic", skills:["Vehicles","Generators"], station:"maitri", status:"ON_DUTY" },
  { id:"P009", name:"Ritika Sengupta", role:"Cook", skills:["Catering"], station:"maitri", status:"ON_DUTY" },
  { id:"P010", name:"Farhan Sheikh", role:"Station Manager", skills:["Operations"], station:"maitri", status:"ON_DUTY" },
  { id:"P011", name:"Neha Joshi", role:"Station Doctor", skills:["Medical"], station:"bharati", status:"ON_DUTY" },
  { id:"P012", name:"Karan Oberoi", role:"Chief Engineer", skills:["Power Systems"], station:"bharati", status:"ON_DUTY" },
  { id:"P013", name:"Simran Kaur", role:"Logistics Officer", skills:["Cargo"], station:"bharati", status:"ON_DUTY" },
  { id:"P014", name:"Aryan Chauhan", role:"Marine Biologist", skills:["Research"], station:"bharati", status:"ON_DUTY" },
  { id:"P015", name:"Pooja Reddy", role:"Communications Officer", skills:["Radio"], station:"bharati", status:"ON_DUTY" },
  { id:"P016", name:"Yash Trivedi", role:"Mechanic", skills:["Vehicles","Generators"], station:"bharati", status:"ON_DUTY" },
  { id:"P017", name:"Anjali Bose", role:"Meteorologist", skills:["Weather"], station:"bharati", status:"ON_DUTY" },
  { id:"P018", name:"Rahul Khanna", role:"Cook", skills:["Catering"], station:"bharati", status:"ON_DUTY" },
  { id:"P019", name:"Sneha Pillai", role:"Station Manager", skills:["Operations"], station:"bharati", status:"ON_DUTY" },
  { id:"P020", name:"Manav Saxena", role:"Geologist", skills:["Research"], station:"bharati", status:"ON_DUTY" },
  { id:"P021", name:"Kavya Ramesh", role:"Station Doctor", skills:["Medical"], station:"dg", status:"ON_DUTY" },
  { id:"P022", name:"Siddharth Rao", role:"Chief Engineer", skills:["Power Systems"], station:"dg", status:"ON_DUTY" },
  { id:"P023", name:"Ira Bhattacharya", role:"Logistics Officer", skills:["Cargo"], station:"dg", status:"ON_DUTY" },
  { id:"P024", name:"Omkar Desai", role:"Mechanic", skills:["Vehicles"], station:"dg", status:"ON_DUTY" },
  { id:"P025", name:"Zara Ahmed", role:"Communications Officer", skills:["Satellite"], station:"dg", status:"ON_DUTY" },
];
// pad personnel to 50+
for (let i=26;i<=54;i++){
  const stn = ["maitri","bharati","dg"][i%3];
  const names = ["Aman Gupta","Nikita Rao","Harsh Vardhan","Sameera Khan","Rajat Malviya","Pallavi Suresh","Dhruv Kapadia","Ishita Pandey","Kunal Bhalla","Sanjana Iyer","Vivaan Chowdhury","Riya Agarwal","Aarav Mehta","Diya Krishnan","Yuvraj Solanki"];
  const roles = ["Research Assistant","Mechanic","Cargo Handler","Radio Operator","Field Technician"];
  PERSONNEL0.push({ id:`P0${i}`, name:names[i%names.length]+" "+i, role:roles[i%roles.length], skills:["General"], station:stn, status:"ON_DUTY" });
}

const CARGO_CATEGORIES = ["Food","Fuel","Scientific Equipment","Medicine","Spare Parts","Clothing","Emergency Supplies","Communication Equipment"];
const CARGO_STATUSES = ["REQUESTED","APPROVED","PACKED","LOADED","IN_TRANSIT","ARRIVED","RECEIVED","DAMAGED","LOST"];

function seedCargo(){
  const items = [
    ["Frozen Rations Pallet","Food",1200,"kg"],["Rice & Pulses Crate","Food",800,"kg"],
    ["Diesel Fuel Drums","Fuel",4000,"L"],["Aviation Fuel Drums","Fuel",2000,"L"],
    ["Ice Core Drill Rig","Scientific Equipment",650,"kg"],["Weather Balloon Kit","Scientific Equipment",120,"kg"],
    ["Medical Oxygen Cylinders","Medicine",300,"L"],["Trauma Kit Crate","Medicine",90,"kg"],
    ["Antibiotics Case","Medicine",40,"kg"],["Generator Spare Parts","Spare Parts",350,"kg"],
    ["Vehicle Tyre Set","Spare Parts",280,"kg"],["Polar Thermal Suits","Clothing",210,"kg"],
    ["Emergency Survival Tents","Emergency Supplies",180,"kg"],["Satellite Radio Units","Communication Equipment",95,"kg"],
    ["Snowmobile Engine Parts","Spare Parts",310,"kg"],["Fresh Produce Container","Food",600,"kg"],
    ["LPG Cylinders","Fuel",1500,"L"],["Seismograph Array","Scientific Equipment",220,"kg"],
    ["Surgical Supplies Crate","Medicine",60,"kg"],["Insulation Panels","Spare Parts",400,"kg"],
    ["Winter Boots Pallet","Clothing",150,"kg"],["Flare & Beacon Kit","Emergency Supplies",70,"kg"],
    ["VHF Antenna Assembly","Communication Equipment",85,"kg"],["Bottled Water Pallet","Food",900,"kg"],
    ["Kerosene Drums","Fuel",1800,"L"],["Lab Reagent Case","Scientific Equipment",55,"kg"],
    ["Vaccine Cold Chain Box","Medicine",25,"kg"],["Snow Vehicle Track Set","Spare Parts",500,"kg"],
    ["Emergency Ration Packs","Emergency Supplies",200,"kg"],["Field Radio Repeaters","Communication Equipment",65,"kg"],
    ["Canned Goods Pallet","Food",750,"kg"],["Hydraulic Fluid Drums","Fuel",700,"L"],
    ["Drone Survey Kit","Scientific Equipment",45,"kg"],["First Aid Restock Crate","Medicine",35,"kg"],
  ];
  return items.map((it,i)=>{
    const dest = STATIONS[i%3].id;
    const status = CARGO_STATUSES[i%5]; // bias toward earlier lifecycle states
    return {
      id:`CGO-${String(i+101)}`, name:it[0], category:it[1], quantity:it[2], unit:it[3],
      weight: Math.round(it[2]* (it[3]==="L"?0.95:1)), volume: Math.round(it[2]/40*10)/10,
      priority: it[1]==="Medicine"||it[1]==="Emergency Supplies" ? "HIGH": (it[1]==="Fuel"?"MEDIUM":"NORMAL"),
      destination: dest, currentLocation: i%4===0? "In Transit" : "Goa Port Depot",
      transportAsset: null, eta: null, fragility: it[1]==="Scientific Equipment"?"FRAGILE":"STANDARD",
      storage: it[1]==="Medicine"?"REFRIGERATED":(it[1]==="Fuel"?"HAZMAT":"STANDARD"),
      status,
    };
  });
}
const CARGO0 = seedCargo();

const TRANSPORT0 = [
  { id:"TRN-01", name:"MV Polar Star", type:"Ship", capacityKg:180000, location:"Goa Port", destination:"bharati", status:"IN_TRANSIT", etaDays:12, fuelPct:82, weatherRisk:"LOW" },
  { id:"TRN-02", name:"MV Ice Voyager", type:"Ship", capacityKg:150000, location:"Cape Town", destination:"maitri", status:"READY", etaDays:0, fuelPct:95, weatherRisk:"LOW" },
  { id:"TRN-03", name:"Dhruv Helicopter 1", type:"Helicopter", capacityKg:1200, location:"maitri", destination:"dg", status:"READY", etaDays:0, fuelPct:70, weatherRisk:"MODERATE" },
  { id:"TRN-04", name:"Dhruv Helicopter 2", type:"Helicopter", capacityKg:1200, location:"bharati", destination:"bharati", status:"MAINTENANCE", etaDays:0, fuelPct:40, weatherRisk:"LOW" },
  { id:"TRN-05", name:"Snow Cat Alpha", type:"Snow Vehicle", capacityKg:3000, location:"maitri", destination:"dg", status:"IN_TRANSIT", etaDays:1, fuelPct:60, weatherRisk:"HIGH" },
  { id:"TRN-06", name:"Snow Cat Bravo", type:"Snow Vehicle", capacityKg:3000, location:"dg", destination:"dg", status:"READY", etaDays:0, fuelPct:88, weatherRisk:"MODERATE" },
  { id:"TRN-07", name:"Cargo Truck T1", type:"Truck", capacityKg:8000, location:"bharati", destination:"bharati", status:"READY", etaDays:0, fuelPct:77, weatherRisk:"LOW" },
  { id:"TRN-08", name:"IAF Transport Aircraft", type:"Aircraft", capacityKg:40000, location:"Goa Airbase", destination:"bharati", status:"READY", etaDays:0, fuelPct:100, weatherRisk:"LOW" },
];

function seedInventory(){
  const defs = [
    // item, category, unit, per-station qty[maitri,bharati,dg], dailyUse[maitri,bharati,dg], min, safety
    ["Medical Oxygen","Medicine","L",[520,200,140],[9,10,6],150,250],
    ["Diesel Fuel","Fuel","L",[9000,4200,3100],[110,95,80],2000,3500],
    ["Aviation Fuel","Fuel","L",[3000,1600,600],[40,25,15],500,900],
    ["Fresh Food Rations","Food","kg",[2400,1100,650],[45,38,22],400,700],
    ["Dry & Tinned Food","Food","kg",[5200,2600,1400],[30,26,15],800,1400],
    ["Antibiotics","Medicine","kg",[38,18,9],[0.6,0.5,0.3],8,15],
    ["Surgical Supplies","Medicine","kg",[54,22,10],[0.4,0.3,0.2],10,18],
    ["Generator Spare Parts","Spare Parts","kg",[210,140,60],[1.2,1.5,0.9],40,70],
    ["Winter Fuel Additive","Fuel","L",[600,320,150],[6,5,3],100,180],
    ["LPG (Cooking Gas)","Fuel","kg",[900,480,260],[8,7,4],150,260],
    ["Communication Batteries","Communication Equipment","units",[240,140,70],[3,2,1.5],40,80],
    ["Emergency Rations","Emergency Supplies","kg",[300,180,100],[0.5,0.4,0.3],80,150],
  ];
  const rows=[];
  STATIONS.forEach((s,si)=>{
    defs.forEach((d,di)=>{
      rows.push({
        id:`INV-${s.id}-${di+1}`, item:d[0], category:d[1], station:s.id, unit:d[2],
        quantity:d[3][si], dailyConsumption:d[4][si], minThreshold:d[5], safetyStock:d[6],
        reserved: Math.round(d[3][si]*0.05), storageLocation: s.name+" Depot", expiry:null,
      });
    });
  });
  return rows;
}
const INVENTORY0 = seedInventory();

const ASSETS0 = [
  { id:"AST-01", name:"Diesel Generator Unit 1", category:"Power Systems", station:"maitri", condition:"GOOD", status:"OPERATIONAL", assigned:"Vikram Rathore", lastMaint:"2026-06-12", nextMaint:"2026-12-12" },
  { id:"AST-02", name:"Diesel Generator Unit 2", category:"Power Systems", station:"maitri", condition:"FAIR", status:"WARNING", assigned:"Vikram Rathore", lastMaint:"2026-03-02", nextMaint:"2026-09-02" },
  { id:"AST-03", name:"Snow Groomer", category:"Vehicles", station:"maitri", condition:"GOOD", status:"OPERATIONAL", assigned:"Aditya Kulkarni", lastMaint:"2026-07-20", nextMaint:"2027-01-20" },
  { id:"AST-04", name:"Ice Core Drill Rig", category:"Scientific Equipment", station:"maitri", condition:"GOOD", status:"OPERATIONAL", assigned:"Tara Chatterjee", lastMaint:"2026-05-15", nextMaint:"2026-11-15" },
  { id:"AST-05", name:"Satellite Uplink Terminal", category:"Communication Equipment", station:"maitri", condition:"FAIR", status:"OPERATIONAL", assigned:"Naveen Pillai", lastMaint:"2026-04-01", nextMaint:"2026-10-01" },
  { id:"AST-06", name:"Defibrillator Unit", category:"Medical Equipment", station:"maitri", condition:"GOOD", status:"OPERATIONAL", assigned:"Arjun Malhotra", lastMaint:"2026-08-01", nextMaint:"2027-02-01" },
  { id:"AST-07", name:"Diesel Generator Unit 1", category:"Power Systems", station:"bharati", condition:"POOR", status:"DAMAGED", assigned:"Karan Oberoi", lastMaint:"2026-01-18", nextMaint:"2026-09-18" },
  { id:"AST-08", name:"Water Desalination Plant", category:"Power Systems", station:"bharati", condition:"GOOD", status:"OPERATIONAL", assigned:"Karan Oberoi", lastMaint:"2026-06-01", nextMaint:"2026-12-01" },
  { id:"AST-09", name:"Snow Cat Bravo Engine", category:"Vehicles", station:"bharati", condition:"FAIR", status:"OPERATIONAL", assigned:"Yash Trivedi", lastMaint:"2026-07-01", nextMaint:"2026-10-15" },
  { id:"AST-10", name:"Marine Sample Winch", category:"Scientific Equipment", station:"bharati", condition:"GOOD", status:"OPERATIONAL", assigned:"Aryan Chauhan", lastMaint:"2026-05-25", nextMaint:"2026-11-25" },
  { id:"AST-11", name:"Emergency Beacon Array", category:"Emergency Equipment", station:"bharati", condition:"GOOD", status:"OPERATIONAL", assigned:"Pooja Reddy", lastMaint:"2026-08-10", nextMaint:"2027-02-10" },
  { id:"AST-12", name:"Backup Generator", category:"Power Systems", station:"dg", condition:"POOR", status:"UNDER_REPAIR", assigned:"Siddharth Rao", lastMaint:"2025-12-01", nextMaint:"2026-09-14" },
  { id:"AST-13", name:"Snowmobile Fleet (x4)", category:"Vehicles", station:"dg", condition:"FAIR", status:"OPERATIONAL", assigned:"Omkar Desai", lastMaint:"2026-06-20", nextMaint:"2026-09-20" },
  { id:"AST-14", name:"Field Radio Repeater", category:"Communication Equipment", station:"dg", condition:"GOOD", status:"OPERATIONAL", assigned:"Zara Ahmed", lastMaint:"2026-07-05", nextMaint:"2027-01-05" },
];

const EMERGENCIES0 = [
  { id:"EMG-01", station:"dg", location:"Camp Perimeter", type:"EXTREME_WEATHER", severity:"HIGH", time:"2026-09-12 06:40", affected:6, requiredResources:["Shelter","Communication"], status:"MONITORING" },
];

const WEATHER_SEVERITY_RISK = { LOW:5, MODERATE:15, SEVERE:30 };
/* =====================================================================
   PREDICTIVE INVENTORY ENGINE
===================================================================== */
function inventoryStatus(row, weather, resupplyDays){
  const wxMult = weather ? (weather.severity==="SEVERE"?1.35:weather.severity==="MODERATE"?1.12:1) : 1;
  const dailyUse = row.dailyConsumption * wxMult;
  const available = Math.max(row.quantity - row.reserved, 0);
  const daysRemaining = dailyUse>0 ? available / dailyUse : 999;
  const today = new Date("2026-09-13");
  const depletionDate = new Date(today.getTime() + daysRemaining*86400000);
  const gapDays = resupplyDays - daysRemaining;
  const expectedUsage = dailyUse * resupplyDays;
  const projectedQuantity = available - expectedUsage;
  const requiredQuantity = Math.max(expectedUsage - available + row.safetyStock, 0);

  let status = "SAFE";
  if (projectedQuantity < 0 || daysRemaining < resupplyDays * 0.4) status = "CRITICAL";
  else if (projectedQuantity < row.safetyStock || daysRemaining < resupplyDays * 0.85) status = "WARNING";
  if (available <= row.minThreshold) status = "CRITICAL";

  return {
    ...row, dailyUse: Math.round(dailyUse*10)/10, daysRemaining: Math.round(daysRemaining*10)/10,
    depletionDate: depletionDate.toISOString().slice(0,10), gapDays: Math.round(gapDays*10)/10,
    projectedQuantity: Math.round(projectedQuantity), requiredQuantity: Math.round(requiredQuantity),
    status,
  };
}

function computeInventoryFull(inventory, weatherMap, resupplyDaysByStation){
  return inventory.map(row=>{
    const wx = weatherMap[row.station];
    const resupply = resupplyDaysByStation[row.station] ?? 12;
    return inventoryStatus(row, wx, resupply);
  });
}

/* Smart resupply recommendation engine */
function resupplyRecommendations(computedInventory){
  return computedInventory
    .filter(r=>r.status!=="SAFE")
    .map(r=>{
      const stationName = STATIONS.find(s=>s.id===r.station)?.name ?? r.station;
      const shortage = Math.max(r.requiredQuantity, 0);
      return {
        id:`REC-${r.id}`, station:r.station, stationName, item:r.item, category:r.category,
        status:r.status, currentQty:r.quantity, available: Math.max(r.quantity-r.reserved,0),
        required: Math.round(r.dailyUse*12 + r.safetyStock), shortage: Math.round(shortage), unit:r.unit,
        priority: r.status==="CRITICAL"?"CRITICAL":"WARNING",
        deadline: r.depletionDate,
        recommendation: shortage>0
          ? `Add ${Math.round(shortage)} ${r.unit} of ${r.item} to next shipment to ${stationName}.`
          : `Monitor ${r.item} at ${stationName}; margin is thin.`,
      };
    })
    .sort((a,b)=> (a.priority==="CRITICAL"?0:1) - (b.priority==="CRITICAL"?0:1) || a.daysRemaining - b.daysRemaining);
}

/* =====================================================================
   RISK ENGINE
===================================================================== */
function computeRisk(computedInventory, transport, weatherMap, emergencies, assets){
  let score = 100;
  const contributors = [];

  const critical = computedInventory.filter(r=>r.status==="CRITICAL").length;
  const warning = computedInventory.filter(r=>r.status==="WARNING").length;
  const invPenalty = critical*7 + warning*2.5;
  if (invPenalty>0){ score -= invPenalty; contributors.push({ label:"Inventory shortage", value: -Math.round(invPenalty) }); }

  const wxPenalty = Object.values(weatherMap).reduce((s,w)=> s + (WEATHER_SEVERITY_RISK[w.severity]||0), 0)/3;
  if (wxPenalty>0){ score -= wxPenalty; contributors.push({ label:"Weather", value: -Math.round(wxPenalty) }); }

  const delayed = transport.filter(t=>t.status==="DELAYED").length;
  const transPenalty = delayed*6 + transport.filter(t=>t.status==="MAINTENANCE"||t.status==="UNAVAILABLE").length*3;
  if (transPenalty>0){ score -= transPenalty; contributors.push({ label:"Transport delays", value: -Math.round(transPenalty) }); }

  const brokenAssets = assets.filter(a=>a.status==="DAMAGED"||a.status==="OFFLINE").length;
  const assetPenalty = brokenAssets*4 + assets.filter(a=>a.status==="WARNING"||a.status==="UNDER_REPAIR").length*1.5;
  if (assetPenalty>0){ score -= assetPenalty; contributors.push({ label:"Asset failures", value: -Math.round(assetPenalty) }); }

  const emgPenalty = emergencies.reduce((s,e)=> s + (e.status==="RESOLVED"?0: e.severity==="CRITICAL"?18:e.severity==="HIGH"?10:4), 0);
  if (emgPenalty>0){ score -= emgPenalty; contributors.push({ label:"Active emergencies", value: -Math.round(emgPenalty) }); }

  score = Math.max(0, Math.min(100, Math.round(score)));
  let level = "LOW";
  if (score<40) level="CRITICAL"; else if (score<60) level="HIGH"; else if (score<80) level="MEDIUM";
  return { score, level, contributors: contributors.sort((a,b)=>a.value-b.value) };
}

function stationRisk(stationId, computedInventory, weatherMap, emergencies){
  const rows = computedInventory.filter(r=>r.station===stationId);
  const critical = rows.filter(r=>r.status==="CRITICAL").length;
  const warning = rows.filter(r=>r.status==="WARNING").length;
  const wx = WEATHER_SEVERITY_RISK[weatherMap[stationId]?.severity] || 0;
  const emg = emergencies.filter(e=>e.station===stationId && e.status!=="RESOLVED").length;
  let score = 100 - critical*10 - warning*4 - wx - emg*15;
  score = Math.max(0, Math.min(100, Math.round(score)));
  let level = "LOW";
  if (score<40) level="CRITICAL"; else if (score<60) level="HIGH"; else if (score<80) level="MEDIUM";
  return { score, level };
}

/* =====================================================================
   ALERTS — dynamically generated, never hard-coded
===================================================================== */
function generateAlerts(computedInventory, transport, assets, emergencies){
  const alerts = [];
  computedInventory.forEach(r=>{
    const stationName = STATIONS.find(s=>s.id===r.station)?.name ?? r.station;
    if (r.status==="CRITICAL"){
      alerts.push({ id:`AL-INV-${r.id}`, level:"CRITICAL", source:"Inventory",
        message:`${r.item} at ${stationName} predicted to run out ${r.gapDays>0?`${Math.abs(Math.round(r.gapDays))} days before resupply`:"before next resupply"}.`,
        time:"2026-09-13 08:12", resolved:false });
    } else if (r.status==="WARNING"){
      alerts.push({ id:`AL-INV-${r.id}`, level:"WARNING", source:"Inventory",
        message:`${r.item} at ${stationName} is trending toward shortage (${r.daysRemaining} days remaining).`,
        time:"2026-09-13 08:12", resolved:false });
    }
  });
  transport.forEach(t=>{
    if (t.status==="DELAYED") alerts.push({ id:`AL-TRN-${t.id}`, level:"WARNING", source:"Transport", message:`${t.name} is delayed en route to ${STATIONS.find(s=>s.id===t.destination)?.name ?? t.destination}.`, time:"2026-09-13 07:30", resolved:false });
    if (t.weatherRisk==="HIGH") alerts.push({ id:`AL-WX-${t.id}`, level:"WARNING", source:"Weather", message:`${t.name} operation risk is high due to weather conditions.`, time:"2026-09-13 07:00", resolved:false });
    if (t.status==="MAINTENANCE") alerts.push({ id:`AL-MNT-${t.id}`, level:"MAINTENANCE", source:"Transport", message:`${t.name} is grounded for maintenance.`, time:"2026-09-12 18:00", resolved:false });
  });
  assets.forEach(a=>{
    if (a.status==="DAMAGED"||a.status==="UNDER_REPAIR") alerts.push({ id:`AL-AST-${a.id}`, level:"CRITICAL", source:"Assets", message:`${a.name} at ${STATIONS.find(s=>s.id===a.station)?.name} is ${a.status.replace("_"," ").toLowerCase()}.`, time:"2026-09-12 14:00", resolved:false });
    else if (a.status==="WARNING") alerts.push({ id:`AL-AST-${a.id}`, level:"MAINTENANCE", source:"Assets", message:`${a.name} maintenance due ${a.nextMaint}.`, time:"2026-09-12 09:00", resolved:false });
  });
  emergencies.forEach(e=>{
    if (e.status!=="RESOLVED") alerts.push({ id:`AL-EMG-${e.id}`, level: e.severity==="CRITICAL"?"CRITICAL":"WARNING", source:"Emergency", message:`${e.type.replace(/_/g," ")} incident active at ${STATIONS.find(s=>s.id===e.station)?.name} (${e.severity}).`, time:e.time, resolved:false });
  });
  const order = { CRITICAL:0, WARNING:1, MAINTENANCE:2, INFO:3 };
  return alerts.sort((a,b)=>order[a.level]-order[b.level]);
}
/* =====================================================================
   WHAT-IF SIMULATION ENGINE — mutates a snapshot of state and recomputes
===================================================================== */
const SCENARIOS = [
  { id:"delay5", label:"Supply ship delayed 5 days", apply:(s)=>({...s, resupplyDelta:5}) },
  { id:"delay10", label:"Supply ship delayed 10 days", apply:(s)=>({...s, resupplyDelta:10}) },
  { id:"delay15", label:"Supply ship delayed 15 days", apply:(s)=>({...s, resupplyDelta:15}) },
  { id:"fuel20", label:"Fuel consumption +20%", apply:(s)=>({...s, fuelMult:1.2}) },
  { id:"personnel10", label:"Personnel +10 at Bharati", apply:(s)=>({...s, extraPersonnel:10}) },
  { id:"heliDown", label:"Helicopter unavailable", apply:(s)=>({...s, heliDown:true}) },
  { id:"stationCut", label:"Dakshin Gangotri inaccessible", apply:(s)=>({...s, stationCut:"dg"}) },
  { id:"extremeWx", label:"Extreme weather across region", apply:(s)=>({...s, extremeWx:true}) },
  { id:"evac", label:"Emergency evacuation at Bharati", apply:(s)=>({...s, evac:true}) },
];

function runSimulation(scenarioIds, inventory, weatherMap, resupplyDaysByStation, transport){
  let resupplyDelta=0, fuelMult=1, extraPersonnel=0, heliDown=false, stationCut=null, extremeWx=false, evac=false;
  scenarioIds.forEach(id=>{
    const sc = SCENARIOS.find(s=>s.id===id);
    if (!sc) return;
    const r = sc.apply({});
    if (r.resupplyDelta) resupplyDelta += r.resupplyDelta;
    if (r.fuelMult) fuelMult *= r.fuelMult;
    if (r.extraPersonnel) extraPersonnel += r.extraPersonnel;
    if (r.heliDown) heliDown = true;
    if (r.stationCut) stationCut = r.stationCut;
    if (r.extremeWx) extremeWx = true;
    if (r.evac) evac = true;
  });

  const wxMap2 = {};
  Object.keys(weatherMap).forEach(k=>{
    wxMap2[k] = extremeWx ? { ...weatherMap[k], severity:"SEVERE" } : weatherMap[k];
  });
  const resupply2 = {};
  Object.keys(resupplyDaysByStation).forEach(k=> resupply2[k] = resupplyDaysByStation[k] + resupplyDelta);

  const inv2 = inventory.map(row=>{
    let dailyConsumption = row.dailyConsumption;
    if (row.category==="Fuel") dailyConsumption *= fuelMult;
    if (extraPersonnel && row.station==="bharati" && (row.category==="Food"||row.category==="Medicine")) {
      dailyConsumption *= (1 + extraPersonnel*0.02);
    }
    if (evac && row.station==="bharati") dailyConsumption *= 1.4;
    return { ...row, dailyConsumption };
  });

  const computed = computeInventoryFull(inv2, wxMap2, resupply2);
  const risk = computeRisk(computed, transport, wxMap2, EMERGENCIES0, ASSETS0);
  const recs = resupplyRecommendations(computed);

  const byCategory = {};
  computed.forEach(r=>{
    if (!byCategory[r.category]) byCategory[r.category] = "SAFE";
    const order = { SAFE:0, WARNING:1, CRITICAL:2 };
    if (order[r.status] > order[byCategory[r.category]]) byCategory[r.category] = r.status;
  });

  const worst = recs[0];
  const impact = worst
    ? `${worst.item} shortage projected at ${worst.stationName} around ${worst.deadline}${worst.gapDays<0?"":""}.`
    : "No critical shortages projected under this scenario.";
  const donorStation = worst ? findDonorStation(worst, computed) : null;
  const recommendation = worst
    ? (donorStation
        ? `Transfer ${worst.shortage} ${worst.unit} of ${worst.item} from ${donorStation.name} to ${worst.stationName}${heliDown ? " via surface vehicle (helicopter unavailable)" : ""}.`
        : `Expedite ${worst.shortage} ${worst.unit} of ${worst.item} to ${worst.stationName} on next available transport.`)
    : "Maintain current resupply schedule.";

  return { computed, risk, recs, byCategory, impact, recommendation, scenarioIds, heliDown, stationCut, resupplyDelta };
}

function findDonorStation(rec, computedInventory){
  const candidates = computedInventory.filter(r=>
    r.item===rec.item && r.station!==rec.station && r.status==="SAFE" &&
    (r.quantity-r.reserved) - r.safetyStock > rec.shortage
  );
  if (!candidates.length) return null;
  const best = candidates.sort((a,b)=> (b.quantity-b.reserved) - (a.quantity-a.reserved))[0];
  return { id:best.station, name: STATIONS.find(s=>s.id===best.station)?.name, surplus: Math.round((best.quantity-best.reserved)-best.safetyStock) };
}

/* =====================================================================
   SMART CARGO STOWAGE OPTIMIZER — greedy decreasing-weight bin packing
===================================================================== */
function optimizeStowage(cargoList, containerCapacityKg=12000, containerVolumeM3=60){
  const priorityRank = { HIGH:0, MEDIUM:1, NORMAL:2 };
  const sorted = [...cargoList].sort((a,b)=>
    (priorityRank[a.priority]-priorityRank[b.priority]) || (b.weight-a.weight)
  );
  const containers = [];
  sorted.forEach(item=>{
    let placed = false;
    for (const c of containers){
      if (c.usedWeight+item.weight<=containerCapacityKg && c.usedVolume+item.volume<=containerVolumeM3){
        c.items.push(item); c.usedWeight+=item.weight; c.usedVolume+=item.volume; placed=true; break;
      }
    }
    if (!placed){
      containers.push({ id:`CTN-${containers.length+1}`, capacityKg:containerCapacityKg, capacityM3:containerVolumeM3,
        usedWeight:item.weight, usedVolume:item.volume, items:[item] });
    }
  });
  containers.forEach(c=>{
    c.loadingOrder = [...c.items].sort((a,b)=> (priorityRank[a.priority]-priorityRank[b.priority]));
    c.unloadingOrder = [...c.loadingOrder].reverse();
  });
  return containers;
}

/* =====================================================================
   EMERGENCY RESPONSE ENGINE
===================================================================== */
const EMERGENCY_NEEDS = {
  MEDICAL: { skills:["Medical"], items:["Medical Oxygen","Surgical Supplies","Antibiotics"] },
  FIRE: { skills:["Operations"], items:["Emergency Rations"] },
  EXTREME_WEATHER: { skills:["Operations"], items:["Emergency Rations"] },
  VEHICLE_FAILURE: { skills:["Vehicles"], items:["Generator Spare Parts"] },
  COMMUNICATION_FAILURE: { skills:["Radio","Satellite"], items:["Communication Batteries"] },
  EQUIPMENT_FAILURE: { skills:["Power Systems"], items:["Generator Spare Parts"] },
  SUPPLY_SHORTAGE: { skills:["Cargo"], items:["Emergency Rations"] },
  EVACUATION: { skills:["Vehicles","Operations"], items:["Emergency Rations"] },
};

function emergencyResponsePlan(emergency, personnel, computedInventory, transport){
  const need = EMERGENCY_NEEDS[emergency.type] || { skills:[], items:[] };
  const localResponders = personnel.filter(p=>p.station===emergency.station && need.skills.some(sk=>p.skills.includes(sk)));
  const otherStations = STATIONS.filter(s=>s.id!==emergency.station);
  const nearbyHelp = otherStations.map(s=>{
    const responders = personnel.filter(p=>p.station===s.id && need.skills.some(sk=>p.skills.includes(sk)));
    const supplies = need.items.map(item=>{
      const row = computedInventory.find(r=>r.station===s.id && r.item===item);
      return row ? { item, available: Math.round(row.quantity-row.reserved), unit: row.unit, surplus: row.status==="SAFE" } : null;
    }).filter(Boolean);
    return { station: s, responders, supplies };
  }).filter(x=>x.responders.length || x.supplies.some(sp=>sp.surplus));

  const availableTransport = transport.filter(t=> t.status==="READY" && (t.location===emergency.station || t.destination===emergency.station));

  const steps = [];
  if (localResponders.length) steps.push(`Deploy on-site responder ${localResponders[0].name} (${localResponders[0].role}) at ${STATIONS.find(s=>s.id===emergency.station)?.name}.`);
  const donor = nearbyHelp.find(h=>h.responders.length) || nearbyHelp[0];
  if (donor) {
    if (donor.responders.length) steps.push(`Dispatch ${donor.responders[0].name} (${donor.responders[0].role}) from ${donor.station.name}.`);
    const goodSupply = donor.supplies.find(s=>s.surplus);
    if (goodSupply) steps.push(`Transfer ${goodSupply.available} ${goodSupply.unit} of ${goodSupply.item} from ${donor.station.name}.`);
  }
  if (availableTransport.length) steps.push(`Assign ${availableTransport[0].name} for rapid transfer.`);
  else steps.push(`No ready transport at ${STATIONS.find(s=>s.id===emergency.station)?.name} — request nearest available asset.`);

  return { need, localResponders, nearbyHelp, availableTransport, steps };
}
/* =====================================================================
   AI LOGISTICS ASSISTANT — deterministic decision engine (no external LLM)
   Answers are generated from live application state, not canned text.
===================================================================== */
function aiAssistantAnswer(question, ctx){
  const q = question.toLowerCase();
  const { computedInventory, risk, recs, transport, weatherMap, resupplyDaysByStation } = ctx;

  const findStationId = ()=> STATIONS.find(s=> q.includes(s.name.toLowerCase()) || q.includes(s.id))?.id;

  // "Can <station> survive a N-day supply delay?"
  const delayMatch = q.match(/(\d+)\s*-?\s*day/);
  if (q.includes("survive") && delayMatch){
    const stId = findStationId() || "bharati";
    const days = parseInt(delayMatch[1],10);
    const sim = runSimulation([days<=6?"delay5":days<=12?"delay10":"delay15"], INVENTORY0.filter(r=>true), weatherMap, resupplyDaysByStation, transport);
    const stName = STATIONS.find(s=>s.id===stId)?.name;
    const stRows = sim.computed.filter(r=>r.station===stId);
    const critical = stRows.filter(r=>r.status==="CRITICAL");
    const answer = critical.length
      ? `No — ${stName} cannot fully absorb a ${days}-day delay without action.`
      : `Yes — ${stName} can absorb a ${days}-day delay with current stock.`;
    return {
      answer,
      reasoning: critical.length
        ? `Extending the resupply window by ${days} days pushes ${critical.map(r=>r.item).join(", ")} below safety stock before the vessel arrives.`
        : `All tracked inventory categories at ${stName} remain above safety stock through the extended ${days}-day window.`,
      dataUsed: stRows.map(r=>`${r.item}: ${r.daysRemaining}d remaining, status ${r.status}`),
      recommendation: critical.length
        ? `Pre-position ${critical[0].item} from an unaffected station before the delay materializes.`
        : `No immediate action required; continue monitoring.`,
    };
  }

  if (q.includes("critical") && (q.includes("inventory")||q.includes("item")||q.includes("stock"))){
    const crit = computedInventory.filter(r=>r.status==="CRITICAL");
    return {
      answer: crit.length ? `${crit.length} inventory line(s) are currently CRITICAL.` : "No inventory items are currently critical.",
      reasoning: "Status is derived from days-of-supply remaining versus each station's resupply interval, and from minimum-threshold breaches.",
      dataUsed: crit.map(r=>`${r.item} @ ${STATIONS.find(s=>s.id===r.station)?.name}: ${r.daysRemaining}d remaining`),
      recommendation: crit.length ? `Prioritize ${crit[0].item} at ${STATIONS.find(s=>s.id===crit[0].station)?.name} in the next shipment.` : "Maintain current resupply cadence.",
    };
  }

  if (q.includes("next shipment") || q.includes("should be sent") || (q.includes("send") && q.includes("shipment"))){
    const top = recs.slice(0,4);
    return {
      answer: top.length ? `The next shipment should prioritize ${top.map(r=>r.item).join(", ")}.` : "No urgent items for the next shipment.",
      reasoning: "Ranked by shortage severity (CRITICAL before WARNING) and by days remaining before depletion.",
      dataUsed: top.map(r=>`${r.item} → ${r.stationName}: shortage ${r.shortage} ${r.unit}`),
      recommendation: top.map(r=>r.recommendation).join(" "),
    };
  }

  if (q.includes("which station") && q.includes("help")){
    const stId = findStationId() || "bharati";
    const target = recs.find(r=>r.station===stId);
    if (!target) return { answer:`${STATIONS.find(s=>s.id===stId)?.name} has no active shortages requiring support.`, reasoning:"No CRITICAL or WARNING inventory rows found for this station.", dataUsed:[], recommendation:"No action needed." };
    const donor = findDonorStation(target, computedInventory);
    return {
      answer: donor ? `${donor.name} can support ${STATIONS.find(s=>s.id===stId)?.name}.` : `No station currently holds sufficient surplus to help ${STATIONS.find(s=>s.id===stId)?.name}.`,
      reasoning: donor ? `${donor.name} holds ${donor.surplus} ${target.unit} of ${target.item} above its own safety stock.` : "All other stations are at or below safety stock for this item.",
      dataUsed: [`Shortfall at ${target.stationName}: ${target.shortage} ${target.unit} of ${target.item}`],
      recommendation: donor ? `Transfer ${Math.min(donor.surplus, target.shortage)} ${target.unit} of ${target.item} from ${donor.name}.` : `Expedite external resupply for ${target.item}.`,
    };
  }

  if (q.includes("fuel") && q.includes("20")){
    const sim = runSimulation(["fuel20"], INVENTORY0, weatherMap, resupplyDaysByStation, transport);
    const fuelRows = sim.computed.filter(r=>r.category==="Fuel");
    const worst = fuelRows.sort((a,b)=>a.daysRemaining-b.daysRemaining)[0];
    return {
      answer: `A 20% rise in fuel consumption drops mission health to ${sim.risk.score}/100 (${sim.risk.level}).`,
      reasoning: `${worst.item} at ${STATIONS.find(s=>s.id===worst.station)?.name} falls to ${worst.daysRemaining} days of supply, status ${worst.status}.`,
      dataUsed: fuelRows.map(r=>`${r.item} @ ${STATIONS.find(s=>s.id===r.station)?.name}: ${r.daysRemaining}d, ${r.status}`),
      recommendation: sim.recommendation,
    };
  }

  if (q.includes("cargo") && q.includes("priorit")){
    const top = [...CARGO0].sort((a,b)=> ({HIGH:0,MEDIUM:1,NORMAL:2}[a.priority]) - ({HIGH:0,MEDIUM:1,NORMAL:2}[b.priority]) ).slice(0,5);
    return {
      answer: `${top.map(c=>c.name).join(", ")} should be prioritized for loading.`,
      reasoning: "Priority is assigned by cargo category criticality (medicine and emergency supplies first, then fuel, then general cargo).",
      dataUsed: top.map(c=>`${c.name}: priority ${c.priority}, destination ${STATIONS.find(s=>s.id===c.destination)?.name}`),
      recommendation: "Load HIGH priority items first and closest to the exit for fastest unloading.",
    };
  }

  // fallback: mission health summary
  return {
    answer: `Mission health is currently ${risk.score}/100 (${risk.level}).`,
    reasoning: risk.contributors.length ? `Primary contributors: ${risk.contributors.map(c=>`${c.label} (${c.value})`).join(", ")}.` : "No significant risk contributors detected.",
    dataUsed: computedInventory.filter(r=>r.status!=="SAFE").slice(0,5).map(r=>`${r.item} @ ${STATIONS.find(s=>s.id===r.station)?.name}: ${r.status}`),
    recommendation: recs[0]?.recommendation ?? "No immediate action required. Continue monitoring.",
  };
}

const AI_SUGGESTED_QUESTIONS = [
  "Can Bharati survive a 10-day supply delay?",
  "Which inventory items are critical?",
  "What should be sent in the next shipment?",
  "Which station can help Bharati?",
  "What happens if fuel consumption increases by 20%?",
  "Which cargo should be prioritized?",
];
/* =====================================================================
   SHARED UI PRIMITIVES
===================================================================== */
function GlobalStyle(){
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600&display=swap');
      .polar-root { font-family: ${fontHead}; color: ${T.ice}; background: ${T.void}; }
      .polar-root * { box-sizing: border-box; }
      .polar-mono { font-family: ${fontMono}; }
      .polar-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
      .polar-scroll::-webkit-scrollbar-thumb { background: ${T.borderBright}; border-radius: 8px; }
      .polar-scroll::-webkit-scrollbar-track { background: transparent; }
      .polar-grid-bg { background: transparent; }
      .polar-corner { position: relative; box-shadow: 0 1px 2px rgba(16,24,40,0.05); }
      @keyframes pulseDot { 0%,100%{ opacity:1; } 50%{ opacity:0.35; } }
      input, select, textarea { outline: none; }
      ::placeholder { color: ${T.iceFaint}; }

      @media (max-width: 768px) {
        .polar-login-grid {
          grid-template-columns: 1fr !important;
          max-width: 480px !important;
        }
        .polar-login-grid > div:first-child {
          border-right: none !important;
          border-bottom: 1px solid ${T.border};
        }
        .polar-login-grid > div {
          padding: 28px 22px !important;
        }
      }
    `}</style>
  );
}

function Panel({ title, icon:Icon, right, children, className="", pad=true, bg=true }){
  return (
    <div className={`polar-corner ${className}`} style={{
      background: bg ? T.panel : "transparent", border:`1px solid ${T.border}`, borderRadius:10,
    }}>
      {title && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {Icon && <Icon size={14} color={T.cyan} />}
            <span style={{ fontSize:13, color:T.iceDim, fontWeight:600 }}>{title}</span>
          </div>
          {right}
        </div>
      )}
      <div style={{ padding: pad ? 14 : 0 }}>{children}</div>
    </div>
  );
}

function statusColors(){ return {
  SAFE:T.green, OPERATIONAL:T.green, READY:T.green, LOW:T.green, ON_DUTY:T.green, RECEIVED:T.green, ARRIVED:T.green, RESOLVED:T.green,
  WARNING:T.amber, MEDIUM:T.amber, MODERATE:T.amber, DELAYED:T.amber, FAIR:T.amber, MAINTENANCE:T.amber, IN_TRANSIT:T.cyan,
  CRITICAL:T.red, HIGH:T.red, SEVERE:T.red, DAMAGED:T.red, LOST:T.red, OFFLINE:T.red, UNAVAILABLE:T.red, POOR:T.red, UNDER_REPAIR:T.amber,
  PLANNED:T.iceDim, REQUESTED:T.iceDim, APPROVED:T.cyan, PACKED:T.cyan, LOADED:T.cyan, ACTIVE:T.cyan, COMPLETED:T.green, CANCELLED:T.iceFaint,
  MONITORING:T.amber, NORMAL:T.iceDim, GOOD:T.green,
}; }
function StatusBadge({ status }){
  const c = statusColors()[status] || T.iceDim;
  return (
    <span className="polar-mono" style={{
      display:"inline-flex", alignItems:"center", gap:6, fontSize:11, padding:"3px 8px",
      border:`1px solid ${c}55`, color:c, borderRadius:8, whiteSpace:"nowrap",
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c, boxShadow:`0 0 6px ${c}` }} />
      {status.replace(/_/g," ")}
    </span>
  );
}

function KPI({ label, value, unit, icon:Icon, accent }){
  return (
    <div className="polar-corner" style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <span style={{ fontSize:12.5, color:T.iceDim }}>{label}</span>
        {Icon && <Icon size={14} color={accent||T.cyan} />}
      </div>
      <div className="polar-mono" style={{ fontSize:24, fontWeight:600, color:T.ice }}>
        {value}<span style={{ fontSize:12, color:T.iceDim, marginLeft:4 }}>{unit}</span>
      </div>
    </div>
  );
}

function DataTable({ columns, rows, onRowClick }){
  return (
    <div className="polar-scroll" style={{ overflowX:"auto", border:`1px solid ${T.border}`, borderRadius:10 }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13.5 }}>
        <thead>
          <tr style={{ background:T.subtle }}>
            {columns.map(c=>(
              <th key={c.key} style={{ textAlign:"left", padding:"10px 14px", color:T.iceDim, fontWeight:600, fontSize:12.5, borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap" }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length===0 && (
            <tr><td colSpan={columns.length} style={{ padding:24, textAlign:"center", color:T.iceFaint }}>No records match.</td></tr>
          )}
          {rows.map((r,i)=>(
            <tr key={r.id||i} onClick={()=>onRowClick&&onRowClick(r)} style={{ cursor:onRowClick?"pointer":"default", background: i%2===1?T.stripe:T.panel, borderBottom:`1px solid ${T.border}` }}
              onMouseEnter={e=>e.currentTarget.style.background=T.cyanDim} onMouseLeave={e=>e.currentTarget.style.background=i%2===1?T.stripe:T.panel}>
              {columns.map(c=>(
                <td key={c.key} style={{ padding:"10px 14px", color:T.ice, whiteSpace:"nowrap" }}>{c.render ? c.render(r) : r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Modal({ title, onClose, children, width=520 }){
  return (
    <div style={{ position:"fixed", inset:0, background:T.overlay, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div className="polar-corner" onClick={e=>e.stopPropagation()} style={{ width, maxWidth:"100%", maxHeight:"86vh", overflowY:"auto", background:T.panelSolid, border:`1px solid ${T.borderBright}`, borderRadius:12, boxShadow:"0 20px 40px rgba(16,24,40,0.18)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontSize:13, fontWeight:600, color:T.ice }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:T.iceDim, cursor:"pointer" }}><X size={16}/></button>
        </div>
        <div style={{ padding:16 }}>{children}</div>
      </div>
    </div>
  );
}

function Toast({ toasts }){
  return (
    <div style={{ position:"fixed", bottom:16, right:16, zIndex:200, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t=>(
        <div key={t.id} className="polar-corner" style={{ background:T.panelSolid, border:`1px solid ${t.type==="error"?T.red:t.type==="success"?T.green:T.borderBright}`, borderRadius:10, padding:"10px 14px", fontSize:13, color:T.ice, minWidth:240, boxShadow:"0 8px 24px rgba(16,24,40,0.15)" }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function Field({ label, children }){
  return (
    <label style={{ display:"block", marginBottom:12 }}>
      <span style={{ display:"block", fontSize:12.5, color:T.iceDim, marginBottom:6 }}>{label}</span>
      {children}
    </label>
  );
}
function inputStyle(){ return { width:"100%", background:T.panel, border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 10px", color:T.ice, fontSize:13 }; }

function Btn({ children, onClick, variant="primary", icon:Icon, type="button", disabled }){
  const styles = {
    primary: { background:T.cyan, color:"#FFFFFF", border:`1px solid ${T.cyan}` },
    ghost: { background:"transparent", color:T.ice, border:`1px solid ${T.border}` },
    danger: { background:"transparent", color:T.red, border:`1px solid ${T.red}55` },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={{
      ...styles[variant], display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600,
      padding:"8px 14px", borderRadius:8, cursor: disabled?"not-allowed":"pointer", opacity: disabled?0.5:1,
    }}>
      {Icon && <Icon size={14}/>}{children}
    </button>
  );
}

function EmptyState({ label }){
  return <div style={{ padding:"32px 12px", textAlign:"center", color:T.iceFaint, fontSize:13 }}>{label}</div>;
}
/* =====================================================================
   POLAR MAP — custom SVG (Leaflet unavailable in this runtime)
===================================================================== */
/* =====================================================================
   POLAR MAP — real satellite basemap (Esri World Imagery) via Leaflet,
   loaded from CDN at runtime since it isn't a bundled dependency.
===================================================================== */
const PORTS = {
  maitri:  { name:"Cape Town",  lat:-33.92, lng:18.42 },
  bharati: { name:"Fremantle",  lat:-32.06, lng:115.74 },
};

function loadLeaflet(onReady){
  if (typeof window==="undefined") return;
  if (window.L){ onReady(window.L); return; }
  if (!document.getElementById("leaflet-css")){
    const link = document.createElement("link");
    link.id = "leaflet-css"; link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }
  let script = document.getElementById("leaflet-js");
  if (!script){
    script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    document.body.appendChild(script);
  }
  script.addEventListener("load", ()=> onReady(window.L));
  if (window.L) onReady(window.L);
}

function bearingDeg(a, b){
  const toRad = d=>d*Math.PI/180, toDeg = r=>(r*180/Math.PI+360)%360;
  const y = Math.sin(toRad(b.lng-a.lng)) * Math.cos(toRad(b.lat));
  const x = Math.cos(toRad(a.lat))*Math.sin(toRad(b.lat)) - Math.sin(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.cos(toRad(b.lng-a.lng));
  return toDeg(Math.atan2(y, x));
}

const BOAT_SVG = (color, angle)=> `
  <div style="transform:rotate(${angle}deg);width:26px;height:26px;display:flex;align-items:center;justify-content:center;">
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      style="filter:drop-shadow(0 1px 3px rgba(0,0,0,0.85));">
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="white"/>
      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.62 7.44" fill="${color}"/>
      <path d="M12 10V4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3"/>
    </svg>
  </div>`;

function PolarMap({ stations, transport, emergencies, onSelectStation, selected, themeMode }){
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [ready, setReady] = useState(false);

  useEffect(()=>{ loadLeaflet(()=> setReady(true)); }, []);

  // create the map + satellite tile layer + routes + vessels once
  useEffect(()=>{
    if (!ready || !containerRef.current || mapRef.current) return;
    const L = window.L;
    const map = L.map(containerRef.current, { worldCopyJump:true }).setView([-71, 35], 3);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 13,
      attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics",
    }).addTo(map);
    mapRef.current = map;

    const maitri = stations.find(s=>s.id==="maitri");
    const bharati = stations.find(s=>s.id==="bharati");
    const dg = stations.find(s=>s.id==="dg");
    const routes = [[PORTS.maitri, maitri], [PORTS.bharati, bharati], [maitri, dg]].filter(([a,b])=>a&&b);

    routes.forEach(([a,b])=>{
      L.polyline([[a.lat,a.lng],[b.lat,b.lng]], { color:"#49D6E8", weight:2, dashArray:"5 7", opacity:0.85 }).addTo(map);
    });
    routes.slice(0,2).forEach(([a,b])=>{
      const t = 0.4;
      const lat = a.lat + (b.lat-a.lat)*t, lng = a.lng + (b.lng-a.lng)*t;
      const icon = L.divIcon({ className:"polar-boat-icon", html:BOAT_SVG("#49D6E8", bearingDeg(a,b)), iconSize:[26,26], iconAnchor:[13,13] });
      L.marker([lat,lng], { icon, interactive:false }).addTo(map);
    });

    setTimeout(()=> map.invalidateSize(), 60);
  }, [ready]);

  // (re)draw station markers when stations, selection, emergencies, or theme change
  useEffect(()=>{
    if (!ready || !mapRef.current) return;
    const L = window.L, map = mapRef.current;
    Object.values(markersRef.current).forEach(m=> map.removeLayer(m));
    markersRef.current = {};
    stations.forEach(s=>{
      const isSel = selected===s.id;
      const emg = emergencies.some(e=>e.station===s.id && e.status!=="RESOLVED");
      const color = emg ? "#E5544A" : "#49D6E8";
      const dot = isSel ? 16 : 12;
      const icon = L.divIcon({
        className: "polar-station-icon",
        html: `<div style="display:flex;flex-direction:column;align-items:center;">
                 <div style="width:${dot}px;height:${dot}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 6px rgba(0,0,0,0.6)${emg?`,0 0 0 6px ${color}55`:""}"></div>
                 <div style="margin-top:4px;padding:2px 7px;background:rgba(11,15,23,0.78);color:#fff;font-size:11px;border-radius:4px;white-space:nowrap;font-family:${fontMono}">${s.name}</div>
               </div>`,
        iconSize:[90,44], iconAnchor:[dot/2, dot/2],
      });
      const marker = L.marker([s.lat, s.lng], { icon }).addTo(map);
      marker.on("click", ()=> onSelectStation(s.id));
      markersRef.current[s.id] = marker;
    });
  }, [ready, stations, selected, emergencies, themeMode]);

  // fly to a station when it's selected from elsewhere in the app
  useEffect(()=>{
    if (!ready || !mapRef.current || !selected) return;
    const s = stations.find(x=>x.id===selected);
    if (s) mapRef.current.flyTo([s.lat, s.lng], Math.max(mapRef.current.getZoom(), 5), { duration:0.8 });
  }, [selected, ready]);

  useEffect(()=> ()=>{ if (mapRef.current){ mapRef.current.remove(); mapRef.current = null; } }, []);

  return (
    <div style={{ position:"relative", width:"100%", aspectRatio:"16/10", borderRadius:10, overflow:"hidden", border:`1px solid ${T.border}` }}>
      <div ref={containerRef} style={{ width:"100%", height:"100%", background:T.mapBg }} />
      {!ready && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:T.iceDim, fontSize:12, background:T.mapBg }}>
          Loading satellite imagery…
        </div>
      )}
      <div style={{ position:"absolute", bottom:8, left:10, display:"flex", gap:14, fontSize:10.5, color:"#fff", textShadow:"0 1px 3px rgba(0,0,0,0.85)", zIndex:1000, pointerEvents:"none" }}>
        <span style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ width:9, height:9, borderRadius:"50%", background:"#49D6E8", border:"1.5px solid #fff", display:"inline-block" }}/>Station</span>
        <span style={{ display:"flex", alignItems:"center", gap:5 }}><Ship size={12}/>Vessel</span>
        <span style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ width:12, height:0, borderTop:"1.5px dashed #49D6E8", display:"inline-block" }}/>Supply route</span>
      </div>
    </div>
  );
}

/* =====================================================================
   LOGIN VIEW
===================================================================== */
function LoginView({ onLogin, themeMode, onToggleTheme }){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [clock] = useState(()=> new Date("2026-09-13T08:14:00"));

  function submit(e){
    e.preventDefault();
    const acct = DEMO_ACCOUNTS.find(a=>a.email===email.trim().toLowerCase() && a.password===password);
    if (!acct){ setError("Invalid credentials. Use one of the demo accounts below."); return; }
    setError("");
    onLogin(acct);
  }

  return (
    <div className="polar-root" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", padding:16 }}>
      <GlobalStyle/>
      <button onClick={onToggleTheme} title="Toggle theme" style={{ position:"absolute", top:20, right:20, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", background:T.panel, border:`1px solid ${T.border}`, borderRadius:8, color:T.iceDim, cursor:"pointer" }}>
        {themeMode==="dark" ? <Sun size={16}/> : <Moon size={16}/>}
      </button>
      <div className="polar-login-grid" style={{ position:"relative", zIndex:1, width:"100%", maxWidth:"min(1400px, 92vw)", display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:0, border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden", boxShadow:"0 12px 32px rgba(16,24,40,0.08)" }}>
        <div style={{ padding:"46px 40px", background:T.subtle, borderRight:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:26 }}>
            <Snowflake size={22} color={T.cyan}/>
            <span className="polar-mono" style={{ fontSize:20, fontWeight:600, letterSpacing:"0.08em" }}>POLAR</span>
          </div>
          <div style={{ fontSize:12, color:T.iceDim, lineHeight:1.7, marginBottom:22 }}>
            Integrated Polar Expedition Logistics &amp; Asset Management System
          </div>
          <div style={{ fontSize:13, color:T.ice, lineHeight:1.6, marginBottom:30, maxWidth:340 }}>
            Mission intelligence for the world's most remote environments.
          </div>
          <div className="polar-mono" style={{ fontSize:11, color:T.iceFaint, display:"grid", gap:6 }}>
            <div>LAT 70.76°S · LNG 11.73°E</div>
            <div>MISSION TIME {clock.toISOString().slice(0,16).replace("T"," ")} UTC</div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}><Wifi size={12} color={T.green}/> NETWORK NOMINAL</div>
          </div>
          <div style={{ marginTop:34, paddingTop:18, borderTop:`1px solid ${T.border}` }}>
            <div style={{ fontSize:11, color:T.iceDim, marginBottom:10 }}>Demo Accounts</div>
            <div style={{ display:"grid", gap:6, maxHeight:170, overflowY:"auto" }} className="polar-scroll">
              {DEMO_ACCOUNTS.map(a=>(
                <button key={a.id} onClick={()=>{ setEmail(a.email); setPassword(a.password); }} style={{
                  textAlign:"left", background:"transparent", border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 9px",
                  color:T.iceDim, fontSize:11.5, cursor:"pointer", display:"flex", justifyContent:"space-between"
                }}>
                  <span>{a.name}</span><span className="polar-mono" style={{ color:T.cyan }}>{a.role.replace(/_/g," ")}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding:"46px 36px", background:T.void, display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:22 }}>Command Center Access</div>
          <Field label="Email">
            <input style={inputStyle()} value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@polar.gov.in"
              onKeyDown={e=>{ if(e.key==="Enter") submit(e); }} />
          </Field>
          <Field label="Password">
            <input type="password" style={inputStyle()} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={e=>{ if(e.key==="Enter") submit(e); }} />
          </Field>
          {error && <div style={{ color:T.red, fontSize:12, marginBottom:12 }}>{error}</div>}
          <Btn onClick={submit}>Authenticate <ArrowRight size={14}/></Btn>
          <div style={{ marginTop:18, fontSize:11, color:T.iceFaint, lineHeight:1.6 }}>
            Click a demo account on the left to autofill credentials, then authenticate.
          </div>
        </div>
      </div>
    </div>
  );
}
/* =====================================================================
   DASHBOARD VIEW
===================================================================== */
function DashboardView({ data, onNavigate, onSelectStation, selectedStation }){
  const { computedInventory, risk, alerts, transport, weatherMap, expeditions, personnel, cargo, emergencies } = data;
  const activeExp = expeditions.filter(e=>e.status==="ACTIVE").length;
  const inTransitCargo = cargo.filter(c=>c.status==="IN_TRANSIT").length;
  const criticalItems = computedInventory.filter(r=>r.status==="CRITICAL").length;
  const activeEmg = emergencies.filter(e=>e.status!=="RESOLVED").length;
  const avgWx = Object.values(weatherMap).some(w=>w.severity==="SEVERE") ? "SEVERE" : Object.values(weatherMap).some(w=>w.severity==="MODERATE") ? "MODERATE" : "LOW";
  const nextResupply = transport.filter(t=>t.type==="Ship").sort((a,b)=>a.etaDays-b.etaDays)[0];

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
        <KPI label="MISSION HEALTH" value={risk.score} unit="/100" icon={Gauge} accent={statusColors()[risk.level]||T.cyan}/>
        <KPI label="ACTIVE EXPEDITIONS" value={activeExp} unit="" icon={Anchor}/>
        <KPI label="PERSONNEL DEPLOYED" value={personnel.length} unit="" icon={Users}/>
        <KPI label="CARGO IN TRANSIT" value={inTransitCargo} unit="" icon={Package}/>
        <KPI label="CRITICAL ITEMS" value={criticalItems} unit="" icon={AlertTriangle} accent={criticalItems?T.red:T.green}/>
        <KPI label="ACTIVE EMERGENCIES" value={activeEmg} unit="" icon={Siren} accent={activeEmg?T.red:T.green}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:14 }}>
        <Panel title="Operations Map" icon={MapPin} right={<span className="polar-mono" style={{ fontSize:10, color:T.iceFaint }}>Click a station</span>}>
          <PolarMap stations={STATIONS} transport={transport} emergencies={emergencies} onSelectStation={onSelectStation} selected={selectedStation} themeMode={data.themeMode} />
          <div style={{ display:"flex", gap:16, marginTop:10, fontSize:11, color:T.iceDim }}>
            <span><span style={{ color:T.cyan }}>●</span> Station</span>
            <span><span style={{ color:T.red }}>●</span> Active Emergency</span>
            <span style={{ color:T.cyan }}>┄ Cargo Route</span>
          </div>
        </Panel>

        <div style={{ display:"grid", gap:14 }}>
          <Panel title="Mission Risk Contributors" icon={Activity}>
            <div style={{ fontSize:30, fontWeight:700, color: statusColors()[risk.level], marginBottom:4 }} className="polar-mono">{risk.score}<span style={{ fontSize:13, color:T.iceDim }}>/100</span></div>
            <div style={{ fontSize:11, color:T.iceDim, marginBottom:10 }}>Level: <span style={{ color:statusColors()[risk.level] }}>{risk.level}</span></div>
            <div style={{ display:"grid", gap:6 }}>
              {risk.contributors.length===0 && <div style={{ fontSize:12, color:T.iceFaint }}>No significant risk contributors.</div>}
              {risk.contributors.map((c,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                  <span style={{ color:T.iceDim }}>{c.label}</span>
                  <span className="polar-mono" style={{ color:T.red }}>{c.value}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Resupply" icon={Ship}>
            {nextResupply ? (
              <div style={{ fontSize:12, color:T.iceDim, display:"grid", gap:4 }}>
                <div style={{ color:T.ice, fontSize:13, fontWeight:600 }}>{nextResupply.name}</div>
                <div>→ {STATIONS.find(s=>s.id===nextResupply.destination)?.name}</div>
                <div>ETA: <span className="polar-mono" style={{ color:T.cyan }}>{nextResupply.etaDays}d</span></div>
                <div>Weather risk: <StatusBadge status={nextResupply.weatherRisk}/></div>
              </div>
            ) : <EmptyState label="No scheduled resupply." />}
          </Panel>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Panel title="Weather Risk" icon={CloudSnow} right={<StatusBadge status={avgWx}/>}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {STATIONS.map(s=>{
              const w = weatherMap[s.id];
              return (
                <div key={s.id} style={{ border:`1px solid ${T.border}`, borderRadius:8, padding:10 }}>
                  <div style={{ fontSize:12, fontWeight:600, marginBottom:6 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:T.iceDim, display:"grid", gap:3 }}>
                    <div><Thermometer size={10} style={{ display:"inline", marginRight:4 }}/>{w.temp}°C</div>
                    <div><Wind size={10} style={{ display:"inline", marginRight:4 }}/>{w.wind} km/h</div>
                    <div><Eye size={10} style={{ display:"inline", marginRight:4 }}/>{w.visibility} km</div>
                  </div>
                  <div style={{ marginTop:6 }}><StatusBadge status={w.severity}/></div>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel title="Live Alerts" icon={Bell} right={<button onClick={()=>onNavigate("alerts")} style={{ background:"none", border:"none", color:T.cyan, fontSize:11, cursor:"pointer" }}>View all</button>}>
          <div style={{ display:"grid", gap:8, maxHeight:220, overflowY:"auto" }} className="polar-scroll">
            {alerts.slice(0,6).map(a=>(
              <div key={a.id} style={{ display:"flex", gap:8, alignItems:"flex-start", borderLeft:`2px solid ${statusColors()[a.level]}`, paddingLeft:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:T.ice }}>{a.message}</div>
                  <div style={{ fontSize:10, color:T.iceFaint, marginTop:2 }}>{a.source} · {a.time}</div>
                </div>
              </div>
            ))}
            {alerts.length===0 && <EmptyState label="No active alerts." />}
          </div>
        </Panel>
      </div>
    </div>
  );
}
/* =====================================================================
   EXPEDITIONS VIEW
===================================================================== */
function ExpeditionsView({ data, actions }){
  const { expeditions } = data;
  const [modal, setModal] = useState(null); // "new" | expedition object
  const [form, setForm] = useState({ name:"", description:"", destination:"maitri", startDate:"", endDate:"", teamSize:10, priority:"MEDIUM", route:"", nextResupply:"" });

  function openNew(){ setForm({ name:"", description:"", destination:"maitri", startDate:"", endDate:"", teamSize:10, priority:"MEDIUM", route:"", nextResupply:"" }); setModal("new"); }
  function save(){
    if (!form.name.trim()) return;
    actions.addExpedition(form);
    setModal(null);
  }

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:15, fontWeight:600 }}>Expeditions</div>
        <Btn icon={Plus} onClick={openNew}>New Expedition</Btn>
      </div>
      <Panel pad={false}>
        <DataTable
          columns={[
            { key:"id", label:"ID" }, { key:"name", label:"Name" },
            { key:"destination", label:"Destination", render:r=>STATIONS.find(s=>s.id===r.destination)?.name },
            { key:"status", label:"Status", render:r=><StatusBadge status={r.status}/> },
            { key:"priority", label:"Priority" }, { key:"teamSize", label:"Team" },
            { key:"startDate", label:"Start" }, { key:"nextResupply", label:"Next Resupply" },
          ]}
          rows={expeditions}
          onRowClick={r=>setModal(r)}
        />
      </Panel>

      {modal && (
        <Modal title={modal==="new" ? "New Expedition" : `Expedition ${modal.id}`} onClose={()=>setModal(null)}>
          {modal==="new" ? (
            <div>
              <Field label="Name"><input style={inputStyle()} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
              <Field label="Description"><textarea style={{...inputStyle(),minHeight:60}} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></Field>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Destination">
                  <select style={inputStyle()} value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})}>
                    {STATIONS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
                <Field label="Mission Priority">
                  <select style={inputStyle()} value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                    {["LOW","MEDIUM","HIGH","CRITICAL"].map(p=><option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Start Date"><input type="date" style={inputStyle()} value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/></Field>
                <Field label="End Date"><input type="date" style={inputStyle()} value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}/></Field>
                <Field label="Team Size"><input type="number" style={inputStyle()} value={form.teamSize} onChange={e=>setForm({...form,teamSize:parseInt(e.target.value)||0})}/></Field>
                <Field label="Next Resupply Date"><input type="date" style={inputStyle()} value={form.nextResupply} onChange={e=>setForm({...form,nextResupply:e.target.value})}/></Field>
              </div>
              <Field label="Planned Route"><input style={inputStyle()} value={form.route} onChange={e=>setForm({...form,route:e.target.value})} placeholder="Goa Port → Bharati Station"/></Field>
              <Btn onClick={save} icon={Check}>Create Expedition</Btn>
            </div>
          ) : (
            <div style={{ display:"grid", gap:8, fontSize:13 }}>
              <div><b>{modal.name}</b> — {modal.description}</div>
              <div>Destination: {STATIONS.find(s=>s.id===modal.destination)?.name}</div>
              <div>Status: <StatusBadge status={modal.status}/></div>
              <div>Team size: {modal.teamSize} · Priority: {modal.priority}</div>
              <div>Route: {modal.route || "—"}</div>
              <div>Start {modal.startDate || "—"} · End {modal.endDate || "—"} · Next resupply {modal.nextResupply || "—"}</div>
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                {["PLANNED","ACTIVE","DELAYED","COMPLETED","CANCELLED"].map(s=>(
                  <button key={s} onClick={()=>{ actions.updateExpeditionStatus(modal.id, s); setModal(null); }} style={{
                    fontSize:11, padding:"5px 9px", borderRadius:8, cursor:"pointer",
                    background: s===modal.status? T.cyan:"transparent", color: s===modal.status? "#FFFFFF":T.iceDim,
                    border:`1px solid ${s===modal.status?T.cyan:T.border}` }}>{s}</button>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

/* =====================================================================
   CARGO VIEW
===================================================================== */
function CargoView({ data, actions }){
  const { cargo } = data;
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [showOptimizer, setShowOptimizer] = useState(false);

  const filtered = cargo.filter(c=>
    (catFilter==="ALL"||c.category===catFilter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
  );

  const nextStatus = { REQUESTED:"APPROVED", APPROVED:"PACKED", PACKED:"LOADED", LOADED:"IN_TRANSIT", IN_TRANSIT:"ARRIVED", ARRIVED:"RECEIVED" };

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
        <div style={{ fontSize:15, fontWeight:600 }}>Cargo Management</div>
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ position:"relative" }}>
            <Search size={13} style={{ position:"absolute", left:8, top:9, color:T.iceFaint }}/>
            <input style={{ ...inputStyle(), paddingLeft:26, width:200 }} placeholder="Search cargo…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select style={inputStyle()} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
            <option value="ALL">All categories</option>
            {CARGO_CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
          <Btn variant="ghost" icon={Boxes} onClick={()=>setShowOptimizer(true)}>Stowage Optimizer</Btn>
        </div>
      </div>
      <Panel pad={false}>
        <DataTable
          columns={[
            { key:"id", label:"ID" }, { key:"name", label:"Name" }, { key:"category", label:"Category" },
            { key:"quantity", label:"Qty", render:r=>`${r.quantity} ${r.unit}` },
            { key:"priority", label:"Priority" },
            { key:"destination", label:"Destination", render:r=>STATIONS.find(s=>s.id===r.destination)?.name },
            { key:"status", label:"Status", render:r=><StatusBadge status={r.status}/> },
          ]}
          rows={filtered}
          onRowClick={setSelected}
        />
      </Panel>

      {selected && (
        <Modal title={`${selected.id} — ${selected.name}`} onClose={()=>setSelected(null)}>
          <div style={{ display:"grid", gap:6, fontSize:13, marginBottom:14 }}>
            <div>Category: {selected.category} · Priority: {selected.priority}</div>
            <div>Quantity: {selected.quantity} {selected.unit} · Weight: {selected.weight} kg · Volume: {selected.volume} m³</div>
            <div>Destination: {STATIONS.find(s=>s.id===selected.destination)?.name}</div>
            <div>Current location: {selected.currentLocation}</div>
            <div>Fragility: {selected.fragility} · Storage: {selected.storage}</div>
            <div>Status: <StatusBadge status={selected.status}/></div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {nextStatus[selected.status] && (
              <Btn onClick={()=>{ actions.updateCargoStatus(selected.id, nextStatus[selected.status]); setSelected({...selected, status:nextStatus[selected.status]}); }}>
                Advance to {nextStatus[selected.status]}
              </Btn>
            )}
            <Btn variant="danger" onClick={()=>{ actions.updateCargoStatus(selected.id, "DAMAGED"); setSelected({...selected,status:"DAMAGED"}); }}>Mark Damaged</Btn>
          </div>
        </Modal>
      )}

      {showOptimizer && <StowageOptimizerModal cargo={cargo} onClose={()=>setShowOptimizer(false)} />}
    </div>
  );
}

function StowageOptimizerModal({ cargo, onClose }){
  const [capacity, setCapacity] = useState(12000);
  const [volume, setVolume] = useState(60);
  const [result, setResult] = useState(null);
  const candidateCargo = cargo.filter(c=>["REQUESTED","APPROVED","PACKED"].includes(c.status));

  function optimize(){ setResult(optimizeStowage(candidateCargo, capacity, volume)); }

  return (
    <Modal title="Smart Cargo Stowage Optimizer" onClose={onClose} width={640}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:12, marginBottom:14, alignItems:"end" }}>
        <Field label="Container Capacity (kg)"><input type="number" style={inputStyle()} value={capacity} onChange={e=>setCapacity(parseInt(e.target.value)||0)}/></Field>
        <Field label="Container Volume (m³)"><input type="number" style={inputStyle()} value={volume} onChange={e=>setVolume(parseInt(e.target.value)||0)}/></Field>
        <Btn onClick={optimize} icon={Boxes}>Optimize Loading</Btn>
      </div>
      <div style={{ fontSize:11, color:T.iceFaint, marginBottom:10 }}>{candidateCargo.length} cargo items eligible for loading (requested/approved/packed).</div>
      {result && (
        <div style={{ display:"grid", gap:10 }}>
          {result.map(c=>(
            <div key={c.id} style={{ border:`1px solid ${T.border}`, borderRadius:8, padding:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:6 }}>
                <b>{c.id}</b>
                <span className="polar-mono" style={{ color:T.iceDim }}>{c.usedWeight}/{c.capacityKg} kg · {c.usedVolume.toFixed(1)}/{c.capacityM3} m³</span>
              </div>
              <div style={{ height:6, background:T.void, borderRadius:8, overflow:"hidden", marginBottom:8 }}>
                <div style={{ width:`${Math.min(100,(c.usedWeight/c.capacityKg)*100)}%`, height:"100%", background:T.cyan }}/>
              </div>
              <div style={{ fontSize:11.5, color:T.iceDim }}>Loading order: {c.loadingOrder.map(i=>i.name).join(" → ")}</div>
            </div>
          ))}
        </div>
      )}
      {!result && <EmptyState label="Click OPTIMIZE LOADING to generate a container plan." />}
    </Modal>
  );
}
/* =====================================================================
   TRANSPORT VIEW
===================================================================== */
const TRANSPORT_ICON = { Ship:Ship, Helicopter:Plane, Truck:Truck, "Snow Vehicle":Truck, Aircraft:Plane };
function TransportView({ data, actions }){
  const { transport } = data;
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ fontSize:15, fontWeight:600 }}>Transportation Tracking</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {transport.map(t=>{
          const Icon = TRANSPORT_ICON[t.type]||Truck;
          return (
            <div key={t.id} onClick={()=>setSelected(t)} className="polar-corner" style={{ cursor:"pointer", background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, padding:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <Icon size={16} color={T.cyan}/>
                <StatusBadge status={t.status}/>
              </div>
              <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{t.name}</div>
              <div style={{ fontSize:11, color:T.iceDim, marginBottom:8 }}>{t.type}</div>
              <div className="polar-mono" style={{ fontSize:11, color:T.iceDim, display:"grid", gap:3 }}>
                <div>→ {STATIONS.find(s=>s.id===t.destination)?.name ?? t.destination}</div>
                <div>ETA: {t.etaDays}d · Fuel {t.fuelPct}%</div>
                <div>Weather risk: <span style={{ color:statusColors()[t.weatherRisk] }}>{t.weatherRisk}</span></div>
              </div>
            </div>
          );
        })}
      </div>
      {selected && (
        <Modal title={selected.name} onClose={()=>setSelected(null)}>
          <div style={{ display:"grid", gap:6, fontSize:13, marginBottom:14 }}>
            <div>Type: {selected.type} · Capacity: {selected.capacityKg.toLocaleString()} kg</div>
            <div>Location: {selected.location} → Destination: {STATIONS.find(s=>s.id===selected.destination)?.name ?? selected.destination}</div>
            <div>ETA: {selected.etaDays} days · Fuel: {selected.fuelPct}%</div>
            <div>Status: <StatusBadge status={selected.status}/> · Weather risk: <StatusBadge status={selected.weatherRisk}/></div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <Btn onClick={()=>{ actions.updateTransportStatus(selected.id,"DELAYED"); setSelected({...selected,status:"DELAYED"}); }} variant="ghost">Mark Delayed</Btn>
            <Btn onClick={()=>{ actions.updateTransportStatus(selected.id,"IN_TRANSIT"); setSelected({...selected,status:"IN_TRANSIT"}); }} variant="ghost">Dispatch</Btn>
            <Btn onClick={()=>{ actions.updateTransportStatus(selected.id,"ARRIVED"); setSelected({...selected,status:"ARRIVED"}); }} variant="ghost">Mark Arrived</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* =====================================================================
   INVENTORY VIEW — the predictive engine surfaced
===================================================================== */
function InventoryView({ data }){
  const { computedInventory } = data;
  const [stationFilter, setStationFilter] = useState("ALL");
  const rows = computedInventory.filter(r=>stationFilter==="ALL"||r.station===stationFilter);
  const chartData = ["Fuel","Food","Medicine"].map(cat=>{
    const catRows = computedInventory.filter(r=>r.category===cat);
    const obj = { category:cat };
    STATIONS.forEach(s=>{ obj[s.name] = Math.round(catRows.filter(r=>r.station===s.id).reduce((a,r)=>a+r.daysRemaining,0)/Math.max(1,catRows.filter(r=>r.station===s.id).length)); });
    return obj;
  });

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:15, fontWeight:600 }}>Predictive Inventory</div>
        <select style={inputStyle()} value={stationFilter} onChange={e=>setStationFilter(e.target.value)}>
          <option value="ALL">All stations</option>
          {STATIONS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <Panel title="Days of Supply Remaining — Fuel / Food / Medicine" icon={BarChart3}>
        <div style={{ width:"100%", height:220 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
              <XAxis dataKey="category" stroke={T.iceDim} fontSize={11} />
              <YAxis stroke={T.iceDim} fontSize={11} />
              <Tooltip contentStyle={{ background:T.panelSolid, border:`1px solid ${T.border}`, fontSize:12 }} />
              <Legend wrapperStyle={{ fontSize:11 }}/>
              <Bar dataKey="Maitri" fill={T.cyan} />
              <Bar dataKey="Bharati" fill={T.violet} />
              <Bar dataKey="Dakshin Gangotri" fill={T.amber} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel pad={false}>
        <DataTable
          columns={[
            { key:"item", label:"Item" }, { key:"station", label:"Station", render:r=>STATIONS.find(s=>s.id===r.station)?.name },
            { key:"quantity", label:"Qty", render:r=>`${r.quantity} ${r.unit}` },
            { key:"dailyUse", label:"Daily Use", render:r=>`${r.dailyUse} ${r.unit}/day` },
            { key:"daysRemaining", label:"Days Remaining" },
            { key:"depletionDate", label:"Depletion Date" },
            { key:"status", label:"Status", render:r=><StatusBadge status={r.status}/> },
          ]}
          rows={rows.sort((a,b)=>a.daysRemaining-b.daysRemaining)}
        />
      </Panel>
    </div>
  );
}
/* =====================================================================
   ASSETS VIEW
===================================================================== */
function AssetsView({ data }){
  const { assets } = data;
  const maintDue = assets.filter(a=>a.status==="WARNING"||a.status==="UNDER_REPAIR"||a.status==="DAMAGED");
  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ fontSize:15, fontWeight:600 }}>Asset Management</div>
      {maintDue.length>0 && (
        <Panel title="Maintenance Alerts" icon={Wrench}>
          <div style={{ display:"grid", gap:6 }}>
            {maintDue.map(a=>(
              <div key={a.id} style={{ display:"flex", justifyContent:"space-between", fontSize:12, borderLeft:`2px solid ${statusColors()[a.status]}`, paddingLeft:8 }}>
                <span>{a.name} — {STATIONS.find(s=>s.id===a.station)?.name}</span>
                <span className="polar-mono" style={{ color:T.iceDim }}>Next: {a.nextMaint}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}
      <Panel pad={false}>
        <DataTable
          columns={[
            { key:"id", label:"ID" }, { key:"name", label:"Name" }, { key:"category", label:"Category" },
            { key:"station", label:"Station", render:r=>STATIONS.find(s=>s.id===r.station)?.name },
            { key:"condition", label:"Condition", render:r=><StatusBadge status={r.condition}/> },
            { key:"status", label:"Status", render:r=><StatusBadge status={r.status}/> },
            { key:"assigned", label:"Assigned To" }, { key:"nextMaint", label:"Next Maintenance" },
          ]}
          rows={assets}
        />
      </Panel>
    </div>
  );
}

/* =====================================================================
   PERSONNEL VIEW
===================================================================== */
function PersonnelView({ data }){
  const { personnel } = data;
  const [stationFilter, setStationFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const rows = personnel.filter(p=>(stationFilter==="ALL"||p.station===stationFilter) && p.name.toLowerCase().includes(search.toLowerCase()));
  const byStation = STATIONS.map(s=>({ station:s, count: personnel.filter(p=>p.station===s.id).length }));

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
        <div style={{ fontSize:15, fontWeight:600 }}>Personnel Directory</div>
        <div style={{ display:"flex", gap:8 }}>
          <input style={{ ...inputStyle(), width:180 }} placeholder="Search personnel…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <select style={inputStyle()} value={stationFilter} onChange={e=>setStationFilter(e.target.value)}>
            <option value="ALL">All stations</option>
            {STATIONS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {byStation.map(b=>(
          <KPI key={b.station.id} label={b.station.name} value={b.count} unit="personnel" icon={Users}/>
        ))}
      </div>
      <Panel pad={false}>
        <DataTable
          columns={[
            { key:"id", label:"ID" }, { key:"name", label:"Name" }, { key:"role", label:"Role" },
            { key:"skills", label:"Skills", render:r=>r.skills.join(", ") },
            { key:"station", label:"Station", render:r=>STATIONS.find(s=>s.id===r.station)?.name },
            { key:"status", label:"Status", render:r=><StatusBadge status={r.status}/> },
          ]}
          rows={rows}
        />
      </Panel>
    </div>
  );
}

/* =====================================================================
   STATIONS VIEW — digital twin
===================================================================== */
function StationsView({ data, initialSelected }){
  const { personnel, computedInventory, assets, weatherMap, emergencies, transport } = data;
  const [selected, setSelected] = useState(initialSelected || STATIONS[0].id);
  const s = STATIONS.find(x=>x.id===selected);
  const sPersonnel = personnel.filter(p=>p.station===selected);
  const sInventory = computedInventory.filter(r=>r.station===selected);
  const sAssets = assets.filter(a=>a.station===selected);
  const sEmg = emergencies.filter(e=>e.station===selected);
  const sVehicles = transport.filter(t=>t.location===selected && (t.type==="Snow Vehicle"||t.type==="Truck"));
  const risk = stationRisk(selected, computedInventory, weatherMap, emergencies);
  const fuel = sInventory.find(r=>r.item==="Diesel Fuel");
  const food = sInventory.find(r=>r.item==="Fresh Food Rations");
  const med = sInventory.find(r=>r.item==="Medical Oxygen");
  const pct = (r)=> r ? Math.max(0,Math.min(100,Math.round(((r.quantity-r.reserved)/(r.minThreshold*4))*100))) : 0;

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"flex", gap:8 }}>
        {STATIONS.map(st=>(
          <button key={st.id} onClick={()=>setSelected(st.id)} style={{
            padding:"7px 14px", borderRadius:8, fontSize:12.5, cursor:"pointer",
            background: selected===st.id? T.cyan:"transparent", color: selected===st.id?"#FFFFFF":T.iceDim,
            border:`1px solid ${selected===st.id?T.cyan:T.border}` }}>{st.name}</button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
        <KPI label="PERSONNEL" value={sPersonnel.length} unit="" icon={Users}/>
        <KPI label="RISK" value={risk.score} unit="/100" icon={ShieldAlert} accent={statusColors()[risk.level]}/>
        <KPI label="ACTIVE EMERGENCIES" value={sEmg.filter(e=>e.status!=="RESOLVED").length} unit="" icon={Siren} accent={sEmg.length?T.red:T.green}/>
        <KPI label="VEHICLES ON-SITE" value={sVehicles.length} unit="" icon={Truck}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
        <Panel title="Fuel" icon={Fuel} right={fuel && <StatusBadge status={fuel.status}/>}>
          {fuel ? <><div className="polar-mono" style={{ fontSize:22, fontWeight:600 }}>{pct(fuel)}%</div><div style={{ fontSize:11, color:T.iceDim }}>{fuel.daysRemaining} days remaining</div></> : <EmptyState label="No data"/>}
        </Panel>
        <Panel title="Food" icon={Package} right={food && <StatusBadge status={food.status}/>}>
          {food ? <><div className="polar-mono" style={{ fontSize:22, fontWeight:600 }}>{pct(food)}%</div><div style={{ fontSize:11, color:T.iceDim }}>{food.daysRemaining} days remaining</div></> : <EmptyState label="No data"/>}
        </Panel>
        <Panel title="Medical" icon={HeartPulse} right={med && <StatusBadge status={med.status}/>}>
          {med ? <><div className="polar-mono" style={{ fontSize:22, fontWeight:600 }}>{pct(med)}%</div><div style={{ fontSize:11, color:T.iceDim }}>{med.daysRemaining} days remaining</div></> : <EmptyState label="No data"/>}
        </Panel>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Panel title="Weather" icon={CloudSnow}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, fontSize:12, color:T.iceDim }}>
            <div>Temp: {weatherMap[selected].temp}°C</div><div>Wind: {weatherMap[selected].wind} km/h</div>
            <div>Visibility: {weatherMap[selected].visibility} km</div><div>Ice: {weatherMap[selected].ice}</div>
          </div>
          <div style={{ marginTop:8 }}><StatusBadge status={weatherMap[selected].severity}/></div>
        </Panel>
        <Panel title="Assets" icon={Wrench}>
          <div style={{ display:"grid", gap:5, maxHeight:130, overflowY:"auto" }} className="polar-scroll">
            {sAssets.map(a=>(<div key={a.id} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}><span>{a.name}</span><StatusBadge status={a.status}/></div>))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
/* =====================================================================
   EMERGENCY RESPONSE VIEW
===================================================================== */
const EMERGENCY_TYPES = ["MEDICAL","FIRE","EXTREME_WEATHER","VEHICLE_FAILURE","COMMUNICATION_FAILURE","EQUIPMENT_FAILURE","SUPPLY_SHORTAGE","EVACUATION"];
function EmergencyView({ data, actions }){
  const { emergencies, personnel, computedInventory, transport } = data;
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ station:"bharati", location:"", type:"MEDICAL", severity:"HIGH", affected:1 });
  const [planFor, setPlanFor] = useState(null);

  function create(){
    if (!form.location.trim()) return;
    actions.addEmergency(form);
    setModal(false);
    setForm({ station:"bharati", location:"", type:"MEDICAL", severity:"HIGH", affected:1 });
  }

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:15, fontWeight:600 }}>Emergency Response Center</div>
        <Btn icon={Siren} onClick={()=>setModal(true)} variant="danger">Report Emergency</Btn>
      </div>

      <div style={{ display:"grid", gap:12 }}>
        {emergencies.length===0 && <EmptyState label="No emergency incidents recorded."/>}
        {emergencies.map(e=>(
          <Panel key={e.id} title={`${e.id} — ${e.type.replace(/_/g," ")}`} icon={Siren} right={<StatusBadge status={e.status}/>}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, fontSize:12, color:T.iceDim, marginBottom:10 }}>
              <div>Station: {STATIONS.find(s=>s.id===e.station)?.name}</div>
              <div>Severity: <StatusBadge status={e.severity}/></div>
              <div>Affected: {e.affected}</div>
              <div>Location: {e.location}</div>
              <div>Time: {e.time}</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Btn variant="ghost" icon={BrainCircuit} onClick={()=>setPlanFor(e)}>Generate Response Plan</Btn>
              {e.status!=="RESOLVED" && <Btn variant="ghost" icon={Check} onClick={()=>actions.resolveEmergency(e.id)}>Mark Resolved</Btn>}
            </div>
          </Panel>
        ))}
      </div>

      {modal && (
        <Modal title="Report Emergency Incident" onClose={()=>setModal(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Station"><select style={inputStyle()} value={form.station} onChange={e=>setForm({...form,station:e.target.value})}>{STATIONS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
            <Field label="Type"><select style={inputStyle()} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{EMERGENCY_TYPES.map(t=><option key={t}>{t}</option>)}</select></Field>
            <Field label="Severity"><select style={inputStyle()} value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}>{["LOW","MEDIUM","HIGH","CRITICAL"].map(s=><option key={s}>{s}</option>)}</select></Field>
            <Field label="Affected Personnel"><input type="number" style={inputStyle()} value={form.affected} onChange={e=>setForm({...form,affected:parseInt(e.target.value)||0})}/></Field>
          </div>
          <Field label="Location"><input style={inputStyle()} value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="e.g. Generator Shed"/></Field>
          <Btn variant="danger" onClick={create} icon={Siren}>Create Incident</Btn>
        </Modal>
      )}

      {planFor && (
        <Modal title={`Response Plan — ${planFor.id}`} onClose={()=>setPlanFor(null)} width={620}>
          {(() => {
            const plan = emergencyResponsePlan(planFor, personnel, computedInventory, transport);
            return (
              <div style={{ display:"grid", gap:14 }}>
                <div>
                  <div style={{ fontSize:11, color:T.iceDim, marginBottom:6 }}>Recommended Actions</div>
                  <div style={{ display:"grid", gap:6 }}>
                    {plan.steps.map((s,i)=>(
                      <div key={i} style={{ display:"flex", gap:8, fontSize:13 }}><ArrowRight size={13} color={T.cyan} style={{ marginTop:2, flexShrink:0 }}/><span>{s}</span></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:T.iceDim, marginBottom:6 }}>Nearby Station Support</div>
                  {plan.nearbyHelp.length===0 && <div style={{ fontSize:12, color:T.iceFaint }}>No nearby resources identified.</div>}
                  {plan.nearbyHelp.map(h=>(
                    <div key={h.station.id} style={{ border:`1px solid ${T.border}`, borderRadius:8, padding:10, marginBottom:6, fontSize:12, color:T.iceDim }}>
                      <b style={{ color:T.ice }}>{h.station.name}</b>: {h.responders.length} responder(s){h.supplies.length? ", " + h.supplies.map(sp=>`${sp.available} ${sp.unit} ${sp.item}`).join(", "):""}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

/* =====================================================================
   SIMULATION CENTER
===================================================================== */
function SimulationView({ data, savedSims, onSaveSim }){
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [result, setResult] = useState(null);

  function toggle(id){ setSelectedScenarios(s=> s.includes(id) ? s.filter(x=>x!==id) : [...s, id]); }
  function run(){
    if (!selectedScenarios.length) return;
    const r = runSimulation(selectedScenarios, INVENTORY0, data.weatherMap, data.resupplyDaysByStation, data.transport);
    setResult(r);
  }
  function runSihDemo(){
    setSelectedScenarios(["delay5"]);
    const r = runSimulation(["delay5"], INVENTORY0, data.weatherMap, data.resupplyDaysByStation, data.transport);
    setResult(r);
  }

  const chartData = result ? Object.entries(result.byCategory).map(([category, status])=>({ category, riskLevel: status==="CRITICAL"?3:status==="WARNING"?2:1 })) : [];

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
        <div style={{ fontSize:15, fontWeight:600 }}>What-If Simulation Center</div>
        <Btn variant="ghost" icon={Siren} onClick={runSihDemo}>Run SIH Demo Scenario</Btn>
      </div>
      <Panel title="Select Scenarios" icon={FlaskConical}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
          {SCENARIOS.map(s=>(
            <button key={s.id} onClick={()=>toggle(s.id)} style={{
              textAlign:"left", fontSize:12, padding:"9px 11px", borderRadius:8, cursor:"pointer",
              background: selectedScenarios.includes(s.id) ? `${T.cyan}1A` : "transparent",
              border:`1px solid ${selectedScenarios.includes(s.id)?T.cyan:T.border}`, color:T.ice }}>{s.label}</button>
          ))}
        </div>
        <Btn onClick={run} icon={Activity}>Run Simulation</Btn>
      </Panel>

      {result && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Panel title="Projected Mission Health" icon={Gauge}>
              <div className="polar-mono" style={{ fontSize:28, fontWeight:700, color:statusColors()[result.risk.level] }}>{result.risk.score}<span style={{ fontSize:13, color:T.iceDim }}>/100</span></div>
              <div style={{ fontSize:12, color:T.iceDim, marginTop:4 }}>Level: {result.risk.level}</div>
            </Panel>
            <Panel title="Category Status" icon={Boxes}>
              <div style={{ display:"grid", gap:6 }}>
                {Object.entries(result.byCategory).map(([cat,status])=>(
                  <div key={cat} style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}><span style={{ color:T.iceDim }}>{cat}</span><StatusBadge status={status}/></div>
                ))}
              </div>
            </Panel>
          </div>
          <Panel title="Impact & Recommendation" icon={BrainCircuit}>
            <div style={{ fontSize:13, color:T.ice, marginBottom:6 }}><b>Impact:</b> {result.impact}</div>
            <div style={{ fontSize:13, color:T.cyan }}><b>Recommendation:</b> {result.recommendation}</div>
            <div style={{ marginTop:12 }}>
              <Btn variant="ghost" icon={Check} onClick={()=>onSaveSim({ id:`SIM-${Date.now()}`, scenarios:selectedScenarios.map(id=>SCENARIOS.find(s=>s.id===id)?.label), score:result.risk.score, level:result.risk.level, impact:result.impact, recommendation:result.recommendation, time:"2026-09-13" })}>Save Simulation Result</Btn>
            </div>
          </Panel>
        </>
      )}

      {savedSims.length>0 && (
        <Panel title="Saved Simulations" icon={FileClock}>
          <div style={{ display:"grid", gap:8 }}>
            {savedSims.map(s=>(
              <div key={s.id} style={{ borderLeft:`2px solid ${statusColors()[s.level]}`, paddingLeft:8, fontSize:12 }}>
                <div style={{ color:T.ice }}>{s.scenarios.join(", ")} — Health {s.score}/100 ({s.level})</div>
                <div style={{ color:T.iceDim }}>{s.impact}</div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
/* =====================================================================
   AI LOGISTICS ASSISTANT VIEW
===================================================================== */
function AIView({ data }){
  const [messages, setMessages] = useState([
    { role:"assistant", text:"POLAR AI Logistics Assistant online. Ask about inventory, resupply, transport risk, or emergency readiness — answers are generated from live mission data." }
  ]);
  const [input, setInput] = useState("");

  function ask(q){
    if (!q.trim()) return;
    const ans = aiAssistantAnswer(q, data);
    setMessages(m=>[...m, { role:"user", text:q }, { role:"assistant", text:null, structured:ans }]);
    setInput("");
  }

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 260px", gap:14, height:"calc(100vh - 150px)" }}>
      <Panel title="AI Logistics Assistant" icon={BrainCircuit} pad={false} className="" >
        <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 260px)" }}>
          <div className="polar-scroll" style={{ flex:1, overflowY:"auto", padding:14, display:"grid", gap:12 }}>
            {messages.map((m,i)=>(
              <div key={i} style={{ alignSelf: m.role==="user"?"flex-end":"flex-start", maxWidth:"80%" }}>
                {m.role==="user" ? (
                  <div style={{ background:`${T.cyan}1A`, border:`1px solid ${T.cyanDim}`, borderRadius:10, padding:"8px 12px", fontSize:13 }}>{m.text}</div>
                ) : m.text ? (
                  <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, padding:"8px 12px", fontSize:13 }}>{m.text}</div>
                ) : (
                  <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", fontSize:12.5, display:"grid", gap:8 }}>
                    <div><span style={{ color:T.cyan, fontWeight:600 }}>Answer </span>{m.structured.answer}</div>
                    <div><span style={{ color:T.iceDim, fontWeight:600 }}>Reasoning </span><span style={{ color:T.iceDim }}>{m.structured.reasoning}</span></div>
                    {m.structured.dataUsed.length>0 && (
                      <div><span style={{ color:T.iceDim, fontWeight:600 }}>Data Used</span>
                        <ul style={{ margin:"4px 0 0 16px", padding:0, color:T.iceDim }}>{m.structured.dataUsed.map((d,idx)=><li key={idx}>{d}</li>)}</ul>
                      </div>
                    )}
                    <div style={{ color:T.green }}><span style={{ fontWeight:600 }}>Recommendation </span>{m.structured.recommendation}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, padding:12, borderTop:`1px solid ${T.border}` }}>
            <input style={inputStyle()} placeholder="Ask about mission logistics…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter" && ask(input)}/>
            <Btn onClick={()=>ask(input)} icon={ArrowRight}>Ask</Btn>
          </div>
        </div>
      </Panel>
      <Panel title="Suggested Queries" icon={BrainCircuit}>
        <div style={{ display:"grid", gap:6 }}>
          {AI_SUGGESTED_QUESTIONS.map((q,i)=>(
            <button key={i} onClick={()=>ask(q)} style={{ textAlign:"left", fontSize:11.5, color:T.iceDim, background:"transparent", border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 9px", cursor:"pointer" }}>{q}</button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* =====================================================================
   ANALYTICS VIEW
===================================================================== */
function AnalyticsView({ data }){
  const [range, setRange] = useState(30);
  const days = Array.from({length:range}, (_,i)=>i);
  const fuelSeries = days.map(d=>({ day:`D${d+1}`, Maitri: 9000 - d*110 + Math.sin(d)*80, Bharati: 4200 - d*95 + Math.cos(d)*60 }));
  const cargoThroughput = days.filter((_,i)=>i%Math.max(1,Math.floor(range/10))===0).map((d,i)=>({ day:`D${d+1}`, delivered: Math.round(4+Math.random()*6) }));
  const emgFrequency = ["Medical","Weather","Vehicle","Comms","Equipment"].map(t=>({ type:t, count: Math.round(1+Math.random()*4) }));

  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:15, fontWeight:600 }}>Analytics</div>
        <div style={{ display:"flex", gap:6 }}>
          {[7,30,90].map(r=>(
            <button key={r} onClick={()=>setRange(r)} style={{ fontSize:11.5, padding:"6px 11px", borderRadius:8, cursor:"pointer",
              background: range===r?T.cyan:"transparent", color: range===r?"#FFFFFF":T.iceDim, border:`1px solid ${range===r?T.cyan:T.border}` }}>{r}d</button>
          ))}
        </div>
      </div>
      <Panel title="Fuel Consumption Trend (L)" icon={Fuel}>
        <div style={{ width:"100%", height:200 }}>
          <ResponsiveContainer>
            <AreaChart data={fuelSeries}>
              <CartesianGrid stroke={T.border} strokeDasharray="3 3"/>
              <XAxis dataKey="day" stroke={T.iceDim} fontSize={10} interval={Math.floor(range/8)}/>
              <YAxis stroke={T.iceDim} fontSize={10}/>
              <Tooltip contentStyle={{ background:T.panelSolid, border:`1px solid ${T.border}`, fontSize:12 }}/>
              <Area type="monotone" dataKey="Maitri" stroke={T.cyan} fill={`${T.cyan}22`}/>
              <Area type="monotone" dataKey="Bharati" stroke={T.violet} fill={`${T.violet}22`}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Panel title="Cargo Throughput" icon={Package}>
          <div style={{ width:"100%", height:180 }}>
            <ResponsiveContainer><BarChart data={cargoThroughput}><CartesianGrid stroke={T.border} strokeDasharray="3 3"/><XAxis dataKey="day" stroke={T.iceDim} fontSize={10}/><YAxis stroke={T.iceDim} fontSize={10}/><Tooltip contentStyle={{ background:T.panelSolid, border:`1px solid ${T.border}`, fontSize:12 }}/><Bar dataKey="delivered" fill={T.green}/></BarChart></ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Emergency Frequency by Type" icon={Siren}>
          <div style={{ width:"100%", height:180 }}>
            <ResponsiveContainer><BarChart data={emgFrequency} layout="vertical"><CartesianGrid stroke={T.border} strokeDasharray="3 3"/><XAxis type="number" stroke={T.iceDim} fontSize={10}/><YAxis dataKey="type" type="category" stroke={T.iceDim} fontSize={10} width={70}/><Tooltip contentStyle={{ background:T.panelSolid, border:`1px solid ${T.border}`, fontSize:12 }}/><Bar dataKey="count" fill={T.amber}/></BarChart></ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* =====================================================================
   ALERTS VIEW
===================================================================== */
function AlertsView({ alerts, resolvedIds, onResolve }){
  const [filter, setFilter] = useState("ALL");
  const visible = alerts.filter(a=> filter==="ALL"||a.level===filter);
  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:15, fontWeight:600 }}>Alert Center</div>
        <select style={inputStyle()} value={filter} onChange={e=>setFilter(e.target.value)}>
          {["ALL","CRITICAL","WARNING","MAINTENANCE"].map(f=><option key={f}>{f}</option>)}
        </select>
      </div>
      <div style={{ display:"grid", gap:8 }}>
        {visible.map(a=>{
          const resolved = resolvedIds.includes(a.id);
          return (
            <div key={a.id} className="polar-corner" style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:10, padding:12, display:"flex", justifyContent:"space-between", alignItems:"center", opacity:resolved?0.45:1 }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <StatusBadge status={resolved?"RESOLVED":a.level}/>
                <div>
                  <div style={{ fontSize:13, color:T.ice }}>{a.message}</div>
                  <div style={{ fontSize:11, color:T.iceFaint, marginTop:2 }}>{a.source} · {a.time}</div>
                </div>
              </div>
              {!resolved && <Btn variant="ghost" onClick={()=>onResolve(a.id)} icon={Check}>Resolve</Btn>}
            </div>
          );
        })}
        {visible.length===0 && <EmptyState label="No alerts match this filter."/>}
      </div>
    </div>
  );
}

/* =====================================================================
   AUDIT LOG VIEW
===================================================================== */
function AuditView({ log }){
  return (
    <div style={{ display:"grid", gap:14 }}>
      <div style={{ fontSize:15, fontWeight:600 }}>Audit Log</div>
      <Panel pad={false}>
        <DataTable
          columns={[
            { key:"time", label:"Time" }, { key:"user", label:"User" }, { key:"action", label:"Action" },
            { key:"entity", label:"Entity" }, { key:"oldValue", label:"Old Value" }, { key:"newValue", label:"New Value" },
          ]}
          rows={log}
        />
      </Panel>
    </div>
  );
}
/* =====================================================================
   APP SHELL
===================================================================== */
const NAV = [
  { id:"dashboard", label:"Command Center", icon:Gauge },
  { id:"expeditions", label:"Expeditions", icon:Anchor },
  { id:"cargo", label:"Cargo", icon:Package },
  { id:"transport", label:"Transport", icon:Ship },
  { id:"inventory", label:"Inventory", icon:Boxes },
  { id:"assets", label:"Assets", icon:Wrench },
  { id:"personnel", label:"Personnel", icon:Users },
  { id:"stations", label:"Stations", icon:MapPin },
  { id:"emergency", label:"Emergency", icon:Siren },
  { id:"simulation", label:"Simulation", icon:FlaskConical },
  { id:"analytics", label:"Analytics", icon:BarChart3 },
  { id:"ai", label:"AI Assistant", icon:BrainCircuit },
  { id:"alerts", label:"Alerts", icon:Bell },
  { id:"audit", label:"Audit Log", icon:FileClock },
];

export default function PolarApp(){
  const [themeMode, setThemeMode] = useState("light");
  applyTheme(themeMode);
  const toggleTheme = ()=> setThemeMode(m => m==="dark" ? "light" : "dark");

  const [session, setSession] = useState(null);
  const [view, setView] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const [online, setOnline] = useState(true);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [syncState, setSyncState] = useState("ONLINE");
  const [selectedStation, setSelectedStation] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [savedSims, setSavedSims] = useState([]);
  const [resolvedAlertIds, setResolvedAlertIds] = useState([]);
  const [auditLog, setAuditLog] = useState([
    { time:"2026-09-12 09:00", user:"Rohan Bhatt", action:"Updated cargo status", entity:"CGO-101", oldValue:"REQUESTED", newValue:"APPROVED" },
    { time:"2026-09-12 11:20", user:"Ananya Iyer", action:"Logged weather reading", entity:"Maitri", oldValue:"—", newValue:"Wind 34 km/h" },
  ]);

  const [expeditions, setExpeditions] = useState([
    { id:"EXP-01", name:"Winter Resupply Run 12", description:"Scheduled resupply convoy to Bharati Station.", destination:"bharati", startDate:"2026-09-05", endDate:"2026-09-28", teamSize:14, status:"ACTIVE", priority:"HIGH", route:"Goa Port → Bharati Station", nextResupply:"2026-09-25" },
    { id:"EXP-02", name:"Maitri Structural Survey", description:"Glaciology and structural integrity survey at Maitri.", destination:"maitri", startDate:"2026-08-15", endDate:"2026-10-01", teamSize:8, status:"ACTIVE", priority:"MEDIUM", route:"Cape Town → Maitri Station", nextResupply:"2026-10-05" },
    { id:"EXP-03", name:"Dakshin Gangotri Camp Rotation", description:"Personnel rotation and equipment refresh.", destination:"dg", startDate:"2026-10-01", endDate:"2026-10-20", teamSize:6, status:"PLANNED", priority:"MEDIUM", route:"Maitri → Dakshin Gangotri", nextResupply:"2026-10-15" },
  ]);
  const [cargo, setCargo] = useState(CARGO0);
  const [transport, setTransport] = useState(TRANSPORT0);
  const [assets] = useState(ASSETS0);
  const [personnel] = useState(PERSONNEL0);
  const [weatherMap, setWeatherMap] = useState(WEATHER0);
  const [emergencies, setEmergencies] = useState(EMERGENCIES0);
  const resupplyDaysByStation = { maitri:14, bharati:12, dg:16 };

  function toast(message, type="info"){
    const id = Date.now()+Math.random();
    setToasts(t=>[...t, { id, message, type }]);
    setTimeout(()=> setToasts(t=>t.filter(x=>x.id!==id)), 3500);
  }
  function logAudit(action, entity, oldValue, newValue){
    setAuditLog(l=>[{ time:"2026-09-13 "+new Date().toISOString().slice(11,16), user: session?.name || "System", action, entity, oldValue, newValue }, ...l]);
  }
  function queueOrApply(fn, label){
    if (!online){
      setPendingQueue(q=>[...q, { label, fn }]);
      setSyncState("OFFLINE");
      toast(`Offline — change queued: ${label}`, "info");
    } else {
      fn();
    }
  }

  function toggleOnline(){
    if (online){ setOnline(false); setSyncState("OFFLINE"); toast("You are now offline. Changes will be queued.", "info"); }
    else {
      setOnline(true); setSyncState("SYNCING");
      setTimeout(()=>{
        pendingQueue.forEach(p=>p.fn());
        setPendingQueue([]);
        setSyncState("SYNC COMPLETE");
        toast(`Synced ${pendingQueue.length} queued change(s).`, "success");
        setTimeout(()=>setSyncState("ONLINE"), 1400);
      }, 900);
    }
  }

  const computedInventory = useMemo(()=> computeInventoryFull(INVENTORY0, weatherMap, resupplyDaysByStation), [weatherMap]);
  const risk = useMemo(()=> computeRisk(computedInventory, transport, weatherMap, emergencies, assets), [computedInventory, transport, weatherMap, emergencies, assets]);
  const alerts = useMemo(()=> generateAlerts(computedInventory, transport, assets, emergencies).filter(a=>!resolvedAlertIds.includes(a.id)), [computedInventory, transport, assets, emergencies, resolvedAlertIds]);
  const recs = useMemo(()=> resupplyRecommendations(computedInventory), [computedInventory]);

  const data = { expeditions, cargo, transport, assets, personnel, weatherMap, emergencies, computedInventory, risk, alerts, recs, resupplyDaysByStation, themeMode };

  const actions = {
    addExpedition:(f)=>{
      const id = `EXP-${String(expeditions.length+1).padStart(2,"0")}`;
      queueOrApply(()=>{ setExpeditions(e=>[...e, { id, ...f, status:"PLANNED" }]); logAudit("Created expedition", id, "—", f.name); toast("Expedition created.", "success"); }, `Create expedition ${f.name}`);
    },
    updateExpeditionStatus:(id, status)=>{
      queueOrApply(()=>{ const old = expeditions.find(e=>e.id===id)?.status; setExpeditions(e=>e.map(x=>x.id===id?{...x,status}:x)); logAudit("Updated expedition status", id, old, status); toast(`${id} → ${status}`, "success"); }, `Update ${id} to ${status}`);
    },
    updateCargoStatus:(id, status)=>{
      queueOrApply(()=>{ const old = cargo.find(c=>c.id===id)?.status; setCargo(c=>c.map(x=>x.id===id?{...x,status}:x)); logAudit("Updated cargo status", id, old, status); toast(`${id} → ${status}`, "success"); }, `Update cargo ${id}`);
    },
    updateTransportStatus:(id, status)=>{
      queueOrApply(()=>{ const old = transport.find(t=>t.id===id)?.status; setTransport(t=>t.map(x=>x.id===id?{...x,status}:x)); logAudit("Updated transport status", id, old, status); toast(`${id} → ${status}`, "success"); }, `Update transport ${id}`);
    },
    addEmergency:(f)=>{
      const id = `EMG-${String(emergencies.length+1).padStart(2,"0")}`;
      queueOrApply(()=>{ setEmergencies(e=>[...e, { id, ...f, time:"2026-09-13 "+new Date().toISOString().slice(11,16), status:"MONITORING" }]); logAudit("Reported emergency", id, "—", f.type); toast("Emergency incident logged.", "error"); }, `Report emergency ${f.type}`);
    },
    resolveEmergency:(id)=>{
      queueOrApply(()=>{ setEmergencies(e=>e.map(x=>x.id===id?{...x,status:"RESOLVED"}:x)); logAudit("Resolved emergency", id, "MONITORING", "RESOLVED"); toast(`${id} resolved.`, "success"); }, `Resolve ${id}`);
    },
  };

  function onSaveSim(sim){ setSavedSims(s=>[sim, ...s]); toast("Simulation result saved.", "success"); }
  function onResolveAlert(id){ setResolvedAlertIds(r=>[...r, id]); logAudit("Resolved alert", id, "ACTIVE", "RESOLVED"); }

  const searchResults = useMemo(()=>{
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    const res = [];
    cargo.forEach(c=>{ if (c.name.toLowerCase().includes(q)||c.id.toLowerCase().includes(q)) res.push({ type:"Cargo", label:`${c.id} — ${c.name}`, go:"cargo" }); });
    personnel.forEach(p=>{ if (p.name.toLowerCase().includes(q)) res.push({ type:"Personnel", label:`${p.name} (${p.role})`, go:"personnel" }); });
    STATIONS.forEach(s=>{ if (s.name.toLowerCase().includes(q)) res.push({ type:"Station", label:s.full, go:"stations" }); });
    assets.forEach(a=>{ if (a.name.toLowerCase().includes(q)) res.push({ type:"Asset", label:a.name, go:"assets" }); });
    expeditions.forEach(e=>{ if (e.name.toLowerCase().includes(q)) res.push({ type:"Expedition", label:e.name, go:"expeditions" }); });
    transport.forEach(t=>{ if (t.name.toLowerCase().includes(q)) res.push({ type:"Transport", label:t.name, go:"transport" }); });
    emergencies.forEach(e=>{ if (e.type.toLowerCase().includes(q)) res.push({ type:"Emergency", label:e.id, go:"emergency" }); });
    return res.slice(0,8);
  }, [globalSearch, cargo, personnel, assets, expeditions, transport, emergencies]);

  if (!session){
    return <LoginView onLogin={(acct)=>{ setSession(acct); toast(`Welcome, ${acct.name.split(" ")[0]}.`, "success"); }} themeMode={themeMode} onToggleTheme={toggleTheme} />;
  }

  return (
    <div className="polar-root" style={{ minHeight:"100vh", display:"flex" }}>
      <GlobalStyle/>
      {/* Sidebar */}
      <div style={{ width:70, background:T.panelSolid, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 0", gap:4, flexShrink:0 }}>
        <Snowflake size={20} color={T.cyan} style={{ marginBottom:14 }}/>
        {NAV.map(n=>{
          const Icon = n.icon;
          const active = view===n.id;
          return (
            <button key={n.id} onClick={()=>setView(n.id)} title={n.label} style={{
              width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:10, cursor:"pointer",
              background: active ? `${T.cyan}1A` : "transparent", border: active?`1px solid ${T.cyan}55`:"1px solid transparent",
              color: active ? T.cyan : T.iceDim, position:"relative" }}>
              <Icon size={17}/>
              {n.id==="alerts" && alerts.filter(a=>a.level==="CRITICAL").length>0 && (
                <span style={{ position:"absolute", top:4, right:6, width:6, height:6, borderRadius:"50%", background:T.red }}/>
              )}
            </button>
          );
        })}
        <div style={{ flex:1 }}/>
        <button onClick={()=>setSession(null)} title="Logout" style={{ width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", background:"transparent", border:"none", color:T.iceDim, cursor:"pointer" }}>
          <LogOut size={17}/>
        </button>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Header */}
        <div style={{ height:56, borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:16, background:T.panelSolid, flexShrink:0 }}>
          <div className="polar-mono" style={{ fontSize:13, fontWeight:600, letterSpacing:"0.06em", color:T.cyan }}>POLAR</div>
          <div style={{ width:1, height:20, background:T.border }}/>
          <div style={{ fontSize:12.5, color:T.iceDim }}>{NAV.find(n=>n.id===view)?.label}</div>
          <div style={{ flex:1, position:"relative", maxWidth:340 }}>
            <Search size={13} style={{ position:"absolute", left:9, top:9, color:T.iceFaint }}/>
            <input value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} placeholder="Search cargo, personnel, stations…" style={{ ...inputStyle(), paddingLeft:28, fontSize:12 }}/>
            {searchResults.length>0 && (
              <div className="polar-corner" style={{ position:"absolute", top:34, left:0, width:320, background:T.panelSolid, border:`1px solid ${T.borderBright}`, borderRadius:10, zIndex:50, maxHeight:260, overflowY:"auto" }}>
                {searchResults.map((r,i)=>(
                  <div key={i} onClick={()=>{ setView(r.go); setGlobalSearch(""); }} style={{ padding:"8px 12px", fontSize:12, cursor:"pointer", borderBottom:`1px solid ${T.border}` }}>
                    <span style={{ color:T.iceFaint, marginRight:6 }}>{r.type}</span>{r.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={toggleOnline} title="Toggle connectivity" style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:`1px solid ${T.border}`, borderRadius:8, padding:"5px 10px", cursor:"pointer", fontSize:11 }}>
            {online ? <Wifi size={13} color={syncState==="SYNCING"?T.amber:T.green}/> : <WifiOff size={13} color={T.red}/>}
            <span style={{ color:T.iceDim }} className="polar-mono">{syncState}{pendingQueue.length>0?` (${pendingQueue.length})`:""}</span>
          </button>
          <button onClick={toggleTheme} title="Toggle theme" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:30, height:30, background:"transparent", border:`1px solid ${T.border}`, borderRadius:8, cursor:"pointer", color:T.iceDim }}>
            {themeMode==="dark" ? <Sun size={14}/> : <Moon size={14}/>}
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, color:T.ice }}>{session.name}</div>
              <div style={{ fontSize:10, color:T.iceFaint }}>{session.role.replace(/_/g," ")}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="polar-scroll" style={{ flex:1, overflowY:"auto", padding:20 }}>
          {view==="dashboard" && <DashboardView data={data} onNavigate={setView} onSelectStation={(id)=>{ setSelectedStation(id); setView("stations"); }} selectedStation={selectedStation}/>}
          {view==="expeditions" && <ExpeditionsView data={data} actions={actions}/>}
          {view==="cargo" && <CargoView data={data} actions={actions}/>}
          {view==="transport" && <TransportView data={data} actions={actions}/>}
          {view==="inventory" && <InventoryView data={data}/>}
          {view==="assets" && <AssetsView data={data}/>}
          {view==="personnel" && <PersonnelView data={data}/>}
          {view==="stations" && <StationsView data={data} initialSelected={selectedStation}/>}
          {view==="emergency" && <EmergencyView data={data} actions={actions}/>}
          {view==="simulation" && <SimulationView data={data} savedSims={savedSims} onSaveSim={onSaveSim}/>}
          {view==="analytics" && <AnalyticsView data={data}/>}
          {view==="ai" && <AIView data={data}/>}
          {view==="alerts" && <AlertsView alerts={generateAlerts(computedInventory, transport, assets, emergencies)} resolvedIds={resolvedAlertIds} onResolve={onResolveAlert}/>}
          {view==="audit" && <AuditView log={auditLog}/>}
        </div>
      </div>
      <Toast toasts={toasts}/>
    </div>
  );
}
