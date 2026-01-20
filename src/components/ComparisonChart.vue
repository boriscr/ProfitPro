<script setup>
import { useLanguage } from '../assets/js/useLanguage';
import { useFormatters } from '../composables/useFormatters';

defineProps({
    ganador: String,
    diferencia: Number,
    datosPF: Object,
    datosFCI: Object,
    porcentajePF: Number,
    porcentajeFCI: Number
});

const { t } = useLanguage();
const { formatear } = useFormatters();
</script>

<template>
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
                    <span class="value-chart">$ {{ formatear(datosPF.totalIntereses.toFixed(2)) }}</span>
                </div>
                <div class="progress-ios">
                    <div class="progress-bar-ios pf-color" :style="{ width: porcentajePF + '%' }"></div>
                </div>
            </div>

            <div class="chart-item mt-3">
                <div class="d-flex justify-content-between mb-1">
                    <span class="label-chart">{{ t('fci') }}</span>
                    <span class="value-chart">$ {{ formatear(datosFCI.totalIntereses.toFixed(2)) }}</span>
                </div>
                <div class="progress-ios">
                    <div class="progress-bar-ios fci-color" :style="{ width: porcentajeFCI + '%' }"></div>
                </div>
            </div>
        </div>
    </div>
</template>
