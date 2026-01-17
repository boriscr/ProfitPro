import { computed } from 'vue';

export function useComparison(datosCalculados, datosCalculadosFCI) {
    const ambosCalculados = computed(() => {
        // Asumimos que si totalIntereses es distinto de 0 o montoInicial es distinto de 0, algo se calculó.
        // O mejor, basarnos en si los arrays de resultados tienen largo, pero aquí recibimos los objetos sumarios.
        // En App.vue original usaba: resultadosTabla.value.length > 0 && resultadosTablaFCI.value.length > 0
        // Pero aquí no tenemos acceso directo a las tablas salvo que las pasemos.
        // Podemos chequear montoInicial > 0 como proxy de que se calculó algo válido, o agregar una flag 'calculado' en los objetos.
        // Por consistencia con los datos pasados:
        return datosCalculados.value.montoInicial > 0 && datosCalculadosFCI.value.montoInicial > 0;
    });

    const diferencia = computed(() => {
        return Math.abs(datosCalculados.value.totalIntereses - datosCalculadosFCI.value.totalIntereses);
    });

    const ganador = computed(() => {
        return datosCalculados.value.totalIntereses > datosCalculadosFCI.value.totalIntereses
            ? 'Plazo Fijo'
            : 'FCI';
    });

    const porcentajePF = computed(() => {
        if (!ambosCalculados.value) return 0;
        const max = Math.max(datosCalculados.value.totalIntereses, datosCalculadosFCI.value.totalIntereses);
        if (max === 0) return 0;
        return (datosCalculados.value.totalIntereses / max) * 100;
    });

    const porcentajeFCI = computed(() => {
        if (!ambosCalculados.value) return 0;
        const max = Math.max(datosCalculados.value.totalIntereses, datosCalculadosFCI.value.totalIntereses);
        if (max === 0) return 0;
        return (datosCalculadosFCI.value.totalIntereses / max) * 100;
    });

    const montoFinalTotal = computed(() => {
        return datosCalculados.value.montoInicial +
            datosCalculados.value.totalIntereses +
            datosCalculados.value.totalInvertidoExtra -
            datosCalculados.value.totalDescontado;
    });

    const montoFinalFCI = computed(() => {
        return datosCalculadosFCI.value.montoInicial + datosCalculadosFCI.value.totalIntereses;
    });

    return {
        ambosCalculados,
        diferencia,
        ganador,
        porcentajePF,
        porcentajeFCI,
        montoFinalTotal,
        montoFinalFCI
    };
}
