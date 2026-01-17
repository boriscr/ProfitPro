<script setup>
import { useTheme } from '../assets/js/themeHandler';
import { useLanguage } from '../assets/js/useLanguage';

const { t, toggleLanguage, currentLocale } = useLanguage();
const { theme, toggleTheme } = useTheme();
</script>

<template>
    <section class="containerBtns">
        <button @click="toggleTheme" class="theme-btn">
            {{ theme === 'light' ? t('modoClaro') : t('modoOscuro') }}
        </button>
        <button @click="toggleLanguage" class="theme-btn btn-lang">
            {{ t('bandera') }}
            <span>{{ currentLocale === 'es' ? 'ES' : 'EN' }}</span>
        </button>
    </section>
</template>
