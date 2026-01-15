<script setup>
import { ref, computed, nextTick } from 'vue'

const opcionSeleccionada = ref("Plazo Fijo")
const montoPlazoFijo = ref(0)
const plazoPlazoFijo = ref(0)
const interesPlazoFijo = ref(0)
const montoExtra = ref(0) // Sigue siendo reactivo para el <small>
const montoDescontar = ref(0)
const resultadosTabla = ref([])
const tablaRef = ref(null)
//FCI
const montoFCI = ref(0)
const plazoFCI = ref(0)
const interesFCI = ref(0)
const resultadosTablaFCI = ref([])
const tablaFCIRef = ref(null)
// Snapshot para el resumen final
const datosCalculados = ref({
  montoInicial: 0,
  plazo: 0,
  totalIntereses: 0,
  totalInvertidoExtra: 0
})
const datosCalculadosFCI = ref({
  montoInicial: 0,
  plazo: 0,
  totalIntereses: 0
})

const formatear = (valor) => {
  return new Intl.NumberFormat('es-AR').format(valor)
}
//Formatear inputs
const formatearInput = (e) => {
  let val = e.target.value.replace(/\D/g, "")
  montoPlazoFijo.value = val ? parseInt(val) : 0
}
const formatearInputExtra = (e) => {
  let val = e.target.value.replace(/\D/g, "")
  montoExtra.value = val ? parseInt(val) : 0
}
const formatearInputDescontar = (e) => {
  let val = e.target.value.replace(/\D/g, "")
  montoDescontar.value = val ? parseInt(val) : 0
}
const formatearInputFCI = (e) => {
  let val = e.target.value.replace(/\D/g, "")
  montoFCI.value = val ? parseInt(val) : 0
}

const calcularPlazoFijo = async () => {
  resultadosTabla.value = []
  let montoActual = parseFloat(montoPlazoFijo.value)
  let acumuladoIntereses = 0
  let acumuladoExtra = 0
  let acumuladoDescontar = 0
  const tasaMensual = (interesPlazoFijo.value / 100) / 12

  for (let i = 0; i < plazoPlazoFijo.value; i++) {
    let interesDelMes = montoActual * tasaMensual
    acumuladoIntereses += interesDelMes
    montoActual += interesDelMes
    montoActual -= montoDescontar.value
    acumuladoDescontar += montoDescontar.value
    montoActual += montoExtra.value
    acumuladoExtra += montoExtra.value


    resultadosTabla.value.push({
      mes: i + 1,
      interes: interesDelMes.toFixed(2),
      total: montoActual.toFixed(2)
    })
  }

  // Guardamos la "foto" del cálculo
  datosCalculados.value = {
    montoInicial: montoPlazoFijo.value,
    montoExtra: montoExtra.value, // <-- Guardamos el valor actual aquí
    plazo: plazoPlazoFijo.value,
    totalIntereses: acumuladoIntereses,
    totalInvertidoExtra: acumuladoExtra,
    totalDescontado: acumuladoDescontar,
    montoDescontar: montoDescontar.value
  }

  await nextTick()
  tablaRef.value?.scrollIntoView({ behavior: 'smooth' })

}

const calcularFCI = async () => {
  resultadosTablaFCI.value = []
  let montoActual = parseFloat(montoFCI.value)
  let acumuladoIntereses = 0

  // Tasa diaria: TNA / 100 / 365 días
  const tasaDiaria = (interesFCI.value / 100) / 365

  for (let i = 1; i <= plazoFCI.value; i++) {
    let interesDelDia = montoActual * tasaDiaria
    acumuladoIntereses += interesDelDia
    montoActual += interesDelDia

    // Para no saturar el celular con una tabla de 300 filas, 
    // guardamos solo hitos (cada 5 días) y el último día.
    if (i % 5 === 0 || i === plazoFCI.value) {
      resultadosTablaFCI.value.push({
        dia: i,
        interes: interesDelDia.toFixed(2),
        total: montoActual.toFixed(2)
      })
    }
  }

  datosCalculadosFCI.value = {
    montoInicial: montoFCI.value,
    plazo: plazoFCI.value,
    totalIntereses: acumuladoIntereses
  }

  await nextTick()
  tablaFCIRef.value?.scrollIntoView({ behavior: 'smooth' })
}

