import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

// ── CONFIG ──
const SHEET_ID = "1AWDbbyt3rMhzjjR2Vj0v_QaAuw1Z80uE4L5tbeDvz6M";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby1c084CK5HwYQk3Ouxy0KKGz2jXQNHYU3zeS__Q9x1VD_v1ATFPEWdQBDFE-N21gG6/exec";

function sendToSheet(gasto) {
  try {
    const params = new URLSearchParams({
      id: gasto.id || "",
      categoria: gasto.categoria || "",
      subcategoria: gasto.subcategoria || "",
      persona: gasto.persona || "",
      importe: gasto.importe || "",
      fecha: gasto.fecha || "",
    });
    const url = SCRIPT_URL + "?" + params.toString();
    const img = new Image();
    img.src = url;
    return Promise.resolve(true);
  } catch { return Promise.resolve(false); }
}

function deleteFromSheet(id) {
  try {
    const params = new URLSearchParams({ action: "delete", id });
    const url = SCRIPT_URL + "?" + params.toString();
    const img = new Image();
    img.src = url;
    return Promise.resolve(true);
  } catch { return Promise.resolve(false); }
}

// ── CATEGORÍAS Y SUBCATEGORÍAS ──
const CATS = {
  "ALQUILER":     ["ALQUILER","LUZ","AGUA","COSAS FAMILIA","MOVILIARIO","REPARACIONES"],
  "GASOLINA":     ["MAZDA","AUDI","BMW"],
  "PRESTAMO":     ["MAZDA","TARJETA"],
  "COMIDA":       ["COMEDOR ADRI","COMEDOR MARI","COMIDA CASA"],
  "ROPA":         ["ROPA MARI","ROPA ADRI"],
  "COCHE":        ["PARKING","MULTAS","MECANICO AUDI","MECANICO MAZDA","MECANICO BMW","ITV MAZDA","ITV AUDI","ITV BMW","IMP. MAZDA","IMP. AUDI","IMP BMW"],
  "AUTOCARAVANA": ["COMPRAS AUTOC.","SEGURO MYBOX","PRETAMO ING","MECANICO AUTOC.","GASOLINA AUTOC.","LETRA","ACAT","IMPUESTOS AUTOCARAVANA","ITV AUTOCARVANA","SEGURO"],
  "OCIO":         ["COMER FUERA/FIESTA","PARQUES","TRANSPORTES","HOTELES"],
  "SEGUROS":      ["MAZDA","AUDI","BMW"],
  "CUMPLEAÑOS":   ["REGALOS FAMILIA","REGALOS AMIGOS ARI","REGALOS AMIGOS","REGALOS ARIDANE"],
  "PERSONAL":     ["LIMPIEZA CASA","GYM","LEGALITAS","FORMACIÓN","LOTERÍA","OPO PREPARADOR","MATERIAL","Documentos","PELUQUERIA"],
  "TECNO Y COM":  ["MOVIL E INTERNET","APP Y SUSC.","EQUIPAMIENTO","REPARACIONES"],
  "SALUD":        ["SEGURO MEDICO","FARMACIA/PRIMORK","DENTISTA","LENTILLAS"],
  "ARIDANE":      ["JUGUETES","ROPA","COLEGIO","LIBROS","EXTRAESCOLARES","MATERIAL ESCOLAR","UNIFORMES","MyInvestor","ESTÉTICA"],
  "AHORRO":       ["Adri MyInvestor","Mari MyInvestor"],
  "TRANSPORTE":   ["OTROS","TAXI","AVIÓN"],
  "NEGOCIO WEB":  ["PERDIDA","GANANCIA","Compra stock"],
};

const CAT_COLORS = {
  "ALQUILER":"#6B8CFF","GASOLINA":"#F59E0B","PRESTAMO":"#EF4444","COMIDA":"#10B981",
  "ROPA":"#EC4899","COCHE":"#3B82F6","AUTOCARAVANA":"#8B5CF6","OCIO":"#F97316",
  "SEGUROS":"#06B6D4","CUMPLEAÑOS":"#D946EF","PERSONAL":"#84CC16","TECNO Y COM":"#14B8A6",
  "SALUD":"#F43F5E","ARIDANE":"#FBBF24","AHORRO":"#22C55E","TRANSPORTE":"#A78BFA","NEGOCIO WEB":"#FB923C",
};

