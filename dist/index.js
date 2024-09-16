// hipoteca.ts
function convertirMesesAAnosYMeses(meses2) {
  const anios = Math.floor(meses2 / 12);
  const mesesRestantes = meses2 % 12;
  return {
    anios,
    meses: mesesRestantes
  };
}
var Hipoteca = class {
  capitalInicial;
  tasaInteresAnual;
  numeroPagos;
  cuotaMensual;
  constructor(capital, tasaInteres, anios) {
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
  calcularCuotaMensual(saldo, numeroPagos) {
    const tasaMensual = this.tasaInteresAnual / 100 / 12;
    return saldo * (tasaMensual * Math.pow(1 + tasaMensual, numeroPagos)) / (Math.pow(1 + tasaMensual, numeroPagos) - 1);
  }
  // Simulación personalizada de amortización anticipada
  simularEscenarioPersonalizado(amortizaciones2) {
    let saldoRestante = this.capitalInicial;
    const tasaMensual = this.tasaInteresAnual / 100 / 12;
    let totalIntereses = 0;
    let calendarioPagos = [];
    let cuotaMensual = this.cuotaMensual;
    let numeroPagosRestantes = this.numeroPagos;
    for (let mes = 1; saldoRestante > 0; mes++) {
      const amortizacion = amortizaciones2.find((a) => a.mes === mes);
      if (amortizacion) {
        saldoRestante -= amortizacion.cantidad;
        if (amortizacion.tipo === "reducirCuota") {
          cuotaMensual = this.calcularCuotaMensual(saldoRestante, numeroPagosRestantes - mes + 1);
        } else if (amortizacion.tipo === "reducirPlazo") {
          const numeroPagosNuevos = this.calcularNumeroPagos(saldoRestante, cuotaMensual);
          numeroPagosRestantes = mes - 1 + numeroPagosNuevos;
        }
      }
      const interesMes = saldoRestante * tasaMensual;
      const capitalAmortizado2 = cuotaMensual - interesMes;
      saldoRestante -= capitalAmortizado2;
      totalIntereses += interesMes;
      calendarioPagos.push({
        mes,
        cuotaMensual,
        interesMes,
        capitalAmortizado: capitalAmortizado2,
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
  calcularNumeroPagos(saldo, cuotaMensual) {
    const tasaMensual = this.tasaInteresAnual / 100 / 12;
    return Math.ceil(
      Math.log(cuotaMensual / (cuotaMensual - saldo * tasaMensual)) / Math.log(1 + tasaMensual)
    );
  }
  // Simulación de amortización anticipada con un plan
  simularAmortizacionConPlan(planAmortizacion) {
    let saldoRestante = this.capitalInicial;
    const tasaMensual = this.tasaInteresAnual / 100 / 12;
    let totalIntereses = 0;
    let calendarioPagos = [];
    for (let mes = 1; mes <= this.numeroPagos; mes++) {
      const interesMes = saldoRestante * tasaMensual;
      const capitalAmortizado2 = this.cuotaMensual - interesMes;
      saldoRestante -= capitalAmortizado2;
      const amortizacion = planAmortizacion.find((a) => a.mes === mes);
      if (amortizacion) {
        saldoRestante -= amortizacion.cantidad;
      }
      totalIntereses += interesMes;
      calendarioPagos.push({
        mes,
        cuotaMensual: this.cuotaMensual,
        interesMes,
        capitalAmortizado: capitalAmortizado2,
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
  // Simulación de amortización anticipada fija cada cierto tiempo
  simularAmortizacionAnticipada(amortizacionAnual, duracionAmortizacionMeses, inicioAmortizacionMes) {
    let saldoRestante = this.capitalInicial;
    const tasaMensual = this.tasaInteresAnual / 100 / 12;
    let totalIntereses = 0;
    let calendarioPagos = [];
    for (let mes = 1; mes <= this.numeroPagos; mes++) {
      const interesMes = saldoRestante * tasaMensual;
      const capitalAmortizado2 = this.cuotaMensual - interesMes;
      saldoRestante -= capitalAmortizado2;
      totalIntereses += interesMes;
      if (mes >= inicioAmortizacionMes && (mes - inicioAmortizacionMes) % 12 === 0) {
        saldoRestante -= amortizacionAnual;
        console.log("Aplicar amortizacion:", amortizacionAnual, mes);
      }
      calendarioPagos.push({
        mes,
        cuotaMensual: this.cuotaMensual,
        interesMes,
        capitalAmortizado: capitalAmortizado2,
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
  generarCalendarioPagos(amortizacionMes, amortizacionCantidad) {
    let saldoRestante = this.capitalInicial;
    const tasaMensual = this.tasaInteresAnual / 100 / 12;
    let totalIntereses = 0;
    let calendarioPagos = [];
    for (let mes = 1; mes <= this.numeroPagos; mes++) {
      const interesMes = saldoRestante * tasaMensual;
      const capitalAmortizado2 = this.cuotaMensual - interesMes;
      saldoRestante -= capitalAmortizado2;
      if (amortizacionMes && mes === amortizacionMes) {
        saldoRestante -= amortizacionCantidad || 0;
      }
      totalIntereses += interesMes;
      calendarioPagos.push({
        mes,
        cuotaMensual: this.cuotaMensual,
        interesMes,
        capitalAmortizado: capitalAmortizado2,
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
  // Método para calcular el ahorro en intereses tras una amortización anticipada
  calcularAhorroAmortizacion(mesAmortizacion, cantidadAmortizacion) {
    const { totalIntereses: totalInteresesOriginal } = this.generarCalendarioPagos();
    const { totalIntereses: totalInteresesConAmortizacion } = this.generarCalendarioPagos(mesAmortizacion, cantidadAmortizacion);
    const ahorroIntereses = totalInteresesOriginal - totalInteresesConAmortizacion;
    return {
      ahorro: ahorroIntereses,
      totalInteresesOriginal,
      totalInteresesConAmortizacion
    };
  }
};

// index.ts
function calcularPorcentajeInteresesPagados(totalInteresesPagados, capitalInicial2) {
  return totalInteresesPagados / capitalInicial2 * 100;
}
var capitalInicial = 17e4;
var interesAnual = 2.45;
var a\u00F1os = 27;
var hipoteca = new Hipoteca(capitalInicial, interesAnual, a\u00F1os);
var resultadoSin = hipoteca.generarCalendarioPagos();
console.log(resultadoSin);
var amortizaciones = [
  //  { mes: convertirAnosEnMeses(1), cantidad: 8000, tipo: "reducirCuota" },
  // { mes: convertirAnosEnMeses(2), cantidad: 8000, tipo: "reducirCuota" },
  // { mes: convertirAnosEnMeses(3), cantidad: 8000, tipo: "reducirCuota" }
];
var totalMeses = 27 * 12;
for (let mes = 3; mes <= totalMeses; mes += 3) {
  amortizaciones.push({
    mes,
    cantidad: 2e3,
    tipo: "reducirPlazo"
    // Puedes cambiar a 'reducirCuota' si lo deseas
  });
}
var resultado = hipoteca.simularEscenarioPersonalizado(amortizaciones.filter(Boolean));
console.log("Capital inicial prestamo:", capitalInicial + "\u20AC", "Interes Anual:", interesAnual.toString() + "%", "A\xF1os:", a\u00F1os);
console.log(`Total intereses pagados: ${resultado.totalIntereses.toFixed(2)}\u20AC`);
console.log("Total:", (capitalInicial + resultado.totalIntereses).toFixed(2) + "\u20AC");
console.log("% de intereses pagado", calcularPorcentajeInteresesPagados(resultado.totalIntereses, capitalInicial).toFixed(2));
var tiempo = convertirMesesAAnosYMeses(resultado.calendar.length);
console.log(`Tiempo: ${tiempo.anios} a\xF1os y ${tiempo.meses} meses`);
console.table(resultado.calendar.map((cuota) => ({
  mes: cuota.mes,
  cuotaMensual: cuota.cuotaMensual.toFixed(2) + "\u20AC",
  capitalAmortizado: cuota.capitalAmortizado.toFixed(2) + "\u20AC",
  interesesMes: cuota.interesMes.toFixed(2) + "\u20AC",
  saldoRestante: cuota.saldoRestante.toFixed(2) + "\u20AC",
  totalInteresesPagados: cuota.totalInteresesPagados.toFixed(2) + "\u20AC"
})));
var meses = resultado.calendar.map((cuota) => cuota.mes);
var interesesMes = resultado.calendar.map((cuota) => cuota.interesMes);
var capitalAmortizado = resultado.calendar.map((cuota) => cuota.capitalAmortizado);
var ctx = document.getElementById("hipotecaChart").getContext("2d");
var hipotecaChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: meses,
    datasets: [
      {
        label: "Intereses Pagados (\u20AC)",
        data: interesesMes,
        borderColor: "blue",
        fill: false
      },
      {
        label: "Capital Amortizado (\u20AC)",
        data: capitalAmortizado,
        borderColor: "green",
        fill: false
      }
    ]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: "Mes"
        }
      },
      y: {
        title: {
          display: true,
          text: "Monto (\u20AC)"
        }
      }
    }
  }
});
