const services = document.querySelectorAll('.service-card button');
const cartItems = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const generateQuoteButton = document.getElementById('generate-quote');
const generatePdfButton = document.getElementById('generate-pdf');

let cart = [];
let total = 0;

services.forEach(service => {
  service.addEventListener('click', () => {
    const card = service.parentElement;
    const serviceName = card.getAttribute('data-service');
    const servicePrice = parseFloat(card.getAttribute('data-price'));

    const existingService = cart.find(item => item.name === serviceName);

    if (existingService) {
      existingService.quantity++;
      existingService.totalPrice += servicePrice;
    } else {
      cart.push({ name: serviceName, unitPrice: servicePrice, quantity: 1, totalPrice: servicePrice });
    }

    renderCart();
  });
});

function renderCart() {
  cartItems.innerHTML = '';
  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>R$ ${item.unitPrice.toFixed(2)}</td>
      <td>R$ ${item.totalPrice.toFixed(2)}</td>
      <td><button onclick="removeService(${index})" class="btn-remove">Remover</button></td>
    `;
    cartItems.appendChild(row);
  });

  total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  totalPriceElement.textContent = `R$ ${total.toFixed(2)}`;
}

function removeService(index) {
  cart.splice(index, 1);
  renderCart();
}

generateQuoteButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Nenhum serviço foi selecionado.');
  } else {
    modal.style.display = 'flex';
  }
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

generatePdfButton.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text('Orçamento de Serviços', 105, 10, { align: 'center' });

  const tableData = cart.map(item => [
    item.name,
    item.quantity,
    `R$ ${item.unitPrice.toFixed(2)}`,
    `R$ ${item.totalPrice.toFixed(2)}`
  ]);

  doc.autoTable({
    head: [['Serviço', 'Quantidade', 'Valor Unitário (R$)', 'Valor Total (R$)']],
    body: tableData,
    startY: 20
  });

  const totalText = `Total Geral: R$ ${total.toFixed(2)}`;
  doc.text(totalText, 190, doc.previousAutoTable.finalY + 10, { align: 'right' });

  doc.save('orcamento.pdf');
});
