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
     * ============================================================
     * Button positioning
     * ============================================================
     */

    button.style.setProperty(
        "position",
        "fixed",
        "important"
    );

    button.style.setProperty(
        "left",
        "330px",
        "important"
    );

    button.style.setProperty(
        "right",
        "auto",
        "important"
    );

    button.style.setProperty(
        "top",
        "50%",
        "important"
    );

    button.style.setProperty(
        "bottom",
        "auto",
        "important"
    );

    button.style.setProperty(
        "transform",
        "translateY(-50%)",
        "important"
    );

    button.style.setProperty(
        "width",
        "38px",
        "important"
    );

    button.style.setProperty(
        "height",
        "58px",
        "important"
    );

    button.style.setProperty(
        "margin",
        "0",
        "important"
    );

    button.style.setProperty(
        "padding",
        "0",
        "important"
    );

    button.style.setProperty(
        "z-index",
        "9999",
        "important"
    );


    /*
     * ============================================================
     * Toggle sidebar
     * ============================================================
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

            /*
             * Move button to viewport edge
             */

            button.style.setProperty(
                "left",
                "0",
                "important"
            );

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

            /*
             * Move button back to sidebar edge
             */

            button.style.setProperty(
                "left",
                "330px",
                "important"
            );

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