// 5. PROPIEDADES COMPUTADAS (¡Aquí afuera para que el HTML las vea!)
const ambosCalculados = computed(() => {
  return resultadosTabla.value.length > 0 && resultadosTablaFCI.value.length > 0
})

const diferencia = computed(() => {
  return Math.abs(datosCalculados.value.totalIntereses - datosCalculadosFCI.value.totalIntereses)
})

const ganador = computed(() => {
  return datosCalculados.value.totalIntereses > datosCalculadosFCI.value.totalIntereses
    ? 'Plazo Fijo'
    : 'FCI'
})

const porcentajePF = computed(() => {
  if (!ambosCalculados.value) return 0
  const max = Math.max(datosCalculados.value.totalIntereses, datosCalculadosFCI.value.totalIntereses)
  return (datosCalculados.value.totalIntereses / max) * 100
})

const porcentajeFCI = computed(() => {
  if (!ambosCalculados.value) return 0
  const max = Math.max(datosCalculados.value.totalIntereses, datosCalculadosFCI.value.totalIntereses)
  return (datosCalculadosFCI.value.totalIntereses / max) * 100
})

const montoFinalTotal = computed(() => {
  return datosCalculados.value.montoInicial +
    datosCalculados.value.totalIntereses +
    datosCalculados.value.totalInvertidoExtra -
    datosCalculados.value.totalDescontado
})

const montoFinalFCI = computed(() => {
  return datosCalculadosFCI.value.montoInicial + datosCalculadosFCI.value.totalIntereses
})


</script>

