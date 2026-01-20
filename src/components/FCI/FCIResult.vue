<script setup>
import { useLanguage } from '../../assets/js/useLanguage';
import { useFormatters } from '../../composables/useFormatters';

const props = defineProps({
    resultados: {
        type: Array,
        required: true
    },
    datos: {
        type: Object,
        required: true
    },
    montoFinal: {
        type: Number,
        required: true
    }
});

const { t } = useLanguage();
const { formatear } = useFormatters();
</script>

<template>
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
                <tr v-for="(item, index) in resultados" :key="index">
                    <td>{{ item.dia }}</td>
                    <td class="text-success">+$ {{ formatear(item.interes) }}</td>
                    <td>$ {{ formatear(item.total) }}</td>
                </tr>
            </tbody>
        </table>
        <div class="containerTotal alert mt-3">
            <div class="subContainerTotal">
                <p>{{ t('intereses') }}</p>
                <p>$ {{ formatear(datos.totalIntereses.toFixed(2)) }}</p>
            </div>
            <div class="subContainerTotal">
                <p>{{ t('montoFinal') }}</p>
                <p>$ {{ formatear(montoFinal.toFixed(2)) }}</p>
            </div>
        </div>
    </div>
    <div class="containerTotalDetails alert mt-3 text-start">
        <h5 class="border-bottom pb-2">Resumen FCI</h5>
        <div class="d-flex justify-content-between">
            <span>{{ t('capitalInicial') }}</span>
            <strong>$ {{ formatear(datos.montoInicial.toFixed(2)) }}</strong>
        </div>
        <div class="d-flex justify-content-between text-success">
            <span>{{ t('interesesGanadosConPlazo') }} ({{ datos.plazo }} {{ t('dias') }}):</span>
            <strong>+ $ {{ formatear(datos.totalIntereses) }}</strong>
        </div>
        <hr>
        <div class="d-flex justify-content-between h4 mt-2 p-2 rounded shadow-sm">
            <span>{{ t('total') }}</span>
            <strong class="text-primary">$ {{ formatear(montoFinal.toFixed(2)) }}</strong>
        </div>
        <p class="small mt-2">
            {{ t('notaFci') }}
        </p>
    </div>
</template>
