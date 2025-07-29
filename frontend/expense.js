const body = document.querySelector("body");
const pageButton = document.getElementById("newPageButton");
const token = JSON.parse(localStorage.getItem("token"));
const ul = document.querySelector("ul");
const form = document.querySelector("form");

window.onload = function () {
  const pageNo = JSON.parse(localStorage.getItem("pageNo"));
  const limit = JSON.parse(localStorage.getItem("limit"));

  if (!pageNo) localStorage.setItem("pageNo", JSON.stringify("1"));

  if (!limit) localStorage.setItem("limit", JSON.stringify("5"));

  const body = document.querySelector("body");
  if (token) {
    body.hidden = false;
  } else {
    body.hidden = true;
    alert("Plz log in first");
    window.location.href = "./login.html";
  }
};

inintialize();

const handleSubmit = async (event) => {
  event.preventDefault();

  const amount = event.target.amount.value.trim();
  const description = event.target.description.value.trim();
  const category = event.target.category.value;

  if (!amount || !description || !category) {
    alert("Please fill out all fields.");
    return;
  }

  const data = { amount, description, category };

  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.post("http://localhost:4000/expense/add", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res);

    await getAllItems();
  } catch (error) {
    console.error("Error adding expense:", error);
    alert("Failed to add expense. Please try again.");
  }

  event.target.reset();
};

const styleList = (li) => {
  li.style.padding = "10px";
  li.style.margin = "10px";
  li.style.color = "#a01e74";
  li.style.fontWeight = "bold";
  li.style.fontFamily = "Arial, sans-serif";
  li.style.backgroundColor = "#f0f0f0";
  li.style.border = "1px solid #ccc";
  li.style.borderRadius = "8px";
  li.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.1)";
  li.style.transition = "all 0.3s ease";
  li.style.cursor = "pointer";
  li.style.listStyleType = "none";
  li.style.textAlign = "center";
  li.style.textTransform = "capitalize";
  li.style.gap = "20px";
};

const styleTop = (button) => {
  button.style.backgroundColor = "#4a9696";
  button.style.color = "white";
  button.style.padding = "10px";
  button.style.margin = "5px";
  button.style.borderRadius = "5px";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.fontSize = "12px";
  button.style.fontWeight = "bold";
  button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  button.style.transition = "background-color 0.3s ease, transform 0.2s ease";
};

const style = (button) => {
  button.style.backgroundColor = "gray";
  button.style.color = "white";
  button.style.padding = "8px 16px";
  button.style.margin = "5px";
  button.style.borderRadius = "8px";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.fontSize = "16px";
  button.style.fontWeight = "bold";
  button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  button.style.transition = "background-color 0.3s ease, transform 0.2s ease";

  button.addEventListener("mouseenter", () => {
    button.style.backgroundColor = "#ada9a9";
    button.style.transform = "scale(1.05)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.backgroundColor = "gray";
    button.style.transform = "scale(1)";
  });
};

