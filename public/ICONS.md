# Ícones PWA

Os arquivos `icon-192.png` e `icon-512.png` são necessários pro manifest da PWA.

## Gerar os PNGs

Use o SVG base `icon-192.svg` como ponto de partida:

```bash
# Com Inkscape
inkscape icon-192.svg -w 192 -h 192 -o icon-192.png
inkscape icon-192.svg -w 512 -h 512 -o icon-512.png

# Ou com sharp via Node
npx sharp-cli resize 192 192 --input icon-192.svg --output icon-192.png
npx sharp-cli resize 512 512 --input icon-192.svg --output icon-512.png
```

## Em desenvolvimento

O vite-plugin-pwa em dev não registra o SW (normal). O manifest e os ícones
só são validados no build de produção (`npm run build && npm run preview`).
