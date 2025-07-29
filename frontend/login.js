const handleSubmit = async (event) => {
  event.preventDefault();

  const data = {
    email: event.target.email.value,
    password: event.target.password.value,
  };

  try {
    const res = await axios.post("http://localhost:4000/user/login", data);

    console.log(res);

    const token = res.data.token;
    const userId = res.data.user._id;
    console.log(res.data.user._id);

    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("userId", JSON.stringify(userId));

    alert(res.data.msg);
    window.location.href = "./expense.html";
  } catch (error) {
    alert(error.response.data.msg);
    console.log(error);
  }

  event.target.email.value = "";
  event.target.password.value = "";
};
