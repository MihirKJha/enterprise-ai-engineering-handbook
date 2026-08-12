document.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.querySelector(".md-sidebar--primary");

    if (!sidebar) {
        return;
    }

    const button = document.createElement("button");

    button.className = "sidebar-toggle";
    button.setAttribute("aria-label", "Toggle navigation sidebar");
    button.setAttribute("title", "Toggle navigation sidebar");

    button.innerHTML = "☰";

    document.body.appendChild(button);

    button.addEventListener("click", function () {

        document.body.classList.toggle("sidebar-collapsed");

        const collapsed =
            document.body.classList.contains("sidebar-collapsed");

        button.innerHTML = collapsed ? "›" : "☰";

        button.setAttribute(
            "aria-label",
            collapsed
                ? "Show navigation sidebar"
                : "Hide navigation sidebar"
        );

    });

});