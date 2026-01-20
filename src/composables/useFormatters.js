import { useLanguage } from '../assets/js/useLanguage';

export function useFormatters() {
    const { currentLocale } = useLanguage();

    const formatear = (valor) => {
        if (valor === null || valor === undefined || valor === "") return "";
        const locale = currentLocale.value === 'es' ? 'es-AR' : 'en-US';
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor);
    };

    const formatearParaInput = (valor) => {
        if (!valor && valor !== 0) return "";
        const locale = currentLocale.value === 'es' ? 'es-AR' : 'en-US';
        return new Intl.NumberFormat(locale, {
            maximumFractionDigits: 0
        }).format(valor);
    };

    const formatearDecimalParaInput = (valor) => {
        if (!valor && valor !== 0) return "";
        // Si termina en punto/coma o es un decimal incompleto, lo dejamos como está para permitir seguir escribiendo
        if (typeof valor === 'string' && (valor.endsWith('.') || valor.endsWith(','))) {
            return valor;
        }

        const num = parseFloat(valor);
        if (isNaN(num)) return valor;

        const locale = currentLocale.value === 'es' ? 'es-AR' : 'en-US';
        return new Intl.NumberFormat(locale, {
            maximumFractionDigits: 2 // O los que consideres necesarios para interés
        }).format(num);
    };

    const formatearInputGenerico = (e, refVar, isDecimal = false) => {
        let val = e.target.value;
        if (isDecimal) {
            // Permitir números y un punto/coma
            val = val.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
            // Evitar múltiples puntos
            const points = val.split(".");
            if (points.length > 2) {
                val = points[0] + "." + points.slice(1).join("");
            }
            refVar.value = val;
        } else {
            val = val.replace(/\D/g, ""); // Solo números
            refVar.value = val ? parseInt(val) : ""; // Si borra todo, dejamos string vacío
        }
    }

    return {
        formatear,
        formatearParaInput,
        formatearDecimalParaInput,
        formatearInputGenerico
    };
}
