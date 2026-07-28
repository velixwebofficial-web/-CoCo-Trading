document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("loginError");

    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (errorBox) {
            errorBox.style.display = "none";
            errorBox.textContent = "";
        }

        try {

            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (errorBox) {
                    errorBox.textContent = data.error || "Login failed.";
                    errorBox.style.display = "block";
                }
                return;
            }

            window.location.href = "dashboard.html";

        } catch (err) {

            if (errorBox) {
                errorBox.textContent = "Could not reach the server. Is it running?";
                errorBox.style.display = "block";
            }

        }

    });

});
