import { Amortizacion } from "./estrategias";
import { convertirAnosEnMeses } from "./hipoteca";
    
const amortiza3meses=()=>{
    const results:Amortizacion[]=[];
    const totalMeses = 27 * 12;
    
    // Crear amortizaciones trimestrales de 2,000€ cada 3 meses
    for (let mes = 3; mes <= totalMeses; mes += 3) {
        results.push({
        mes: mes,
        cantidad: 2000,
        tipo: "reducirPlazo", // Puedes cambiar a 'reducirCuota' si lo deseas
      });
    }
    return results;
}

export const amortizaCadaAño=()=>{
const amortizaciones:Amortizacion[]=[
    {mes:convertirAnosEnMeses(1),cantidad:8000,tipo:"reducirCuota"}
];
for (let ano = amortizaciones.length + 1; ano <= 13; ano++) {
  amortizaciones.push({
    mes: convertirAnosEnMeses(ano),
    cantidad: 8000,
    tipo: "reducirPlazo",
  });
}
return amortizaciones
}

export const AMORTIZAR_TRES_MESES:Amortizacion[]=amortiza3meses();
    
