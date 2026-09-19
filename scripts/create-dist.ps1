# Genera un paquete estático autocontenido, apto para GitHub Pages y Supabase Storage.
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$output = [System.IO.Path]::GetFullPath((Join-Path $root 'dist'))

# Protección antes de limpiar una salida anterior: solo se permite la carpeta dist
# situada directamente en la raíz del proyecto.
if ((Split-Path -Leaf $output) -ne 'dist' -or (Split-Path -Parent $output) -ne $root) {
    throw 'La ruta de salida no es la carpeta dist esperada.'
}

if (Test-Path -LiteralPath $output) {
    Remove-Item -LiteralPath $output -Recurse -Force
}

New-Item -ItemType Directory -Path $output | Out-Null
Copy-Item -LiteralPath (Join-Path $root 'index.html') -Destination $output
Copy-Item -LiteralPath (Join-Path $root 'robots.txt') -Destination $output
Copy-Item -LiteralPath (Join-Path $root 'sitemap.xml') -Destination $output

# Copia solo los módulos y recursos que utiliza el navegador; no se filtran
# herramientas de desarrollo ni el archivo fuente de compilación de Tailwind.
$sourceRoot = Join-Path $root 'src'
$outputSource = Join-Path $output 'src'
New-Item -ItemType Directory -Path $outputSource | Out-Null
@('controllers', 'models', 'services', 'views', 'vendor') | ForEach-Object {
    Copy-Item -LiteralPath (Join-Path $sourceRoot $_) -Destination $outputSource -Recurse
}
$outputStyles = Join-Path $outputSource 'styles'
New-Item -ItemType Directory -Path $outputStyles | Out-Null
@('app.css', 'tailwind.css') | ForEach-Object {
    Copy-Item -LiteralPath (Join-Path $sourceRoot "styles\$_") -Destination $outputStyles
}
