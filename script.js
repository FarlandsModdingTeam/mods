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
                    <a href="${latestVersion.url}?mod=${modData.guid}&version=${latestVersion.version}">Descargar</a>
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