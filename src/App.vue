<script setup>
import { ref, computed, nextTick } from 'vue'
import { useTheme } from './assets/js/themeHandler'; // Ajusta la ruta según tu carpeta
import { useLanguage } from './assets/js/useLanguage';

const { t, toggleLanguage, currentLocale } = useLanguage();
const { theme, toggleTheme } = useTheme();

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

// Para los textos y resultados (con 2 decimales)
const formatear = (valor) => {
  if (valor === null || valor === undefined || valor === "") return "";
  const locale = currentLocale.value === 'es' ? 'es-AR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
};

// NUEVA: Para los inputs mientras se escribe (SIN decimales)
const formatearParaInput = (valor) => {
  if (!valor && valor !== 0) return "";
  const locale = currentLocale.value === 'es' ? 'es-AR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0
  }).format(valor);
};

// Modificación de los handlers de input para permitir borrar
const formatearInputGenerico = (e, refVar) => {
  let val = e.target.value.replace(/\D/g, ""); // Solo números
  refVar.value = val ? parseInt(val) : ""; // Si borra todo, dejamos string vacío
}
// Actualiza tus funciones existentes llamando a la genérica
const formatearInput = (e) => formatearInputGenerico(e, montoPlazoFijo)
const formatearInputExtra = (e) => formatearInputGenerico(e, montoExtra)
const formatearInputDescontar = (e) => formatearInputGenerico(e, montoDescontar)
const formatearInputFCI = (e) => formatearInputGenerico(e, montoFCI)

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
  <section class="containerBtns">
    <button @click="toggleTheme" class="theme-btn">
      {{ theme === 'light' ? t('modoOscuro') : t('modoClaro') }}
    </button>
    <button @click="toggleLanguage" class="theme-btn btn-lang">
      {{ t('bandera') }}
      <span>{{ currentLocale === 'es' ? 'ES' : 'EN' }}</span>
    </button>
  </section>
  <hr>
  <br>
  <section class="containerBtns">
    <div class="subContainerBtns">
      <input type="button" :value="t('plazoFijo')" @click="opcionSeleccionada = 'Plazo Fijo'"
        :class="opcionSeleccionada === 'Plazo Fijo' ? 'colorActive' : 'colorDefault'">
      <input type="button" :value="t('fci')" @click="opcionSeleccionada = 'FCI'"
        :class="opcionSeleccionada === 'FCI' ? 'colorActive' : 'colorDefault'">
    </div>
  </section>

  <!-- Seccion Plazo Fijo-->
  <section v-if="opcionSeleccionada === 'Plazo Fijo'" class="containerInputs text-center mt-4">
    <label>{{ t('monto') }}</label>
    <div class="item">
      <i class="bi bi-currency-dollar"></i>
      <input type="text" inputmode="numeric" :placeholder="t('placeholderMonto')"
        :value="formatearParaInput(montoPlazoFijo)" @input="formatearInput">
    </div>
    <div class="item-input-container">
      <div class="subContainerInputs">
        <label>{{ t('plazo') }}</label>
        <div class="item">
          <i class="bi bi-calendar"></i>
          <input type="number" :placeholder="t('placeholderEjMeses')" v-model.number="plazoPlazoFijo">
        </div>
      </div>
      <div class="subContainerInputs">
        <label>{{ t('interesAnual') }}</label>
        <div class="item">
          <i class="bi bi-percent"></i>
          <input type="number" :placeholder="t('placeholderEjInteres')" v-model.number="interesPlazoFijo">
        </div>
      </div>
    </div>
    <label>{{ t('montoExtra') }}</label>
    <div class="item">
      <i class="bi bi-currency-dollar"></i>
      <input type="text" inputmode="numeric" :placeholder="t('placeholderExtra')"
        :value="formatearParaInput(montoExtra)" @input="formatearInputExtra">
    </div>

    <label>{{ t('montoDescontar') }}</label>
    <div class="item">
      <i class="bi bi-currency-dollar"></i>
      <input type="text" inputmode="numeric" :placeholder="t('placeholderDescontar')"
        :value="formatearParaInput(montoDescontar)" @input="formatearInputDescontar">
    </div>

    <button type="button" @click="calcularPlazoFijo" class="colorBtnPrimary">{{ t('calcular') }}</button>
  </section>

  <!--Seccion FCI-->
  <section v-if="opcionSeleccionada === 'FCI'" class="containerInputs text-center mt-4">
    <label>{{ t('monto') }}</label>
    <div class="item">
      <i class="bi bi-currency-dollar"></i>
      <input type="text" inputmode="numeric" :placeholder="t('placeholderMonto')" :value="formatearParaInput(montoFCI)"
        @input="formatearInputFCI">
    </div>
    <div class="item-input-container">
      <div class="subContainerInputs">
        <label>{{ t('plazoDias') }}</label>
        <div class="item">
          <i class="bi bi-calendar"></i>
          <input type="number" v-model.number="plazoFCI" :placeholder="t('placeholderEjDias')">
        </div>
      </div>
      <div class="subContainerInputs">
        <label>{{ t('interesAnual') }}</label>
        <div class="item">
          <i class="bi bi-percent"></i>
          <input type="number" v-model.number="interesFCI" :placeholder="t('placeholderEjInteres')">
        </div>
      </div>
    </div>
    <button type="button" @click="calcularFCI" class="colorBtnPrimary">{{ t('calcular') }}</button>
  </section>

  <!--Graficos de comparacion-->
  <section v-if="ambosCalculados" class="containerCompare mt-5 px-3">
    <div class="card-ios">
      <h3 class="title-ios">{{ t('comparativa') }}</h3>
      <p class="subtitle-ios text-center">
        {{ t('el') }} <strong>{{ ganador === 'Plazo Fijo' ? t('plazoFijo') : t('fci') }}</strong>
        {{ t('teRinde') }}
        <span class="text-success">$ {{ formatear(diferencia) }}</span>
        {{ t('mas') }}
      </p>

      <div class="chart-container mt-4">
        <div class="chart-item">
          <div class="d-flex justify-content-between mb-1">
            <span class="label-chart">{{ t('plazoFijo') }}</span>
            <span class="value-chart">$ {{ formatear(datosCalculados.totalIntereses.toFixed(2)) }}</span>
          </div>
          <div class="progress-ios">
            <div class="progress-bar-ios pf-color" :style="{ width: porcentajePF + '%' }"></div>
          </div>
        </div>

        <div class="chart-item mt-3">
          <div class="d-flex justify-content-between mb-1">
            <span class="label-chart">{{ t('fci') }}</span>
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
      <h4 class="title-ios">{{ t('evolucionMensual') }}</h4>
      <table class="table" id="table-color">
        <thead>
          <tr>
            <th>{{ t('mes') }}</th>
            <th>{{ t('interesGanado') }}</th>
            <th>{{ datosCalculados.montoDescontar > 0 ? t('subtotalRestante') : t('subtotalAcumulado') }}</th>
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
          <p>{{ t('intereses') }}</p>
          <p>$ {{ formatear(datosCalculados.totalIntereses.toFixed(2)) }}</p>
        </div>
        <div class="subContainerTotal">
          <p>{{ t('montoFinal') }}</p>
          <p>$ {{ formatear(montoFinalTotal.toFixed(2)) }}</p>
        </div>
      </div>
    </div>

    <div class="containerTotalDetails alert mt-3 text-start">
      <h5 class="border-bottom pb-2">{{ t('resumen') }}</h5>
      <div class="d-flex justify-content-between">
        <span>{{ t('capitalInicial') }}</span>
        <strong>$ {{ formatear(datosCalculados.montoInicial.toFixed(2)) }}</strong>
      </div>

      <div v-if="datosCalculados.totalInvertidoExtra > 0" class="d-flex justify-content-between text-success">
        <span>{{ t('totalAportes') }}</span>
        <strong>+ $ {{ formatear(datosCalculados.totalInvertidoExtra.toFixed(2)) }}</strong>
      </div>

      <div v-if="datosCalculados.totalDescontado > 0" class="d-flex justify-content-between text-danger">
        <span>{{ t('totalDescontado') }}</span>
        <strong>- $ {{ formatear(datosCalculados.totalDescontado.toFixed(2)) }}</strong>
      </div>

      <div v-if="datosCalculados.totalIntereses > 0" class="d-flex justify-content-between text-success">
        <span>
          <span>
            <span>{{ t('gananciaPura1') }}</span>
            <br>
            <span>{{ t('gananciaPura2') }}</span>
          </span>
        </span>
        <strong>+ $ {{ formatear(datosCalculados.totalIntereses.toFixed(2)) }}</strong>
      </div>
      <div v-if="datosCalculados.totalIntereses < 0" class="d-flex justify-content-between text-danger">
        <span>{{ t('interesesPerdidos') }}</span>
        <strong>- $ {{ formatear(datosCalculados.totalIntereses.toFixed(2)) }}</strong>
      </div>
      <hr>

      <div v-if="datosCalculados.totalInvertidoExtra > 0" class="d-flex justify-content-between">
        <span>
          <span>{{ t('montoSinAportes1') }}</span>
          <br>
          <span>{{ t('montoSinAportes2') }}</span>
        </span>
        <strong>$ {{ formatear((montoFinalTotal - datosCalculados.totalInvertidoExtra).toFixed(2)) }}</strong>
      </div>

      <div class="containerTotalResumen d-flex justify-content-between h4 mt-2 p-2 rounded shadow-sm">
        <span>{{ t('total') }}</span>
        <strong class="text-primary">$ {{ formatear(montoFinalTotal.toFixed(2)) }}</strong>
      </div>

      <p class="small mt-2">
        {{ t('nota1') }}
      </p>
    </div>
  </section>

  <!-- Resultado FCI -->
  <section v-if="opcionSeleccionada === 'FCI' && resultadosTablaFCI.length > 0" ref="tablaFCIRef" class="mt-4">
    <div class="containerTable">
      <h4 class="title-ios">{{ t('evolucionDiaria') }}</h4>
      <table class="table" id="table-color">
        <thead>
          <tr>
            <th>{{ t('dia') }}</th>
            <th>{{ t('gananciaHoy') }}</th>
            <th>{{ t('subtotalAcumulado') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in resultadosTablaFCI" :key="index">
            <td>{{ item.dia }}</td>
            <td class="text-success">+$ {{ formatear(item.interes) }}</td>
            <td>$ {{ formatear(item.total) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="containerTotal alert mt-3">
        <div class="subContainerTotal">
          <p>{{ t('intereses') }}</p>
          <p>$ {{ formatear(datosCalculadosFCI.totalIntereses.toFixed(2)) }}</p>
        </div>
        <div class="subContainerTotal">
          <p>{{ t('montoFinal') }}</p>
          <p>$ {{ formatear(montoFinalFCI.toFixed(2)) }}</p>
        </div>
      </div>
    </div>
    <div class="containerTotalDetails alert mt-3 text-start">
      <h5 class="border-bottom pb-2">Resumen FCI</h5>
      <div class="d-flex justify-content-between">
        <span>{{ t('capitalInicial') }}</span>
        <strong>$ {{ formatear(datosCalculadosFCI.montoInicial.toFixed(2)) }}</strong>
      </div>
      <div class="d-flex justify-content-between text-success">
        <span>{{ t('interesesGanadosConPlazo') }} ({{ datosCalculadosFCI.plazo }} {{ t('dias') }}):</span>
        <strong>+ $ {{ formatear(datosCalculadosFCI.totalIntereses) }}</strong>
      </div>
      <hr>
      <div class="d-flex justify-content-between h4 mt-2 p-2 rounded shadow-sm">
        <span>{{ t('total') }}</span>
        <strong class="text-primary">$ {{ formatear(montoFinalFCI.toFixed(2)) }}</strong>
      </div>
      <p class="small mt-2">
        {{ t('notaFci') }}
      </p>
    </div>
  </section>

</template>