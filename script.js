// Función para cargar la lista de mods desde mods.json
async function loadMods() {
    try {
        const modsResponse = await fetch("mods.json");
        const modsData = await modsResponse.json();
        const modsList = document.getElementById("mods-list");
        modsList.innerHTML = ""; // Limpiar antes de cargar

        if (!modsData || modsData.length === 0) {
            modsList.innerHTML = "<p>No hay mods disponibles.</p>";
            return;
        }

        // Crear lista de mods
        for (const modRef of modsData) {
            try {
                const modResponse = await fetch(modRef.url);
                const modData = await modResponse.json();

                const latestVersion = modData.versions[0];
                const modElement = document.createElement("div");
                modElement.classList.add("mod");
                modElement.innerHTML = `
                    <h3>${modData.name}</h3>
                    <p><strong>Descripción:</strong> ${modData.description}</p>
                    <p><strong>Versión:</strong> ${latestVersion.version}</p>
                    <p><strong>Compatible con Farlands:</strong> ${latestVersion.farlands}</p>
                    <a href="api/mod/download.html?mod=${modData.guid}&version=${latestVersion.version}">Descargar</a>
                `;
                modsList.appendChild(modElement);
            } catch (error) {
                console.error(`Error al cargar el mod desde ${modRef.url}:`, error);
            }
        }
    } catch (error) {
        document.getElementById("mods-list").innerHTML = "<p>Error al cargar los mods.</p>";
    }
}

// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", loadMods);

// Función para procesar la solicitud de descarga
async function handleDownloadRequest() {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const modGuid = urlParams.get("mod");
    const modVersion = urlParams.get("version");

    if (!modGuid || !modVersion) {
        document.body.innerHTML = "<h2>Error: Debes proporcionar 'mod' y 'version' en la URL.</h2>";
        return;
    }

    try {
        // Cargar mods.json
        const modsResponse = await fetch("../../mods.json");
        const modsData = await modsResponse.json();

        // Buscar el mod correspondiente
        const modRef = modsData.find(m => m.guid === modGuid);
        if (!modRef) {
            document.body.innerHTML = `<h2>Error: Mod '${modGuid}' no encontrado.</h2>`;
            return;
        }

        // Cargar el JSON específico del mod
        const modResponse = await fetch(`../../${modRef.url}`);
        const modData = await modResponse.json();

        // Buscar la versión específica
        const versionData = modData.versions.find(v => v.version === modVersion);
        if (!versionData) {
            document.body.innerHTML = `<h2>Error: Versión '${modVersion}' no encontrada para '${modGuid}'.</h2>`;
            return;
        }

        // Redirigir a la URL de descarga
        window.location.href = versionData.url;
    } catch (error) {
        document.body.innerHTML = "<h2>Error al procesar la solicitud.</h2>";
        console.error("Error:", error);
    }
}

// Ejecutar la función de descarga si estamos en la página de descarga
if (window.location.pathname.includes("download.html")) {
    document.addEventListener("DOMContentLoaded", handleDownloadRequest);
}
