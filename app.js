// Datos mínimos (locales)
const SERVICIOS = [
  { id: 1, nombre: "Revisión y redacción de documentos legales", categoria: "Legal", precio: "$2.000", descripcion: "Documentación legal.", imagen: "img/Legal300x248.png" },
  { id: 2, nombre: "Confección de fichas de costo", categoria: "Comercial", precio: "$500", descripcion: "Fichas de costo profesionales.", imagen: "img/Ficha de costo300x200.jpg" },
  { id: 3, nombre: "Cálculo y llenado de declaración jurada", categoria: "Tributario", precio: "De $500 a $2000", descripcion: "Asesoría tributaria.", imagen: "img/Impuesto.png" },
  { id: 4, nombre: "SERVICIO DE TENEDURÍA DE LIBROS", categoria: "Comercial", precio: "$5.000 Semanal", descripcion: "Gestión contable y comercial.", imagen: "img/Oficina300x200.jpg" }
];

// Explicaciones largas (HTML) para mostrar en el modal
const EXPLICACIONES = {
  4: `
    <ul style="margin-left:18px;line-height:1.5">
      <li><strong>Control y análisis de ingresos, costos, gastos y utilidades.</strong></li>
      <li><strong>Control y análisis de puntos de venta.</strong></li>
      <li><strong>Control y análisis de inventarios.</strong></li>
      <li><strong>Registro de ingresos, gastos y nómina mensual.</strong></li>
      <li><strong>Resumen semanal detallado de la rentabilidad del negocio.</strong></li>
      <li><strong>Gestión comercial:</strong> declaración jurada para mercancías; control de mercancías para la venta; facturación y negociación.</li>
    </ul>
  `
};

// Helper seguro para insertar texto
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}



// Render de tarjetas
function renderizarServicios(lista) {
  const grid = document.getElementById("productosGrid");
  if (!grid) return;
  grid.innerHTML = "";
  if (!lista || lista.length === 0) {
    grid.innerHTML = '<div class="loading"><p>No se encontraron servicios.</p></div>';
    return;
  }
  lista.forEach(serv => {
    const card = document.createElement("article");
    card.className = "producto-card";
    card.innerHTML = `
      <img src="${escapeHtml(serv.imagen)}" alt="${escapeHtml(serv.nombre)}" class="producto-imagen">
      <div class="producto-info">
        <span class="producto-categoria">${escapeHtml(serv.categoria)}</span>
        <h3 class="producto-nombre">${escapeHtml(serv.nombre)}</h3>
        <p class="producto-descripcion">${escapeHtml(serv.descripcion)}</p>
        <div class="producto-footer">
          <div>
            <div class="producto-precio">${escapeHtml(serv.precio)}</div>
          </div>
          <button class="btn-agregar btn-contacto" data-id="${serv.id}">VER INFO</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Conectar botones
  document.querySelectorAll(".btn-contacto").forEach(btn => {
    btn.addEventListener("click", e => {
      abrirModalContactoConServicio(e.currentTarget.getAttribute("data-id"));
    });
  });
}

// Modal
function abrirModalContactoConServicio(id) {
  const servicio = SERVICIOS.find(s => String(s.id) === String(id));
  if (!servicio) return;
  const modal = document.getElementById("modalContactoPromo");
  const body = document.getElementById("modalInfoBody");
  // Usar explicación larga si existe en EXPLICACIONES, si no usar la descripción corta
  const explicacionLarga = EXPLICACIONES[id];
  body.innerHTML = `
    <h4 style="margin-bottom:8px">${escapeHtml(servicio.nombre)}</h4>
    <p><strong>Categoría:</strong> ${escapeHtml(servicio.categoria)}</p>
    <p><strong>Precio:</strong> ${escapeHtml(servicio.precio)}</p>
    <div style="margin-top:10px">
      ${explicacionLarga ? explicacionLarga : `<p>${escapeHtml(servicio.descripcion)}</p>`}
    </div>
  `;
  const waLink = document.getElementById("whatsappLink");
  if (waLink) {
    waLink.href = "https://wa.me/5358755513/?text=" + encodeURIComponent("Hola, me interesa el servicio: " + servicio.nombre);
  }
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}
function cerrarModalPromo() {
  const modal = document.getElementById("modalContactoPromo");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

// Filtrado y búsqueda
let estadoFiltro = { categoria: "todas", textoBusqueda: "" };
function aplicarFiltros() {
  const texto = (estadoFiltro.textoBusqueda || "").toLowerCase();
  const categoria = estadoFiltro.categoria || "todas";
  const filtrados = SERVICIOS.filter(item => {
    const pasaCategoria = categoria === "todas" || item.categoria === categoria;
    const hayTexto = texto.length > 0
      ? (item.nombre || "").toLowerCase().includes(texto) ||
      (item.descripcion || "").toLowerCase().includes(texto) ||
      (item.categoria || "").toLowerCase().includes(texto)
      : true;
    return pasaCategoria && hayTexto;
  });
  renderizarServicios(filtrados);
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderizarServicios(SERVICIOS);

  // filtros
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      estadoFiltro.categoria = btn.getAttribute("data-cat") || "todas";
      aplicarFiltros();
    });
  });

  // Header efecto cristal al hacer scroll
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.style.background = "rgba(10, 26, 47, 0.4)"; // oscuro translúcido
      header.style.backdropFilter = "blur(10px)";
      header.style.webkitBackdropFilter = "blur(10px)";
    } else {
      header.style.background = "#1f2069"; // sólido oscuro
      header.style.backdropFilter = "none";
      header.style.webkitBackdropFilter = "none";
    }
  });

  // búsqueda
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      estadoFiltro.textoBusqueda = searchInput.value.trim().toLowerCase();
      aplicarFiltros();
    });
  }

  // modal close
  const closeBtn = document.getElementById("closeModalPromo");
  const cancelBtn = document.getElementById("cancelModalPromo");
  if (closeBtn) closeBtn.addEventListener("click", cerrarModalPromo);
  if (cancelBtn) cancelBtn.addEventListener("click", cerrarModalPromo);
});
