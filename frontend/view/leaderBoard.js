window.onload = function () {
  const token = JSON.parse(localStorage.getItem("token"));

  if (!token) {
    body.hidden = true;
    alert("User LoggedOut");
    window.location.href = "../login.html";
  } else {
    const body = document.querySelector("body");
    body.hidden = false;
  }
};

const backButton = document.getElementById("backButton");

backButton.addEventListener("click", () => {
  window.location.href = "../expense.html";
});

// const display = (item) => {
//   const ul = document.getElementById("userList");

//   const li = document.createElement("li");

//   li.innerText = `${item.username} TotalAmount ${item.totalCost}`;

//   ul.appendChild(li);
// };
function display(item) {
  const ul = document.getElementById("userList");
  const li = document.createElement("li");

  li.innerHTML = `
    <span class="expense-username">Username:- ${item.username}</span>
    <span class="expense-totalAmount">Total amount spend:- ₹${item.totalCost}</span>
    
    
  `;

  ul.appendChild(li);
}

const inintialize = async () => {
  const ul = document.getElementById("userList");

  const token = JSON.parse(localStorage.getItem("token"));

  ul.innerHTML = "";

  try {
    const expenses = await axios.get("http://localhost:4000/premiumFeature", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const items = expenses.data.data;

    items.map((item) => {
      display(item);
    });

    console.log(expenses.data.data);
  } catch (error) {
    console.log(error);
  }
};

inintialize();
