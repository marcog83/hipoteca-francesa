import { AMORTIZAR_TRES_MESES } from "./combinations";
import { Amortizacion } from "./estrategias";
import { convertirAnosEnMeses, Hipoteca, convertirMesesAAnosYMeses, Cuota } from "./hipoteca";
function calcularPorcentajeInteresesPagados(totalInteresesPagados: number, capitalInicial: number): number {
  return (totalInteresesPagados / capitalInicial) * 100;
}

const capitalInicial = 170000;
const interesAnual = 2.45;
const años = 27;

// Uso del programa
const hipoteca = new Hipoteca(capitalInicial, interesAnual, años);
const resultadoSin = hipoteca.generarCalendarioPagos();
console.log(resultadoSin);

const resultado = hipoteca.simularEscenarioPersonalizado(AMORTIZAR_TRES_MESES.filter(Boolean))
// Mostrar los resultados
console.log("Capital inicial prestamo:", capitalInicial + "€", "Interes Anual:", interesAnual.toString() + "%", "Años:", años);
console.log(`Total intereses pagados: ${resultado.totalIntereses.toFixed(2)}€`);
console.log("Total:", (capitalInicial + resultado.totalIntereses).toFixed(2) + "€")
console.log("% de intereses pagado", calcularPorcentajeInteresesPagados(resultado.totalIntereses, capitalInicial).toFixed(2))
const tiempo = convertirMesesAAnosYMeses(resultado.calendar.length);
console.log(`Tiempo: ${tiempo.anios} años y ${tiempo.meses} meses`);
console.table(resultado.calendar.map(cuota => ({
  mes: cuota.mes,
  cuotaMensual: cuota.cuotaMensual.toFixed(2) + "€",
  capitalAmortizado: cuota.capitalAmortizado.toFixed(2) + "€",
  interesesMes: cuota.interesMes.toFixed(2) + "€",

  saldoRestante: cuota.saldoRestante.toFixed(2) + "€",
  totalInteresesPagados: cuota.totalInteresesPagados.toFixed(2) + "€",
})))
// Extraer los datos del calendario devuelto
const meses = resultado.calendar.map(cuota => cuota.mes);
const interesesMes = resultado.calendar.map(cuota => cuota.interesMes); // Intereses pagados por mes
const capitalAmortizado = resultado.calendar.map(cuota => cuota.capitalAmortizado); // Capital amortizado por mes

// Crear el gráfico usando Chart.js
const ctx = document.getElementById('hipotecaChart')!.getContext('2d');
const hipotecaChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: meses,
    datasets: [
      {
        label: 'Intereses Pagados (€)',
        data: interesesMes,
        borderColor: 'blue',
        fill: false
      },
      {
        label: 'Capital Amortizado (€)',
        data: capitalAmortizado,
        borderColor: 'green',
        fill: false
      }
    ]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mes'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Monto (€)'
        }
      }
    }
  }
});