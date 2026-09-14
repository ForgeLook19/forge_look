import { AppModel } from '../models/app-model.js';
import { AppView } from '../views/app-view.js';

// La integración con Supabase queda desactivada por defecto para mantener el
// flujo comercial actual de WhatsApp y evitar que un lead se guarde sin una
// decisión explícita del propietario del proyecto.
const ENABLE_SUPABASE_LEADS = false;

/**
 * CONTROLADOR: conecta los eventos de la interfaz con el Modelo y pide a la Vista
 * volver a pintar únicamente los componentes que cambiaron.
 */
export const AppController = {
    init() {
        // Primero se crea el DOM; después se instala una sola delegación de eventos.
        this.renderAll();
        this.setupEventListeners();
    },

    renderAll() {
        AppView.renderHeader();
        AppView.renderHero();
        AppView.renderSolutions();
        AppView.renderNeedFinder();
        AppView.renderServices();
        AppView.renderWorkflow();
        AppView.renderHelpAndCta();
        AppView.renderFooter();
    },

    setupEventListeners() {
        // Delegación: sigue funcionando aunque la Vista reemplace botones con innerHTML.
        document.addEventListener('click', (event) => {
            const menuButton = event.target.closest('#mobile-menu-btn');
            const mobileLink = event.target.closest('.mobile-nav-link');
            const bannerButton = event.target.closest('[data-banner]');

            if (menuButton) {
                AppModel.state.isMenuOpen = !AppModel.state.isMenuOpen;
                AppView.renderHeader();
            }
            if (mobileLink) {
                AppModel.state.isMenuOpen = false;
                AppView.renderHeader();
            }
            if (bannerButton) {
                AppModel.state.activeBannerIndex = Number(bannerButton.dataset.banner);
                AppView.renderSolutions();
            }
            if (event.target.closest('#send-idea-btn')) {
                if (ENABLE_SUPABASE_LEADS && window.__FORGE_LOOK_ENABLE_SUPABASE_LEADS === true) {
                    this.sendIdeaToSupabase();
                }
                this.sendIdeaToWhatsApp();
            }
        });

        // Conserva el borrador en el Modelo incluso si otra acción vuelve a pintar la vista.
        document.addEventListener('input', (event) => {
            if (event.target.matches('#user-need-input')) {
                AppModel.state.userNeedInput = event.target.value;
            }
        });
    },

    async sendIdeaToSupabase() {
        // La integración con Supabase queda deshabilitada por defecto para no
        // guardar leads ni enviar datos desde el navegador sin consentimiento claro.
        if (!ENABLE_SUPABASE_LEADS || window.__FORGE_LOOK_ENABLE_SUPABASE_LEADS !== true) {
            return;
        }

        const input = document.querySelector('#user-need-input');
        const idea = input?.value.trim() || 'Tengo una idea o necesidad para mi negocio.';
        try {
            const { saveLead } = await import('../services/supabase-client.js');
            await saveLead({ idea, whatsappNumber: AppModel.state.whatsappNumber });
        } catch (error) {
            console.error('No se pudo guardar la idea en Supabase:', error);
        }
    },

    sendIdeaToWhatsApp() {
        // Se lee el texto actual antes de construir una URL segura para WhatsApp.
        const input = document.querySelector('#user-need-input');
        const idea = input?.value.trim() || 'Tengo una idea o necesidad para mi negocio.';
        AppModel.state.userNeedInput = idea;
        const message = `Hola, soy cliente de Forge_Look. Tengo esta necesidad:\n\n"${idea}"\n\nMe gustaría saber qué solución podrían ofrecerme.`;
        window.open(`https://wa.me/${AppModel.state.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
};

// Punto de inicio de la aplicación cuando los contenedores HTML ya existen.
document.addEventListener('DOMContentLoaded', () => AppController.init());
