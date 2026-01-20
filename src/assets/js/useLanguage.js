import { ref } from 'vue';

// 1. Intentar cargar el idioma guardado, si no, usar español por defecto
const savedLanguage = localStorage.getItem('user-lang') || 'es';
const currentLocale = ref(savedLanguage);

const translations = {
    es: {
        titulo: 'Calculadora de Ganancias',
        calcular: 'Calcular',
        limpiar: 'Limpiar Todo',
        bandera: '🇪🇸',
        monto: "Monto:",
        plazo: "Plazo (Meses):",
        interesAnual: "Interés (Anual %):",
        montoExtra: "Monto Extra (Al finalizar el mes):",
        montoDescontar: "Monto a Descontar (Al finalizar el mes):",
        evolucionMensual: "Evolución Mensual (Plazo Fijo)",
        mes: "Mes",
        interesGanado: "Interés Ganado",
        subtotalRestante: "Subtotal Restante",
        intereses: "Intereses:",
        montoFinal: "Monto Final:",
        resumen: "Resumen de la Inversión",
        capitalInicial: "Capital Inicial:",
        totalAportes: "Total Aportes Extra:",
        totalDescontado: "Total Descontado:",
        gananciaPura1: "Intereses Ganados",
        gananciaPura2: "(Ganancia Pura):",

        montoSinAportes1: "Monto Final",
        montoSinAportes2: "(Sin aportes extra):",
        total: "TOTAL:",
        nota1: "* El interés de los Plazos Fijos es constante durante todo el plazo.",
        notaPlazoFijoBase: "* El cálculo del Plazo Fijo utiliza una base de 365 días y meses de 30 días para una comparación precisa.",
        plazoFijo: "Plazo Fijo",
        fci: "FCI",

        interesesPerdidos: "Intereses Perdidos:",
        subtotalAcumulado: "Subtotal Acumulado",
        plazoDias: "Plazo (Días):",
        comparativa: "Comparativa de Rendimientos",
        evolucionDiaria: "Evolución Diaria (FCI)",
        dia: "Día",
        gananciaHoy: "Ganancia Hoy",
        notaFci: "* El interés de los FCI varía diariamente. Este cálculo es una estimación basada en la TNA ingresada.",

        el: "El",
        teRinde: "te rinde",
        mas: "más.",
        interesesGanadosConPlazo: "Intereses Ganados",
        dias: "días",


        modoOscuro: "Modo Oscuro",
        modoClaro: "Modo Claro",
        placeholderMonto: "Ingrese el monto",
        placeholderEjMeses: "Ej: 2",
        placeholderEjDias: "Ej: 30",
        placeholderEjInteres: "Ej: 20",
        placeholderExtra: "Ingrese el monto extra",
        placeholderDescontar: "Ingrese el monto a descontar",

    },
    en: {
        titulo: 'Profit Calculator',
        plazoFijo: 'Fixed Term',
        fci: 'Mutual Funds',
        calcular: 'Calculate',
        limpiar: 'Clear All',
        bandera: '🇺🇸',
        monto: "Amount:",
        plazo: "Term (Months):",
        interesAnual: "Annual Interest (%):",
        montoExtra: "Extra Amount (End of Month):",
        montoDescontar: "Amount to Deduct (End of Month):",
        evolucionMensual: "Monthly Growth (Fixed Term)",
        mes: "Month",
        interesGanado: "Interest Earned",
        subtotalRestante: "Remaining Subtotal",
        intereses: "Total Interest:",
        montoFinal: "Final Balance:",
        resumen: "Investment Summary",
        capitalInicial: "Initial Capital:",
        totalAportes: "Total Extra Deposits:",
        totalDescontado: "Total Deducted:",
        gananciaPura1: "Interest Earned",
        gananciaPura2: "(Net Profit):",
        montoSinAportes1: "Final Balance",
        montoSinAportes2: "(Without extra deposits):",
        total: "TOTAL:",
        nota1: "* Fixed-term interest remains constant throughout the term.",
        notaPlazoFijoBase: "* Fixed Term calculations use a 365-day base and 30-day months for accurate comparison.",
        plazoFijo: "Fixed Term",
        fci: "Mutual Funds",

        interesesPerdidos: "Lost Interest:",
        subtotalAcumulado: "Accrued Subtotal",
        plazoDias: "Term (Days):",
        comparativa: "Yield Comparison",
        evolucionDiaria: "Daily Growth (Mutual Funds)",
        dia: "Day",
        gananciaHoy: "Today's Profit",
        notaFci: "* Mutual Fund yields fluctuate daily. This calculation is an estimate based on the entered APR.",

        el: "The",
        teRinde: "offers",
        mas: "more returns.",
        interesesGanadosConPlazo: "Interest Earned",
        dias: "days",

        modoOscuro: "Dark Mode",
        modoClaro: "Light Mode",
        placeholderMonto: "Enter amount",
        placeholderEjMeses: "E.g., 2",
        placeholderEjDias: "E.g, 30",
        placeholderEjInteres: "E.g., 20",
        placeholderExtra: "Enter extra amount",
        placeholderDescontar: "Enter amount to deduct",
    }
};

export function useLanguage() {
    const t = (key) => {
        return translations[currentLocale.value][key] || key;
    };

    const toggleLanguage = () => {
        // Cambiamos entre es y en
        currentLocale.value = currentLocale.value === 'es' ? 'en' : 'es';
        // 2. Guardamos la elección para la próxima vez que abra la app
        localStorage.setItem('user-lang', currentLocale.value);
    };

    return { t, toggleLanguage, currentLocale };
}