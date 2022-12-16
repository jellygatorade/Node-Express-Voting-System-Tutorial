class Poll {
  constructor(root, title) {
    this.root = root;
    this.selected = sessionStorage.getItem("poll-selected");
    this.endpoint = "http://localhost:3000/poll";

    this.root.insertAdjacentHTML(
      "afterbegin",
      `<div class="poll__title">${title}</div>`
    );

    this._refresh();
  }

  async _refresh() {
    // GET the existing data (data.json on server)
    const response = await fetch(this.endpoint);
    const data = await response.json();

    console.log(data);

    // Delete existing poll option DOM elements
    this.root.querySelectorAll(".poll__option").forEach((option) => {
      option.remove();
    });

    // For each entry in the retrieved data (which is an array)
    for (const option of data) {
      const template = document.createElement("template");
      const fragment = template.content;

      template.innerHTML = `
        <div class="poll__option ${
          this.selected == option.label ? "poll__option--selected" : ""
        }">
            <div class="poll__option-fill"></div>
            <div class="poll__option-info">
                <span class="poll__label">${option.label}</span>
                <span class="poll__percentage">${option.percentage}%</span>
            </div>
        </div>
        `;

      // Only add this event listender if this.selected is empty
      if (!this.selected) {
        fragment
          .querySelector(".poll__option")
          .addEventListener("click", () => {
            // POST method
            fetch(this.endpoint, {
              method: "post",
              body: `add=${option.label}`,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }).then(() => {
              this.selected = option.label;
              sessionStorage.setItem("poll-selected", option.label); // set sessionStorage telling the app user has voted in this session
              this._refresh();
            });
          });
      }

      fragment.querySelector(
        ".poll__option-fill"
      ).style.width = `${option.percentage}%`;

      this.root.appendChild(fragment);
    }
  }
}

const p = new Poll(document.querySelector(".poll"), "Which do you prefer?");

//console.log(p);