const paginatingButton = (page) => {
  console.log(page);

  pageButton.innerHTML = "";

  const preButton = document.createElement("button");
  const currButton = document.createElement("button");
  const nextButton = document.createElement("button");

  if (page.pre === true) {
    preButton.addEventListener("click", async () => {
      const pageNo = JSON.parse(localStorage.getItem("pageNo"));
      localStorage.setItem("pageNo", JSON.stringify(pageNo - 1));

      const limit = JSON.parse(localStorage.getItem("limit"));
      const expenses = await axios.get(
        `http://localhost:4000/expense/${
          Number(page.pageId) - 1
        }?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const items = expenses.data.expense;
      ul.innerHTML = "";

      items.map((item) => display(item));
      pageButton.innerHTML = "";
      paginatingButton(expenses.data.page);
    });

    preButton.innerText = `${Number(page.pageId) - 1}`;
    style(preButton);
    pageButton.appendChild(preButton);
  }

  if (page.curr === true) {
    currButton.addEventListener("click", async () => {
      const pageNo = JSON.parse(localStorage.getItem("pageNo"));
      localStorage.setItem("pageNo", JSON.stringify(pageNo));
      const limit = JSON.parse(localStorage.getItem("limit"));
      const expenses = await axios.get(
        `http://localhost:4000/expense/${Number(page.pageId)}?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const items = expenses.data.expense;
      ul.innerHTML = "";

      items.map((item) => display(item));
      pageButton.innerHTML = "";
      paginatingButton(expenses.data.page);
    });

    currButton.innerText = `${page.pageId}`;
    style(currButton);
    currButton.style.height = "50px";
    pageButton.appendChild(currButton);
  }

  if (page.next === true) {
    nextButton.addEventListener("click", async () => {
      const pageNo = JSON.parse(localStorage.getItem("pageNo"));
      localStorage.setItem("pageNo", JSON.stringify(Number(pageNo) + 1));
      const limit = JSON.parse(localStorage.getItem("limit"));
      const expenses = await axios.get(
        `http://localhost:4000/expense/${
          Number(page.pageId) + 1
        }?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const items = expenses.data.expense;
      ul.innerHTML = "";

      items.map((item) => display(item));
      pageButton.innerHTML = "";
      paginatingButton(expenses.data.page);
    });

    nextButton.innerText = `${Number(page.pageId) + 1}`;
    style(nextButton);
    pageButton.appendChild(nextButton);
  }
};

const getAllItems = async () => {
  ul.innerHTML = "";

  try {
    const limit = JSON.parse(localStorage.getItem("limit")) || 5;
    const pageNo = JSON.parse(localStorage.getItem("pageNo")) || 1;
    const token = JSON.parse(localStorage.getItem("token"));

    console.log("Limit:", limit, "Page No:", pageNo);

    const response = await axios.get(
      `http://localhost:4000/expense/${pageNo}/?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const items = response.data.expense;
    const pageData = response.data.page;

    console.log("Expenses:", items);

    items.forEach((item) => display(item));
    paginatingButton(pageData);
  } catch (err) {
    console.error("Failed to fetch items:", err);
    ul.innerHTML = `<li style="color:red;">Failed to load items. Please try again.</li>`;
  }
};

async function display(item) {
  const li = document.createElement("li");
  const del = document.createElement("button");

  styleList(li);
  li.innerText = `Amount -> ${item.amount},  Desc -> ${item.description},  Category-> ${item.category}`;

  del.innerText = "Delete";
  del.style.marginLeft = "10px";

  try {
    del.addEventListener("click", async () => {
      await axios.delete(`http://localhost:4000/expense/delete/${item._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const limit = JSON.parse(localStorage.getItem("limit")) || 5;
      const pageNo = JSON.parse(localStorage.getItem("pageNo")) || 1;

      const response = await axios.get(
        `http://localhost:4000/expense/${pageNo}/?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const items = response.data.expense;
      if (items.length === 0 && pageNo > 0)
        localStorage.setItem("pageNo", JSON.stringify(pageNo - 1));

      pageButton.innerHTML = "";
      ul.innerHTML = "";
      getAllItems();
    });
  } catch (error) {
    console.log(error);
  }

  li.appendChild(del);
  ul.appendChild(li);
}

async function inintialize() {
  const ul = document.querySelector("ul");
  ul.innerHTML = "";

  const select = document.getElementById("limit");
  localStorage.setItem("limit", JSON.stringify(select.value));

  select.addEventListener("click", async () => {
    ul.innerHTML = "";
    console.log(select.value);

    localStorage.setItem("limit", JSON.stringify(select.value));

    const limit = JSON.parse(localStorage.getItem("limit")) || 5;
    const pageNo = JSON.parse(localStorage.getItem("pageNo")) || 1;
    const response = await axios.get(
      `http://localhost:4000/expense/${pageNo}/?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const items = response.data.expense;
    if (items.length === 0 && pageNo > 0) {
      localStorage.setItem("pageNo", JSON.stringify(pageNo - 1));
    }

    pageButton.innerHTML = "";
    ul.innerHTML = "";
    localStorage.setItem("pageNo", JSON.stringify("1"));
    getAllItems();
  });

  const premiumButton = document.getElementById("premium");

  try {
    const result = await axios.get("http://localhost:4000/order", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (result.data.order) {
      const status = result.data.order.OrderStatus;
      //console.log(status);

      if (status == "Success") {
        if (premiumButton) {
          getPremiumButton(premiumButton);

          const leaderBoard = document.getElementById("premiumButtons");
          // console.log(leaderBoard);

          const leaderBoardButton = document.createElement("button");
          leaderBoardButton.innerText = "Leader Board";
          leaderBoard.appendChild(leaderBoardButton);
          styleTop(leaderBoardButton);

          leaderBoardButton.addEventListener("click", async () => {
            window.location.href = "./view/leaderBoard.html";
          });

          const expenseDetailsButton = document.createElement("button");
          expenseDetailsButton.innerText = "Expense Details";
          leaderBoard.appendChild(expenseDetailsButton);
          styleTop(expenseDetailsButton);

          expenseDetailsButton.addEventListener("click", async () => {
            window.location.href = "./view/dailyExpenses.html";
          });
        }
      }
    }
    getAllItems();
  } catch (error) {
    if (error) {
      alert("User Logged Out Invalid Token");
      window.location.href = "./login.html";
    }
    console.log(error);
  }
}

const getPremiumButton = (premiumButton) => {
  form.removeChild(premiumButton);

  const premium = document.createElement("button");
  premium.style.backgroundColor = "rgb(236, 101, 124)";
  premium.innerText = "You are a Premium User";
  premium.id = "Premium";
  premium.addEventListener("click", () => {
    alert("Already A Premium User");
  });
  form.appendChild(premium);
};
