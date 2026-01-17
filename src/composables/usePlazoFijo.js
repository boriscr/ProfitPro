import { ref, nextTick } from 'vue';

export function usePlazoFijo() {
    const montoPlazoFijo = ref(0);
    const plazoPlazoFijo = ref(0);
    const interesPlazoFijo = ref(0);
    const montoExtra = ref(0);
    const montoDescontar = ref(0);
    const resultadosTabla = ref([]);
    const tablaRef = ref(null);

    const datosCalculados = ref({
        montoInicial: 0,
        plazo: 0,
        totalIntereses: 0,
        totalInvertidoExtra: 0,
        totalDescontado: 0,
        montoDescontar: 0,
        montoExtra: 0
    });

    const calcularPlazoFijo = async () => {
        resultadosTabla.value = [];
        let montoActual = parseFloat(montoPlazoFijo.value) || 0;
        let acumuladoIntereses = 0;
        let acumuladoExtra = 0;
        let acumuladoDescontar = 0;
        const tasaMensual = ((interesPlazoFijo.value || 0) / 100) / 12;

        const plazo = plazoPlazoFijo.value || 0;
        const extra = montoExtra.value || 0;
        const descontar = montoDescontar.value || 0;

        for (let i = 0; i < plazo; i++) {
            let interesDelMes = montoActual * tasaMensual;
            acumuladoIntereses += interesDelMes;
            montoActual += interesDelMes;
            montoActual -= descontar;
            acumuladoDescontar += descontar;
            montoActual += extra;
            acumuladoExtra += extra;

            resultadosTabla.value.push({
                mes: i + 1,
                interes: interesDelMes.toFixed(2),
                total: montoActual.toFixed(2)
            });
        }

        // Guardamos la "foto" del cálculo
        datosCalculados.value = {
            montoInicial: montoPlazoFijo.value || 0,
            montoExtra: extra,
            plazo: plazo,
            totalIntereses: acumuladoIntereses,
            totalInvertidoExtra: acumuladoExtra,
            totalDescontado: acumuladoDescontar,
            montoDescontar: descontar
        };

        if (tablaRef.value) {
            await nextTick();
            tablaRef.value.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return {
        montoPlazoFijo,
        plazoPlazoFijo,
        interesPlazoFijo,
        montoExtra,
        montoDescontar,
        resultadosTabla,
        tablaRef,
        datosCalculados,
        calcularPlazoFijo
    };
}
