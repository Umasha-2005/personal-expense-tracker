
const form = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const currentBalanceEl = document.getElementById('current-balance');
const filterType = document.getElementById('filter-type');
const searchBox = document.getElementById('search-box');
const clearBtn = document.getElementById('clear-btn');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

document.getElementById('date').valueAsDate = new Date();

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    
    if (!description || isNaN(amount) || amount <= 0 || !category || !date) {
        alert('Please fill in all fields correctly and ensure amount is greater than zero.');
        return;
    }

    const transaction = {
        id: Date.now(),
        type,
        description,
        amount,
        category,
        date
    };

    transactions.push(transaction);
    updateLocalStorage();
    init();
    form.reset();
    document.getElementById('date').valueAsDate = new Date();
    alert('Transaction added successfully!');
});


function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function deleteTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    updateLocalStorage();
    init();
}


function init() {
    transactionList.innerHTML = '';
    
    let totalIncome = 0;
    let totalExpenses = 0;

    const filterValue = filterType.value;
    const searchValue = searchBox.value.toLowerCase();

    const filteredTransactions = transactions.filter(item => {
        const matchesType = (filterValue === 'All') || (item.type === filterValue);
        const matchesSearch = item.description.toLowerCase().includes(searchValue) || item.category.toLowerCase().includes(searchValue);
        return matchesType && matchesSearch;
    });

    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-gray-400">No transactions found.</td></tr>`;
        totalIncomeEl.innerText = `LKR 0.00`;
        totalExpensesEl.innerText = `LKR 0.00`;
        currentBalanceEl.innerText = `LKR 0.00`;
        return;
    }

    filteredTransactions.forEach(item => {
        if (item.type === 'Income') {
            totalIncome += item.amount;
        } else {
            totalExpenses += item.amount;
        }

        const row = document.createElement('tr');
        row.classList.add('border-b', 'border-gray-100', 'hover:bg-gray-50');

        row.innerHTML = `
            <td class="py-3 px-4">${item.date}</td>
            <td class="py-3 px-4">${item.description}</td>
            <td class="py-3 px-4"><span class="px-2 py-1 rounded text-xs font-semibold ${item.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${item.type}</span></td>
            <td class="py-3 px-4">${item.category}</td>
            <td class="py-3 px-4 font-semibold ${item.type === 'Income' ? 'text-green-600' : 'text-red-600'}">
                ${item.type === 'Income' ? '+' : '-'} LKR ${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </td>
            <td class="py-3 px-4">
                <button onclick="deleteTransaction(${item.id})" class="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-xs font-medium transition">Delete</button>
            </td>
        `;
        transactionList.appendChild(row);
    });

    const currentBalance = totalIncome - totalExpenses;

    totalIncomeEl.innerText = `LKR ${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    totalExpensesEl.innerText = `LKR ${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    currentBalanceEl.innerText = `LKR ${currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}
 
clearBtn.addEventListener('click', () => {
    form.reset();
    document.getElementById('date').valueAsDate = new Date();
});

filterType.addEventListener('change', init);
searchBox.addEventListener('input', init);

init();