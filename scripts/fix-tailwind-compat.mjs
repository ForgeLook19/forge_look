import { readFile, writeFile } from 'node:fs/promises';

const stylesheetPath = new URL('../src/styles/tailwind.css', import.meta.url);
const stylesheet = await readFile(stylesheetPath, 'utf8');

const compatibleStylesheet = stylesheet
    .replace(
        '-webkit-text-size-adjust:100%;',
        '-webkit-text-size-adjust:100%;text-size-adjust:100%;'
    )
    .replace(
        '-webkit-appearance:button;background-color:transparent;',
        '-webkit-appearance:button;appearance:button;background-color:transparent;'
    )
    .replace(
        '-webkit-appearance:textfield;outline-offset:-2px',
        '-webkit-appearance:textfield;appearance:textfield;outline-offset:-2px'
    )
    .replace(
        'audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}',
        'audio,canvas,embed,iframe,img,object,svg,video{display:block}'
    );

if (compatibleStylesheet === stylesheet) {
    throw new Error('No se aplicaron las correcciones de compatibilidad de Tailwind.');
}

await writeFile(stylesheetPath, compatibleStylesheet);
