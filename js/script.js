let carrito = [];

const productosArr = [
  { id: 1, nombre: "Pelota", categoria: "Deportes", precio: 1000 },
  { id: 2, nombre: "Remera", categoria: "Ropa", precio: 7000 },
  { id: 3, nombre: "Short", categoria: "Ropa", precio: 4000 },
  { id: 4, nombre: "Raqueta de tenis", categoria: "Deportes", precio: 2000 },
  { id: 5, nombre: "Botines", categoria: "Deportes", precio: 8000 },
  { id: 6, nombre: "Pelota de basquet", categoria: "Deportes", precio: 800 },
  { id: 7, nombre: "Silla", categoria: "Muebles", precio: 5000 },
  { id: 8, nombre: "Mesa", categoria: "Muebles", precio: 15000 },
  { id: 9, nombre: "Escritorio", categoria: "Muebles", precio: 22500 },
];

function menu() {
  let opcion;
  do {
    opcion = Number(
      prompt(
        "Bienvenido al menu principal, elija una opción:\n 0. Cerrar\n 1. Productos\n 2. Carrito de compras \n"
      )
    );
    switch (opcion) {
      case 0:
        return 0;
      case 1:
        productos();
        break;
      case 2:
        carritoOptions();
        break;
      default:
        alert("Opcion no valida");
    }
  } while (opcion < 1 || opcion > 3 || isNaN(opcion));
}

function productos() {
  let opcionProductos;
  let cantidad;

  do {
    opcionProductos = Number(
      prompt(
        " 1. Agregar al carrito\n 2. Filtrar por categoria\n 3. Filtrar por precio menor a:\n 0. Volver al menu principal\n\n" +
          verArrayObjetos(productosArr)
      )
    );
    if (opcionProductos === 0) {
      menu();
    } else if (opcionProductos < 1 || opcionProductos > 3) {
      alert("Tiene que ingresar un numero correcto");
    }
  } while (
    opcionProductos < 1 ||
    opcionProductos > 3 ||
    isNaN(opcionProductos)
  );
  switch (opcionProductos) {
    case 0:
      menu();
    case 1:
      agregar();
      break;
    case 2:
      alert(verArrayObjetos(filtroProductos("categoria")));
      menu();
      break;
    case 3:
      alert(verArrayObjetos(filtroProductos("precio")));
      menu();
      break;
  }
}

function agregar() {
  let producto;
  let exists;
  do {
    producto = Number(
      prompt(
        verArrayObjetos(productosArr) +
          "\nElige el id de un producto para agregarlo al carrito, ingresa su id. 0 para volver"
      )
    );
    exists = productosArr.some((p) => p.id === producto);
    if (producto === 0) {
      menu();
    } else if (!exists) {
      alert("Ingrese un id correcto");
    }
  } while (!exists);
  let product = productosArr.find((e) => e.id === producto);
  let tryProduct = carrito.some((e) => e.id === product.id);
  if (!tryProduct) {
    product.quantity = 1;
    carrito.push(product);
  } else {
    carrito[carrito.indexOf(product)].quantity += 1;
  }
  menu();
}

function filtroProductos(filtro) {
  let optionFiltro;
  let result;
  if (filtro === "categoria") {
    do {
      optionFiltro = prompt(
        "Elegi la categoria de productos: \nDeportes - Ropa - Muebles"
      ).toLowerCase();
      if (
        optionFiltro != "deportes" &&
        optionFiltro != "muebles" &&
        optionFiltro != "ropa"
      ) {
        alert("Opcion no valida");
      }
    } while (
      optionFiltro !== "muebles" &&
      optionFiltro !== "deportes" &&
      optionFiltro != "ropa"
    );
    result = productosArr.filter(
      (p) => p.categoria.toLocaleLowerCase() === optionFiltro
    );
  } else if (filtro === "precio") {
    do {
      optionFiltro = Number(prompt("Filtrar por precio menor a: "));
      if (isNaN(optionFiltro)) {
        alert("Opcion no valida");
      }
    } while (isNaN(optionFiltro));
    result = productosArr.filter((p) => p.precio <= optionFiltro);
  }
  return result;
}

function carritoOptions() {
  let carritoOpcion;
  do {
    carritoOpcion = Number(
      prompt("0. Volver\n1. Ver carrito\n2. Comprar carrito")
    );
    switch (carritoOpcion) {
      case 0:
        menu();
        break;
      case 1:
        alert(verArrayCarrito(carrito));
        break;
      case 2:
        alert(
          "Total: " +
            carrito.reduce((a, b) => a + b.quantity * b.precio, 0) +
            "\n\n" +
            verArrayCarrito(carrito) +
            "\n\nCarrito Comprado!"
        );
        carrito.splice(0);
        menu();
        break;
      default:
        alert("Opcion no valida");
    }
  } while (carritoOpcion != 0 || carritoOpcion != 1 || isNaN(carritoOpcion));
}

//Funciones para ver arrays

function verArrayObjetos(array) {
  let strArray = "ID - Nombre - Precio\n";
  array.forEach((e) => {
    strArray += e.id + "- " + e.nombre + " - $" + e.precio + "\n";
  });
  return strArray;
}

function verArrayCarrito(array) {
  let strArray = "Producto - Precio/u - Subtotal - Cantidad\n";
  array.forEach((e) => {
    strArray +=
      e.nombre +
      " - " +
      e.precio +
      " - " +
      e.precio * e.quantity +
      " -   " +
      e.quantity +
      "\n";
  });
  return strArray;
}
menu();
