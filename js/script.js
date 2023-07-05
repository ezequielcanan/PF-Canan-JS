function main() {
  let pcsArr = [
    {
      id: 1,
      gpu: "2060s",
      mother: "Gigabyte",
      cpu: "Intel",
      cpuDescription: "Intel I3-10100F",
      ram: "16gb",
      ssd: "480gb",
      price: 979,
      pathImage: `./multimedia/pc1.png`,
    },
    {
      id: 2,
      gpu: "3070ti",
      mother: "Asus",
      cpu: "Intel",
      cpuDescription: "Intel I7-10700F",
      ram: "16gb",
      ssd: "480gb",
      price: 1189,
      pathImage: `./multimedia/pc2.png`,
    },
    {
      id: 3,
      gpu: "3090ti",
      mother: "Aorus",
      cpu: "Intel",
      cpuDescription: "Intel I9-13900K",
      ram: "32gb",
      ssd: "480gb",
      price: 1239,
      pathImage: `./multimedia/pc3.png`,
    },
    {
      id: 4,
      gpu: "4090ti",
      mother: "Asus",
      cpu: "AMD",
      cpuDescription: "AMD 5600G",
      ram: "32gb",
      ssd: "1000gb",
      price: 1489,
      pathImage: `./multimedia/pc4.jpg`,
    },
  ];
  setCarrito([]);
  createFilters(pcsArr);
  renderizar(pcsArr);
  /*Boton reset filtros*/
  let inputsFiltros = document.getElementsByClassName("input-filtro");
  let resetFilters = document.getElementById("resetFilters");
  resetFilters.onclick = () => {
    resetearFiltros(inputsFiltros, pcsArr);
  };

  let carritoIcon = document.getElementById("carritoIcon");
  carritoIcon.addEventListener("click", () => {
    renderizarCarrito();
    mostrarOcultar();
  });
}

main();

function renderizar(arr) {
  let cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = "";
  let pcsRender = arr;
  for (let filtro in filtrosAObjeto()) {
    pcsRender = pcsRender.filter((pc) =>
      pc[filtro].toLowerCase().includes(filtrosAObjeto()[filtro].toLowerCase())
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
        agregarAlCarrito(id, arr)
      );
    }
  }
}

function renderizarCarrito() {
  let carritoFisico = document.getElementById("carritoFisico");
  let carrito = carritoAObjeto();
  carritoFisico.innerHTML = "";
  if (carrito.length) {
    let total = carrito.reduce((acc, e) => e.cantidad * e.price, 0);
    carrito.forEach((product) => {
      carritoFisico.innerHTML += `
      <div class="carritoProduct">
        <div class="cardCarrito">
          <div class="container-img-carrito">
            <img src=${product.pathImage}>
          </div>
          <div class="container-info-carrito">
            <h5>X${product.cantidad}, $${product.cantidad * product.price}</h5>
            <p>${product.cpu}, ${product.gpu}, ${product.ram} y ${
        product.ssd
      }.</p>
          </div>
        </div>
        <i class="fa-solid fa-xmark delete-product" id="delete${
          product.id
        }"></i>
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
      setCarrito([]);
      mostrarOcultar();
    };
    let deleteButtons = document.getElementsByClassName("delete-product");
    for (const button of deleteButtons) {
      button.onclick = ({ target: { id } }) => eliminarDelCarrito(id);
    }
  } else {
    carritoFisico.innerHTML = "<h5>No hay nada en el carrito</h5>";
  }
}

function agregarAlCarrito(id, arr) {
  let producto = arr.find((pc) => pc.id == id);
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
}

function eliminarDelCarrito(id) {
  let carrito = carritoAObjeto();
  id = id.slice(6);
  let productoIndex = carrito.findIndex((pc) => pc.id == id);
  carrito.splice(productoIndex, 1);
  setCarrito(carrito);
  renderizarCarrito();
}

function createFilters(arr) {
  let filtros = ["cpu", "mother", "ram", "ssd"];
  filtros.forEach((filtro) => {
    let ulFiltro = document
      .getElementsByClassName(`container__tienda__aside__filtro-${filtro}`)[0]
      .getElementsByClassName("container__tienda__aside__filtro__ul");
    let options = [];
    arr.forEach((pc) => {
      if (!options.includes(pc[filtro])) {
        let option = document.createElement("li");
        option.classList.add("container-input");
        option.innerHTML = `<input class="input-filtro" type="radio" name="${filtro}" value="${pc[filtro]}" id="${pc[filtro]}">
        <label class="label-filtro" for="${pc[filtro]}">${pc[filtro]}</label>`;
        options.push(pc[filtro]);
        ulFiltro[0].appendChild(option);

        let inputBtn = document.getElementById(pc[filtro]);
        inputBtn.addEventListener("input", ({ target: { id, name } }) =>
          applyFilter(id, name, arr)
        );
      }
    });
  });
  sessionStorage.setItem("filtros", JSON.stringify({}));
}

function applyFilter(filtro, name, arr) {
  let jsonFiltros = sessionStorage.getItem("filtros");
  let objectFiltros = JSON.parse(jsonFiltros);
  objectFiltros[name] = filtro;
  sessionStorage.setItem("filtros", JSON.stringify(objectFiltros));
  renderizar(arr);
}

function filtrosAObjeto() {
  return JSON.parse(sessionStorage.getItem("filtros"));
}
// decido hacer dos funciones y no una con parametro para que sea mas intuitivo al llamarlas.
function carritoAObjeto() {
  return JSON.parse(sessionStorage.getItem("carrito"));
}

function resetearFiltros(arr1, arr2) {
  for (const filtro of arr1) {
    filtro.checked = false;
  }
  sessionStorage.setItem("filtros", JSON.stringify({}));
  renderizar(arr2);
}

function setCarrito(object) {
  sessionStorage.setItem("carrito", JSON.stringify(object));
}

function mostrarOcultar() {
  let filtrosContainer = document.getElementById("containerFiltros");
  let carritoFisico = document.getElementById("carritoFisico");
  filtrosContainer.classList.toggle("hide");
  carritoFisico.classList.toggle("hide");
}
