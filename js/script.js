function main() {
  let pcsArr = [
    { id: 1, gpu: "2060s", mother: "Gigabyte", cpu: "Intel", cpuDescription: "Intel I3-10100F", ram: "16gb", ssd: "480gb", price: 979, pathImage: `./multimedia/pc1.png` },
    { id: 2, gpu: "3070ti", mother: "Asus", cpu: "Intel", cpuDescription: "Intel I7-10700F", ram: "16gb", ssd: "480gb", price: 1189, pathImage: `./multimedia/pc2.png` },
    { id: 3, gpu: "3090ti", mother: "Aorus", cpu: "Intel", cpuDescription: "Intel I9-13900K", ram: "32gb", ssd: "480gb", price: 1239, pathImage: `./multimedia/pc3.png` },
    { id: 4, gpu: "4090ti", mother: "Asus", cpu: "AMD", cpuDescription: "AMD 5600G", ram: "32gb", ssd: "1000gb", price: 1489, pathImage: `./multimedia/pc4.jpg` },
  ];
  createFilters(pcsArr)
  renderizar(pcsArr)
  /*Boton reset filtros*/
  let inputsFiltros = document.getElementsByClassName("input-filtro")
  let resetFilters = document.getElementById("resetFilters")
  resetFilters.onclick = () => {
    resetearFiltros(inputsFiltros, pcsArr)
  }
  /*Evento agregar al carrito*/
  let buttonsAgregarAlCarrito = document.querySelectorAll(".btn-buy-card")
  for (const btn of buttonsAgregarAlCarrito) {
    btn.addEventListener("click", ({ target: { id } }) => agregarAlCarrito(id))
  }

}

main()
//let appliedFilters = {}
//let carrito = []

function renderizar(arr) {
  let cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = ""
  let pcsRender = arr
  for (let filtro in filtrosAObjeto()) {
    pcsRender = pcsRender.filter((pc) => pc[filtro].toLowerCase().includes(filtrosAObjeto()[filtro].toLowerCase()))
  }
  pcsRender.forEach((card) => {
    cardsContainer.innerHTML += `<div class="card container__tienda__items__cards__card mb-3 col-md-5">
    <img src=${card.pathImage} class="card-img-top" alt="Imagen de pc con la gpu ${card.gpu}">
    <div class="card-body container__tienda__items__cards__card__body">
    <h4 class="card-title">${card.price} USD</h4>
    <p class="card-text">PC armada gamer con ${card.ram} de ram, ${card.ssd}gb, ${card.cpuDescription} y la gpu RTX ${card.gpu}.</p>
    <button class="btn btn-buy-card" id=${card.id}>Agregar al carrito</button>
    </div>
    </div>`;
  });
}

function agregarAlCarrito(id, arr) {
  let producto = arr.find((pc) => pc.id == id)
  if (carrito.includes(producto)) {
    carrito[carrito.indexOf(producto)].cantidad++
  } else {
    producto.cantidad = 1
    carrito.push(producto)
  }
}

function createFilters(arr) {
  let filtros = ["cpu", "mother", "ram", "ssd"]
  filtros.forEach((filtro) => {
    let ulFiltro = document.getElementsByClassName(`container__tienda__aside__filtro-${filtro}`)[0].getElementsByClassName("container__tienda__aside__filtro__ul")
    let options = []
    arr.forEach((pc) => {
      if (!options.includes(pc[filtro])) {
        let option = document.createElement("li")
        option.classList.add("container-input")
        option.innerHTML = `<input class="input-filtro" type="radio" name="${filtro}" value="${pc[filtro]}" id="${pc[filtro]}">
        <label class="label-filtro" for="${pc[filtro]}">${pc[filtro]}</label>`
        options.push(pc[filtro])
        ulFiltro[0].appendChild(option)

        let inputBtn = document.getElementById(pc[filtro])
        inputBtn.addEventListener("input", ({target:{id, name}}) => applyFilter(id, name, arr))
      }
    })
  })
  sessionStorage.setItem("filtros", JSON.stringify({}))
}

function applyFilter(filtro, name, arr) {
  let jsonFiltros = sessionStorage.getItem("filtros")
  let objectFiltros = JSON.parse(jsonFiltros)
  objectFiltros[name] = filtro
  sessionStorage.setItem("filtros", JSON.stringify(objectFiltros))
  renderizar(arr, filtrosAObjeto())
}

function filtrosAObjeto() {
  return JSON.parse(sessionStorage.getItem("filtros"))
}

function resetearFiltros(arr1,arr2) {
  for (const filtro of arr1) {
    filtro.checked = false
  }
  sessionStorage.setItem("filtros", JSON.stringify({}))
  renderizar(arr2)
}