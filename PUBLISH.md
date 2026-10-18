# Publicar como repositorio autónomo en GitHub

Esta carpeta es la **raíz** de un repositorio nuevo, no una subcarpeta de una aplicación.

## GitHub (interfaz)

1. Abre https://github.com/new?name=cognitive-learning-flow
2. Owner: `EmyFox`. Nombre: `cognitive-learning-flow`.
3. Para una primera revisión, elige **Private**; podrás cambiarlo después.
4. **No marques** `Add README`, `.gitignore` ni licencia: ya están incluidos en este paquete.
5. Pulsa `Create repository`.

## Publicar desde Windows PowerShell

Descomprime el ZIP y abre PowerShell dentro de la carpeta `cognitive-learning-flow`.

```powershell
git init -b main
git add .
git commit -m "feat: cognitive learning flow standalone skill v0.1"
git remote add origin https://github.com/EmyFox/cognitive-learning-flow.git
git push -u origin main
```

Necesitas Git instalado y acceso autorizado a GitHub desde tu PC. Si falla el `push` por permisos, autentica tu sesión con la herramienta oficial de GitHub o un gestor de credenciales; no pegues tokens secretos en chats.

## Usarlo en otro proyecto

Desde la carpeta raíz de ese proyecto:

```powershell
git submodule add https://github.com/EmyFox/cognitive-learning-flow.git .agents/skills/cognitive-learning-flow
```

Si el proyecto ignora `.agents/`, usa un subdirectorio que tu agente reconozca (p. ej. `.opencode/skills/cognitive-learning-flow`) o ajusta `.gitignore` cuidadosamente. Para un repositorio privado, quien clone el submódulo necesita permiso de lectura.

También puedes copiar la carpeta a `~/.config/opencode/skills/cognitive-learning-flow/` para uso global en OpenCode.