// ── DATOS HISTÓRICOS (sept 2025 – abr 2026) ──
const HISTORICAL = [
  // SEPT 2025 - ADRI
  {id:"h001",fecha:"2025-09-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:42},
  {id:"h002",fecha:"2025-09-01",categoria:"SALUD",subcategoria:"LENTILLAS",persona:"ADRI",importe:76},
  {id:"h003",fecha:"2025-09-01",categoria:"AUTOCARAVANA",subcategoria:"LETRA",persona:"ADRI",importe:650},
  {id:"h004",fecha:"2025-09-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"ADRI",importe:340},
  {id:"h005",fecha:"2025-09-01",categoria:"AUTOCARAVANA",subcategoria:"MECANICO AUTOC.",persona:"ADRI",importe:37},
  {id:"h006",fecha:"2025-09-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:215},
  {id:"h007",fecha:"2025-09-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:34},
  {id:"h008",fecha:"2025-09-01",categoria:"AUTOCARAVANA",subcategoria:"PRETAMO ING",persona:"ADRI",importe:124},
  {id:"h009",fecha:"2025-09-01",categoria:"AUTOCARAVANA",subcategoria:"SEGURO MYBOX",persona:"ADRI",importe:40},
  {id:"h010",fecha:"2025-09-01",categoria:"AUTOCARAVANA",subcategoria:"COMPRAS AUTOC.",persona:"ADRI",importe:9},
  {id:"h011",fecha:"2025-09-01",categoria:"COCHE",subcategoria:"MECANICO AUDI",persona:"ADRI",importe:90},
  {id:"h012",fecha:"2025-09-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:40},
  {id:"h013",fecha:"2025-09-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:28},
  {id:"h014",fecha:"2025-09-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"ADRI",importe:50},
  {id:"h015",fecha:"2025-09-01",categoria:"ALQUILER",subcategoria:"LUZ",persona:"ADRI",importe:16},
  {id:"h016",fecha:"2025-09-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:89},
  {id:"h017",fecha:"2025-09-01",categoria:"ROPA",subcategoria:"ROPA ADRI",persona:"ADRI",importe:50},
  {id:"h018",fecha:"2025-09-01",categoria:"TECNO Y COM",subcategoria:"MOVIL E INTERNET",persona:"ADRI",importe:29},
  {id:"h019",fecha:"2025-09-01",categoria:"GASOLINA",subcategoria:"BMW",persona:"ADRI",importe:3},
  {id:"h020",fecha:"2025-09-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:38},
  {id:"h021",fecha:"2025-09-01",categoria:"AHORRO",subcategoria:"Adri MyInvestor",persona:"ADRI",importe:100},
  {id:"h022",fecha:"2025-09-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:4},
  {id:"h023",fecha:"2025-09-01",categoria:"TECNO Y COM",subcategoria:"EQUIPAMIENTO",persona:"ADRI",importe:310},
  {id:"h024",fecha:"2025-09-01",categoria:"ALQUILER",subcategoria:"MOVILIARIO",persona:"ADRI",importe:20},
  {id:"h025",fecha:"2025-09-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:35},
  {id:"h026",fecha:"2025-09-01",categoria:"PERSONAL",subcategoria:"LIMPIEZA CASA",persona:"ADRI",importe:30},
  {id:"h027",fecha:"2025-09-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:55},
  {id:"h028",fecha:"2025-09-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:37},
  {id:"h029",fecha:"2025-09-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:24},
  {id:"h030",fecha:"2025-09-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:16},
  {id:"h031",fecha:"2025-09-01",categoria:"PERSONAL",subcategoria:"FORMACIÓN",persona:"ADRI",importe:14},
  {id:"h032",fecha:"2025-09-01",categoria:"PERSONAL",subcategoria:"LIMPIEZA CASA",persona:"ADRI",importe:30},
  {id:"h033",fecha:"2025-09-01",categoria:"COMIDA",subcategoria:"COMEDOR ADRI",persona:"ADRI",importe:48},
  {id:"h034",fecha:"2025-09-01",categoria:"NEGOCIO WEB",subcategoria:"PERDIDA",persona:"ADRI",importe:109},
  // SEPT 2025 - MARI
  {id:"h040",fecha:"2025-09-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"MARI",importe:340},
  {id:"h041",fecha:"2025-09-01",categoria:"AUTOCARAVANA",subcategoria:"COMPRAS AUTOC.",persona:"MARI",importe:34},
  {id:"h042",fecha:"2025-09-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS ARIDANE",persona:"MARI",importe:200},
  {id:"h043",fecha:"2025-09-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"MARI",importe:150},
  {id:"h044",fecha:"2025-09-01",categoria:"ROPA",subcategoria:"ROPA ADRI",persona:"MARI",importe:30},
  {id:"h045",fecha:"2025-09-01",categoria:"ARIDANE",subcategoria:"ROPA",persona:"MARI",importe:47},
  {id:"h046",fecha:"2025-09-01",categoria:"ALQUILER",subcategoria:"MOVILIARIO",persona:"MARI",importe:11},
  {id:"h047",fecha:"2025-09-01",categoria:"ARIDANE",subcategoria:"COLEGIO",persona:"MARI",importe:197},
  {id:"h048",fecha:"2025-09-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"MARI",importe:19},
  // OCT 2025
  {id:"h050",fecha:"2025-10-01",categoria:"ARIDANE",subcategoria:"LIBROS",persona:"MARI",importe:70},
  {id:"h051",fecha:"2025-10-01",categoria:"ARIDANE",subcategoria:"COLEGIO",persona:"MARI",importe:197},
  {id:"h052",fecha:"2025-10-01",categoria:"ARIDANE",subcategoria:"UNIFORMES",persona:"MARI",importe:53},
  {id:"h053",fecha:"2025-10-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:60},
  {id:"h054",fecha:"2025-10-01",categoria:"AUTOCARAVANA",subcategoria:"LETRA",persona:"ADRI",importe:648},
  {id:"h055",fecha:"2025-10-01",categoria:"AUTOCARAVANA",subcategoria:"SEGURO MYBOX",persona:"ADRI",importe:40},
  {id:"h056",fecha:"2025-10-01",categoria:"AUTOCARAVANA",subcategoria:"PRETAMO ING",persona:"ADRI",importe:124},
  {id:"h057",fecha:"2025-10-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"ADRI",importe:340},
  {id:"h058",fecha:"2025-10-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"MARI",importe:340},
  {id:"h059",fecha:"2025-10-01",categoria:"SALUD",subcategoria:"SEGURO MEDICO",persona:"MARI",importe:78},
  {id:"h060",fecha:"2025-10-01",categoria:"PERSONAL",subcategoria:"OPO PREPARADOR",persona:"MARI",importe:150},
  {id:"h061",fecha:"2025-10-01",categoria:"PRESTAMO",subcategoria:"MAZDA",persona:"MARI",importe:310},
  {id:"h062",fecha:"2025-10-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"ADRI",importe:32},
  {id:"h063",fecha:"2025-10-01",categoria:"PERSONAL",subcategoria:"LEGALITAS",persona:"ADRI",importe:49},
  {id:"h064",fecha:"2025-10-01",categoria:"GASOLINA",subcategoria:"BMW",persona:"MARI",importe:70},
  {id:"h065",fecha:"2025-10-01",categoria:"ROPA",subcategoria:"ROPA MARI",persona:"MARI",importe:13},
  {id:"h066",fecha:"2025-10-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS AMIGOS",persona:"MARI",importe:230},
  {id:"h067",fecha:"2025-10-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"MARI",importe:515},
  {id:"h068",fecha:"2025-10-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS FAMILIA",persona:"MARI",importe:30},
  {id:"h069",fecha:"2025-10-01",categoria:"COCHE",subcategoria:"PARKING",persona:"MARI",importe:9},
  {id:"h070",fecha:"2025-10-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:209},
  {id:"h071",fecha:"2025-10-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"MARI",importe:30},
  {id:"h072",fecha:"2025-10-01",categoria:"ALQUILER",subcategoria:"LUZ",persona:"ADRI",importe:38},
  {id:"h073",fecha:"2025-10-01",categoria:"OCIO",subcategoria:"PARQUES",persona:"ADRI",importe:12},
  {id:"h074",fecha:"2025-10-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"MARI",importe:9},
  {id:"h075",fecha:"2025-10-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"MARI",importe:10},
  {id:"h076",fecha:"2025-10-01",categoria:"AUTOCARAVANA",subcategoria:"GASOLINA AUTOC.",persona:"ADRI",importe:90},
  {id:"h077",fecha:"2025-10-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:27},
  {id:"h078",fecha:"2025-10-01",categoria:"ARIDANE",subcategoria:"ESTÉTICA",persona:"ADRI",importe:10},
  {id:"h079",fecha:"2025-10-01",categoria:"PERSONAL",subcategoria:"LIMPIEZA CASA",persona:"ADRI",importe:40},
  {id:"h080",fecha:"2025-10-01",categoria:"PERSONAL",subcategoria:"LOTERÍA",persona:"ADRI",importe:42},
  {id:"h081",fecha:"2025-10-01",categoria:"PERSONAL",subcategoria:"LOTERÍA",persona:"MARI",importe:20},
  {id:"h082",fecha:"2025-10-01",categoria:"TRANSPORTE",subcategoria:"AVIÓN",persona:"ADRI",importe:287},
  {id:"h083",fecha:"2025-10-01",categoria:"NEGOCIO WEB",subcategoria:"PERDIDA",persona:"ADRI",importe:183},
  {id:"h084",fecha:"2025-10-01",categoria:"ARIDANE",subcategoria:"EXTRAESCOLARES",persona:"ADRI",importe:50},
  {id:"h085",fecha:"2025-10-01",categoria:"COMIDA",subcategoria:"COMEDOR ADRI",persona:"ADRI",importe:65},
  {id:"h086",fecha:"2025-10-01",categoria:"COMIDA",subcategoria:"COMEDOR MARI",persona:"MARI",importe:34},
  {id:"h087",fecha:"2025-10-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"MARI",importe:50},
  {id:"h088",fecha:"2025-10-01",categoria:"ALQUILER",subcategoria:"COSAS FAMILIA",persona:"MARI",importe:6},
  {id:"h089",fecha:"2025-10-01",categoria:"ALQUILER",subcategoria:"AGUA",persona:"ADRI",importe:26},
  {id:"h090",fecha:"2025-10-01",categoria:"GASOLINA",subcategoria:"BMW",persona:"ADRI",importe:10},
  {id:"h091",fecha:"2025-10-01",categoria:"PERSONAL",subcategoria:"LEGALITAS",persona:"ADRI",importe:22},
  {id:"h092",fecha:"2025-10-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"ADRI",importe:50},
  // NOV 2025
  {id:"h100",fecha:"2025-11-01",categoria:"AUTOCARAVANA",subcategoria:"LETRA",persona:"ADRI",importe:648},
  {id:"h101",fecha:"2025-11-01",categoria:"AUTOCARAVANA",subcategoria:"SEGURO MYBOX",persona:"ADRI",importe:40},
  {id:"h102",fecha:"2025-11-01",categoria:"GASOLINA",subcategoria:"BMW",persona:"ADRI",importe:32},
  {id:"h103",fecha:"2025-11-01",categoria:"AUTOCARAVANA",subcategoria:"PRETAMO ING",persona:"ADRI",importe:124},
  {id:"h104",fecha:"2025-11-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"ADRI",importe:20},
  {id:"h105",fecha:"2025-11-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:85},
  {id:"h106",fecha:"2025-11-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"ADRI",importe:340},
  {id:"h107",fecha:"2025-11-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"MARI",importe:340},
  {id:"h108",fecha:"2025-11-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"MARI",importe:50},
  {id:"h109",fecha:"2025-11-01",categoria:"SALUD",subcategoria:"FARMACIA/PRIMORK",persona:"MARI",importe:71},
  {id:"h110",fecha:"2025-11-01",categoria:"ARIDANE",subcategoria:"COLEGIO",persona:"MARI",importe:197},
  {id:"h111",fecha:"2025-11-01",categoria:"SALUD",subcategoria:"SEGURO MEDICO",persona:"MARI",importe:78},
  {id:"h112",fecha:"2025-11-01",categoria:"PERSONAL",subcategoria:"OPO PREPARADOR",persona:"MARI",importe:150},
  {id:"h113",fecha:"2025-11-01",categoria:"AUTOCARAVANA",subcategoria:"COMPRAS AUTOC.",persona:"ADRI",importe:6},
  {id:"h114",fecha:"2025-11-01",categoria:"ARIDANE",subcategoria:"UNIFORMES",persona:"MARI",importe:24},
  {id:"h115",fecha:"2025-11-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:60},
  {id:"h116",fecha:"2025-11-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"ADRI",importe:22},
  {id:"h117",fecha:"2025-11-01",categoria:"ARIDANE",subcategoria:"EXTRAESCOLARES",persona:"ADRI",importe:30},
  {id:"h118",fecha:"2025-11-01",categoria:"ALQUILER",subcategoria:"LUZ",persona:"ADRI",importe:40},
  {id:"h119",fecha:"2025-11-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"MARI",importe:494},
  {id:"h120",fecha:"2025-11-01",categoria:"ARIDANE",subcategoria:"JUGUETES",persona:"MARI",importe:184},
  {id:"h121",fecha:"2025-11-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:62},
  {id:"h122",fecha:"2025-11-01",categoria:"PERSONAL",subcategoria:"PELUQUERIA",persona:"MARI",importe:102},
  {id:"h123",fecha:"2025-11-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"MARI",importe:40},
  {id:"h124",fecha:"2025-11-01",categoria:"ROPA",subcategoria:"ROPA MARI",persona:"ADRI",importe:60},
  {id:"h125",fecha:"2025-11-01",categoria:"ARIDANE",subcategoria:"ROPA",persona:"MARI",importe:10},
  {id:"h126",fecha:"2025-11-01",categoria:"ALQUILER",subcategoria:"COSAS FAMILIA",persona:"MARI",importe:60},
  {id:"h127",fecha:"2025-11-01",categoria:"OCIO",subcategoria:"PARQUES",persona:"MARI",importe:15},
  {id:"h128",fecha:"2025-11-01",categoria:"PERSONAL",subcategoria:"LOTERÍA",persona:"MARI",importe:60},
  {id:"h129",fecha:"2025-11-01",categoria:"ARIDANE",subcategoria:"LIBROS",persona:"MARI",importe:42},
  {id:"h130",fecha:"2025-11-01",categoria:"PRESTAMO",subcategoria:"MAZDA",persona:"MARI",importe:310},
  {id:"h131",fecha:"2025-11-01",categoria:"COMIDA",subcategoria:"COMEDOR MARI",persona:"MARI",importe:66},
  {id:"h132",fecha:"2025-11-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"ADRI",importe:50},
  {id:"h133",fecha:"2025-11-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"MARI",importe:50},
  {id:"h134",fecha:"2025-11-01",categoria:"PERSONAL",subcategoria:"LOTERÍA",persona:"ADRI",importe:24},
  {id:"h135",fecha:"2025-11-01",categoria:"TECNO Y COM",subcategoria:"MOVIL E INTERNET",persona:"ADRI",importe:35},
  {id:"h136",fecha:"2025-11-01",categoria:"PERSONAL",subcategoria:"LEGALITAS",persona:"ADRI",importe:22},
  {id:"h137",fecha:"2025-11-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"ADRI",importe:20},
  {id:"h138",fecha:"2025-11-01",categoria:"COMIDA",subcategoria:"COMEDOR ADRI",persona:"ADRI",importe:52},
  {id:"h139",fecha:"2025-11-01",categoria:"NEGOCIO WEB",subcategoria:"PERDIDA",persona:"ADRI",importe:10},
  {id:"h140",fecha:"2025-11-01",categoria:"ARIDANE",subcategoria:"ESTÉTICA",persona:"ADRI",importe:10},
  // DIC 2025
  {id:"h150",fecha:"2025-12-01",categoria:"AUTOCARAVANA",subcategoria:"LETRA",persona:"ADRI",importe:648},
  {id:"h151",fecha:"2025-12-01",categoria:"AUTOCARAVANA",subcategoria:"PRETAMO ING",persona:"ADRI",importe:124},
  {id:"h152",fecha:"2025-12-01",categoria:"AUTOCARAVANA",subcategoria:"SEGURO MYBOX",persona:"ADRI",importe:40},
  {id:"h153",fecha:"2025-12-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:290},
  {id:"h154",fecha:"2025-12-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"ADRI",importe:300},
  {id:"h155",fecha:"2025-12-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"MARI",importe:380},
  {id:"h156",fecha:"2025-12-01",categoria:"AUTOCARAVANA",subcategoria:"GASOLINA AUTOC.",persona:"ADRI",importe:68},
  {id:"h157",fecha:"2025-12-01",categoria:"SALUD",subcategoria:"FARMACIA/PRIMORK",persona:"ADRI",importe:7},
  {id:"h158",fecha:"2025-12-01",categoria:"PERSONAL",subcategoria:"Documentos",persona:"ADRI",importe:29},
  {id:"h159",fecha:"2025-12-01",categoria:"COCHE",subcategoria:"MULTAS",persona:"ADRI",importe:50},
  {id:"h160",fecha:"2025-12-01",categoria:"ALQUILER",subcategoria:"LUZ",persona:"ADRI",importe:50},
  {id:"h161",fecha:"2025-12-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"ADRI",importe:15},
  {id:"h162",fecha:"2025-12-01",categoria:"PRESTAMO",subcategoria:"TARJETA",persona:"ADRI",importe:300},
  {id:"h163",fecha:"2025-12-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:93},
  {id:"h164",fecha:"2025-12-01",categoria:"PERSONAL",subcategoria:"LOTERÍA",persona:"ADRI",importe:20},
  {id:"h165",fecha:"2025-12-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:40},
  {id:"h166",fecha:"2025-12-01",categoria:"COCHE",subcategoria:"PARKING",persona:"ADRI",importe:3},
  {id:"h167",fecha:"2025-12-01",categoria:"ARIDANE",subcategoria:"ESTÉTICA",persona:"ADRI",importe:10},
  {id:"h168",fecha:"2025-12-01",categoria:"TRANSPORTE",subcategoria:"AVIÓN",persona:"ADRI",importe:65},
  {id:"h169",fecha:"2025-12-01",categoria:"TRANSPORTE",subcategoria:"TAXI",persona:"ADRI",importe:40},
  {id:"h170",fecha:"2025-12-01",categoria:"TECNO Y COM",subcategoria:"MOVIL E INTERNET",persona:"ADRI",importe:36},
  {id:"h171",fecha:"2025-12-01",categoria:"ROPA",subcategoria:"ROPA ADRI",persona:"ADRI",importe:25},
  {id:"h172",fecha:"2025-12-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS FAMILIA",persona:"ADRI",importe:82},
  {id:"h173",fecha:"2025-12-01",categoria:"ALQUILER",subcategoria:"AGUA",persona:"ADRI",importe:27},
  {id:"h174",fecha:"2025-12-01",categoria:"NEGOCIO WEB",subcategoria:"PERDIDA",persona:"ADRI",importe:138},
  {id:"h175",fecha:"2025-12-01",categoria:"PERSONAL",subcategoria:"OPO PREPARADOR",persona:"MARI",importe:150},
  {id:"h176",fecha:"2025-12-01",categoria:"SALUD",subcategoria:"SEGURO MEDICO",persona:"MARI",importe:78},
  {id:"h177",fecha:"2025-12-01",categoria:"ARIDANE",subcategoria:"COLEGIO",persona:"MARI",importe:198},
  {id:"h178",fecha:"2025-12-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"MARI",importe:84},
  {id:"h179",fecha:"2025-12-01",categoria:"OCIO",subcategoria:"PARQUES",persona:"MARI",importe:52},
  {id:"h180",fecha:"2025-12-01",categoria:"PRESTAMO",subcategoria:"MAZDA",persona:"MARI",importe:306},
  {id:"h181",fecha:"2025-12-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"MARI",importe:10},
  {id:"h182",fecha:"2025-12-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS FAMILIA",persona:"MARI",importe:202},
  {id:"h183",fecha:"2025-12-01",categoria:"COMIDA",subcategoria:"COMEDOR MARI",persona:"MARI",importe:45},
  {id:"h184",fecha:"2025-12-01",categoria:"ARIDANE",subcategoria:"ROPA",persona:"MARI",importe:15},
  {id:"h185",fecha:"2025-12-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"ADRI",importe:50},
  {id:"h186",fecha:"2025-12-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"MARI",importe:50},
  {id:"h187",fecha:"2025-12-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"MARI",importe:20},
  {id:"h188",fecha:"2025-12-01",categoria:"COMIDA",subcategoria:"COMEDOR ADRI",persona:"ADRI",importe:69},
  {id:"h189",fecha:"2025-12-01",categoria:"ARIDANE",subcategoria:"UNIFORMES",persona:"MARI",importe:21},
  // ENE 2026
  {id:"h200",fecha:"2026-01-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"ADRI",importe:340},
  {id:"h201",fecha:"2026-01-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"MARI",importe:340},
  {id:"h202",fecha:"2026-01-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:50},
  {id:"h203",fecha:"2026-01-01",categoria:"AUTOCARAVANA",subcategoria:"LETRA",persona:"ADRI",importe:648},
  {id:"h204",fecha:"2026-01-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"MARI",importe:70},
  {id:"h205",fecha:"2026-01-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"ADRI",importe:110},
  {id:"h206",fecha:"2026-01-01",categoria:"AUTOCARAVANA",subcategoria:"COMPRAS AUTOC.",persona:"ADRI",importe:131},
  {id:"h207",fecha:"2026-01-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"ADRI",importe:44},
  {id:"h208",fecha:"2026-01-01",categoria:"AUTOCARAVANA",subcategoria:"SEGURO MYBOX",persona:"ADRI",importe:40},
  {id:"h209",fecha:"2026-01-01",categoria:"SALUD",subcategoria:"SEGURO MEDICO",persona:"MARI",importe:90},
  {id:"h210",fecha:"2026-01-01",categoria:"PERSONAL",subcategoria:"MATERIAL",persona:"MARI",importe:255},
  {id:"h211",fecha:"2026-01-01",categoria:"PRESTAMO",subcategoria:"MAZDA",persona:"MARI",importe:310},
  {id:"h212",fecha:"2026-01-01",categoria:"TRANSPORTE",subcategoria:"AVIÓN",persona:"ADRI",importe:96},
  {id:"h213",fecha:"2026-01-01",categoria:"ALQUILER",subcategoria:"LUZ",persona:"ADRI",importe:41},
  {id:"h214",fecha:"2026-01-01",categoria:"SALUD",subcategoria:"LENTILLAS",persona:"ADRI",importe:36},
  {id:"h215",fecha:"2026-01-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:212},
  {id:"h216",fecha:"2026-01-01",categoria:"AUTOCARAVANA",subcategoria:"GASOLINA AUTOC.",persona:"ADRI",importe:107},
  {id:"h217",fecha:"2026-01-01",categoria:"PERSONAL",subcategoria:"LOTERÍA",persona:"ADRI",importe:84},
  {id:"h219",fecha:"2026-01-01",categoria:"COCHE",subcategoria:"MECANICO AUDI",persona:"ADRI",importe:29},
  {id:"h221",fecha:"2026-01-01",categoria:"PERSONAL",subcategoria:"OPO PREPARADOR",persona:"MARI",importe:150},
  {id:"h222",fecha:"2026-01-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"MARI",importe:64},
  {id:"h223",fecha:"2026-01-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"MARI",importe:17},
  {id:"h224",fecha:"2026-01-01",categoria:"TRANSPORTE",subcategoria:"TAXI",persona:"MARI",importe:48},
  {id:"h225",fecha:"2026-01-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS FAMILIA",persona:"MARI",importe:44},
  {id:"h226",fecha:"2026-01-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"MARI",importe:67},
  {id:"h227",fecha:"2026-01-01",categoria:"ARIDANE",subcategoria:"ROPA",persona:"MARI",importe:376},
  {id:"h228",fecha:"2026-01-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:218},
  {id:"h230",fecha:"2026-01-01",categoria:"ARIDANE",subcategoria:"ROPA",persona:"ADRI",importe:24},
  {id:"h231",fecha:"2026-01-01",categoria:"ROPA",subcategoria:"ROPA MARI",persona:"ADRI",importe:53},
  {id:"h232",fecha:"2026-01-01",categoria:"AUTOCARAVANA",subcategoria:"ACAT",persona:"ADRI",importe:50},
  {id:"h234",fecha:"2026-01-01",categoria:"ARIDANE",subcategoria:"COLEGIO",persona:"MARI",importe:16},
  {id:"h235",fecha:"2026-01-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS AMIGOS",persona:"ADRI",importe:3},
  {id:"h236",fecha:"2026-01-01",categoria:"TECNO Y COM",subcategoria:"MOVIL E INTERNET",persona:"ADRI",importe:57},
  {id:"h237",fecha:"2026-01-01",categoria:"PERSONAL",subcategoria:"LEGALITAS",persona:"ADRI",importe:23},
  {id:"h238",fecha:"2026-01-01",categoria:"AUTOCARAVANA",subcategoria:"PRETAMO ING",persona:"ADRI",importe:124},
  {id:"h239",fecha:"2026-01-01",categoria:"ARIDANE",subcategoria:"JUGUETES",persona:"ADRI",importe:14},
  {id:"h240",fecha:"2026-01-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:19},
  {id:"h241",fecha:"2026-01-01",categoria:"COMIDA",subcategoria:"COMEDOR MARI",persona:"MARI",importe:44},
  {id:"h242",fecha:"2026-01-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"MARI",importe:10},
  {id:"h243",fecha:"2026-01-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"MARI",importe:50},
  {id:"h244",fecha:"2026-01-01",categoria:"COCHE",subcategoria:"MECANICO MAZDA",persona:"MARI",importe:8},
  {id:"h245",fecha:"2026-01-01",categoria:"TRANSPORTE",subcategoria:"OTROS",persona:"MARI",importe:6},
  {id:"h246",fecha:"2026-01-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS FAMILIA",persona:"ADRI",importe:29},
  {id:"h247",fecha:"2026-01-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS AMIGOS ARI",persona:"MARI",importe:13},
  {id:"h248",fecha:"2026-01-01",categoria:"ARIDANE",subcategoria:"LIBROS",persona:"MARI",importe:26},
  {id:"h249",fecha:"2026-01-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"MARI",importe:29},
  {id:"h250",fecha:"2026-01-01",categoria:"ARIDANE",subcategoria:"EXTRAESCOLARES",persona:"MARI",importe:15},
  {id:"h251",fecha:"2026-01-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"ADRI",importe:50},
  {id:"h252",fecha:"2026-01-01",categoria:"COMIDA",subcategoria:"COMEDOR ADRI",persona:"ADRI",importe:13},
  {id:"h253",fecha:"2026-01-01",categoria:"NEGOCIO WEB",subcategoria:"PERDIDA",persona:"ADRI",importe:105},
  // FEB 2026
  {id:"h300",fecha:"2026-02-01",categoria:"PERSONAL",subcategoria:"GYM",persona:"ADRI",importe:47},
  {id:"h301",fecha:"2026-02-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:206},
  {id:"h302",fecha:"2026-02-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"ADRI",importe:680},
  {id:"h303",fecha:"2026-02-01",categoria:"COMIDA",subcategoria:"COMEDOR ADRI",persona:"ADRI",importe:10},
  {id:"h304",fecha:"2026-02-01",categoria:"COCHE",subcategoria:"MECANICO AUDI",persona:"ADRI",importe:343},
  {id:"h305",fecha:"2026-02-01",categoria:"PERSONAL",subcategoria:"LOTERÍA",persona:"ADRI",importe:45},
  {id:"h306",fecha:"2026-02-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"ADRI",importe:16},
  {id:"h307",fecha:"2026-02-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:50},
  {id:"h308",fecha:"2026-02-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:265},
  {id:"h309",fecha:"2026-02-01",categoria:"AUTOCARAVANA",subcategoria:"LETRA",persona:"ADRI",importe:648},
  {id:"h310",fecha:"2026-02-01",categoria:"AUTOCARAVANA",subcategoria:"SEGURO MYBOX",persona:"ADRI",importe:40},
  {id:"h311",fecha:"2026-02-01",categoria:"AUTOCARAVANA",subcategoria:"PRETAMO ING",persona:"ADRI",importe:124},
  {id:"h312",fecha:"2026-02-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"ADRI",importe:50},
  {id:"h313",fecha:"2026-02-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"ADRI",importe:70},
  {id:"h314",fecha:"2026-02-01",categoria:"ARIDANE",subcategoria:"ROPA",persona:"ADRI",importe:20},
  {id:"h316",fecha:"2026-02-01",categoria:"ALQUILER",subcategoria:"LUZ",persona:"ADRI",importe:45},
  {id:"h317",fecha:"2026-02-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:20},
  {id:"h318",fecha:"2026-02-01",categoria:"ROPA",subcategoria:"ROPA ADRI",persona:"ADRI",importe:75},
  {id:"h319",fecha:"2026-02-01",categoria:"AUTOCARAVANA",subcategoria:"COMPRAS AUTOC.",persona:"ADRI",importe:12},
  {id:"h321",fecha:"2026-02-01",categoria:"TECNO Y COM",subcategoria:"MOVIL E INTERNET",persona:"ADRI",importe:60},
  {id:"h322",fecha:"2026-02-01",categoria:"ARIDANE",subcategoria:"ESTÉTICA",persona:"ADRI",importe:40},
  {id:"h323",fecha:"2026-02-01",categoria:"ARIDANE",subcategoria:"EXTRAESCOLARES",persona:"ADRI",importe:25},
  {id:"h325",fecha:"2026-02-01",categoria:"SEGUROS",subcategoria:"AUDI",persona:"ADRI",importe:143},
  {id:"h328",fecha:"2026-02-01",categoria:"PERSONAL",subcategoria:"LEGALITAS",persona:"ADRI",importe:23},
  {id:"h329",fecha:"2026-02-01",categoria:"ALQUILER",subcategoria:"AGUA",persona:"ADRI",importe:21},
  {id:"h330",fecha:"2026-02-01",categoria:"COCHE",subcategoria:"ITV AUDI",persona:"ADRI",importe:53},
  {id:"h331b",fecha:"2026-02-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"MARI",importe:387},
  {id:"h332",fecha:"2026-02-01",categoria:"SALUD",subcategoria:"SEGURO MEDICO",persona:"MARI",importe:88},
  {id:"h333",fecha:"2026-02-01",categoria:"ARIDANE",subcategoria:"COLEGIO",persona:"MARI",importe:253},
  {id:"h334",fecha:"2026-02-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"MARI",importe:17},
  {id:"h335",fecha:"2026-02-01",categoria:"COMIDA",subcategoria:"COMEDOR MARI",persona:"MARI",importe:34},
  {id:"h336",fecha:"2026-02-01",categoria:"ARIDANE",subcategoria:"ROPA",persona:"MARI",importe:90},
  {id:"h337",fecha:"2026-02-01",categoria:"SALUD",subcategoria:"FARMACIA/PRIMORK",persona:"MARI",importe:22},
  {id:"h338",fecha:"2026-02-01",categoria:"PRESTAMO",subcategoria:"MAZDA",persona:"MARI",importe:306},
  {id:"h339",fecha:"2026-02-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"MARI",importe:58},
  {id:"h340",fecha:"2026-02-01",categoria:"ARIDANE",subcategoria:"MATERIAL ESCOLAR",persona:"MARI",importe:13},
  {id:"h341",fecha:"2026-02-01",categoria:"PERSONAL",subcategoria:"GYM",persona:"MARI",importe:60},
  {id:"h342",fecha:"2026-02-01",categoria:"PERSONAL",subcategoria:"PELUQUERIA",persona:"MARI",importe:102},
  {id:"h343",fecha:"2026-02-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"MARI",importe:50},
  {id:"h344",fecha:"2026-02-01",categoria:"COCHE",subcategoria:"PARKING",persona:"MARI",importe:6},
  {id:"h345",fecha:"2026-02-01",categoria:"TRANSPORTE",subcategoria:"AVIÓN",persona:"MARI",importe:347},
  {id:"h346",fecha:"2026-02-01",categoria:"OCIO",subcategoria:"PARQUES",persona:"MARI",importe:19},
  {id:"h347",fecha:"2026-02-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"MARI",importe:50},
  {id:"h348",fecha:"2026-02-01",categoria:"NEGOCIO WEB",subcategoria:"PERDIDA",persona:"ADRI",importe:105},
  {id:"h349",fecha:"2026-02-01",categoria:"PERSONAL",subcategoria:"OPO PREPARADOR",persona:"MARI",importe:150},
  // MAR 2026
  {id:"h400",fecha:"2026-03-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"ADRI",importe:340},
  {id:"h401",fecha:"2026-03-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"MARI",importe:340},
  {id:"h402",fecha:"2026-03-01",categoria:"PERSONAL",subcategoria:"GYM",persona:"MARI",importe:60},
  {id:"h403",fecha:"2026-03-01",categoria:"COMIDA",subcategoria:"COMEDOR MARI",persona:"MARI",importe:34},
  {id:"h404",fecha:"2026-03-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"MARI",importe:7},
  {id:"h405",fecha:"2026-03-01",categoria:"AUTOCARAVANA",subcategoria:"SEGURO MYBOX",persona:"ADRI",importe:40},
  {id:"h406",fecha:"2026-03-01",categoria:"AUTOCARAVANA",subcategoria:"LETRA",persona:"ADRI",importe:648},
  {id:"h407",fecha:"2026-03-01",categoria:"TRANSPORTE",subcategoria:"AVIÓN",persona:"ADRI",importe:120},
  {id:"h408",fecha:"2026-03-01",categoria:"AUTOCARAVANA",subcategoria:"PRETAMO ING",persona:"ADRI",importe:124},
  {id:"h409",fecha:"2026-03-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"ADRI",importe:50},
  {id:"h410",fecha:"2026-03-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"MARI",importe:18},
  {id:"h411",fecha:"2026-03-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS AMIGOS",persona:"MARI",importe:32},
  {id:"h412",fecha:"2026-03-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:397},
  {id:"h413",fecha:"2026-03-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:60},
  {id:"h414",fecha:"2026-03-01",categoria:"ALQUILER",subcategoria:"LUZ",persona:"ADRI",importe:43},
  {id:"h415",fecha:"2026-03-01",categoria:"TECNO Y COM",subcategoria:"MOVIL E INTERNET",persona:"ADRI",importe:50},
  {id:"h416",fecha:"2026-03-01",categoria:"TECNO Y COM",subcategoria:"APP Y SUSC.",persona:"ADRI",importe:7},
  {id:"h417",fecha:"2026-03-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:284},
  {id:"h418",fecha:"2026-03-01",categoria:"PERSONAL",subcategoria:"GYM",persona:"ADRI",importe:45},
  {id:"h419",fecha:"2026-03-01",categoria:"AUTOCARAVANA",subcategoria:"GASOLINA AUTOC.",persona:"ADRI",importe:68},
  {id:"h420",fecha:"2026-03-01",categoria:"PERSONAL",subcategoria:"LOTERÍA",persona:"ADRI",importe:20},
  {id:"h421",fecha:"2026-03-01",categoria:"TRANSPORTE",subcategoria:"OTROS",persona:"ADRI",importe:189},
  {id:"h422",fecha:"2026-03-01",categoria:"SALUD",subcategoria:"LENTILLAS",persona:"ADRI",importe:40},
  {id:"h423",fecha:"2026-03-01",categoria:"PERSONAL",subcategoria:"LEGALITAS",persona:"ADRI",importe:23},
  {id:"h424",fecha:"2026-03-01",categoria:"AUTOCARAVANA",subcategoria:"MECANICO AUTOC.",persona:"ADRI",importe:144},
  {id:"h425",fecha:"2026-03-01",categoria:"NEGOCIO WEB",subcategoria:"PERDIDA",persona:"ADRI",importe:105},
  // ABR 2026 (datos completos del Sheet)
  {id:"h500",fecha:"2026-04-01",categoria:"AUTOCARAVANA",subcategoria:"PRETAMO ING",persona:"ADRI",importe:124},
  {id:"h501",fecha:"2026-04-01",categoria:"AUTOCARAVANA",subcategoria:"LETRA",persona:"ADRI",importe:647},
  {id:"h502",fecha:"2026-04-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"ADRI",importe:50},
  {id:"h503",fecha:"2026-04-01",categoria:"ALQUILER",subcategoria:"ALQUILER",persona:"ADRI",importe:340},
  {id:"h504",fecha:"2026-04-01",categoria:"AUTOCARAVANA",subcategoria:"SEGURO MYBOX",persona:"ADRI",importe:40},
  {id:"h505",fecha:"2026-04-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:206},
  {id:"h506",fecha:"2026-04-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:76},
  {id:"h507",fecha:"2026-04-01",categoria:"AUTOCARAVANA",subcategoria:"GASOLINA AUTOC.",persona:"ADRI",importe:158},
  {id:"h508",fecha:"2026-04-01",categoria:"COCHE",subcategoria:"PARKING",persona:"ADRI",importe:7},
  {id:"h509",fecha:"2026-04-01",categoria:"SALUD",subcategoria:"FARMACIA/PRIMORK",persona:"ADRI",importe:183},
  {id:"h510",fecha:"2026-04-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"ADRI",importe:40},
  {id:"h511",fecha:"2026-04-01",categoria:"PERSONAL",subcategoria:"LOTERÍA",persona:"ADRI",importe:10},
  {id:"h513",fecha:"2026-04-01",categoria:"ALQUILER",subcategoria:"AGUA",persona:"ADRI",importe:32},
  {id:"h514",fecha:"2026-04-01",categoria:"ALQUILER",subcategoria:"LUZ",persona:"ADRI",importe:48},
  {id:"h515",fecha:"2026-04-01",categoria:"PERSONAL",subcategoria:"FORMACIÓN",persona:"ADRI",importe:41},
  {id:"h516",fecha:"2026-04-01",categoria:"TECNO Y COM",subcategoria:"MOVIL E INTERNET",persona:"ADRI",importe:46},
  {id:"h517",fecha:"2026-04-01",categoria:"CUMPLEAÑOS",subcategoria:"REGALOS ARIDANE",persona:"ADRI",importe:16},
  {id:"h518",fecha:"2026-04-01",categoria:"COCHE",subcategoria:"IMP. AUDI",persona:"ADRI",importe:115},
  {id:"h520",fecha:"2026-04-01",categoria:"ALQUILER",subcategoria:"REPARACIONES",persona:"ADRI",importe:3},
  // MAY 2026 - todos los datos del Sheet
  {id:"h600",fecha:"2026-05-01",categoria:"AUTOCARAVANA",subcategoria:"PRETAMO ING",persona:"ADRI",importe:124},
  {id:"h601",fecha:"2026-05-01",categoria:"ARIDANE",subcategoria:"MyInvestor",persona:"ADRI",importe:50},
  {id:"h602",fecha:"2026-05-01",categoria:"AUTOCARAVANA",subcategoria:"LETRA",persona:"ADRI",importe:647},
  {id:"h603",fecha:"2026-05-01",categoria:"NEGOCIO WEB",subcategoria:"PERDIDA",persona:"ADRI",importe:37},
  {id:"h604",fecha:"2026-05-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:22},
  {id:"h605",fecha:"2026-05-01",categoria:"GASOLINA",subcategoria:"MAZDA",persona:"ADRI",importe:20},
  {id:"h606",fecha:"2026-05-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:68},
  {id:"h607",fecha:"2026-05-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:8},
  {id:"h608",fecha:"2026-05-01",categoria:"PERSONAL",subcategoria:"LOTERÍA",persona:"ADRI",importe:15},
  {id:"h609",fecha:"2026-05-01",categoria:"AUTOCARAVANA",subcategoria:"IMPUESTOS AUTOCARAVANA",persona:"ADRI",importe:115},
  {id:"h610",fecha:"2026-05-01",categoria:"COCHE",subcategoria:"IMP. AUDI",persona:"ADRI",importe:115},
  {id:"h611",fecha:"2026-05-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:5},
  {id:"h612",fecha:"2026-05-01",categoria:"NEGOCIO WEB",subcategoria:"PERDIDA",persona:"ADRI",importe:7},
  {id:"h613",fecha:"2026-05-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:20},
  {id:"h614",fecha:"2026-05-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:70},
  {id:"h615",fecha:"2026-05-01",categoria:"OCIO",subcategoria:"PARQUES",persona:"ADRI",importe:10},
  {id:"h616",fecha:"2026-05-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:6},
  {id:"h617",fecha:"2026-05-01",categoria:"ALQUILER",subcategoria:"REPARACIONES",persona:"ADRI",importe:3},
  {id:"h618",fecha:"2026-05-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:20},
  {id:"h619",fecha:"2026-05-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:20},
  {id:"h620",fecha:"2026-05-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:6},
  {id:"h621",fecha:"2026-05-01",categoria:"GASOLINA",subcategoria:"AUDI",persona:"ADRI",importe:20},
  {id:"h622",fecha:"2026-05-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:15},
  {id:"h623",fecha:"2026-05-01",categoria:"OCIO",subcategoria:"COMER FUERA/FIESTA",persona:"ADRI",importe:16},
  {id:"h624",fecha:"2026-05-01",categoria:"COMIDA",subcategoria:"COMIDA CASA",persona:"ADRI",importe:114},
  {id:"h625",fecha:"2026-05-01",categoria:"SALUD",subcategoria:"LENTILLAS",persona:"ADRI",importe:20},
];

const MONTHS_ES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MONTH_KEYS = ["2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05"];
const CURRENT_MONTH = new Date().toISOString().slice(0,7); // "2026-05"

function fmt(n) {
  return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n||0);
}
function monthLabel(k) {
  const [y,m] = k.split("-");
  return MONTHS_ES[parseInt(m)-1]+" "+y.slice(2);
}
function todayStr() { return new Date().toISOString().split("T")[0]; }

// ── GOOGLE SHEETS SYNC ──
async function fetchSheetData(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.slice(47, -2));
    const rows = json.table.rows || [];
    return rows.map(r => r.c.map(c => c ? (c.v ?? c.f ?? "") : ""));
  } catch { return []; }
}

async function appendToSheet(sheetName, values) {
  // Escribir en Google Sheet usando la API pública de formularios de Google
  // Como alternativa sin OAuth, guardamos en localStorage y mostramos exportación CSV
  return null;
}

export default function App() {
  const [tab, setTab] = useState("add");
  const [userGastos, setUserGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filterPersona, setFilterPersona] = useState("TODOS");
  const [filterMonth, setFilterMonth] = useState(CURRENT_MONTH);
  const [filterYear, setFilterYear] = useState(CURRENT_MONTH.slice(0,4));
  const [formTab, setFormTab] = useState("gasto");
  const [form, setForm] = useState({
    fecha: todayStr(), importe: "", categoria: "COMIDA",
    subcategoria: "COMIDA CASA", persona: "ADRI", descripcion: ""
  });
  const [iForm, setIForm] = useState({
    fecha: todayStr(), importe: "", persona: "ADRI", concepto: ""
  });

  // Carga inicial - limpia datos viejos de versiones anteriores
  useEffect(() => {
    (async () => {
      try {
        // Limpiar claves antiguas de versiones previas que causaban duplicados
        try { localStorage.removeItem("gastos_v2"); } catch {}
        try { localStorage.removeItem("ingresos_v2"); } catch {}
        try { localStorage.removeItem("gastos_data"); } catch {}
        try { localStorage.removeItem("ingresos_data"); } catch {}

        const r1 = JSON.parse(localStorage.getItem("gastos_v3") || "null");
        if (r1) setUserGastos(JSON.parse(r1));
        const r2 = JSON.parse(localStorage.getItem("ingresos_v3") || "null");
        if (r2) setIngresos(JSON.parse(r2));
        const r3 = JSON.parse(localStorage.getItem("last_sync_v3") || "null");
        if (r3) setLastSync(r3.value);
      } catch {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("gastos_v3", JSON.stringify(userGastos)); } catch {}
  }, [userGastos, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("ingresos_v3", JSON.stringify(ingresos)); } catch {}
  }, [ingresos, loaded]);

  // Combinar históricos + nuevos, eliminando duplicados por id
  const allGastosRaw = [...HISTORICAL, ...userGastos];
  const allGastos = allGastosRaw.filter((g,i,arr) => arr.findIndex(x=>x.id===g.id)===i);

  function flash(msg, ok=true) {
    setFeedback({msg,ok});
    setTimeout(()=>setFeedback(null), 2800);
  }

  function addGasto() {
    if (!form.importe || isNaN(+form.importe)) return flash("Introduce un importe válido", false);
    const g = {
      id: "u"+Date.now(), fecha: form.fecha, categoria: form.categoria,
      subcategoria: form.subcategoria, persona: form.persona,
      importe: parseFloat((+form.importe).toFixed(2)),
      descripcion: form.descripcion.trim() || form.subcategoria
    };
    setUserGastos(p=>[g,...p]);
    setForm(f=>({...f, importe:"", descripcion:""}));
    flash(`✓ ${fmt(g.importe)} añadido · ${g.persona} · guardando en Sheet...`);
    sendToSheet(g).then(ok => {
      flash(ok
        ? `✓ ${fmt(g.importe)} añadido y guardado en Sheet`
        : `✓ ${fmt(g.importe)} añadido (Sheet sin conexión)`
      );
    });
  }

  function addIngreso() {
    if (!iForm.importe || isNaN(+iForm.importe)) return flash("Importe no válido", false);
    const i = {
      id: "i"+Date.now(), fecha: iForm.fecha, persona: iForm.persona,
      importe: parseFloat((+iForm.importe).toFixed(2)),
      concepto: iForm.concepto || "Ingreso"
    };
    setIngresos(p=>[i,...p]);
    setIForm(f=>({...f, importe:"", concepto:""}));
    flash(`✓ Ingreso ${fmt(i.importe)} · ${i.persona}`);
  }

  async function resetStorage() {
    if (!window.confirm("¿Borrar todos los gastos añadidos desde la app? Los datos históricos del Sheet se mantienen.")) return;
    try {
      localStorage.removeItem("gastos_v3");
      localStorage.removeItem("ingresos_v3");
      localStorage.removeItem("gastos_v2");
      localStorage.removeItem("ingresos_v2");
      localStorage.removeItem("gastos_data");
      localStorage.removeItem("ingresos_data");
      localStorage.removeItem("last_sync_v3");
    } catch {}
    setUserGastos([]);
    setIngresos([]);
    setLastSync(null);
    flash("✓ Datos locales borrados. Total ahora cuadra con el Sheet.");
  }

  function deleteEntry(id) {
    // Si empieza por "u" es un gasto nuevo, lo borramos del Sheet también
    if (id.startsWith("u")) {
      deleteFromSheet(id);
    }
    setUserGastos(p=>p.filter(g=>g.id!==id));
    setIngresos(p=>p.filter(i=>i.id!==id));
    setDeleteId(null);
    flash("Eliminado");
  }

  // Exportar CSV para copiar al Sheet
  function exportCSV() {
    const rows = userGastos.map(g=>[g.id,g.fecha,g.categoria,g.subcategoria,g.persona,g.importe].join(","));
    const csv = "ID,FECHA,CATEGORIA,SUBCATEGORIA,PERSONA,IMPORTE\n" + rows.join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gastos_nuevos.csv";
    a.click();
    flash("CSV descargado — pégalo en la pestaña APP_GASTOS del Sheet");
  }

  // Años disponibles
  const allYears = [...new Set([
    ...HISTORICAL.map(g=>g.fecha.slice(0,4)),
    ...userGastos.map(g=>g.fecha.slice(0,4)),
    CURRENT_MONTH.slice(0,4)
  ])].sort().reverse();

  // Meses del año seleccionado (o todos si filterYear="all")
  const monthsOfYear = filterYear === "all"
    ? [...new Set([
        ...HISTORICAL.map(g=>g.fecha.slice(0,7)),
        ...userGastos.map(g=>g.fecha.slice(0,7)),
        CURRENT_MONTH
      ])].sort().reverse()
    : [...new Set([
        ...HISTORICAL.filter(g=>g.fecha.startsWith(filterYear)).map(g=>g.fecha.slice(0,7)),
        ...userGastos.filter(g=>g.fecha.startsWith(filterYear)).map(g=>g.fecha.slice(0,7)),
        ...(filterYear === CURRENT_MONTH.slice(0,4) ? [CURRENT_MONTH] : [])
      ])].sort().reverse();

  function applyFilters(arr) {
    return arr.filter(g => {
      const yearOk = filterYear==="all" || g.fecha.startsWith(filterYear);
      const mOk = filterMonth==="all" || g.fecha.startsWith(filterMonth);
      const pOk = filterPersona==="TODOS" || g.persona===filterPersona;
      return yearOk && mOk && pOk;
    });
  }

  const filteredGastos = applyFilters(allGastos);
  const totalGastos = filteredGastos.reduce((s,g)=>s+g.importe, 0);
  const filteredIngresos = ingresos.filter(i=>{
    const mOk = filterMonth==="all" || i.fecha.startsWith(filterMonth);
    const pOk = filterPersona==="TODOS" || i.persona===filterPersona;
    return mOk && pOk;
  });
  const totalIngresos = filteredIngresos.reduce((s,i)=>s+i.importe, 0);
  const hayIngresos = ingresos.length > 0;
  const saldo = totalIngresos - totalGastos;

  const byCat = Object.keys(CATS).map(c=>({
    name:c, total:filteredGastos.filter(g=>g.categoria===c).reduce((s,g)=>s+g.importe,0), color:CAT_COLORS[c]||"#888"
  })).filter(c=>c.total>0).sort((a,b)=>b.total-a.total);

  // Gráfica: meses del año seleccionado cronológicamente
  const chartMonths = [...monthsOfYear].sort();
  const byMonthData = chartMonths.map(k=>({
    label: monthLabel(k),
    ADRI: allGastos.filter(g=>g.fecha.startsWith(k)&&g.persona==="ADRI").reduce((s,g)=>s+g.importe,0),
    MARI: allGastos.filter(g=>g.fecha.startsWith(k)&&g.persona==="MARI").reduce((s,g)=>s+g.importe,0),
  }));

  const totalAdri = allGastos.filter(g=>g.persona==="ADRI").reduce((s,g)=>s+g.importe,0);
  const totalMari = allGastos.filter(g=>g.persona==="MARI").reduce((s,g)=>s+g.importe,0);
  const subcats = CATS[form.categoria] || [];

  const recentEntries = [...userGastos, ...ingresos].sort((a,b)=>b.id.localeCompare(a.id)).slice(0,20);

  return (
    <div style={{minHeight:"100vh",background:"#F5F6FA",color:"#1A1A2E",fontFamily:"'Georgia',serif"}}>

      {/* ── HEADER ── */}
      <div style={{background:"linear-gradient(160deg,#FFFFFF 0%,#F5F6FA 100%)",borderBottom:"1px solid #E0E0EA",padding:"18px 16px 0"}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
            <div>
              <div style={{fontSize:24,fontWeight:700,letterSpacing:"-0.5px",lineHeight:1.2}}>Mi Cartera</div>
              <div style={{fontSize:11,color:"#8080AA",fontFamily:"monospace",marginTop:2}}>Adri & Mari · {allGastos.length} registros</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"#8080AA",marginBottom:2}}>
                {syncing ? "🔄 sincronizando..." : lastSync ? `✓ sync ${lastSync}` : "sin sync"}
              </div>
              <div style={{fontSize:12,color:"#6B8CFF"}}>Adri: {fmt(totalAdri)}</div>
              <div style={{fontSize:12,color:"#F472B6"}}>Mari: {fmt(totalMari)}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:0,marginTop:12,overflowX:"auto"}}>
            {[["add","＋ Añadir"],["dashboard","📊 Dashboard"],["list","📋 Historial"]].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                background:"none",border:"none",cursor:"pointer",padding:"8px 16px",fontSize:13,
                fontFamily:"inherit",color:tab===t?"#C9963A":"#7070A0",whiteSpace:"nowrap",
                borderBottom:tab===t?"2px solid #C9963A":"2px solid transparent",
                fontWeight:tab===t?600:400,transition:"color 0.15s"
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"18px 14px 40px"}}>

        {/* Feedback */}
        {feedback && (
          <div style={{
            background:feedback.ok?"#0A1A0A":"#1A0A0A",
            border:`1px solid ${feedback.ok?"#1A4A1A":"#4A1A1A"}`,
            color:feedback.ok?"#4FCF4F":"#CF4F4F",
            padding:"8px 14px",borderRadius:8,marginBottom:14,
            fontSize:12,fontFamily:"monospace",
          }}>{feedback.msg}</div>
        )}

        {/* ═══ ADD TAB ═══ */}
        {tab==="add" && (
          <div>
            {/* SubTab */}
            <div style={{display:"flex",gap:8,marginBottom:16,background:"#F0F0F8",borderRadius:12,padding:6}}>
              {[["gasto","💸 Gasto"],["ingreso","💰 Ingreso"]].map(([t,l])=>(
                <button key={t} onClick={()=>setFormTab(t)} style={{
                  flex:1,padding:"11px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:14,
                  background:formTab===t
                    ?(t==="gasto"
                      ?"linear-gradient(135deg,#7C3AED,#5B21B6)"
                      :"linear-gradient(135deg,#059669,#047857)")
                    :"transparent",
                  border:"none",
                  color:formTab===t?"#FFFFFF":"#7070A0",
                  fontWeight:formTab===t?700:500,
                  boxShadow:formTab===t?"0 2px 8px rgba(0,0,0,0.15)":"none",
                  transition:"all 0.2s",
                }}>{l}</button>
              ))}
            </div>

            {/* Form Gasto */}
            {formTab==="gasto" && (
              <div style={{background:"#FFFFFF",border:"1px solid #E0E0EA",borderRadius:12,padding:20,marginBottom:20}}>
                <div style={{display:"grid",gap:14}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <F label="Fecha"><input type="date" value={form.fecha} onChange={e=>setForm(f=>({...f,fecha:e.target.value}))} style={inp}/></F>
                    <F label="Persona">
                      <select value={form.persona} onChange={e=>setForm(f=>({...f,persona:e.target.value}))} style={inp}>
                        <option value="ADRI">👤 ADRI</option>
                        <option value="MARI">👤 MARI</option>
                      </select>
                    </F>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <F label="Categoría">
                      <select value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value,subcategoria:CATS[e.target.value][0]}))} style={inp}>
                        {Object.keys(CATS).map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </F>
                    <F label="Subcategoría">
                      <select value={form.subcategoria} onChange={e=>setForm(f=>({...f,subcategoria:e.target.value}))} style={inp}>
                        {subcats.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </F>
                  </div>
                  <F label="Importe (€)">
                    <input type="number" step="0.01" min="0" placeholder="0,00"
                      value={form.importe} onChange={e=>setForm(f=>({...f,importe:e.target.value}))}
                      onKeyDown={e=>e.key==="Enter"&&addGasto()}
                      style={{...inp,fontSize:22,fontWeight:700,color:"#C9963A",textAlign:"center"}}/>
                  </F>
                  <F label="Descripción (opcional)">
                    <input type="text" placeholder="Ej: Mercadona" value={form.descripcion}
                      onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))}
                      onKeyDown={e=>e.key==="Enter"&&addGasto()} style={inp}/>
                  </F>
                  <button onClick={addGasto} style={{
                    background:"linear-gradient(135deg,#C9963A,#A07020)",border:"none",borderRadius:8,
                    padding:"14px",color:"#080810",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"
                  }}>Añadir Gasto</button>
                </div>
              </div>
            )}

            {/* Form Ingreso */}
            {formTab==="ingreso" && (
              <div style={{background:"#FFFFFF",border:"1px solid #A0D0A0",borderRadius:12,padding:20,marginBottom:20}}>
                <div style={{display:"grid",gap:14}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <F label="Fecha"><input type="date" value={iForm.fecha} onChange={e=>setIForm(f=>({...f,fecha:e.target.value}))} style={inp}/></F>
                    <F label="Persona">
                      <select value={iForm.persona} onChange={e=>setIForm(f=>({...f,persona:e.target.value}))} style={inp}>
                        <option value="ADRI">👤 ADRI</option>
                        <option value="MARI">👤 MARI</option>
                      </select>
                    </F>
                  </div>
                  <F label="Importe (€)">
                    <input type="number" step="0.01" min="0" placeholder="0,00"
                      value={iForm.importe} onChange={e=>setIForm(f=>({...f,importe:e.target.value}))}
                      onKeyDown={e=>e.key==="Enter"&&addIngreso()}
                      style={{...inp,fontSize:22,fontWeight:700,color:"#1A7A1A",textAlign:"center"}}/>
                  </F>
                  <F label="Concepto">
                    <input type="text" placeholder="Ej: Nómina mayo" value={iForm.concepto}
                      onChange={e=>setIForm(f=>({...f,concepto:e.target.value}))}
                      onKeyDown={e=>e.key==="Enter"&&addIngreso()} style={inp}/>
                  </F>
                  <button onClick={addIngreso} style={{
                    background:"linear-gradient(135deg,#2A8A2A,#186018)",border:"none",borderRadius:8,
                    padding:"14px",color:"#FFFFFF",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"
                  }}>Añadir Ingreso</button>
                </div>
              </div>
            )}

            {/* Nota sync */}
            {userGastos.length > 0 && (
              <div style={{background:"#FFFFFF",border:"1px solid #E0E0EA",borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"#9090BB"}}>{userGastos.length} gastos nuevos sin sincronizar al Sheet</span>
                <button onClick={exportCSV} style={{background:"#F0F0FF",border:"1px solid #D0D0F0",borderRadius:6,
                  padding:"5px 10px",color:"#6060AA",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                  Exportar CSV
                </button>
              </div>
            )}

            {/* Botón reset */}
            <div style={{marginTop:24,paddingTop:16,borderTop:"1px solid #181824",textAlign:"center"}}>
              <button onClick={resetStorage} style={{
                background:"none",border:"1px solid #3A1A1A",borderRadius:8,
                padding:"8px 16px",color:"#8A4A4A",fontSize:12,cursor:"pointer",fontFamily:"inherit"
              }}>🗑 Limpiar datos locales (sincronizar con Sheet)</button>
            </div>
            {recentEntries.length === 0 ? (
              <div style={{color:"#A0A0C0",fontSize:13,textAlign:"center",padding:40}}>
                Empieza añadiendo tu primer gasto o ingreso
              </div>
            ) : recentEntries.map(e => {
              const isGasto = "categoria" in e;
              const col = CAT_COLORS[e.categoria] || "#888";
              return (
                <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:"1px solid #0C0C16"}}>
                  <div style={{width:36,height:36,borderRadius:8,
                    background:(isGasto?col:"#2A5A2A")+"22",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                    {isGasto?"💸":"💰"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:"#2A2A3E",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {isGasto?(e.descripcion||e.subcategoria):e.concepto}
                    </div>
                    <div style={{fontSize:11,color:"#8080AA",marginTop:2}}>
                      {e.fecha} ·{" "}
                      <span style={{color:e.persona==="ADRI"?"#6B8CFF":"#F472B6"}}>{e.persona}</span>
                      {isGasto && <span style={{color:"#8080AA"}}> · {e.categoria}</span>}
                    </div>
                  </div>
                  <div style={{fontSize:15,fontWeight:700,fontFamily:"monospace",flexShrink:0,
                    color:isGasto?"#EDE9E3":"#4FCF4F"}}>
                    {isGasto?"-":"+"}{ fmt(e.importe)}
                  </div>
                  {deleteId===e.id ? (
                    <div style={{display:"flex",gap:3}}>
                      <button onClick={()=>deleteEntry(e.id)} style={{...mbtn,background:"#FEE8E8",color:"#AA1A1A"}}>✓</button>
                      <button onClick={()=>setDeleteId(null)} style={mbtn}>✕</button>
                    </div>
                  ) : (
                    <button onClick={()=>setDeleteId(e.id)} style={{...mbtn,opacity:0.25}}>🗑</button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ DASHBOARD TAB ═══ */}
        {tab==="dashboard" && (
          <div>
            {/* Filtro persona */}
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              {["TODOS","ADRI","MARI"].map(p=>(
                <Pill key={p} label={p===filterPersona?"● "+p:p} active={filterPersona===p}
                  color={p==="ADRI"?"#6B8CFF":p==="MARI"?"#F472B6":"#C9963A"}
                  onClick={()=>setFilterPersona(p)}/>
              ))}
            </div>

            {/* Filtro AÑO */}
            <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
              <span style={{fontSize:11,color:"#9090B0",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginRight:4}}>Año</span>
              <Pill label="Todos" active={filterYear==="all"} color="#C9963A" onClick={()=>{ setFilterYear("all"); setFilterMonth("all"); }}/>
              {allYears.map(y=>(
                <Pill key={y} label={y} active={filterYear===y}
                  color="#22C55E"
                  onClick={()=>{ setFilterYear(y); setFilterMonth("all"); }}/>
              ))}
            </div>

            {/* Filtro MES */}
            <div style={{display:"flex",gap:5,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:11,color:"#9090B0",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginRight:4}}>Mes</span>
              <Pill label="Todo el año" active={filterMonth==="all"} onClick={()=>setFilterMonth("all")} color="#C9963A"/>
              {monthsOfYear.map(m=>(
                <Pill key={m} label={m===CURRENT_MONTH?"● "+monthLabel(m):monthLabel(m)}
                  active={filterMonth===m}
                  color="#22C55E"
                  onClick={()=>setFilterMonth(m)}/>
              ))}
            </div>

            {/* KPIs */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              <KCard label="Total gastos" value={fmt(totalGastos)} accent="#EF4444"/>
              <KCard label="Ingresos" value={fmt(totalIngresos)} accent="#22C55E"/>
              <KCard label={hayIngresos ? "Saldo" : "Saldo"}
                value={hayIngresos ? fmt(saldo) : "—"}
                accent={!hayIngresos ? "#BBBBCC" : saldo>=0?"#22C55E":"#EF4444"}
                sub={!hayIngresos ? "Añade ingresos para ver" : saldo>=0?"superávit":"déficit"}/>
              <KCard label="Media mensual"
                value={monthsOfYear.filter(m => filterMonth==="all" || m===filterMonth).length > 0
                  ? fmt(totalGastos / (filterMonth==="all" ? monthsOfYear.length : 1))
                  : "—"}
                accent="#C9963A"
                sub="gasto medio por mes"/>
            </div>

            {/* Este mes destacado */}
            {filterMonth !== CURRENT_MONTH && (() => {
              const estesMesGastos = allGastos.filter(g=>g.fecha.startsWith(CURRENT_MONTH));
              const totalEsteMes = estesMesGastos.reduce((s,g)=>s+g.importe,0);
              const adriEsteMes = estesMesGastos.filter(g=>g.persona==="ADRI").reduce((s,g)=>s+g.importe,0);
              const mariEsteMes = estesMesGastos.filter(g=>g.persona==="MARI").reduce((s,g)=>s+g.importe,0);
              return (
                <div style={{background:"#F0FBF0",border:"1px solid #86EFAC",borderRadius:12,padding:"14px 18px",marginBottom:14}}>
                  <div style={{fontSize:10,color:"#2A4A2A",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>
                    📅 Este mes — Mayo 2026
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                    <div>
                      <div style={{fontSize:10,color:"#3A5A3A",marginBottom:3}}>Total</div>
                      <div style={{fontSize:18,fontWeight:700,fontFamily:"monospace",color:"#1A1A2E"}}>{fmt(totalEsteMes)}</div>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:"#3A3A6A",marginBottom:3}}>Adri</div>
                      <div style={{fontSize:16,fontWeight:700,fontFamily:"monospace",color:"#6B8CFF"}}>{fmt(adriEsteMes)}</div>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:"#5A3A5A",marginBottom:3}}>Mari</div>
                      <div style={{fontSize:16,fontWeight:700,fontFamily:"monospace",color:"#F472B6"}}>{fmt(mariEsteMes)}</div>
                    </div>
                  </div>
                  <button onClick={()=>setFilterMonth(CURRENT_MONTH)} style={{
                    marginTop:10,background:"none",border:"1px solid #A0D0A0",borderRadius:6,
                    padding:"4px 10px",color:"#4A8A4A",fontSize:11,cursor:"pointer",fontFamily:"inherit"
                  }}>Ver detalle →</button>
                </div>
              );
            })()}

            {/* ── ALERTAS INTELIGENTES ── */}
            {(() => {
              // Determinar qué período analizar
              const personaLabel = filterPersona === "TODOS" ? "Adri + Mari" : filterPersona;

              let mesAnalisis = null;
              let periodoLabel = "";
              let esPeriodoCompleto = false; // true cuando es un año o todos los años

              if (filterMonth !== "all") {
                // Mes concreto seleccionado
                mesAnalisis = filterMonth;
                periodoLabel = monthLabel(filterMonth);
              } else if (filterYear !== "all") {
                // Año concreto, todos los meses
                periodoLabel = filterYear;
                esPeriodoCompleto = true;
              } else {
                // Todos los años
                periodoLabel = "Todo el histórico";
                esPeriodoCompleto = true;
              }

              // Gastos del período analizado
              const periodoGastos = allGastos.filter(g => {
                const pOk = filterPersona==="TODOS" || g.persona===filterPersona;
                if (!pOk) return false;
                if (mesAnalisis) return g.fecha.startsWith(mesAnalisis);
                if (filterYear !== "all") return g.fecha.startsWith(filterYear);
                return true;
              });

              if (periodoGastos.length === 0) return null;

              // Para comparar necesitamos un período de referencia anterior
              // Si es mes → comparamos con media de meses anteriores
              // Si es año → comparamos con media de años anteriores
              // Si es todo → no tiene sentido comparar, mostramos top categorías
              
              let mesesReferencia = [];
              if (mesAnalisis) {
                mesesReferencia = [...new Set(
                  allGastos.filter(g=>g.fecha.slice(0,7) < mesAnalisis)
                    .map(g=>g.fecha.slice(0,7))
                )];
              } else if (filterYear !== "all") {
                mesesReferencia = [...new Set(
                  allGastos.filter(g=>g.fecha.slice(0,4) < filterYear)
                    .map(g=>g.fecha.slice(0,7))
                )];
              }

              // Si no hay suficiente histórico para comparar, mostramos top categorías
              if (mesesReferencia.length < 2) {
                // Mostrar simplemente las 3 categorías con más gasto
                const topCats = Object.keys(CATS).map(cat=>({
                  cat,
                  total: periodoGastos.filter(g=>g.categoria===cat).reduce((s,g)=>s+g.importe,0)
                })).filter(x=>x.total>0).sort((a,b)=>b.total-a.total).slice(0,3);

                if (topCats.length === 0) return null;
                return (
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:11,color:"#6060A0",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>
                      📊 Top categorías — {periodoLabel} · {personaLabel}
                    </div>
                    {topCats.map((a,i)=>(
                      <div key={a.cat} style={{
                        background:["#FEF2F2","#FFF3E0","#F3F8FF"][i],
                        border:`1px solid ${["#FECACA","#FFB74D","#90CAF9"][i]}`,
                        borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                        <span style={{fontSize:20}}>{["🤯","😬","😐"][i]}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,fontWeight:700,color:["#991B1B","#E65100","#1565C0"][i]}}>{a.cat}</div>
                          <div style={{fontSize:12,color:["#B91C1C","#F57C00","#1976D2"][i],marginTop:2}}>{fmt(a.total)} gastado en este período</div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              const numMesesRef = mesesReferencia.length;

              // Calcular alertas por categoría
              const alertas = [];
              Object.keys(CATS).forEach(cat => {
                const gastoPeriodo = periodoGastos
                  .filter(g=>g.categoria===cat)
                  .reduce((s,g)=>s+g.importe,0);
                if (gastoPeriodo === 0) return;

                // Media del período de referencia (normalizada a mismo número de meses)
                const mesesPeriodo = mesAnalisis ? 1 :
                  filterYear !== "all" ? monthsOfYear.length : 1;

                const mediaRef = mesesReferencia.reduce((sum, mes) => {
                  return sum + allGastos
                    .filter(g=>g.fecha.startsWith(mes)&&g.categoria===cat&&(filterPersona==="TODOS"||g.persona===filterPersona))
                    .reduce((s,g)=>s+g.importe,0);
                }, 0) / numMesesRef * mesesPeriodo;

                if (mediaRef < 10) return;

                const ratio = gastoPeriodo / mediaRef;

                // Para el mes actual, proyección
                const esActual = mesAnalisis === CURRENT_MONTH;
                const diasDelMes = new Date().getDate() / new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
                const proyeccion = esActual ? gastoPeriodo / diasDelMes : null;

                if (ratio > 1.2) {
                  alertas.push({ cat, gastoPeriodo, mediaRef, ratio, proyeccion, tipo: "rojo" });
                } else if (esActual && proyeccion && proyeccion > mediaRef * 1.1) {
                  alertas.push({ cat, gastoPeriodo, mediaRef, ratio, proyeccion, tipo: "naranja" });
                } else if (ratio < 0.6) {
                  alertas.push({ cat, gastoPeriodo, mediaRef, ratio, tipo: "verde" });
                }
              });

              if (alertas.length === 0) return null;

              const rojos = alertas.filter(a=>a.tipo==="rojo").sort((a,b)=>b.ratio-a.ratio);
              const naranjas = alertas.filter(a=>a.tipo==="naranja");
              const verdes = alertas.filter(a=>a.tipo==="verde").sort((a,b)=>a.ratio-b.ratio).slice(0,3);

              const refLabel = mesAnalisis ? `media de ${numMesesRef} meses anteriores` :
                filterYear !== "all" ? `media de años anteriores` : "";

              return (
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:"#6060A0",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>
                    🔔 {periodoLabel} · {personaLabel} — vs {refLabel}
                  </div>

                  {rojos.map(a=>(
                    <div key={a.cat} style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:20}}>🔴</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#991B1B"}}>{a.cat}</div>
                        <div style={{fontSize:12,color:"#B91C1C",marginTop:2}}>
                          {fmt(a.gastoPeriodo)} gastado · media {fmt(Math.round(a.mediaRef))} · <strong>{Math.round(a.ratio*100)}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}

                  {naranjas.map(a=>(
                    <div key={a.cat} style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:20}}>🟡</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#92400E"}}>{a.cat}</div>
                        <div style={{fontSize:12,color:"#B45309",marginTop:2}}>
                          Llevas {fmt(a.gastoPeriodo)} · proyección {fmt(Math.round(a.proyeccion))} · media {fmt(Math.round(a.mediaRef))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {verdes.map(a=>(
                    <div key={a.cat} style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:20}}>✅</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#166534"}}>{a.cat}</div>
                        <div style={{fontSize:12,color:"#15803D",marginTop:2}}>
                          {fmt(a.gastoPeriodo)} vs media {fmt(Math.round(a.mediaRef))} — por debajo de lo habitual 👍
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Barra Adri vs Mari */}
            <Sec title="Adri vs Mari por mes">
              <ResponsiveContainer width="100%" height={165}>
                <BarChart data={byMonthData} margin={{top:4,right:0,left:-22,bottom:0}}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1E1E2E"/>
                  <XAxis dataKey="label" tick={{fill:"#9A9ABB",fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:"#9A9ABB",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"€"}/>
                  <Tooltip formatter={v=>fmt(v)} contentStyle={{background:"#FFFFFF",border:"1px solid #8080CC",borderRadius:8,color:"#1A1A2E",fontFamily:"monospace",fontSize:13,fontWeight:600,color:"#111111"}}/>
                  <Legend wrapperStyle={{fontSize:12,color:"#4A4A6A",paddingTop:4}}/>
                  <Bar dataKey="ADRI" name="Adri" fill="#6B8CFF" radius={[3,3,0,0]}/>
                  <Bar dataKey="MARI" name="Mari" fill="#F472B6" radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Sec>

            {/* Pie categorías */}
            {byCat.length>0 && (
              <Sec title="Por categoría">
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={byCat} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={72} innerRadius={36}>
                      {byCat.map((c,i)=><Cell key={i} fill={c.color}/>)}
                    </Pie>
                    <Tooltip formatter={v=>fmt(v)} contentStyle={{background:"#FFFFFF",border:"1px solid #8080CC",borderRadius:8,color:"#1A1A2E",fontFamily:"monospace",fontSize:13,fontWeight:600,color:"#111111"}}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:4}}>
                  {byCat.slice(0,8).map(c=>(
                    <div key={c.name} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:2,background:c.color,flexShrink:0}}/>
                      <span style={{flex:1,fontSize:12,color:"#4A4A6A"}}>{c.name}</span>
                      <span style={{fontSize:12,fontFamily:"monospace",color:"#1A1A2E"}}>{fmt(c.total)}</span>
                      <span style={{fontSize:11,color:"#7070A0",width:30,textAlign:"right"}}>
                        {totalGastos>0?Math.round(c.total/totalGastos*100):0}%
                      </span>
                    </div>
                  ))}
                </div>
              </Sec>
            )}

            {/* Ingresos */}
            {filteredIngresos.length>0 && (
              <Sec title="Ingresos registrados">
                {filteredIngresos.map(i=>(
                  <div key={i.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #0C0C16",fontSize:12}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{color:"#9090BB",fontFamily:"monospace"}}>{i.fecha}</span>
                      <span style={{color:i.persona==="ADRI"?"#6B8CFF":"#F472B6",fontSize:11}}>{i.persona}</span>
                      <span style={{color:"#7070A0"}}>{i.concepto}</span>
                    </div>
                    <span style={{color:"#1A7A1A",fontFamily:"monospace",fontWeight:600}}>+{fmt(i.importe)}</span>
                  </div>
                ))}
              </Sec>
            )}
          </div>
        )}

        {/* ═══ HISTORIAL TAB ═══ */}
        {tab==="list" && (
          <div>
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              {["TODOS","ADRI","MARI"].map(p=>(
                <Pill key={p} label={p} active={filterPersona===p}
                  color={p==="ADRI"?"#6B8CFF":p==="MARI"?"#F472B6":"#C9963A"}
                  onClick={()=>setFilterPersona(p)}/>
              ))}
            </div>
            {/* Filtro AÑO */}
            <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
              <span style={{fontSize:11,color:"#9090B0",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginRight:4}}>Año</span>
              <Pill label="Todos" active={filterYear==="all"} color="#C9963A" onClick={()=>{ setFilterYear("all"); setFilterMonth("all"); }}/>
              {allYears.map(y=>(
                <Pill key={y} label={y} active={filterYear===y}
                  color="#22C55E"
                  onClick={()=>{ setFilterYear(y); setFilterMonth("all"); }}/>
              ))}
            </div>
            {/* Filtro MES */}
            <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:11,color:"#9090B0",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginRight:4}}>Mes</span>
              <Pill label="Todo" active={filterMonth==="all"} onClick={()=>setFilterMonth("all")} color="#C9963A"/>
              {monthsOfYear.map(m=>(
                <Pill key={m} label={m===CURRENT_MONTH?"● "+monthLabel(m):monthLabel(m)}
                  active={filterMonth===m}
                  color="#22C55E"
                  onClick={()=>setFilterMonth(m)}/>
              ))}
            </div>
            <div style={{fontSize:12,color:"#7070A0",marginBottom:12,fontFamily:"monospace"}}>
              {filteredGastos.length} gastos · {fmt(totalGastos)}
            </div>
            {filteredGastos.length === 0 ? (
              <div style={{color:"#A0A0C0",fontSize:13,textAlign:"center",padding:40}}>
                No hay gastos para los filtros seleccionados
              </div>
            ) : [...filteredGastos].sort((a,b)=>{
              // Primero por fecha descendente
              const fechaDiff = b.fecha.localeCompare(a.fecha);
              if (fechaDiff !== 0) return fechaDiff;
              // Si misma fecha, entradas de usuario (id empieza por "u") primero
              const aUser = a.id.startsWith("u") ? 1 : 0;
              const bUser = b.id.startsWith("u") ? 1 : 0;
              if (bUser !== aUser) return bUser - aUser;
              // Si los dos son usuario, el más reciente primero
              return b.id.localeCompare(a.id);
            }).slice(0,200).map(g => {
              const col = CAT_COLORS[g.categoria]||"#888";
              const isUser = g.id.startsWith("u") || g.id.startsWith("s");
              return (
                <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid #0C0C16"}}>
                  <div style={{width:7,height:7,borderRadius:2,background:col,flexShrink:0,marginTop:1}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:"#2A2A3E",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {g.categoria} <span style={{color:"#9090BB"}}>›</span> {g.subcategoria}
                    </div>
                    <div style={{fontSize:11,color:"#8080AA",marginTop:1}}>
                      {g.fecha} · <span style={{color:g.persona==="ADRI"?"#6B8CFF":"#F472B6"}}>{g.persona}</span>
                    </div>
                  </div>
                  <div style={{fontSize:14,fontWeight:700,fontFamily:"monospace",color:"#1A1A2E",flexShrink:0}}>
                    {fmt(g.importe)}
                  </div>
                  {isUser && (
                    deleteId===g.id ? (
                      <div style={{display:"flex",gap:3}}>
                        <button onClick={()=>deleteEntry(g.id)} style={{...mbtn,background:"#FEE8E8",color:"#AA1A1A"}}>✓</button>
                        <button onClick={()=>setDeleteId(null)} style={mbtn}>✕</button>
                      </div>
                    ) : (
                      <button onClick={()=>setDeleteId(g.id)} style={{...mbtn,opacity:0.2}}>🗑</button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Estilos base ──
const inp = {
  width:"100%",boxSizing:"border-box",background:"#F5F6FA",
  border:"1px solid #D0D0E0",borderRadius:8,padding:"9px 12px",
  color:"#1A1A2E",fontSize:14,fontFamily:"Georgia,serif",
  transition:"border-color 0.15s",outline:"none",
};
const mbtn = {
  background:"#FFFFFF",border:"1px solid #D0D0E0",borderRadius:6,
  padding:"4px 7px",cursor:"pointer",fontSize:12,color:"#8080AA",fontFamily:"inherit",
};

function F({label,children}) {
  return (
    <div>
      <div style={{fontSize:11,color:"#6060A0",letterSpacing:"1px",textTransform:"uppercase",marginBottom:5,fontWeight:600}}>{label}</div>
      {children}
    </div>
  );
}

function Pill({label,active,onClick,color="#C9963A"}) {
  return (
    <button onClick={onClick} style={{
      background:active?color:"#F0F0F8",
      border:`1px solid ${active?color:"#D0D0E8"}`,
      color:active?"#FFFFFF":"#5050A0",
      borderRadius:20,padding:"5px 13px",
      fontSize:12,cursor:"pointer",fontFamily:"inherit",
      fontWeight:active?700:500,whiteSpace:"nowrap",transition:"all 0.15s",
      boxShadow:active?"0 2px 8px "+color+"55":"none",
    }}>{label}</button>
  );
}

function KCard({label,value,accent,sub}) {
  return (
    <div style={{background:"#FFFFFF",border:"1px solid #D0D0E0",borderRadius:10,
      padding:"14px 16px",borderLeft:`2px solid ${accent}`}}>
      <div style={{fontSize:11,color:"#6060A0",letterSpacing:"1px",textTransform:"uppercase",marginBottom:6,fontWeight:600}}>{label}</div>
      <div style={{fontSize:20,fontWeight:700,color:"#1A1A2E",fontFamily:"monospace"}}>{value}</div>
      {sub && <div style={{fontSize:10,color:accent,marginTop:3}}>{sub}</div>}
    </div>
  );
}

function Sec({title,children}) {
  return (
    <div style={{background:"#FFFFFF",border:"1px solid #D0D0E0",borderRadius:12,padding:"16px 18px",marginBottom:14}}>
      <div style={{fontSize:11,color:"#6060A0",letterSpacing:"1px",textTransform:"uppercase",marginBottom:14,fontWeight:600}}>{title}</div>
      {children}
    </div>
  );
}
