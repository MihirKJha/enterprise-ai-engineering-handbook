document.addEventListener("DOMContentLoaded", function () {

    /*
     * Create sidebar toggle
     */

    const button = document.createElement("button");

    button.className = "sidebar-toggle";

    button.setAttribute(
        "aria-label",
        "Collapse navigation sidebar"
    );

    button.setAttribute(
        "title",
        "Collapse navigation sidebar"
    );

    button.innerHTML =
        '<span class="sidebar-toggle__icon">‹</span>';

    document.body.appendChild(button);


    /*
     * Toggle sidebar
     */

    button.addEventListener("click", function () {

        const collapsed =
            document.body.classList.toggle(
                "sidebar-collapsed"
            );

        const icon =
            button.querySelector(
                ".sidebar-toggle__icon"
            );


        if (collapsed) {

            icon.textContent = "›";

            button.setAttribute(
                "aria-label",
                "Expand navigation sidebar"
            );

            button.setAttribute(
                "title",
                "Expand navigation sidebar"
            );

        } else {

            icon.textContent = "‹";

            button.setAttribute(
                "aria-label",
                "Collapse navigation sidebar"
            );

            button.setAttribute(
                "title",
                "Collapse navigation sidebar"
            );

        }

    });

});