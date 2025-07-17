document.addEventListener('DOMContentLoaded', function () {
  // Greet user if info is stored
  let storedName = localStorage.getItem('userName');
  let storedProduct = localStorage.getItem('productInterest');
  if (storedName && storedProduct) {
    const greetDiv = document.createElement('div');
    greetDiv.className = 'bg-blue-100 text-blue-800 p-3 rounded mb-4 text-center';
    greetDiv.innerText = `Welcome back, ${storedName}! You were interested in ${storedProduct}.`;
    document.body.insertBefore(greetDiv, document.body.firstChild);
  }

  // Geolocation on page load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const geoDiv = document.createElement('div');
      geoDiv.className = 'bg-green-100 text-green-800 p-3 rounded mb-4 text-center';
      geoDiv.innerText = `Your location: Latitude ${position.coords.latitude}, Longitude ${position.coords.longitude}`;
      document.body.insertBefore(geoDiv, document.body.firstChild);
    });
  }
  let allProducts = [];
  let filteredProducts = [];

  async function fetchProducts() {
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      allProducts = data.slice(0, 8);
      filteredProducts = [...allProducts];
      renderProducts(filteredProducts);
    } catch (err) {
      document.getElementById('products').innerHTML = '<div class="col-span-4 text-center text-red-500">Failed to load products.</div>';
    }
  }

  function renderProducts(products) {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = '';
    if (products.length === 0) {
      productsDiv.innerHTML = '<div class="col-span-4 text-center text-gray-500">No products found.</div>';
      return;
    }
    products.forEach(product => {
      productsDiv.innerHTML += `
        <div class="flex flex-col items-center justify-center border p-4 bg-white">
          <img src="${product.image}" alt="${product.title}" class="h-24 object-contain mb-2" />
          <span class="font-semibold text-center">${product.title}</span>
          <span class="text-sm text-gray-500">₹${product.price}</span>
        </div>
      `;
    });
  }

  function filterProducts() {
    const searchValue = document.getElementById('title').value.trim().toLowerCase();
    filteredProducts = allProducts.filter(p => p.title.toLowerCase().includes(searchValue));
    renderProducts(filteredProducts);
  }

  function sortProducts() {
    const sortValue = document.getElementById('sortPrice').value;
    let sorted = [...filteredProducts];
    if (sortValue === 'low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'high') {
      sorted.sort((a, b) => b.price - a.price);
    }
    renderProducts(sorted);
  }

  fetchProducts();
  document.getElementById('title').addEventListener('input', filterProducts);
  document.getElementById('sortPrice').addEventListener('change', sortProducts);
  function getLocation() {
    const locationDisplay = document.getElementById('locationDisplay');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        locationDisplay.innerText = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
      }, function () {
        locationDisplay.innerText = "Unable to retrieve location.";
      });
    } else {
      locationDisplay.innerText = "Geolocation not supported by your browser.";
    }
  }
  window.getLocation = getLocation;

  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (form && formStatus) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('userName').value.trim();
      const product = document.getElementById('productInterest').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      if (!name || !email || !product) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.classList.remove('text-green-600');
        formStatus.classList.add('text-red-600');
        return;
      }
      localStorage.setItem('userName', name);
      localStorage.setItem('productInterest', product);
      formStatus.textContent = "Thank you for contacting us! Your interest is saved.";
      formStatus.classList.remove('text-red-600');
      formStatus.classList.add('text-green-600');
      form.reset();
    });
  }

  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }
});
