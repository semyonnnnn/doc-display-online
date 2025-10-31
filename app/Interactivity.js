export const Interactivity = {
  init(data_window) {
    const dep_triggers = document.querySelectorAll(".dep_trigger");
    const dep_menus = document.querySelectorAll(".dep_menu");

    dep_triggers.forEach((dep_trigger, index) => {
      dep_trigger.addEventListener("click", () => {
        if (
          dep_trigger.id.replace("dep_trigger_") ===
          dep_menus[index].id.replace("dep_menu_")
        ) {
          const arrow = dep_trigger.querySelector(".arrow");
          if (dep_menus[index].classList.contains("hidden")) {
            dep_menus[index].classList.remove("hidden");
            arrow.classList.add("get_rotated");
          } else {
            dep_menus[index].classList.add("hidden");
            arrow.classList.remove("get_rotated");
          }
        }
      });
    });
  },
};
