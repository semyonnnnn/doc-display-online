export const Interactivity = {
  interact() {
    const vac_buttons = document.querySelectorAll(".vac_title");
    const vac_contents = document.querySelectorAll(".vac_modal");

    vac_buttons.forEach((button, index) => {
      if (
        button.id.replace("_vacTitle", "") ===
        vac_contents[index].id.replace("_modal", "")
      ) {
        button.addEventListener("click", () => {
          vac_contents[index].classList.toggle("purple"); // ✅ toggles
        });
      }
    });
  },
};