<template>
  <hr>
  <br>
  <section class="containerBtns">
    <input type="button" value="Plazo Fijo" @click="opcionSeleccionada = 'Plazo Fijo'"
      :class="opcionSeleccionada === 'Plazo Fijo' ? 'colorActive' : 'colorDefault'">
    <input type="button" value="FCI" @click="opcionSeleccionada = 'FCI'"
      :class="opcionSeleccionada === 'FCI' ? 'colorActive' : 'colorDefault'">
  </section>

  <section v-if="opcionSeleccionada" class="containerTitles text-center mt-4">
    <p class="h3">Has seleccionado: <b>{{ opcionSeleccionada }}</b></p>
  </section>

  <!-- Seccion Plazo Fijo-->
  <section v-if="opcionSeleccionada === 'Plazo Fijo'" class="containerInputs text-center mt-4">
    <label>Monto:</label>
    <div class="item">
      <i class="bi bi-currency-dollar"></i>
      <input type="text" inputmode="numeric" placeholder="Ingrese el monto" :value="formatear(montoPlazoFijo)" @input="formatearInput">
    </div>

    <label>Plazo (Meses):</label>
    <div class="item">
      <i class="bi bi-calendar"></i>
      <input type="number" v-model.number="plazoPlazoFijo">
    </div>

    <label>Interés (Anual %):</label>
    <div class="item">
      <i class="bi bi-percent"></i>
      <input type="number" v-model.number="interesPlazoFijo">
    </div>

    <label>Monto Extra (Al finalizar el plazo):</label>
    <div class="item">
      <i class="bi bi-currency-dollar"></i>
      <input type="text" inputmode="numeric" placeholder="Ingrese el monto extra" :value="formatear(montoExtra)"
        @input="formatearInputExtra">
    </div>

    <label>Monto a Descontar (Al finalizar el plazo):</label>
    <div class="item">
      <i class="bi bi-currency-dollar"></i>
      <input type="text" inputmode="numeric" placeholder="Ingrese el monto a descontar" :value="formatear(montoDescontar)"
        @input="formatearInputDescontar">
    </div>

    <button type="button" @click="calcularPlazoFijo" class="colorBtnPrimary">Calcular</button>
  </section>

  <!--Seccion FCI-->
  <section v-if="opcionSeleccionada === 'FCI'" class="containerInputs text-center mt-4">
    <label>Monto:</label>
    <div class="item">
      <i class="bi bi-currency-dollar"></i>
      <input type="text" inputmode="numeric" placeholder="Ingrese el monto" :value="formatear(montoFCI)" @input="formatearInputFCI">
    </div>

    <label>Plazo (Días):</label>
    <div class="item">
      <i class="bi bi-calendar"></i>
      <input type="number" v-model.number="plazoFCI" placeholder="Ej: 30">
    </div>

    <label>Interés Estimado (Anual %):</label>
    <div class="item">
      <i class="bi bi-percent"></i>
      <input type="number" v-model.number="interesFCI" placeholder="Ej: 80">
    </div>

    <button type="button" @click="calcularFCI" class="colorBtnPrimary">Calcular FCI</button>
  </section>

  <!--Graficos de comparacion-->
  <section v-if="ambosCalculados" class="containerCompare mt-5 px-3">
    <div class="card-ios">
      <h3 class="title-ios">Comparativa de Rendimientos</h3>
      <p class="subtitle-ios text-center">
        El <strong>{{ ganador }}</strong> te rinde <span class="text-success">$ {{ formatear(diferencia.toFixed(2)) }}</span> más.
      </p>

      <div class="chart-container mt-4">
        <div class="chart-item">
          <div class="d-flex justify-content-between mb-1">
            <span class="label-chart">Plazo Fijo</span>
            <span class="value-chart">$ {{ formatear(datosCalculados.totalIntereses.toFixed(2)) }}</span>
          </div>
          <div class="progress-ios">
            <div class="progress-bar-ios pf-color" :style="{ width: porcentajePF + '%' }"></div>
          </div>
        </div>

        <div class="chart-item mt-3">
          <div class="d-flex justify-content-between mb-1">
            <span class="label-chart">FCI</span>
            <span class="value-chart">$ {{ formatear(datosCalculadosFCI.totalIntereses.toFixed(2)) }}</span>
          </div>
          <div class="progress-ios">
            <div class="progress-bar-ios fci-color" :style="{ width: porcentajeFCI + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Resultado Plazo Fijo -->
  <section v-if="opcionSeleccionada === 'Plazo Fijo' && resultadosTabla.length > 0" ref="tablaRef" class="mt-4">
    <div class="containerTable">
      <h4 class="text-primary">Evolución Mensual (Plazo Fijo)</h4>
      <table class="table">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Interés Ganado</th>
            <th>{{ datosCalculados.montoDescontar > 0 ? 'Subtotal Restante' : 'Subtotal Acumulado' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in resultadosTabla" :key="index" :class="item.mes % 12 === 0 ? 'color-year' : ''">
            <td>{{ item.mes }}</td>
            <td>$ {{ formatear(item.interes) }}</td>
            <td>
              <small v-if="index < datosCalculados.plazo && datosCalculados.montoExtra > 0" class="text-Extra">
                +${{ formatear(datosCalculados.montoExtra) }}
              </small>
              $ {{ formatear(item.total) }}
              <small v-if="datosCalculados.montoDescontar > 0" class="text-Descontar">
                -${{ formatear(datosCalculados.montoDescontar) }}
              </small>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="containerTotal alert mt-3">
        <div class="subContainerTotal">
          <p>Intereses:</p>
          <p>$ {{ formatear(datosCalculados.totalIntereses.toFixed(2)) }}</p>
        </div>
        <div class="subContainerTotal">
          <p>Monto Final:</p>
          <p>$ {{ formatear(montoFinalTotal.toFixed(2)) }}</p>
        </div>
      </div>
    </div>

    <div class="containerTotalDetails alert alert-info mt-3 text-start">
      <h5 class="border-bottom pb-2">Resumen de la Inversión</h5>
      <div class="d-flex justify-content-between">
        <span>Capital Inicial:</span>
        <strong>$ {{ formatear(datosCalculados.montoInicial.toFixed(2)) }}</strong>
      </div>

      <div v-if="datosCalculados.totalInvertidoExtra > 0" class="d-flex justify-content-between text-success">
        <span>Total Aportes Extra:</span>
        <strong>+ $ {{ formatear(datosCalculados.totalInvertidoExtra.toFixed(2)) }}</strong>
      </div>

      <div v-if="datosCalculados.totalDescontado > 0" class="d-flex justify-content-between text-danger">
        <span>Total Descontado:</span>
        <strong>- $ {{ formatear(datosCalculados.totalDescontado.toFixed(2)) }}</strong>
      </div>

      <div v-if="datosCalculados.totalIntereses > 0" class="d-flex justify-content-between text-success">
        <span>
          <span>
            <span>Intereses Ganados</span>
            <br>
            <span>(Ganancia Pura):</span>
          </span>
        </span>
        <strong>+ $ {{ formatear(datosCalculados.totalIntereses.toFixed(2)) }}</strong>
      </div>
      <div v-if="datosCalculados.totalIntereses < 0" class="d-flex justify-content-between text-danger">
        <span>Intereses Perdidos:</span>
        <strong>- $ {{ formatear(datosCalculados.totalIntereses.toFixed(2)) }}</strong>
      </div>
      <hr>

      <div v-if="datosCalculados.totalInvertidoExtra > 0" class="d-flex justify-content-between">
        <span>
          <span>Monto Final</span>
          <br>
          <span>(Sin aportes extra):</span>
        </span>
        <strong>$ {{ formatear((montoFinalTotal - datosCalculados.totalInvertidoExtra).toFixed(2)) }}</strong>
      </div>

      <div class="d-flex justify-content-between h4 mt-2 p-2 bg-white rounded shadow-sm">
        <span>TOTAL:</span>
        <strong class="text-primary">$ {{ formatear(montoFinalTotal.toFixed(2)) }}</strong>
      </div>

      <p class="small text-muted mt-2">
        * El interés de los Plazos Fijos es constante durante todo el plazo.
      </p>
    </div>
  </section>

  <!-- Resultado FCI -->
  <section v-if="opcionSeleccionada === 'FCI' && resultadosTablaFCI.length > 0" ref="tablaFCIRef" class="mt-4">
    <div class="containerTable">
      <h4 class="text-primary">Evolución Diaria (FCI)</h4>
      <table class="table">
        <thead>
          <tr>
            <th>Día</th>
            <th>Ganancia Hoy</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in resultadosTablaFCI" :key="index">
            <td>Día {{ item.dia }}</td>
            <td class="text-success">+$ {{ formatear(item.interes) }}</td>
            <td>$ {{ formatear(item.total) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="containerTotal alert mt-3">
        <div class="subContainerTotal">
          <p>Intereses:</p>
          <p>$ {{ formatear(datosCalculadosFCI.totalIntereses.toFixed(2)) }}</p>
        </div>
        <div class="subContainerTotal">
          <p>Monto Final:</p>
          <p>$ {{ formatear(montoFinalFCI.toFixed(2)) }}</p>
        </div>
      </div>
    </div>
    <div class="containerTotalDetails alert alert-info mt-3 text-start">
      <h5 class="border-bottom pb-2">Resumen FCI</h5>
      <div class="d-flex justify-content-between">
        <span>Inversión Inicial:</span>
        <strong>$ {{ formatear(datosCalculadosFCI.montoInicial.toFixed(2)) }}</strong>
      </div>
      <div class="d-flex justify-content-between text-success">
        <span>Intereses Ganados ({{ datosCalculadosFCI.plazo }} días):</span>
        <strong>+ $ {{ formatear(datosCalculadosFCI.totalIntereses.toFixed(2)) }}</strong>
      </div>
      <hr>
      <div class="d-flex justify-content-between h4 mt-2 p-2 bg-white rounded shadow-sm">
        <span>TOTAL ESTIMADO:</span>
        <strong class="text-primary">$ {{ formatear(montoFinalFCI.toFixed(2)) }}</strong>
      </div>
      <p class="small text-muted mt-2">
        * El interés de los FCI varía diariamente. Este cálculo es una estimación basada en la TNA ingresada.
      </p>
    </div>
  </section>

</template>

<style>
/* Tus imports están perfectos */
@import './assets/css/main.css';
@import './assets/css/buttons.css';
@import './assets/css/containers.css';
/* Tip: Asegúrate de que el path sea correcto (añadiendo ./) */
</style>