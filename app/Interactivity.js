export const Interactivity = {
  interact() {
    const vac_buttons = document.querySelectorAll(".vac_title");
    const vac_contents = document.querySelectorAll(".vac_modal");

    const vacs_wrappers = document.querySelectorAll(".vacs_wrapper");
    const dep_title_wrappers = document.querySelectorAll(".dep_title_wrapper");
    const modal_vacs_2025 = document.getElementById("modal_vacs_2025");

    vac_buttons.forEach((button, index) => {
      if (
        button.id.replace("_vacTitle", "") ===
        vac_contents[index].id.replace("_modal", "")
      ) {
        button.addEventListener("click", () => {
          modal_vacs_2025.classList.remove("hidden");
          vac_contents[index].classList.toggle("vac_modal_shown");
          vac_contents.forEach((v, i) => {
            if (i === index) {
              v.classList.add("vac_modal_shown");
            } else {
              v.classList.remove("vac_modal_shown");
            }
          });
        });
      }
    });

    dep_title_wrappers.forEach((item, index) => {
      if (
        item.id.replace("_wrapper", "") ===
        vacs_wrappers[index].id.replace("_content", "")
      ) {
        item.addEventListener("click", () => {
          if (vacs_wrappers[index].classList.contains("hidden")) {
            vacs_wrappers[index].classList.remove("hidden");
            dep_title_wrappers[index].children[1].classList.add(
              "dep_arrow_rotated"
            );
          } else {
            vacs_wrappers[index].classList.add("hidden");
            dep_title_wrappers[index].children[1].classList.remove(
              "dep_arrow_rotated"
            );
          }
        });
      }
    });
  },
};
