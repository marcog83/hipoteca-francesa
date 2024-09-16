import { Amortizacion } from "./estrategias";

// Función de utilidad que convierte años en meses
export function convertirAnosEnMeses(anos: number): number {
    return anos * 12;
}

export function convertirMesesAAnosYMeses(meses: number): { anios: number, meses: number } {
    const anios = Math.floor(meses / 12);  // Calcula los años completos
    const mesesRestantes = meses % 12;  // Calcula los meses restantes

    return {
        anios,
        meses: mesesRestantes
    };
}

export type Cuota={
    mes:number,
    cuotaMensual:number,
    interesMes:number,
    capitalAmortizado:number,
    saldoRestante:number,
    totalInteresesPagados:number
};
export type Calendar={
    totalIntereses:number;
    calendar:Cuota[]
}
export type PlanAmortizacion = {
    mes: number;
    cantidad: number;
};

export class Hipoteca {
    private capitalInicial: number;
    private tasaInteresAnual: number;
    private numeroPagos: number;
    private cuotaMensual: number;

    constructor(capital: number, tasaInteres: number, anios: number) {
        this.capitalInicial = capital;
        this.tasaInteresAnual = tasaInteres;
        this.numeroPagos = anios * 12;
        this.cuotaMensual = this.calcularCuotaMensual(this.capitalInicial, this.numeroPagos);
    }

    // Método para calcular la cuota mensual total
    // private calcularCuotaMensual(): number {
    //     const tasaMensual = this.tasaInteresAnual / 100 / 12;
    //     return (
    //         this.capitalInicial *
    //         (tasaMensual * Math.pow(1 + tasaMensual, this.numeroPagos)) /
    //         (Math.pow(1 + tasaMensual, this.numeroPagos) - 1)
    //     );
    // }

    // Método para calcular la cuota mensual total
    private calcularCuotaMensual(saldo: number, numeroPagos: number): number {
        const tasaMensual = this.tasaInteresAnual / 100 / 12;
        return (
            saldo *
            (tasaMensual * Math.pow(1 + tasaMensual, numeroPagos)) /
            (Math.pow(1 + tasaMensual, numeroPagos) - 1)
        );
    }

    // Simulación personalizada de amortización anticipada
    public simularEscenarioPersonalizado(amortizaciones: Amortizacion[]): Calendar {
        let saldoRestante = this.capitalInicial;
        const tasaMensual = this.tasaInteresAnual / 100 / 12;
        let totalIntereses = 0;
        let calendarioPagos: Cuota[] = [];
        let cuotaMensual = this.cuotaMensual;
        let numeroPagosRestantes = this.numeroPagos;

        for (let mes = 1; saldoRestante > 0; mes++) {
            // Verificar si hay una amortización en este mes
            const amortizacion = amortizaciones.find(a => a.mes === mes);

            if (amortizacion) {
                saldoRestante -= amortizacion.cantidad;

                if (amortizacion.tipo === 'reducirCuota') {
                    // Recalcular la cuota mensual manteniendo el plazo
                    cuotaMensual = this.calcularCuotaMensual(saldoRestante, numeroPagosRestantes - mes + 1);
                } else if (amortizacion.tipo === 'reducirPlazo') {
                    // Recalcular el número de pagos restantes manteniendo la cuota
                    const numeroPagosNuevos = this.calcularNumeroPagos(saldoRestante, cuotaMensual);
                    numeroPagosRestantes = mes - 1 + numeroPagosNuevos;
                }
            }

            const interesMes = saldoRestante * tasaMensual;
            const capitalAmortizado = cuotaMensual - interesMes;
            saldoRestante -= capitalAmortizado;

            totalIntereses += interesMes;

            calendarioPagos.push({
                mes,
                cuotaMensual,
                interesMes,
                capitalAmortizado,
                saldoRestante: saldoRestante > 0 ? saldoRestante : 0,
                totalInteresesPagados: totalIntereses
            });

            if (saldoRestante <= 0) {
                break;
            }
        }

        return {
            totalIntereses,
            calendar: calendarioPagos
        };
    }

    // Método para calcular el número de pagos restantes dado un saldo y una cuota mensual
    private calcularNumeroPagos(saldo: number, cuotaMensual: number): number {
        const tasaMensual = this.tasaInteresAnual / 100 / 12;
        return Math.ceil(
            Math.log(cuotaMensual / (cuotaMensual - saldo * tasaMensual)) / Math.log(1 + tasaMensual)
        );
    }

