/* ==========================================
   SIDEBAR TOGGLE
========================================== */

const sidebar = document.querySelector(".sidebar");
const menuToggle = document.querySelector(".menu-toggle");

if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}

/* ==========================================
   ACTIVE SIDEBAR
========================================== */

const navItems = document.querySelectorAll(".sidebar li");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(i => i.classList.remove("active"));

        item.classList.add("active");

    });

});

/* ==========================================
   MODALS
========================================== */

const openButtons = document.querySelectorAll("[data-modal]");
const closeButtons = document.querySelectorAll(".close-modal");
const modals = document.querySelectorAll(".modal");

openButtons.forEach(button => {

    button.addEventListener("click", () => {

        const target = button.getAttribute("data-modal");

        const modal = document.getElementById(target);

        if(modal){

            modal.classList.add("active");

        }

    });

});

closeButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.closest(".modal").classList.remove("active");

    });

});

window.addEventListener("click",(e)=>{

    modals.forEach(modal=>{

        if(e.target===modal){

            modal.classList.remove("active");

        }

    });

});

/* ==========================================
   SEARCH TABLE
========================================== */

const searchInput = document.querySelector(".search input");

if(searchInput){

    searchInput.addEventListener("keyup",()=>{

        const value = searchInput.value.toLowerCase();

        const rows = document.querySelectorAll(".products-table tbody tr");

        rows.forEach(row=>{

            const text = row.innerText.toLowerCase();

            row.style.display = text.includes(value) ? "" : "none";

        });

    });

}

/* ==========================================
   BUTTON RIPPLE EFFECT
========================================== */

const buttons = document.querySelectorAll("button");

buttons.forEach(button=>{

    button.addEventListener("click",function(e){

        const ripple = document.createElement("span");

        const rect = this.getBoundingClientRect();

        ripple.style.left = (e.clientX-rect.left)+"px";

        ripple.style.top = (e.clientY-rect.top)+"px";

        ripple.className="ripple";

        this.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});
/* ==========================================
   DELETE CONFIRMATION
========================================== */

const deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach(button => {

    button.addEventListener("click", (e) => {

        const confirmed = confirm("Are you sure you want to delete this item?");

        if (!confirmed) {

            e.preventDefault();

        }

    });

});

/* ==========================================
   TOAST NOTIFICATIONS
========================================== */

function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}

/* ==========================================
   FORM VALIDATION
========================================== */

const forms = document.querySelectorAll("form");

forms.forEach(form => {

    form.addEventListener("submit", function (e) {

        let valid = true;

        const requiredInputs = form.querySelectorAll("[required]");

        requiredInputs.forEach(input => {

            if (input.value.trim() === "") {

                valid = false;

                input.style.borderColor = "#e74c3c";

            } else {

                input.style.borderColor = "";

            }

        });

        if (!valid) {

            e.preventDefault();

            showToast("Please fill in all required fields.", "error");

        }

    });

});

/* ==========================================
   SAVE SETTINGS
========================================== */

const saveButtons = document.querySelectorAll(".primary-btn");

saveButtons.forEach(button => {

    if (button.textContent.toLowerCase().includes("save")) {

        button.addEventListener("click", function (e) {

            e.preventDefault();

            showToast("Settings saved successfully.", "success");

        });

    }

});

/* ==========================================
   PAGINATION
========================================== */

const paginationButtons = document.querySelectorAll(".pagination button");

paginationButtons.forEach(button => {

    button.addEventListener("click", () => {

        paginationButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

    });

});

/* ==========================================
   FILTERS
========================================== */

const filterInputs = document.querySelectorAll(".filters input, .filters select");

filterInputs.forEach(input => {

    input.addEventListener("change", () => {

        showToast("Filters applied.", "success");

    });

});
/* ==========================================
   DASHBOARD COUNTERS
========================================== */

const counters = document.querySelectorAll(".card h2");

const animateCounter = (counter) => {

    const text = counter.textContent.replace(/,/g, "").replace("$", "");

    const target = parseFloat(text);

    if (isNaN(target)) return;

    let current = 0;
    const increment = target / 80;

    const update = () => {

        current += increment;

        if (current >= target) {

            if (counter.textContent.includes("$")) {

                counter.textContent =
                    "$" + target.toLocaleString();

            } else {

                counter.textContent =
                    Math.floor(target).toLocaleString();

            }

            return;

        }

        if (counter.textContent.includes("$")) {

            counter.textContent =
                "$" + Math.floor(current).toLocaleString();

        } else {

            counter.textContent =
                Math.floor(current).toLocaleString();

        }

        requestAnimationFrame(update);

    };

    update();

};

const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            animateCounter(entry.target);

            counterObserver.unobserve(entry.target);

        }

    });

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});

