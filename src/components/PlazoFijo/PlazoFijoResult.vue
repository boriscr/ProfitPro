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
        <h4 class="title-ios">{{ t('evolucionMensual') }}</h4>
        <table class="table" id="table-color">
            <thead>
                <tr>
                    <th>{{ t('mes') }}</th>
                    <th>{{ t('interesGanado') }}</th>
                    <th>{{ datos.montoDescontar > 0 ? t('subtotalRestante') : t('subtotalAcumulado') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in resultados" :key="index" :class="item.mes % 12 === 0 ? 'color-year' : ''">
                    <td>{{ item.mes }}</td>
                    <td>$ {{ formatear(item.interes) }}</td>
                    <td>
                        <small v-if="index < datos.plazo && datos.montoExtra > 0" class="text-Extra">
                            +${{ formatear(datos.montoExtra) }}
                        </small>
                        $ {{ formatear(item.total) }}
                        <small v-if="datos.montoDescontar > 0" class="text-Descontar">
                            -${{ formatear(datos.montoDescontar) }}
                        </small>
                    </td>
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
        <h5 class="border-bottom pb-2">{{ t('resumen') }}</h5>
        <div class="d-flex justify-content-between">
            <span>{{ t('capitalInicial') }}</span>
            <strong>$ {{ formatear(datos.montoInicial.toFixed(2)) }}</strong>
        </div>

        <div v-if="datos.totalInvertidoExtra > 0" class="d-flex justify-content-between text-success">
            <span>{{ t('totalAportes') }}</span>
            <strong>+ $ {{ formatear(datos.totalInvertidoExtra.toFixed(2)) }}</strong>
        </div>

        <div v-if="datos.totalDescontado > 0" class="d-flex justify-content-between text-danger">
            <span>{{ t('totalDescontado') }}</span>
            <strong>- $ {{ formatear(datos.totalDescontado.toFixed(2)) }}</strong>
        </div>

        <div v-if="datos.totalIntereses > 0" class="d-flex justify-content-between text-success">
            <span>
                <span>
                    <span>{{ t('gananciaPura1') }}</span>
                    <br>
                    <span>{{ t('gananciaPura2') }}</span>
                </span>
            </span>
            <strong>+ $ {{ formatear(datos.totalIntereses.toFixed(2)) }}</strong>
        </div>
        <div v-if="datos.totalIntereses < 0" class="d-flex justify-content-between text-danger">
            <span>{{ t('interesesPerdidos') }}</span>
            <strong>- $ {{ formatear(datos.totalIntereses.toFixed(2)) }}</strong>
        </div>
        <hr>

        <div v-if="datos.totalInvertidoExtra > 0" class="d-flex justify-content-between">
            <span>
                <span>{{ t('montoSinAportes1') }}</span>
                <br>
                <span>{{ t('montoSinAportes2') }}</span>
            </span>
            <strong>$ {{ formatear((montoFinal - datos.totalInvertidoExtra).toFixed(2)) }}</strong>
        </div>

        <div class="containerTotalResumen d-flex justify-content-between h4 mt-2 p-2 rounded shadow-sm">
            <span>{{ t('total') }}</span>
            <strong class="text-primary">$ {{ formatear(montoFinal.toFixed(2)) }}</strong>
        </div>

        <p class="small mt-2">
            {{ t('nota1') }}
        </p>
    </div>
</template>
