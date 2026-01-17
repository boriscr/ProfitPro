import { ref, nextTick } from 'vue';

export function useFCI() {
    const montoFCI = ref(0);
    const plazoFCI = ref(0);
    const interesFCI = ref(0);
    const resultadosTablaFCI = ref([]);
    const tablaFCIRef = ref(null);

    const datosCalculadosFCI = ref({
        montoInicial: 0,
        plazo: 0,
        totalIntereses: 0
    });

    const calcularFCI = async () => {
        resultadosTablaFCI.value = [];
        let montoActual = parseFloat(montoFCI.value) || 0;
        let acumuladoIntereses = 0;

        // Tasa diaria: TNA / 100 / 365 días
        const tasaDiaria = ((interesFCI.value || 0) / 100) / 365;
        const plazo = plazoFCI.value || 0;

        for (let i = 1; i <= plazo; i++) {
            let interesDelDia = montoActual * tasaDiaria;
            acumuladoIntereses += interesDelDia;
            montoActual += interesDelDia;

            // Para no saturar el celular con una tabla de 300 filas, 
            // guardamos solo hitos (cada 5 días) y el último día.
            if (i % 5 === 0 || i === plazo) {
                resultadosTablaFCI.value.push({
                    dia: i,
                    interes: interesDelDia.toFixed(2),
                    total: montoActual.toFixed(2)
                });
            }
        }

        datosCalculadosFCI.value = {
            montoInicial: montoFCI.value || 0,
            plazo: plazo,
            totalIntereses: acumuladoIntereses
        };

        if (tablaFCIRef.value) {
            await nextTick();
            tablaFCIRef.value.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return {
        montoFCI,
        plazoFCI,
        interesFCI,
        resultadosTablaFCI,
        tablaFCIRef,
        datosCalculadosFCI,
        calcularFCI
    };
}
