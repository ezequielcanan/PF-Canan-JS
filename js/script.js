function main() {
  setCarrito([]);
  createFilters();
  renderizar();
  /*Boton reset filtros*/
  let inputsFiltros = document.getElementsByClassName("input-filtro");
  let resetFilters = document.getElementById("resetFilters");
  resetFilters.onclick = () => {
    resetearFiltros(inputsFiltros);
  };

  let carritoIcon = document.getElementById("carritoIcon");
  carritoIcon.addEventListener("click", () => {
    renderizarCarrito();
    mostrarOcultar();
  });
}

main();

function renderizar() {
  fetchCarrito().then((data) => {
    let cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = "";
    let pcsRender = data;
    for (let filtro in filtrosAObjeto()) {
      pcsRender = pcsRender.filter((pc) =>
        pc[filtro]
          .toLowerCase()
          .includes(filtrosAObjeto()[filtro].toLowerCase())
      );
    }
    if (!pcsRender.length) {
      cardsContainer.innerHTML = `
      <div class="no-results">
      <h4>No hay resultados disponibles</h4>
      <p>Los parametros de su busqueda no coinciden con ningun producto</p>
      </div>
      `;
    } else {
      pcsRender.forEach((card) => {
        cardsContainer.innerHTML += `
        <div class="card container__tienda__items__cards__card mb-3 col-md-5">
        <img src=${card.pathImage} class="card-img-top" alt="Imagen de pc con la gpu ${card.gpu}">
        <div class="card-body container__tienda__items__cards__card__body">
        <h4 class="card-title">${card.price} USD</h4>
        <p class="card-text">PC armada gamer con ${card.ram} de ram, ${card.ssd}, ${card.cpuDescription} y la gpu RTX ${card.gpu}.</p>
        <button class="btn btn-buy-card" id=${card.id}>Agregar al carrito</button>
        </div>
        </div>
        `;
      });
      let buttonsAgregarAlCarrito = document.querySelectorAll(".btn-buy-card");
      for (const btn of buttonsAgregarAlCarrito) {
        btn.addEventListener("click", ({ target: { id } }) =>
          agregarAlCarrito(id)
        );
      }
    }
  });
}

function renderizarCarrito() {
  let carritoFisico = document.getElementById("carritoFisico");
  let carrito = carritoAObjeto();
  carritoFisico.innerHTML = "";
  if (carrito.length) {
    let total = carrito.reduce((acc, e) => acc + e.cantidad * e.price, 0);
    carrito.forEach((product) => {
      carritoFisico.innerHTML += `
      <div class="carritoProduct">
      <div class="cardCarrito">
      <div class="container-img-carrito">
      <img src=${product.pathImage}>
      </div>
      <div class="container-info-carrito">
      <h5>X${product.cantidad}, $${product.cantidad * product.price}</h5>
      <p>${product.cpu}, ${product.gpu}, ${product.ram} y ${product.ssd}.</p>
      </div>
      </div>
      <i class="fa-solid fa-xmark delete-product" id="delete${product.id}"></i>
      </div>
      `;
    });
    console.log(total);
    carritoFisico.innerHTML += `
    <h5>Total: $${total}</h5>
    <button class="btn btn-primary" id="finalizarCompra">Finalizar Compra</button>
    `;
    let finalizarButton = document.getElementById("finalizarCompra");
    finalizarButton.onclick = () => {
      sweetPorComprar().then((result) => {
        if (result.isConfirmed) {
          simpleSweet(
            "Compra Exitosa",
            "Tu compra fue realizada correctamente, esperamos que le guste.",
            "success"
          );
          setCarrito([]);
          mostrarOcultar();
        }
      });
    };
    let deleteButtons = document.getElementsByClassName("delete-product");
    for (const button of deleteButtons) {
      button.onclick = ({ target: { id } }) => eliminarDelCarrito(id);
    }
  } else {
    carritoFisico.innerHTML = "<h5>No hay nada en el carrito</h5>";
  }
}

