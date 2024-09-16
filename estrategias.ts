
// Definir las estrategias de amortización
export type Amortizacion={ mes: number, cantidad: number, tipo: 'reducirCuota' | 'reducirPlazo' }
export type EstrategiaAmortizacion = {
    nombre: string;
    amortizaciones: Amortizacion[];
};
