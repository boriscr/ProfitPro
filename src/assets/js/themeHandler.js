// themeHandler.js
import { ref, onMounted } from 'vue';

export function useTheme() {
    const theme = ref('light');

    const setTheme = (newTheme) => {
        theme.value = newTheme;
        // Aplicamos la clase al elemento raíz para que el CSS responda
        document.documentElement.className = newTheme;
        // Guardamos la preferencia
        localStorage.setItem('user-theme', newTheme);
    };

    const toggleTheme = () => {
        const nextTheme = theme.value === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };

    onMounted(() => {
        // Forzamos 'light' por defecto si no hay nada guardado
        const savedTheme = localStorage.getItem('user-theme') || 'light';
        setTheme(savedTheme);
    });

    return { theme, toggleTheme };
}