/* ==========================================
   EXPORT BUTTON
========================================== */

document.querySelectorAll(".fa-file-export").forEach(icon => {

    icon.closest("button")?.addEventListener("click", () => {

        showToast("Export started...", "success");

    });

});

/* ==========================================
   DARK MODE
========================================== */

const themeButton = document.querySelector("#themeToggle");

if (themeButton) {

    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const mode = document.body.classList.contains("dark-mode")
            ? "enabled"
            : "disabled";

        localStorage.setItem("theme", mode);

    });

}

window.addEventListener("load", () => {

    if (localStorage.getItem("theme") === "enabled") {

        document.body.classList.add("dark-mode");

    }

});

/* ==========================================
   PROGRESS BARS
========================================== */

document.querySelectorAll(".progress span").forEach(bar => {

    const width = bar.dataset.width || "100";

    bar.style.width = "0";

    setTimeout(() => {

        bar.style.transition = "1s";

        bar.style.width = width + "%";

    }, 400);

});

/* ==========================================
   TABLE HOVER EFFECT
========================================== */

document.querySelectorAll(".products-table tbody tr").forEach(row => {

    row.addEventListener("mouseenter", () => {

        row.style.transform = "scale(1.01)";

    });

    row.addEventListener("mouseleave", () => {

        row.style.transform = "scale(1)";

    });

});
/* ==========================================
   PAGE LOADER
========================================== */

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if (loader) {

        setTimeout(() => {

            loader.style.opacity = "0";

            setTimeout(() => {

                loader.remove();

            }, 400);

        }, 500);

    }

});

/* ==========================================
   SCROLL TO TOP
========================================== */

const scrollBtn = document.createElement("button");

scrollBtn.className = "scroll-top";

scrollBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';

document.body.appendChild(scrollBtn);

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        scrollBtn.classList.add("show");

    } else {

        scrollBtn.classList.remove("show");

    }

});

scrollBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

/* ==========================================
   REVEAL ANIMATION
========================================== */

const revealElements = document.querySelectorAll(".panel, .card");

const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("fade-up");

            revealObserver.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.15

});

revealElements.forEach(el => {

    revealObserver.observe(el);

});

/* ==========================================
   AUTO CLOSE ALERTS
========================================== */

document.querySelectorAll(".alert").forEach(alert => {

    setTimeout(() => {

        alert.style.opacity = "0";

        setTimeout(() => {

            alert.remove();

        }, 300);

    }, 4000);

});

/* ==========================================
   HELPER FUNCTIONS
========================================== */

function formatCurrency(value) {

    return "$" + Number(value).toLocaleString();

}

function formatNumber(value) {

    return Number(value).toLocaleString();

}

function randomID() {

    return Math.floor(Math.random() * 100000);

}

/* ==========================================
   INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("WQ Admin Dashboard Loaded Successfully");

    document.querySelectorAll("input").forEach(input => {

        input.setAttribute("autocomplete", "off");

    });

});

/* ==========================================
   KEYBOARD SHORTCUTS
========================================== */

document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.key.toLowerCase() === "s") {

        e.preventDefault();

        showToast("Changes saved successfully.", "success");

    }

    if (e.key === "Escape") {

        document.querySelectorAll(".modal.active").forEach(modal => {

            modal.classList.remove("active");

        });

    }

});

/* ==========================================
   WINDOW RESIZE
========================================== */

window.addEventListener("resize", () => {

    console.log(
        `Window Size: ${window.innerWidth} x ${window.innerHeight}`
    );

});

/* ==========================================
   END OF FILE
========================================== */

console.log("admin.js Loaded");