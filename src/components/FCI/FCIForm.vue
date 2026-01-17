<script setup>
import { useLanguage } from '../../assets/js/useLanguage';
import { useFormatters } from '../../composables/useFormatters';

const props = defineProps({
    monto: [Number, String],
    plazo: [Number, String],
    interes: [Number, String]
});

const emit = defineEmits([
    'update:monto',
    'update:plazo',
    'update:interes',
    'calcular'
]);

const { t } = useLanguage();
const { formatearParaInput } = useFormatters();

const handleMontoInput = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    emit('update:monto', val ? parseInt(val) : "");
};
</script>

<template>
    <section class="containerInputs text-center mt-4">
        <label>{{ t('monto') }}</label>
        <div class="item">
            <i class="bi bi-currency-dollar"></i>
            <input type="text" inputmode="numeric" :placeholder="t('placeholderMonto')" maxlength="19" pattern="[0-9]*"
                :value="formatearParaInput(monto)" @input="handleMontoInput">
        </div>
        <div class="item-input-container">
            <div class="subContainerInputs">
                <label>{{ t('plazoDias') }}</label>
                <div class="item">
                    <i class="bi bi-calendar"></i>
                    <input type="number" :value="plazo" @input="$emit('update:plazo', $event.target.value)"
                        :placeholder="t('placeholderEjDias')" maxlength="4" pattern="[0-9]*">
                </div>
            </div>
            <div class="subContainerInputs">
                <label>{{ t('interesAnual') }}</label>
                <div class="item">
                    <i class="bi bi-percent"></i>
                    <input type="number" :value="interes" @input="$emit('update:interes', $event.target.value)"
                        :placeholder="t('placeholderEjInteres')" maxlength="4" pattern="[0-9]*">
                </div>
            </div>
        </div>
        <button type="button" @click="$emit('calcular')" class="colorBtnPrimary">{{ t('calcular') }}</button>
    </section>
</template>
