const handleSubmit = async (event) => {
  event.preventDefault();
  console.log(event);

  console.log(event.target);

  const data = {
    username: event.target.username.value,
    email: event.target.email.value,
    password: event.target.password.value,
  };

  try {
    console.log("User Post Request");
    const res = await axios.post("http://localhost:4000/user/signup/add", data);
    console.log(res);
    alert(res.data.msg);
    console.log(res);
    window.location.href = "./login.html";
  } catch (error) {
    alert(error.response.data.msg);
    console.log(error);
  }
  event.target.username.value = "";
  event.target.email.value = "";
  event.target.password.value = "";
};
