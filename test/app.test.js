import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!doctype html><body>
    <header id="header-container"></header><section id="hero-container"></section>
    <section id="solutions-carousel-container"></section><section id="need-finder-container"></section>
    <section id="services-container"></section><section id="workflow-container"></section>
    <section id="help-banner-container"></section><section id="cta-container"></section>
    <footer id="footer-container"></footer><div id="toast-container"></div>
</body>`, { url: 'http://localhost' });

globalThis.window = dom.window;
globalThis.document = dom.window.document;
const { AppModel } = await import('../src/models/app-model.js');
const { AppView } = await import('../src/views/app-view.js');
const { AppController } = await import('../src/controllers/app-controller.js');

test('renderiza las secciones principales de la landing', () => {
    AppController.init();
    assert.ok(document.querySelector('#inicio'));
    assert.equal(document.querySelectorAll('[data-banner]').length, AppModel.featuredSolutions.length);
    assert.equal(document.querySelectorAll('#services-container article').length, AppModel.services.length);
});

test('el controlador cambia la solución activa y conserva el borrador', () => {
    document.querySelector('[data-banner="2"]').click();
    assert.equal(AppModel.state.activeBannerIndex, 2);
    assert.match(document.querySelector('#solutions-carousel-container').textContent, /sistema hecho para tu negocio/i);

    const input = document.querySelector('#user-need-input');
    input.value = '<b>Necesito automatizar</b>';
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
    AppView.renderNeedFinder();
    assert.equal(document.querySelector('#user-need-input').value, '<b>Necesito automatizar</b>');
    assert.equal(document.querySelector('#user-need-input b'), null);
});

test('los selectores de solución usan la transición declarada', () => {
    assert.ok(document.querySelector('[data-banner]').classList.contains('solution-card-transition'));
});
