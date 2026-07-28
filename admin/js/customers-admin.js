let allCustomers = [];

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
}

function formatMoney(n) {
    return `${Number(n || 0).toFixed(2)} JD`;
}

function formatDate(iso) {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

async function loadCustomers() {
    const tableBody = document.getElementById("customersTableBody");
    try {
        const res = await fetch("/api/admin/customers", { credentials: "include" });
        if (!res.ok) {
            if (res.status === 401) window.location.href = "index.html";
            return;
        }
        allCustomers = await res.json();
        renderTable();
        renderStats();
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="7">Could not load customers. Is the server running?</td></tr>`;
    }
}

function renderTable() {
    const tableBody = document.getElementById("customersTableBody");
    if (allCustomers.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">No customers yet. They'll appear here automatically once orders come in.</td></tr>`;
        return;
    }
    tableBody.innerHTML = allCustomers
        .map(
            (c, i) => `
        <tr>
            <td>${escapeHtml(c.name)}</td>
            <td>${escapeHtml(c.email || "-")}</td>
            <td>${escapeHtml(c.phone || "-")}</td>
            <td>${c.ordersCount}</td>
            <td>${formatMoney(c.totalSpent)}</td>
            <td>${formatDate(c.lastOrderAt)}</td>
            <td><button class="edit-btn" data-view-idx="${i}"><i class="fa-solid fa-eye"></i></button></td>
        </tr>
    `
        )
        .join("");
}

function renderStats() {
    document.getElementById("statCustTotal").textContent = allCustomers.length;
    document.getElementById("statCustOrders").textContent = allCustomers.reduce((s, c) => s + c.ordersCount, 0);
    document.getElementById("statCustRevenue").textContent = formatMoney(
        allCustomers.reduce((s, c) => s + c.totalSpent, 0)
    );
    const now = new Date();
    const newThisMonth = allCustomers.filter((c) => {
        const d = new Date(c.lastOrderAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && c.ordersCount === 1;
    }).length;
    document.getElementById("statCustNewMonth").textContent = newThisMonth;
}

document.getElementById("customersTableBody").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view-idx]");
    if (!btn) return;
    const c = allCustomers[Number(btn.dataset.viewIdx)];
    if (!c) return;
    document.getElementById("custName").textContent = c.name || "-";
    document.getElementById("custEmail").textContent = c.email || "-";
    document.getElementById("custPhone").textContent = c.phone || "-";
    document.getElementById("custCountry").textContent = c.country || "-";
    document.getElementById("custOrdersCount").textContent = c.ordersCount;
    document.getElementById("custTotalSpent").textContent = formatMoney(c.totalSpent);
    document.getElementById("custLastOrder").textContent = formatDate(c.lastOrderAt);
    document.getElementById("customerModal").classList.add("active");
});

loadCustomers();