function agregarAlCarrito(id) {
  fetchCarrito().then((data) => {
    let producto = data.find((pc) => pc.id == id);
    let carrito = carritoAObjeto();
    let indexProducto = carrito.findIndex((pc) => pc.id == id);
    if (indexProducto != -1) {
      carrito[indexProducto].cantidad++;
    } else {
      producto.cantidad = 1;
      carrito.push(producto);
    }
    setCarrito(carrito);
    if (document.getElementById("carritoFisico").classList.contains("hide")) {
      mostrarOcultar();
    }
    renderizarCarrito();
  });
  // No hago una function para el toast porque lo uso una vez, pero de lo contrario estaria bueno hacerla
  Toastify({
    text: "Agregado al carrito!",
    className: "toastBought",
    duration: 2000,
    offset: {
      y: 75,
    },
    stopOnFocus: false,
  }).showToast();
}

function eliminarDelCarrito(id) {
  let carrito = carritoAObjeto();
  id = id.slice(6);
  let productoIndex = carrito.findIndex((pc) => pc.id == id);
  carrito.splice(productoIndex, 1);
  setCarrito(carrito);
  renderizarCarrito();
}

function createFilters() {
  let filtros = ["cpu", "mother", "ram", "ssd"];
  filtros.forEach((filtro) => {
    let ulFiltro = document
      .getElementsByClassName(`container__tienda__aside__filtro-${filtro}`)[0]
      .getElementsByClassName("container__tienda__aside__filtro__ul");
    let options = [];
    fetchCarrito().then((data) => {
      data.forEach((pc) => {
        if (!options.includes(pc[filtro])) {
          let option = document.createElement("li");
          option.classList.add("container-input");
          option.innerHTML = `<input class="input-filtro" type="radio" name="${filtro}" value="${pc[filtro]}" id="${pc[filtro]}">
          <label class="label-filtro" for="${pc[filtro]}">${pc[filtro]}</label>`;
          options.push(pc[filtro]);
          ulFiltro[0].appendChild(option);

          let inputBtn = document.getElementById(pc[filtro]);
          inputBtn.addEventListener("input", ({ target: { id, name } }) =>
            applyFilter(id, name)
          );
        }
      });
    });
  });
  sessionStorage.setItem("filtros", JSON.stringify({}));
}

function applyFilter(filtro, name) {
  let jsonFiltros = sessionStorage.getItem("filtros");
  let objectFiltros = JSON.parse(jsonFiltros);
  objectFiltros[name] = filtro;
  sessionStorage.setItem("filtros", JSON.stringify(objectFiltros));
  renderizar();
}

function filtrosAObjeto() {
  return JSON.parse(sessionStorage.getItem("filtros"));
}
// decido hacer dos funciones y no una con parametro para que sea mas intuitivo al llamarlas.
function carritoAObjeto() {
  return JSON.parse(localStorage.getItem("carrito"));
}

function resetearFiltros(arr) {
  for (const filtro of arr) {
    filtro.checked = false;
  }
  sessionStorage.setItem("filtros", JSON.stringify({}));
  renderizar();
}

function setCarrito(object) {
  localStorage.setItem("carrito", JSON.stringify(object));
}

function mostrarOcultar() {
  let filtrosContainer = document.getElementById("containerFiltros");
  let carritoFisico = document.getElementById("carritoFisico");
  filtrosContainer.classList.toggle("hide");
  carritoFisico.classList.toggle("hide");
}

function sweetPorComprar() {
  return Swal.fire({
    title: "Confirmar compra",
    text: "Estas aceptando nuestras condiciones",
    icon: "warning",
    showCancelButton: true,
    customClass: {
      confirmButton: "btn-sweet-comprar",
      //cancelButtonColor: '#f10c0c',
    },
    confirmButtonText: "Comprar",
    cancelButtonText: "Cancelar",
  });
}

function simpleSweet(title, text, icon) {
  Swal.fire({
    title,
    text,
    icon,
  });
}

async function fetchCarrito() {
  const urlProducts = "./db.json";
  let result = await fetch(urlProducts);
  let data = await result.json();
  return data;
}
