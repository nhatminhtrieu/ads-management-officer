export default class SideBar {
  constructor() {
    this.sidebar = document.getElementById("side-bar");
    this.menu = document.getElementById("menu");
    this.tabs = Array.from(menu.children);
    this.description = document.getElementById("description");
    this.button = document.getElementById("collapse-btn");
    this.active = 0;
    this.visible = false;
    this.contents = [];
    this.defaultContent = document.createElement("div");
    this.defaultContent.style = `height: 100%;
    display: flex;
    justify-content: center;
    font-size: x-large;
    color: gray;
    align-items: center;`;
    this.defaultContent.innerHTML = "Chưa có thông tin";
  }

  init() {
    this.tabs[this.active].classList.add("tab-active");
    this.tabs.forEach((tab, id) => {
      this.contents.push(this.defaultContent);
      tab.onclick = () => {
        this.changeActive(id);
      };
    });
    this.description.innerHTML = "";
    this.description.appendChild(this.contents[this.active]);
    this.button.onclick = () => this.toggleVisible();
  }

  changeActive(index) {
    this.tabs[this.active].classList.remove("tab-active");
    this.tabs[index].classList.add("tab-active");
    this.active = index;
    this.description.innerHTML = "";
    this.description.appendChild(this.contents[index]);
  }

  show() {
    this.sidebar.style.width = "480px";
    this.button.innerHTML = '<i class="bi bi-caret-left-fill"></i>';
  }

  hide() {
    this.sidebar.style.width = "0px";
    this.button.innerHTML = '<i class="bi bi-caret-right-fill"></i>';
  }

  // Show/Hide the side bar
  toggleVisible() {
    if (this.visible) {
      this.show();
    } else {
      this.hide();
    }
    this.visible = !this.visible;
  }

  // Reset content to default
  removeContent(index) {
    this.contents[index] = this.defaultContent;
    console.log("remove content");
    this.changeActive(index);
  }

  // Update content of a tab and change active to that tab
  setContent(index, content) {
    this.contents[index] = content;
    this.changeActive(index);
  }
}
