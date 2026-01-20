<script setup>
import { useLanguage } from '../assets/js/useLanguage';

defineProps(['modelValue']);
defineEmits(['update:modelValue']);

const { t } = useLanguage();
</script>

<template>
    <section class="containerBtns">
        <div class="subContainerBtns">
            <input type="button" :value="t('plazoFijo')" @click="$emit('update:modelValue', 'Plazo Fijo')"
                :class="modelValue === 'Plazo Fijo' ? 'colorActive' : 'colorDefault'">
            <input type="button" :value="t('fci')" @click="$emit('update:modelValue', 'FCI')"
                :class="modelValue === 'FCI' ? 'colorActive' : 'colorDefault'">
        </div>
    </section>
</template>
