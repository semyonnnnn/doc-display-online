export const Interactivity = {
  interact() {
    const dep_triggers = document.querySelectorAll(".dep_trigger");
    const dep_menus = document.querySelectorAll(".dep_menu");

    dep_triggers.forEach((dep_trigger, index) => {
      dep_trigger.addEventListener("click", () => {
        if (
          dep_trigger.id.replace("dep_trigger_") ===
          dep_menus[index].id.replace("dep_menu_")
        ) {
          if (dep_menus[index].classList.contains("hidden")) {
            dep_menus[index].classList.remove("hidden");
          } else {
            dep_menus[index].classList.add("hidden");
          }
        }
      });
    });
  },
};
