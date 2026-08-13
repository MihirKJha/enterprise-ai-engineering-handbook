document.addEventListener("DOMContentLoaded", function () {

    /*
     * ============================================================
     * CREATE SIDEBAR TOGGLE
     * ============================================================
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
     * FIND MKDOCS PRIMARY SIDEBAR
     * ============================================================
     */

    const sidebar =
        document.querySelector(".md-sidebar--primary");


    /*
     * ============================================================
     * POSITION BUTTON AT ACTUAL SIDEBAR EDGE
     * ============================================================
     */

    function positionToggle() {

        /*
         * If sidebar cannot be found, don't do anything.
         */

        if (!sidebar) {
            return;
        }


        /*
         * If sidebar is collapsed,
         * move button to viewport edge.
         */

        if (
            document.body.classList.contains(
                "sidebar-collapsed"
            )
        ) {

            button.style.left = "0px";

            return;
        }


        /*
         * Get the REAL right edge of the sidebar.
         */

        const sidebarRect =
            sidebar.getBoundingClientRect();


        /*
         * Position button exactly at
         * sidebar's right edge.
         */

        button.style.left =
            `${sidebarRect.right}px`;
    }


    /*
     * ============================================================
     * INITIAL POSITION
     * ============================================================
     */

    positionToggle();


    /*
     * ============================================================
     * KEEP POSITION CORRECT WHEN WINDOW CHANGES
     * ============================================================
     */

    window.addEventListener(
        "resize",
        positionToggle
    );


    /*
     * ============================================================
     * TOGGLE SIDEBAR
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

            icon.textContent = "›";

            button.setAttribute(
                "aria-label",
                "Expand navigation sidebar"
            );

            button.setAttribute(
                "title",
                "Expand navigation sidebar"
            );

            /*
             * Move button to viewport edge.
             */

            button.style.left = "0px";

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

            /*
             * Recalculate actual sidebar edge.
             */

            positionToggle();
        }

    });

});