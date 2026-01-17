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

    const formatearInputGenerico = (e, refVar) => {
        let val = e.target.value.replace(/\D/g, ""); // Solo números
        refVar.value = val ? parseInt(val) : ""; // Si borra todo, dejamos string vacío
    }

    return {
        formatear,
        formatearParaInput,
        formatearInputGenerico
    };
}