    // Simulación de amortización anticipada con un plan
    public simularAmortizacionConPlan(planAmortizacion: PlanAmortizacion[]): Calendar {
        let saldoRestante = this.capitalInicial;
        const tasaMensual = this.tasaInteresAnual / 100 / 12;
        let totalIntereses = 0;
        let calendarioPagos: Cuota[] = [];
    
        for (let mes = 1; mes <= this.numeroPagos; mes++) {
            const interesMes = saldoRestante * tasaMensual;
            const capitalAmortizado = this.cuotaMensual - interesMes;
            saldoRestante -= capitalAmortizado;
    
            // Aplicar amortización anticipada si está en el plan
            const amortizacion = planAmortizacion.find(a => a.mes === mes);
            if (amortizacion) {
                saldoRestante -= amortizacion.cantidad;
            }

            totalIntereses += interesMes;
    
            calendarioPagos.push({
                mes,
                cuotaMensual: this.cuotaMensual,
                interesMes,
                capitalAmortizado,
                saldoRestante,
                totalInteresesPagados:totalIntereses
            });
    
            if (saldoRestante <= 0) {
                break;
            }
        }

        return {
            totalIntereses,
            calendar: calendarioPagos
        };
    }

    // Simulación de amortización anticipada fija cada cierto tiempo
    public simularAmortizacionAnticipada(amortizacionAnual: number, duracionAmortizacionMeses: number, inicioAmortizacionMes: number): Calendar {
        let saldoRestante = this.capitalInicial;
        const tasaMensual = this.tasaInteresAnual / 100 / 12;
        let totalIntereses = 0;
        let calendarioPagos: Cuota[] = [];

        for (let mes = 1; mes <= this.numeroPagos; mes++) {
            const interesMes = saldoRestante * tasaMensual;
            const capitalAmortizado = this.cuotaMensual - interesMes;
            saldoRestante -= capitalAmortizado;

            totalIntereses += interesMes;

            // Aplicar la amortización anticipada una vez al año (cada 12 meses), empezando desde el mes `inicioAmortizacionMes`
            if (mes >= inicioAmortizacionMes && (mes - inicioAmortizacionMes) % 12 === 0) {
                saldoRestante -= amortizacionAnual;
                console.log("Aplicar amortizacion:",amortizacionAnual,mes)
            }

            calendarioPagos.push({
                mes,
                cuotaMensual: this.cuotaMensual,
                interesMes,
                capitalAmortizado,
                saldoRestante,
                totalInteresesPagados: totalIntereses 
            });

            if (saldoRestante <= 0) {
                break;
            }
        }

        return {
            totalIntereses,
            calendar: calendarioPagos
        };
    }

    // Generar el calendario de pagos completo con opción de amortización
    public generarCalendarioPagos(amortizacionMes?: number, amortizacionCantidad?: number): Calendar {
        let saldoRestante = this.capitalInicial;
        const tasaMensual = this.tasaInteresAnual / 100 / 12;
        let totalIntereses = 0;
        let calendarioPagos: Cuota[] = [];

        for (let mes = 1; mes <= this.numeroPagos; mes++) {
            const interesMes = saldoRestante * tasaMensual;
            const capitalAmortizado = this.cuotaMensual - interesMes;
            saldoRestante -= capitalAmortizado;

            // Amortización anticipada en el mes indicado
            if (amortizacionMes && mes === amortizacionMes) {
                saldoRestante -= amortizacionCantidad || 0;
            }

            totalIntereses += interesMes;

            calendarioPagos.push({
                mes,
                cuotaMensual: this.cuotaMensual,
                interesMes,
                capitalAmortizado,
                saldoRestante,
                totalInteresesPagados:totalIntereses
            });

            if (saldoRestante <= 0) {
                break;
            }
        }

        return {
            totalIntereses,
            calendar: calendarioPagos
        };
    }

    // Método para calcular el ahorro en intereses tras una amortización anticipada
    public calcularAhorroAmortizacion(mesAmortizacion: number, cantidadAmortizacion: number): { ahorro: number, totalInteresesOriginal: number, totalInteresesConAmortizacion: number } {
        // Total intereses sin amortización anticipada
        const { totalIntereses: totalInteresesOriginal } = this.generarCalendarioPagos();

        // Total intereses con amortización anticipada
        const { totalIntereses: totalInteresesConAmortizacion } = this.generarCalendarioPagos(mesAmortizacion, cantidadAmortizacion);

        // Ahorro en intereses
        const ahorroIntereses = totalInteresesOriginal - totalInteresesConAmortizacion;

        return {
            ahorro: ahorroIntereses,
            totalInteresesOriginal,
            totalInteresesConAmortizacion
        };
    }
}

