<script setup>
import { ref } from 'vue'
import { useLanguage } from './assets/js/useLanguage';
import { usePlazoFijo } from './composables/usePlazoFijo';
import { useFCI } from './composables/useFCI';
import { useComparison } from './composables/useComparison';

import ThemeLanguageToggler from './components/ThemeLanguageToggler.vue';
import InvestmentSelector from './components/InvestmentSelector.vue';
import PlazoFijoForm from './components/PlazoFijo/PlazoFijoForm.vue';
import PlazoFijoResult from './components/PlazoFijo/PlazoFijoResult.vue';
import FCIForm from './components/FCI/FCIForm.vue';
import FCIResult from './components/FCI/FCIResult.vue';
import ComparisonChart from './components/ComparisonChart.vue';

const { t } = useLanguage();

const opcionSeleccionada = ref("Plazo Fijo")

// Init Composables
const {
  montoPlazoFijo,
  plazoPlazoFijo,
  interesPlazoFijo,
  montoExtra,
  montoDescontar,
  resultadosTabla,
  datosCalculados,
  calcularPlazoFijo,
  tablaRef // We need to bind this to the result component for scrolling
} = usePlazoFijo();

const {
  montoFCI,
  plazoFCI,
  interesFCI,
  resultadosTablaFCI,
  datosCalculadosFCI,
  calcularFCI,
  tablaFCIRef
} = useFCI();

// Compare logic depends on the calculated data objects
const {
  ambosCalculados,
  diferencia,
  ganador,
  porcentajePF,
  porcentajeFCI,
  montoFinalTotal,
  montoFinalFCI
} = useComparison(datosCalculados, datosCalculadosFCI);

</script>

<template>
  <ThemeLanguageToggler />
  <hr>
  <br>

  <InvestmentSelector v-model="opcionSeleccionada" />

  <!-- Seccion Plazo Fijo-->
  <section v-if="opcionSeleccionada === 'Plazo Fijo'">
    <PlazoFijoForm v-model:monto="montoPlazoFijo" v-model:plazo="plazoPlazoFijo" v-model:interes="interesPlazoFijo"
      v-model:extra="montoExtra" v-model:descontar="montoDescontar" @calcular="calcularPlazoFijo" />
  </section>

  <!--Seccion FCI-->
  <section v-if="opcionSeleccionada === 'FCI'">
    <FCIForm v-model:monto="montoFCI" v-model:plazo="plazoFCI" v-model:interes="interesFCI" @calcular="calcularFCI" />
  </section>

  <!--Graficos de comparacion-->
  <section v-if="ambosCalculados" class="containerCompare mt-5 px-3">
    <ComparisonChart :ganador="ganador" :diferencia="diferencia" :datosPF="datosCalculados"
      :datosFCI="datosCalculadosFCI" :porcentajePF="porcentajePF" :porcentajeFCI="porcentajeFCI" />
  </section>

  <!-- Resultado Plazo Fijo -->
  <section v-if="opcionSeleccionada === 'Plazo Fijo' && resultadosTabla.length > 0" ref="tablaRef" class="mt-4">
    <PlazoFijoResult :resultados="resultadosTabla" :datos="datosCalculados" :montoFinal="montoFinalTotal" />
  </section>

  <!-- Resultado FCI -->
  <section v-if="opcionSeleccionada === 'FCI' && resultadosTablaFCI.length > 0" ref="tablaFCIRef" class="mt-4">
    <FCIResult :resultados="resultadosTablaFCI" :datos="datosCalculadosFCI" :montoFinal="montoFinalFCI" />
  </section>

</template>