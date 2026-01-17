<script setup>
import { useLanguage } from '../../assets/js/useLanguage';
import { useFormatters } from '../../composables/useFormatters';

const props = defineProps({
    monto: [Number, String],
    plazo: [Number, String],
    interes: [Number, String],
    extra: [Number, String],
    descontar: [Number, String]
});

const emit = defineEmits([
    'update:monto',
    'update:plazo',
    'update:interes',
    'update:extra',
    'update:descontar',
    'calcular'
]);

const { t } = useLanguage();
const { formatearParaInput, formatearInputGenerico } = useFormatters();

const handleMontoInput = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    emit('update:monto', val ? parseInt(val) : "");
};

const handleExtraInput = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    emit('update:extra', val ? parseInt(val) : "");
};

const handleDescontarInput = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    emit('update:descontar', val ? parseInt(val) : "");
};
</script>

<template>
    <section class="containerInputs text-center mt-4">
        <label>{{ t('monto') }}</label>
        <div class="item">
            <i class="bi bi-currency-dollar"></i>
            <input type="text" inputmode="numeric" :placeholder="t('placeholderMonto')"
                :value="formatearParaInput(monto)" @input="handleMontoInput" maxlength="19" pattern="[0-9]*">
        </div>
        <div class="item-input-container">
            <div class="subContainerInputs">
                <label>{{ t('plazo') }}</label>
                <div class="item">
                    <i class="bi bi-calendar"></i>
                    <input type="number" :placeholder="t('placeholderEjMeses')"
                        :value="plazo" @input="$emit('update:plazo', $event.target.value)">
                </div>
            </div>
            <div class="subContainerInputs">
                <label>{{ t('interesAnual') }}</label>
                <div class="item">
                    <i class="bi bi-percent"></i>
                    <input type="number" :placeholder="t('placeholderEjInteres')"
                        :value="interes" @input="$emit('update:interes', $event.target.value)">
                </div>
            </div>
        </div>
        <label>{{ t('montoExtra') }}</label>
        <div class="item">
            <i class="bi bi-currency-dollar"></i>
            <input type="text" inputmode="numeric" :placeholder="t('placeholderExtra')" maxlength="19" pattern="[0-9]*"
                :value="formatearParaInput(extra)" @input="handleExtraInput">
        </div>

        <label>{{ t('montoDescontar') }}</label>
        <div class="item">
            <i class="bi bi-currency-dollar"></i>
            <input type="text" inputmode="numeric" :placeholder="t('placeholderDescontar')" maxlength="19"
                pattern="[0-9]*" :value="formatearParaInput(descontar)" @input="handleDescontarInput">
        </div>

        <button type="button" @click="$emit('calcular')" class="colorBtnPrimary">{{ t('calcular') }}</button>
    </section>
</template>
